import { Link, useParams } from "react-router-dom";
import products from "../data_products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="text-3xl font-bold text-zinc-900">Product not found</h1>
          <p className="mt-3 text-zinc-600">
            The product you are looking for does not exist.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
        <div className="overflow-hidden rounded-3xl bg-orange-50">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
            {product.category}
          </p>

          <h1 className="text-4xl font-bold text-zinc-900 md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-5 text-lg leading-8 text-zinc-600">
            {product.description}
          </p>

          <div className="mt-8 text-3xl font-bold text-orange-500">
            R{product.price}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-full bg-orange-500 px-7 py-3 font-semibold text-white hover:bg-orange-600">
              Add to Cart
            </button>

            <Link
              to="/products"
              className="rounded-full border border-orange-200 px-7 py-3 font-semibold text-orange-500 hover:bg-orange-50"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
