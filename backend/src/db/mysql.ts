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

export const MySqlPedido = sequelize.define("Pedido", {
  cliente: DataTypes.STRING,
  producto: DataTypes.STRING,
  cantidad: DataTypes.INTEGER,
});

export const MySqlAprobacion = sequelize.define("Aprobar", {
  idpedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("aprobado", "anulado"),
    allowNull: false,
  },
});

MySqlPedido.hasMany(MySqlAprobacion, { foreignKey: "idpedido" });
MySqlAprobacion.belongsTo(MySqlPedido, { foreignKey: "idpedido" });

let isConnected = false;

export const connectMySql = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  await sequelize.authenticate();
  await sequelize.sync();
  isConnected = true;
};

export const getMySqlConnectionState = (): boolean => {
  return isConnected;
};

export { sequelize };
