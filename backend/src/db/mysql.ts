import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME ?? "senatiwebapi",
  process.env.DB_USER ?? "root",
  process.env.DB_PASSWORD ?? "",
  {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    dialect: "mysql",
    logging: false,
  },
);

export const StoreProduct = sequelize.define("StoreProduct", {
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM("pc", "laptop", "celular", "teclado", "audio"),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

export const StoreOrder = sequelize.define("StoreOrder", {
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderStatus: {
    type: DataTypes.ENUM("pending_payment", "paid", "cancelled"),
    allowNull: false,
    defaultValue: "pending_payment",
  },
  paymentStatus: {
    type: DataTypes.ENUM("requires_confirmation", "paid", "failed"),
    allowNull: false,
    defaultValue: "requires_confirmation",
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  shipping: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export const StoreOrderItem = sequelize.define("StoreOrderItem", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  lineTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

StoreOrder.hasMany(StoreOrderItem, { foreignKey: "orderId", as: "items" });
StoreOrderItem.belongsTo(StoreOrder, { foreignKey: "orderId" });

StoreProduct.hasMany(StoreOrderItem, { foreignKey: "productId", as: "orderItems" });
StoreOrderItem.belongsTo(StoreProduct, { foreignKey: "productId", as: "product" });

const seedProducts = [
  {
    sku: "p-001",
    name: "Mouse Gamer RGB Pro",
    description: "Sensor de alta precision 12000 DPI y switch silencioso.",
    category: "pc",
    price: 39.9,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
    isActive: true,
  },
  {
    sku: "p-002",
    name: "Laptop Stand Aluminio",
    description: "Base ergonomica para laptops de 13 a 17 pulgadas.",
    category: "laptop",
    price: 24.5,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    isActive: true,
  },
  {
    sku: "p-003",
    name: "Cable USB-C 100W",
    description: "Carga rapida y transferencia de datos reforzada.",
    category: "celular",
    price: 12.9,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
    isActive: true,
  },
  {
    sku: "p-004",
    name: "Teclado Mecanico TKL",
    description: "Switches red, iluminacion RGB y formato compacto.",
    category: "teclado",
    price: 74.9,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",
    isActive: true,
  },
  {
    sku: "p-005",
    name: "Audifonos Bluetooth ANC",
    description: "Cancelacion de ruido activa para llamadas y musica.",
    category: "audio",
    price: 89,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    isActive: true,
  },
  {
    sku: "p-006",
    name: "Power Bank 20000mAh",
    description: "Dual output USB-C y proteccion termica inteligente.",
    category: "celular",
    price: 34,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1609592093516-765a6f2f47d1?auto=format&fit=crop&w=900&q=80",
    isActive: true,
  },
  {
    sku: "p-007",
    name: "Hub USB-C 7 en 1",
    description: "HDMI 4K, lector SD y puertos USB 3.0 de alta velocidad.",
    category: "laptop",
    price: 49.5,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?auto=format&fit=crop&w=900&q=80",
    isActive: true,
  },
  {
    sku: "p-008",
    name: "Soporte Celular MagSafe",
    description: "Montaje magnetico estable para escritorio y streaming.",
    category: "celular",
    price: 18.9,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=80",
    isActive: true,
  },
];

let isConnected = false;

const seedStoreProducts = async (): Promise<void> => {
  const existing = await StoreProduct.count();
  if (existing > 0) {
    return;
  }

  await StoreProduct.bulkCreate(seedProducts);
};

export const connectMySql = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  await sequelize.authenticate();
  await sequelize.sync();
  await seedStoreProducts();
  isConnected = true;
};

export { sequelize };
