import products from "../data_products";

export default function Cart() {
  const cartItems = products.slice(0, 2);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="bg-orange-50 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
            Cart
          </p>
          <h1 className="text-4xl font-bold text-zinc-900 md:text-5xl">
            Your Cart
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.5fr_.9fr]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-bold text-zinc-900">{item.name}</h3>
                  <p className="mt-1 text-zinc-600">Qty: 1</p>
                </div>
                <div className="text-lg font-bold text-orange-500">
                  R{item.price}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <h2 className="text-2xl font-bold text-zinc-900">Summary</h2>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>R{total}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="mt-6 border-t border-orange-100 pt-6">
              <div className="flex items-center justify-between text-lg font-bold text-zinc-900">
                <span>Total</span>
                <span className="text-orange-500">R{total}</span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
}
