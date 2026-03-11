import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-orange-50">
      <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            Frienemies
          </p>
          <h1 className="mb-5 text-5xl font-bold leading-tight text-zinc-900 md:text-7xl">
            Bold streetwear for the ones who stand out naturally.
          </h1>
          <p className="mb-8 max-w-xl text-base text-zinc-600 md:text-lg">
            Clean fits. Sharp energy. New season pieces built for everyday impact.
          </p>
          <div className="flex gap-4">
            <Link
              to="/products"
              className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Shop Now
            </Link>
            <a
              href="#categories"
              className="rounded-full border border-orange-200 px-6 py-3 font-semibold text-orange-500 hover:bg-orange-100"
            >
              Explore
            </a>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop"
            alt="Frienemies fashion campaign"
            className="h-[520px] w-full rounded-3xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
