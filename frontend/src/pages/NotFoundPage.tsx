import { Link } from "react-router-dom";
import { Alert } from "../components/ui";

export const NotFoundPage = (): JSX.Element => {
  return (
    <Alert variant="error">
      Pagina no encontrada. <Link to="/" className="font-semibold underline">Volver al inicio</Link>
    </Alert>
  );
};