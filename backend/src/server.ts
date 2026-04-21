import { app } from "./app.js";
import { connectMySql } from "./db/mysql.js";

const port = Number(process.env.PORT ?? 3001);

const startServer = async (): Promise<void> => {
  try {
    await connectMySql();
    console.log("MySQL conectado correctamente");
  } catch (error) {
    console.warn("MySQL no disponible. La ruta /mysql/pedidos devolvera error hasta reconectar.");
    console.warn(error);
  }

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
};

void startServer();
