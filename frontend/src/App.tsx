import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AccountPage } from "./pages/AccountPage";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CollectionPage } from "./pages/CollectionPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductPage } from "./pages/ProductPage";
import { useStorefront } from "./storefront/context";

const AppLayout = (): JSX.Element => {
  const { itemCount, wishlistIds } = useStorefront();

  return (
    <>
      <Navbar cartCount={itemCount} wishlistCount={wishlistIds.length} />
      <main className="app-bg min-h-screen p-4 sm:p-8">
        <section className="mx-auto w-full max-w-7xl space-y-5">
          <div className="announcement-bar">
            <div className="announcement-track">
              <span>Envio gratis desde S/ 250 | Garantia local | Soporte para equipos de tecnologia</span>
              <span>Envio gratis desde S/ 250 | Garantia local | Soporte para equipos de tecnologia</span>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/collections/:category" element={<CollectionPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </section>
      </main>
      <Footer />
    </>
  );
};

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};
