
/* ============================
   ICEDOUT STORE — PRODUCTION JS
   Headless WooCommerce Products + Cart + Checkout Sync
   ============================ */

/* ===== CONFIG ===== */
const WOO_CONFIG = {
  // Woo REST (WP is inside /wordpress)
  baseURL: "https://icedoutstore.co.za/wordpress/wp-json/wc/v3",

  // ⚠️ TEMP ONLY (read-only). Remove/rotate for live.
  consumerKey: "ck_baf96bde6af2de4530c285551c8ded1c2dd374fe",
  consumerSecret: "cs_59824944f7644de06e406f4785335328f009c245",

  // ✅ Increase this (max 100 per Woo request)
  productsPerPage: 24,

  // Optional: set true for auto-load on scroll
  enableInfiniteScroll: false,

  // Woo checkout page
  checkoutUrl: "https://icedoutstore.co.za/wordpress/checkout/",

  // ✅ Your custom cart sync endpoint (must return { ok:true, checkout_url })
  cartSyncUrl: "https://icedoutstore.co.za/wordpress/wp-json/icedout/v1/cart/sync",
};

/* ===== HELPERS ===== */
function $(sel, root = document) {
  return root.querySelector(sel);
}

function getProductsContainer() {
  return (
    document.getElementById("productsGrid") ||
    document.querySelector("[data-products-grid]") ||
    document.querySelector(".products-grid")
  );
}

function escapeHTML(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[m];
  });
}

function moneyZAR(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "R0.00";
  return `R${n.toFixed(2)}`;
}

/* Make product cards visible even if CSS has opacity animations */
function forceProductsVisible() {
  const style = document.createElement("style");
  style.textContent = `
    .product-card{opacity:1!important;transform:none!important;visibility:visible!important;}
    #productsGrid:empty::before{content:"";display:block;height:1px;}
  `;
  document.head.appendChild(style);
}

/* ===== WOO API (BROWSER SAFE) ===== */
class WooCommerceAPI {
  constructor(config) {
    this.baseURL = config.baseURL.replace(/\/$/, "");
    this.key = config.consumerKey;
    this.secret = config.consumerSecret;
  }

  buildURL(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}/${endpoint}`);

    // Query auth (more reliable than Authorization header in browser)
    url.searchParams.set("consumer_key", this.key);
    url.searchParams.set("consumer_secret", this.secret);

    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
    return url.toString();
  }

  async request(endpoint, params = {}) {
    const res = await fetch(this.buildURL(endpoint, params), {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      let detail = "";
      try {
        const j = await res.json();
        detail = j?.message ? ` — ${j.message}` : "";
      } catch (_) {}
      throw new Error(`WooCommerce API ${res.status}${detail}`);
    }

    return res.json();
  }

  getProducts(params = {}) {
    return this.request("products", params);
  }

  getProductById(id) {
    return this.request(`products/${id}`);
  }
}

/* ===== CART ===== */
class ShoppingCart {
  constructor() {
    this.storageKey = "icedout_cart";
    this.items = this.load();
    this.updateCartCount();
    this.renderCartItems();
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch {
      return [];
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  totalCount() {
    return this.items.reduce((t, i) => t + (Number(i.quantity) || 0), 0);
  }

  totalPrice() {
    return this.items.reduce((t, i) => t + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);
  }

  updateCartCount() {
    const el = document.getElementById("cartCount");
    if (!el) return;
    const count = this.totalCount();
    el.textContent = String(count);
    el.style.display = count > 0 ? "flex" : "none";
  }

  addItem(product) {
    const id = String(product.id);
    const existing = this.items.find((i) => String(i.id) === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image || "",
        quantity: 1,
      });
    }

    this.save();
    this.updateCartCount();
    this.renderCartItems();
    this.notify(`${product.name} added to cart`);
    this.openCart();
  }

  removeItem(productId) {
    const id = String(productId);
    this.items = this.items.filter((i) => String(i.id) !== id);
    this.save();
    this.updateCartCount();
    this.renderCartItems();
  }

  updateQuantity(productId, qty) {
    const id = String(productId);
    const item = this.items.find((i) => String(i.id) === id);
    if (!item) return;

    const newQty = Number(qty);
    if (!Number.isFinite(newQty) || newQty <= 0) return this.removeItem(id);

    item.quantity = newQty;
    this.save();
    this.updateCartCount();
    this.renderCartItems();
  }

  openCart() {
    document.getElementById("cartSidebar")?.classList.add("active");
    document.getElementById("cartOverlay")?.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeCart() {
    document.getElementById("cartSidebar")?.classList.remove("active");
    document.getElementById("cartOverlay")?.classList.remove("active");
    document.body.style.overflow = "";
  }

  renderCartItems() {
    const container = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");
    if (!container) return;

    if (!this.items.length) {
      container.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
      if (totalEl) totalEl.textContent = "0.00";
      return;
    }

    container.innerHTML = this.items
      .map(
        (item) => `
      <div class="cart-item">
        <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${escapeHTML(item.name)}</h4>
          <p class="cart-item-price">${moneyZAR(item.price)}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${escapeHTML(item.id)}">-</button>
            <span class="quantity">${Number(item.quantity) || 1}</span>
            <button class="quantity-btn plus" data-id="${escapeHTML(item.id)}">+</button>
          </div>
        </div>
        <button class="remove-item" data-id="${escapeHTML(item.id)}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `
      )
      .join("");

    if (totalEl) totalEl.textContent = this.totalPrice().toFixed(2);

    container.querySelectorAll(".minus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.items.find((i) => String(i.id) === String(id));
        if (item) this.updateQuantity(id, (Number(item.quantity) || 1) - 1);
      });
    });

    container.querySelectorAll(".plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.items.find((i) => String(i.id) === String(id));
        if (item) this.updateQuantity(id, (Number(item.quantity) || 1) + 1);
      });
    });

    container.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => this.removeItem(e.currentTarget.dataset.id));
    });
  }

  notify(message) {
    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerHTML = `<i class="fas fa-check-circle"></i><span>${escapeHTML(message)}</span>`;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add("show"), 10);
    setTimeout(() => {
      notif.classList.remove("show");
      setTimeout(() => notif.remove(), 250);
    }, 2500);
  }

  /* ===== CHECKOUT (SYNC TO WOO CART THEN REDIRECT) ===== */
  async goToCheckout() {
    if (!this.items.length) {
      this.notify("Your cart is empty");
      return;
    }

    this.notify("Preparing checkout…");

    try {
      const payload = {
        items: this.items.map((i) => ({
          id: parseInt(i.id, 10),
          quantity: Math.max(1, parseInt(i.quantity, 10) || 1),
        })),
      };

      const res = await fetch(WOO_CONFIG.cartSyncUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Cart sync failed (${res.status})`);
      }

      window.location.href = data.checkout_url || WOO_CONFIG.checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      this.notify(err.message || "Checkout failed. Please try again.");
    }
  }
}

/* ===== PRODUCTS UI (PAGINATED + LOAD MORE) ===== */
class ProductsUI {
  constructor(api) {
    this.api = api;
    this.container = getProductsContainer();

    this.page = 1;
    this.perPage = Math.min(100, Number(WOO_CONFIG.productsPerPage) || 24);
    this.isLoading = false;
    this.hasMore = true;

    this.seenIds = new Set();

    this.loadMoreBtnId = "loadMoreProductsBtn";
    this.sentinelId = "productsSentinel";

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleIntersect = this.handleIntersect.bind(this);
  }

  setLoading(first = false) {
    if (!this.container) return;

    if (first) {
      this.container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:28px;opacity:.75">
          Loading products…
        </div>
      `;
      return;
    }

    if (document.getElementById("productsLoaderRow")) return;

    const loader = document.createElement("div");
    loader.id = "productsLoaderRow";
    loader.style.gridColumn = "1/-1";
    loader.style.textAlign = "center";
    loader.style.padding = "18px";
    loader.style.opacity = "0.75";
    loader.textContent = "Loading more…";
    this.container.appendChild(loader);
  }

  clearInlineLoader() {
    document.getElementById("productsLoaderRow")?.remove();
  }

  setError(message) {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:28px;background:#fff3cd;border-radius:14px;color:#856404">
        <div style="font-size:34px;margin-bottom:10px;">⚠️</div>
        <div style="font-weight:700;margin-bottom:6px;">Unable to load products</div>
        <div style="margin-bottom:16px;">${escapeHTML(message)}</div>
        <button id="retryProductsBtn" style="padding:10px 16px;border:0;border-radius:10px;background:#667eea;color:white;cursor:pointer">
          Retry
        </button>
      </div>
    `;
    document.getElementById("retryProductsBtn")?.addEventListener("click", () => this.resetAndLoad());
  }

  renderInitialShell() {
    if (!this.container) return;

    // Add Load More button under grid if not exists
    if (!document.getElementById(this.loadMoreBtnId)) {
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.justifyContent = "center";
      wrap.style.padding = "10px 0 30px";

      wrap.innerHTML = `
        <button id="${this.loadMoreBtnId}"
          style="padding:12px 18px;border:1px solid #e5e5e5;border-radius:999px;background:white;cursor:pointer;font-weight:600;letter-spacing:.02em">
          Load more
        </button>
      `;

      this.container.insertAdjacentElement("afterend", wrap);
      document.getElementById(this.loadMoreBtnId).addEventListener("click", this.handleLoadMore);
    }

    // Infinite scroll sentinel (optional)
    if (WOO_CONFIG.enableInfiniteScroll && !document.getElementById(this.sentinelId)) {
      const sentinel = document.createElement("div");
      sentinel.id = this.sentinelId;
      sentinel.style.height = "1px";
      this.container.insertAdjacentElement("afterend", sentinel);

      this.io = new IntersectionObserver(this.handleIntersect, {
        root: null,
        threshold: 0.1,
        rootMargin: "300px",
      });
      this.io.observe(sentinel);
    }

    this.updateLoadMoreState();
  }

  updateLoadMoreState() {
    const btn = document.getElementById(this.loadMoreBtnId);
    if (!btn) return;

    if (!this.hasMore) {
      btn.disabled = true;
      btn.style.opacity = "0.6";
      btn.style.cursor = "not-allowed";
      btn.textContent = "No more products";
      return;
    }

    btn.disabled = this.isLoading;
    btn.style.opacity = this.isLoading ? "0.6" : "1";
    btn.style.cursor = this.isLoading ? "not-allowed" : "pointer";
    btn.textContent = this.isLoading ? "Loading…" : "Load more";
  }

  renderProductsAppend(products) {
    if (!this.container) return;

    if (!products?.length && this.page === 1) {
      this.container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:28px;opacity:.7">No products found</div>`;
      this.hasMore = false;
      this.updateLoadMoreState();
      return;
    }

    const frag = document.createDocumentFragment();

    products.forEach((p) => {
      if (!p?.id) return;

      const idStr = String(p.id);
      if (this.seenIds.has(idStr)) return;
      this.seenIds.add(idStr);

      const image =
        p.images?.[0]?.src ||
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600";

      const sale = !!p.on_sale;

      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        ${sale ? '<span class="sale-badge">SALE</span>' : ""}
        <div class="product-image-wrapper">
          <img src="${escapeHTML(image)}" alt="${escapeHTML(p.name)}" loading="lazy" class="product-image">
          <button class="quick-view-btn" data-product-id="${escapeHTML(p.id)}" type="button">
            <i class="fas fa-eye"></i> Quick View
          </button>
        </div>
        <div class="product-info">
          <h3 class="product-title">${escapeHTML(p.name)}</h3>
          <div class="product-price">
            ${moneyZAR(p.price)}
            ${sale ? `<span class="original-price">${moneyZAR(p.regular_price)}</span>` : ""}
          </div>
          <button class="add-to-cart-btn" type="button"
            data-product-id="${escapeHTML(p.id)}"
            data-product-name="${escapeHTML(p.name)}"
            data-product-price="${escapeHTML(p.price)}"
            data-product-image="${escapeHTML(image)}">
            <i class="fas fa-shopping-bag"></i> Add to Cart
          </button>
        </div>
      `;
      frag.appendChild(card);
    });

    this.container.appendChild(frag);

    // Bind events (only new)
    this.container.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", (e) => {
        const t = e.currentTarget;
        window.cart?.addItem({
          id: t.dataset.productId,
          name: t.dataset.productName,
          price: t.dataset.productPrice,
          image: t.dataset.productImage,
        });
      });
    });

    this.container.querySelectorAll(".quick-view-btn").forEach((btn) => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", (e) => this.openQuickView(e.currentTarget.dataset.productId));
    });
  }

  async openQuickView(productId) {
    try {
      const p = await this.api.getProductById(productId);

      const modal = document.createElement("div");
      modal.className = "quick-view-modal";
      const img = p.images?.[0]?.src || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600";

      modal.innerHTML = `
        <div class="quick-view-content">
          <button class="close-modal" type="button"><i class="fas fa-times"></i></button>
          <div class="quick-view-grid">
            <div class="quick-view-image">
              <img src="${escapeHTML(img)}" alt="${escapeHTML(p.name)}">
            </div>
            <div class="quick-view-details">
              <h2>${escapeHTML(p.name)}</h2>
              <p class="quick-view-price">${moneyZAR(p.price)}</p>
              <div class="quick-view-description">${p.short_description || p.description || ""}</div>
              <button class="add-to-cart-btn" type="button"
                data-product-id="${escapeHTML(p.id)}"
                data-product-name="${escapeHTML(p.name)}"
                data-product-price="${escapeHTML(p.price)}"
                data-product-image="${escapeHTML(img)}">
                <i class="fas fa-shopping-bag"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector(".close-modal")?.addEventListener("click", () => modal.remove());
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
      });

      modal.querySelector(".add-to-cart-btn")?.addEventListener("click", (e) => {
        const t = e.currentTarget;
        window.cart?.addItem({
          id: t.dataset.productId,
          name: t.dataset.productName,
          price: t.dataset.productPrice,
          image: t.dataset.productImage,
        });
        modal.remove();
      });
    } catch (err) {
      console.error("Quick view error:", err);
      alert("Unable to load product details");
    }
  }

  async fetchNextPage() {
    if (!this.container || this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    this.updateLoadMoreState();
    this.setLoading(this.page === 1);

    try {
      const products = await this.api.getProducts({
        per_page: this.perPage,
        page: this.page,
        orderby: "date",
        order: "desc",
        status: "publish",
      });

      // End conditions
      if (!products || products.length === 0) this.hasMore = false;
      if (products && products.length < this.perPage) this.hasMore = false;

      // First page: clear grid and set up UI
      if (this.page === 1) {
        this.container.innerHTML = "";
        this.renderInitialShell();
      }

      this.renderProductsAppend(products);
      this.page += 1;
    } catch (err) {
      console.error("ICEDOUT products error:", err);
      if (this.page === 1) this.setError(err?.message || "Failed to load products");
      else window.cart?.notify(err?.message || "Failed to load more products");
    } finally {
      this.isLoading = false;
      this.clearInlineLoader();
      this.updateLoadMoreState();
    }
  }

  handleLoadMore() {
    this.fetchNextPage();
  }

  handleIntersect(entries) {
    if (!WOO_CONFIG.enableInfiniteScroll) return;
    const first = entries?.[0];
    if (first && first.isIntersecting) this.fetchNextPage();
  }

  resetAndLoad() {
    this.page = 1;
    this.hasMore = true;
    this.isLoading = false;
    this.seenIds.clear();
    this.fetchNextPage();
  }

  async load() {
    if (!this.container) {
      console.error('Products container not found. Add id="productsGrid".');
      return;
    }
    this.resetAndLoad();
  }
}

/* ===== UI WIRING ===== */
function initUI() {
  // Mobile Menu
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuOverlay = document.getElementById("menuOverlay");
  const closeMenu = document.getElementById("closeMenu");

  if (menuBtn && mobileMenu && menuOverlay) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.add("active");
      menuOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    closeMenu?.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });

    menuOverlay.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Search Overlay
  const searchBtn = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const closeSearch = document.getElementById("closeSearch");
  const searchInput = document.getElementById("searchInput");

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
      setTimeout(() => searchInput?.focus(), 100);
    });

    closeSearch?.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Cart Sidebar
  const cartBtn = document.getElementById("cartBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");

  cartBtn?.addEventListener("click", () => window.cart?.openCart());
  closeCart?.addEventListener("click", () => window.cart?.closeCart());
  cartOverlay?.addEventListener("click", () => window.cart?.closeCart());

  // Newsletter
  const newsletterForm = document.getElementById("newsletterForm");
  newsletterForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail")?.value || "subscriber";
    window.cart?.notify(`Thanks for subscribing, ${email}!`);
    this.reset();
  });

  // Checkout Button
  const checkoutBtn = document.getElementById("checkoutBtn");
  checkoutBtn?.addEventListener("click", () => window.cart?.goToCheckout());

  // Footer accordion (mobile)
  if (window.innerWidth <= 768) {
    document.querySelectorAll(".section-header").forEach((header) => {
      header.addEventListener("click", function () {
        this.nextElementSibling?.classList.toggle("active");
        this.querySelector(".toggle-icon")?.classList.toggle("active");
      });
    });
  }
}

/* ===== BOOT ===== */
document.addEventListener("DOMContentLoaded", () => {
  forceProductsVisible();

  window.cart = new ShoppingCart();
  initUI();

  const api = new WooCommerceAPI(WOO_CONFIG);
  const productsUI = new ProductsUI(api);
  productsUI.load();
});
