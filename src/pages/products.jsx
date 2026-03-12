import products from "../data_products";
import ProductCard from "../components/products/ProductCard";

export default function Products() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
            Shop
          </p>
          <h1 className="text-4xl font-bold text-zinc-900 md:text-5xl">
            All Products
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Explore the Frienemies range of clean, bold, streetwear-inspired essentials.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
