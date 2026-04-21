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
    type: DataTypes.ENUM("pc", "laptop", "celular", "tablet", "audio", "video", "teclado"),
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
    image: "/Mouse%20Gamer%20RGB%20Pro.jpg",
    isActive: true,
  },
  {
    sku: "p-002",
    name: "Mouse Inalambrico Precision",
    description: "Mouse ergonomico para trabajo y gaming liviano.",
    category: "pc",
    price: 29.9,
    rating: 4.4,
    image: "/Mouse%20Gamer%20RGB%20Pro.jpg",
    isActive: true,
  },
  {
    sku: "p-003",
    name: "Combo Gamer Essential",
    description: "Kit para setup con enfoque en rendimiento diario.",
    category: "pc",
    price: 84.9,
    rating: 4.5,
    image: "/Mouse%20Gamer%20RGB%20Pro.jpg",
    isActive: true,
  },
  {
    sku: "p-004",
    name: "Dock USB para Escritorio",
    description: "Expansion rapida de puertos para escritorio profesional.",
    category: "pc",
    price: 46.9,
    rating: 4.3,
    image: "/Cable%20USB-C%20100W.jpg",
    isActive: true,
  },
  {
    sku: "p-005",
    name: "Webcam Full HD Streaming",
    description: "Video nitido para videollamadas, clases y reuniones.",
    category: "pc",
    price: 69,
    rating: 4.6,
    image: "/Proyector%20Full%20HD.jpg",
    isActive: true,
  },
  {
    sku: "p-006",
    name: "Kit Limpieza Premium PC",
    description: "Set completo para cuidado de pantalla y perifericos.",
    category: "pc",
    price: 22.5,
    rating: 4.2,
    image: "/Cable%20USB-C%20100W.jpg",
    isActive: true,
  },
  {
    sku: "p-007",
    name: "Laptop Stand Aluminio",
    description: "Base ergonomica para laptops de 13 a 17 pulgadas.",
    category: "laptop",
    price: 24.5,
    rating: 4.5,
    image: "/Tablet%2011.jpg",
    isActive: true,
  },
  {
    sku: "p-008",
    name: "Hub USB-C 7 en 1",
    description: "HDMI 4K, lector SD y puertos USB 3.0 de alta velocidad.",
    category: "laptop",
    price: 49.5,
    rating: 4.6,
    image: "/Cable%20USB-C%20100W.jpg",
    isActive: true,
  },
  {
    sku: "p-009",
    name: "Cargador GaN 100W",
    description: "Carga eficiente para laptop y dispositivos moviles.",
    category: "laptop",
    price: 54.9,
    rating: 4.7,
    image: "/Cable%20USB-C%20100W.jpg",
    isActive: true,
  },
  {
    sku: "p-010",
    name: "Mochila Ejecutiva 16",
    description: "Compartimentos reforzados para laptop y accesorios.",
    category: "laptop",
    price: 79.9,
    rating: 4.5,
    image: "/Tablet%2011.jpg",
    isActive: true,
  },
  {
    sku: "p-011",
    name: "Base Refrigerante Dual Fan",
    description: "Disipa calor y mejora sesiones de alto rendimiento.",
    category: "laptop",
    price: 42,
    rating: 4.4,
    image: "/Proyector%20Full%20HD.jpg",
    isActive: true,
  },
  {
    sku: "p-012",
    name: "Adaptador USB-C a Ethernet",
    description: "Conexion de red estable para productividad remota.",
    category: "laptop",
    price: 31,
    rating: 4.3,
    image: "/Cable%20USB-C%20100W.jpg",
    isActive: true,
  },
  {
    sku: "p-013",
    name: "Cable USB-C 100W",
    description: "Carga rapida y transferencia de datos reforzada.",
    category: "celular",
    price: 12.9,
    rating: 4.7,
    image: "/Cable%20USB-C%20100W.jpg",
    isActive: true,
  },
  {
    sku: "p-014",
    name: "Power Bank 20000mAh",
    description: "Dual output USB-C y proteccion termica inteligente.",
    category: "celular",
    price: 34,
    rating: 4.5,
    image: "/Cable%20USB-C%20100W.jpg",
    isActive: true,
  },
  {
    sku: "p-015",
    name: "Soporte Celular MagSafe",
    description: "Montaje magnetico estable para escritorio y streaming.",
    category: "celular",
    price: 18.9,
    rating: 4.3,
    image: "/Soporte%20Celular%20MagSafe.jpg",
    isActive: true,
  },
  {
    sku: "p-016",
    name: "Cargador Inalambrico 15W",
    description: "Base compacta para carga rapida en escritorio.",
    category: "celular",
    price: 27.9,
    rating: 4.4,
    image: "/Soporte%20Celular%20MagSafe.jpg",
    isActive: true,
  },
  {
    sku: "p-017",
    name: "Funda Antigolpe Pro",
    description: "Proteccion premium para uso diario exigente.",
    category: "celular",
    price: 16.5,
    rating: 4.2,
    image: "/Soporte%20Celular%20MagSafe.jpg",
    isActive: true,
  },
  {
    sku: "p-018",
    name: "Tripode Compacto para Movil",
    description: "Accesorio ideal para contenido y video corto.",
    category: "celular",
    price: 23.9,
    rating: 4.3,
    image: "/Soporte%20Celular%20MagSafe.jpg",
    isActive: true,
  },
  {
    sku: "p-019",
    name: "Tablet 11 Pro",
    description: "Pantalla 2K y bateria de larga duracion para estudio.",
    category: "tablet",
    price: 499,
    rating: 4.7,
    image: "/Tablet%2011.jpg",
    isActive: true,
  },
  {
    sku: "p-020",
    name: "Tablet Pencil Active",
    description: "Lapiz digital con baja latencia para notas y diseno.",
    category: "tablet",
    price: 59,
    rating: 4.4,
    image: "/Tablet%20Pencil%20Active.jpg",
    isActive: true,
  },
  {
    sku: "p-021",
    name: "Teclado Bluetooth para Tablet",
    description: "Escritura comoda para trabajo remoto y clases.",
    category: "tablet",
    price: 45,
    rating: 4.5,
    image: "/Teclado%20Mecanico%20TKL.jpg",
    isActive: true,
  },
  {
    sku: "p-022",
    name: "Funda Folio Magnetica",
    description: "Protege pantalla y permite multiples angulos.",
    category: "tablet",
    price: 28.9,
    rating: 4.3,
    image: "/Tablet%2011.jpg",
    isActive: true,
  },
  {
    sku: "p-023",
    name: "Cargador Rapido 45W Tablet",
    description: "Carga segura y estable para jornadas largas.",
    category: "tablet",
    price: 32.5,
    rating: 4.4,
    image: "/Cable%20USB-C%20100W.jpg",
    isActive: true,
  },
  {
    sku: "p-024",
    name: "Soporte Ajustable para Tablet",
    description: "Base de aluminio para escritorio, cocina o estudio.",
    category: "tablet",
    price: 35.9,
    rating: 4.5,
    image: "/Tablet%2011.jpg",
    isActive: true,
  },
  {
    sku: "p-025",
    name: "Audifonos Bluetooth ANC",
    description: "Cancelacion de ruido activa para llamadas y musica.",
    category: "audio",
    price: 89,
    rating: 4.4,
    image: "/Audifonos%20Bluetooth%20ANC.jpg",
    isActive: true,
  },
  {
    sku: "p-026",
    name: "Audifonos Over Ear Studio",
    description: "Sonido balanceado para edicion y entretenimiento.",
    category: "audio",
    price: 119,
    rating: 4.7,
    image: "/Audifonos%20Bluetooth%20ANC.jpg",
    isActive: true,
  },
  {
    sku: "p-027",
    name: "Speaker Bluetooth Portatil",
    description: "Bateria extendida y graves potentes para exteriores.",
    category: "audio",
    price: 69.9,
    rating: 4.5,
    image: "/Audifonos%20Bluetooth%20ANC.jpg",
    isActive: true,
  },
  {
    sku: "p-028",
    name: "Microfono USB Podcast",
    description: "Captura clara para streamings y clases virtuales.",
    category: "audio",
    price: 82.9,
    rating: 4.6,
    image: "/Audifonos%20Bluetooth%20ANC.jpg",
    isActive: true,
  },
  {
    sku: "p-029",
    name: "Barra de Sonido Compacta",
    description: "Mejora el audio de TV y cine en casa.",
    category: "audio",
    price: 149,
    rating: 4.5,
    image: "/Smart%20TV%2055.jpg",
    isActive: true,
  },
  {
    sku: "p-030",
    name: "DAC USB Hi-Res",
    description: "Convierte audio digital con mayor fidelidad.",
    category: "audio",
    price: 95.5,
    rating: 4.3,
    image: "/Audifonos%20Bluetooth%20ANC.jpg",
    isActive: true,
  },
  {
    sku: "p-031",
    name: "Smart TV 55 4K",
    description: "Panel UHD con HDR y control por voz.",
    category: "video",
    price: 679,
    rating: 4.6,
    image: "/Smart%20TV%2055.jpg",
    isActive: true,
  },
  {
    sku: "p-032",
    name: "Proyector Full HD",
    description: "Equipo compacto con Wi-Fi para cine en casa.",
    category: "video",
    price: 289,
    rating: 4.3,
    image: "/Proyector%20Full%20HD.jpg",
    isActive: true,
  },
  {
    sku: "p-033",
    name: "Streaming Stick 4K",
    description: "Convierte tu pantalla en smart con apps de contenido.",
    category: "video",
    price: 48.9,
    rating: 4.4,
    image: "/Smart%20TV%2055.jpg",
    isActive: true,
  },
  {
    sku: "p-034",
    name: "Camara de Seguridad 2K",
    description: "Vision nocturna y monitoreo remoto desde app.",
    category: "video",
    price: 72.9,
    rating: 4.5,
    image: "/Proyector%20Full%20HD.jpg",
    isActive: true,
  },
  {
    sku: "p-035",
    name: "Monitor 27 QHD",
    description: "Pantalla nitida para productividad y diseno.",
    category: "video",
    price: 329,
    rating: 4.7,
    image: "/Smart%20TV%2055.jpg",
    isActive: true,
  },
  {
    sku: "p-036",
    name: "Soporte de Pared TV",
    description: "Instalacion segura con ajuste de inclinacion.",
    category: "video",
    price: 39,
    rating: 4.2,
    image: "/Smart%20TV%2055.jpg",
    isActive: true,
  },
  {
    sku: "p-037",
    name: "Teclado Mecanico TKL",
    description: "Switches red, iluminacion RGB y formato compacto.",
    category: "teclado",
    price: 74.9,
    rating: 4.8,
    image: "/Teclado%20Mecanico%20TKL.jpg",
    isActive: true,
  },
  {
    sku: "p-038",
    name: "Teclado 60 Wireless",
    description: "Formato minimalista con conexion bluetooth estable.",
    category: "teclado",
    price: 88,
    rating: 4.6,
    image: "/Teclado%20Mecanico%20TKL.jpg",
    isActive: true,
  },
  {
    sku: "p-039",
    name: "Teclado Office Silencioso",
    description: "Teclas suaves para jornadas largas de escritura.",
    category: "teclado",
    price: 42.9,
    rating: 4.3,
    image: "/Teclado%20Mecanico%20TKL.jpg",
    isActive: true,
  },
  {
    sku: "p-040",
    name: "Teclado Gamer Full Size",
    description: "Pad numerico y macros para control rapido.",
    category: "teclado",
    price: 97.5,
    rating: 4.7,
    image: "/Teclado%20Mecanico%20TKL.jpg",
    isActive: true,
  },
  {
    sku: "p-041",
    name: "Keycaps PBT Black Edition",
    description: "Set resistente para personalizar tu teclado.",
    category: "teclado",
    price: 35.5,
    rating: 4.4,
    image: "/Teclado%20Mecanico%20TKL.jpg",
    isActive: true,
  },
  {
    sku: "p-042",
    name: "Reposamunecas Ergonomico",
    description: "Mayor comodidad para sesiones de trabajo o juego.",
    category: "teclado",
    price: 21.9,
    rating: 4.2,
    image: "/Teclado%20Mecanico%20TKL.jpg",
    isActive: true,
  },
];

let isConnected = false;

const seedStoreProducts = async (): Promise<void> => {
  const existing = await StoreProduct.findAll({ attributes: ["sku"] });
  const existingSkus = new Set(existing.map((item) => String(item.get("sku"))));
  const missingProducts = seedProducts.filter((product) => !existingSkus.has(product.sku));

  if (!missingProducts.length) {
    return;
  }

  await StoreProduct.bulkCreate(missingProducts);
};

export const connectMySql = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await seedStoreProducts();
  isConnected = true;
};

export { sequelize };
