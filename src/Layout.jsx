import { Link, Outlet, NavLink } from "react-router-dom";
import Footer from "./components/layout/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/" className="text-sm font-medium hover:text-orange-500">Home</NavLink>
            <NavLink to="/products" className="text-sm font-medium hover:text-orange-500">Shop</NavLink>
            <a href="#categories" className="text-sm font-medium hover:text-orange-500">Categories</a>
          </nav>

          <Link to="/" className="mx-auto md:mx-0">
            <img
              src="/frienemies-logo.svg"
              alt="Frienemies"
              className="h-10 w-auto md:h-12"
            />
          </Link>

          <div className="flex items-center gap-4">
            <NavLink to="/products" className="text-sm font-medium hover:text-orange-500">
              Browse
            </NavLink>
            <NavLink to="/cart" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
              Cart
            </NavLink>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
