import { Link } from "react-router-dom";
import products from "../../data_products";
import ProductCard from "../products/ProductCard";

export default function BestSellers() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
              Latest Pieces
            </p>
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
              Featured Products
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden rounded-full border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-500 hover:bg-orange-50 md:inline-flex"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            to="/products"
            className="inline-flex rounded-full border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-500 hover:bg-orange-50"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
}
