import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100 transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-orange-50">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
          {product.category}
        </p>

        <Link to={`/products/${product.id}`}>
          <h3 className="mb-2 text-lg font-bold text-zinc-900 transition group-hover:text-orange-500">
            {product.name}
          </h3>
        </Link>

        <p className="mb-4 text-sm text-zinc-600">{product.description}</p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-orange-500">
            R{product.price}
          </span>

          <Link
            to="/cart"
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
}
