export default function Footer() {
  return (
    <footer className="bg-orange-500 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <img
              src="/frienemies-logo.svg"
              alt="Frienemies"
              className="h-10 w-auto rounded-md bg-white p-1"
            />
            <p className="mt-4 max-w-xs text-sm text-orange-50">
              Frienemies is bold streetwear built for everyday presence, clean energy, and standout identity.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.24em]">
              Shop
            </h3>
            <ul className="space-y-3 text-sm text-orange-50">
              <li>T-Shirts</li>
              <li>Hoodies</li>
              <li>Jackets</li>
              <li>Accessories</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.24em]">
              Help
            </h3>
            <ul className="space-y-3 text-sm text-orange-50">
              <li>Shipping & Delivery</li>
              <li>Returns</li>
              <li>Size Guide</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.24em]">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-orange-50">
              Subscribe for new drops, product updates, and exclusive offers.
            </p>
            <div className="flex rounded-full bg-white p-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full px-4 py-2 text-sm text-zinc-900 outline-none"
              />
              <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-orange-400 pt-6 text-center text-sm text-orange-100">
          © 2026 Frienemies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
