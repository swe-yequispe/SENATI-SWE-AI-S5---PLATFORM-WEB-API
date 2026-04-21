import { Op } from "sequelize";
import { HttpError } from "../types/http-error.js";
import { StoreOrder, StoreOrderItem, StoreProduct, connectMySql, sequelize } from "../db/mysql.js";

interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  items: CheckoutItemInput[];
}

const normalizeMoney = (value: number): number => {
  return Number(value.toFixed(2));
};

export const listProducts = async () => {
  await connectMySql();

  const products = await StoreProduct.findAll({
    where: { isActive: true },
    order: [["id", "ASC"]],
  });

  return products.map((product) => ({
    id: String(product.get("id")),
    sku: String(product.get("sku")),
    name: String(product.get("name")),
    description: String(product.get("description")),
    category: String(product.get("category")),
    price: Number(product.get("price")),
    rating: Number(product.get("rating")),
    image: String(product.get("image")),
  }));
};

export const createOrder = async (input: CreateOrderInput) => {
  await connectMySql();

  const customerName = input.customerName.trim();
  const customerEmail = input.customerEmail.trim().toLowerCase();

  if (!customerName) {
    throw new HttpError(400, "El nombre del cliente es obligatorio");
  }

  if (!customerEmail || !customerEmail.includes("@")) {
    throw new HttpError(400, "El email del cliente no es valido");
  }

  if (!input.items.length) {
    throw new HttpError(400, "Debes enviar al menos un item para crear la orden");
  }

  const invalidItem = input.items.find((item) => item.quantity <= 0 || !Number.isInteger(item.quantity));
  if (invalidItem) {
    throw new HttpError(400, "Cada item debe tener una cantidad entera mayor a cero");
  }

  const productIds = [...new Set(input.items.map((item) => item.productId))];

  const products = await StoreProduct.findAll({
    where: {
      id: { [Op.in]: productIds },
      isActive: true,
    },
  });

  if (products.length !== productIds.length) {
    throw new HttpError(400, "Uno o mas productos enviados no existen o estan inactivos");
  }

  const productMap = new Map(products.map((product) => [String(product.get("id")), product]));

  const subtotal = normalizeMoney(
    input.items.reduce((acc, item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        return acc;
      }

      return acc + Number(product.get("price")) * item.quantity;
    }, 0),
  );

  const shipping = subtotal === 0 || subtotal >= 250 ? 0 : 15;
  const total = normalizeMoney(subtotal + shipping);
  const paymentReference = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const result = await sequelize.transaction(async (transaction) => {
    const order = await StoreOrder.create(
      {
        customerName,
        customerEmail,
        paymentReference,
        orderStatus: "pending_payment",
        paymentStatus: "requires_confirmation",
        subtotal,
        shipping,
        total,
      },
      { transaction },
    );

    await StoreOrderItem.bulkCreate(
      input.items.map((item) => {
        const product = productMap.get(item.productId);
        const unitPrice = product ? Number(product.get("price")) : 0;
        return {
          orderId: order.get("id"),
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          lineTotal: normalizeMoney(unitPrice * item.quantity),
        };
      }),
      { transaction },
    );

    return {
      orderId: Number(order.get("id")),
      paymentReference,
      amount: total,
      status: "requires_confirmation",
    };
  });

  return result;
};

export const confirmOrderPayment = async (orderId: number, paymentReference?: string) => {
  await connectMySql();

  const order = await StoreOrder.findByPk(orderId);
  if (!order) {
    throw new HttpError(404, "Orden no encontrada");
  }

  const currentReference = String(order.get("paymentReference"));

  if (paymentReference && paymentReference !== currentReference) {
    throw new HttpError(400, "La referencia de pago no coincide con la orden");
  }

  if (String(order.get("paymentStatus")) === "paid") {
    return {
      orderId,
      status: "paid",
      message: "Compra ya confirmada",
      paymentReference: currentReference,
      paidAt: order.get("paidAt"),
    };
  }

  order.set("paymentStatus", "paid");
  order.set("orderStatus", "paid");
  order.set("paidAt", new Date());
  await order.save();

  return {
    orderId,
    status: "paid",
    message: "Compra confirmada correctamente",
    paymentReference: currentReference,
    paidAt: order.get("paidAt"),
  };
};
