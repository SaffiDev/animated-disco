"use client";

import { useEffect, useMemo, useState } from "react";
import "./styles.css";

//Данные
const PRODUCTS = [
  { id: 1, title: "Смартфон Nova X", category: "Электроника", price: 42990, rating: 4.8, emoji: "📱", hue: 265 },
  { id: 2, title: "Ноутбук Pro 14", category: "Электроника", price: 89990, rating: 4.7, emoji: "💻", hue: 240 },
  { id: 3, title: "Наушники Calm", category: "Электроника", price: 6990, rating: 4.6, emoji: "🎧", hue: 285 },
  { id: 4, title: "Кроссовки Run", category: "Одежда", price: 5490, rating: 4.2, emoji: "👟", hue: 310 },
  { id: 5, title: "Худи Basic", category: "Одежда", price: 2990, rating: 4.0, emoji: "🧥", hue: 255 },
  { id: 6, title: "Рюкзак Travel", category: "Аксессуары", price: 3290, rating: 4.5, emoji: "🎒", hue: 275 },
  { id: 7, title: "Чехол Soft", category: "Аксессуары", price: 790, rating: 3.9, emoji: "📲", hue: 295 },
  { id: 8, title: "Часы Pulse", category: "Аксессуары", price: 12990, rating: 4.4, emoji: "⌚", hue: 230 },
  { id: 9, title: "Чайная пара", category: "Дом и кухня", price: 1290, rating: 4.3, emoji: "🍵", hue: 300 },
  { id: 10, title: "Кофемолка Mill", category: "Дом и кухня", price: 3990, rating: 4.6, emoji: "☕", hue: 250 },
  { id: 11, title: "Настольная лампа", category: "Дом и кухня", price: 2490, rating: 4.1, emoji: "💡", hue: 320 },
  { id: 12, title: "Плед Cozy", category: "Дом и кухня", price: 1990, rating: 4.7, emoji: "🛋️", hue: 270 },
];

const ALL = "Все";
const CATEGORIES = [ALL, ...new Set(PRODUCTS.map((p) => p.category))];
const CART_KEY = "catalog.cart";
const FILTERS_KEY = "catalog.filters";
const THEME_KEY = "catalog.theme";
const DEFAULT_FILTERS = { search: "", category: ALL, min: "", max: "" };

//Утилиты
const money = (n) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function usePersistentState(key, initial) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(load(key, initial));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {

    }
  }, [key, value, ready]);

  return [value, setValue];
}

async function download(filename, content, mime) {
  if (typeof window !== "undefined" && window.showSaveFilePicker) {
    try {
      const ext = filename.split(".").pop();
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: ext.toUpperCase(), accept: { [mime]: ["." + ext] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      alert(`Файл сохранён: ${handle.name}`);
      return;
    } catch (e) {
      if (e.name === "AbortError") {
        alert("Сохранение отменено");
        return;
      }
    }
  }

  const a = document.createElement("a");
  a.href = `data:${mime};charset=utf-8,${encodeURIComponent(content)}`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  alert("Скачивание запущено, файл должен лежать в папке «Загрузки».");
}

//Компоненты
function Stars({ rating }) {
  const full = Math.round(rating);
  return (
      <span className="stars" aria-label={`Рейтинг ${rating} из 5`}>
      {"★".repeat(full)}
        <span className="stars-off">{"★".repeat(5 - full)}</span>
      <span className="stars-num">{rating.toFixed(1)}</span>
    </span>
  );
}

function ProductCard({ product, inCart, onAdd }) {
  return (
      <article className="card">
        <div className="card-media" style={{ "--hue": product.hue }} aria-hidden="true">
          <span>{product.emoji}</span>
        </div>
        <div className="card-body">
          <p className="card-cat">{product.category}</p>
          <h3 className="card-title">{product.title}</h3>
          <Stars rating={product.rating} />
          <p className="card-price">{money(product.price)}</p>
          <button className="btn btn-primary" onClick={() => onAdd(product.id)}>
            {inCart ? `В корзине: ${inCart}` : "В корзину"}
          </button>
        </div>
      </article>
  );
}

function ProductList({ products, cartQty, onAdd }) {
  if (!products.length) {
    return (
        <p className="empty">
          Ничего не найдено. Измените запрос или сбросьте фильтры.
        </p>
    );
  }
  return (
      <section className="grid" aria-label="Список товаров">
        {products.map((p) => (
            <ProductCard key={p.id} product={p} inCart={cartQty[p.id]} onAdd={onAdd} />
        ))}
      </section>
  );
}

function Filters({ filters, onChange, onReset }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  return (
      <div className="filters">
        <input
            type="search"
            placeholder="Поиск по названию"
            aria-label="Поиск по названию"
            value={filters.search}
            onChange={set("search")}
        />
        <select aria-label="Категория" value={filters.category} onChange={set("category")}>
          {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="range">
          <input type="number" min="0" placeholder="Цена от" aria-label="Цена от"
                 value={filters.min} onChange={set("min")} />
          <span aria-hidden="true">–</span>
          <input type="number" min="0" placeholder="до" aria-label="Цена до"
                 value={filters.max} onChange={set("max")} />
        </div>
        <button className="btn btn-ghost" onClick={onReset}>Сбросить</button>
      </div>
  );
}

function Cart({ items, total, onQty, onRemove, onClear, onExport }) {
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
      <aside className="cart" aria-label="Корзина">
        <h2>
          Корзина {count > 0 && <span className="badge">{count}</span>}
        </h2>

        {items.length === 0 ? (
            <p className="empty">Пока пусто. Добавьте товар из каталога.</p>
        ) : (
            <>
              <ul className="cart-list">
                {items.map(({ product, qty }) => (
                    <li key={product.id} className="cart-item">
                      <div className="cart-info">
                        <span className="cart-name">{product.emoji} {product.title}</span>
                        <span className="cart-sum">{money(product.price * qty)}</span>
                      </div>
                      <div className="qty">
                        <button aria-label="Уменьшить" onClick={() => onQty(product.id, qty - 1)}>−</button>
                        <input
                            type="number" min="1" value={qty} aria-label={`Количество: ${product.title}`}
                            onChange={(e) => onQty(product.id, Number(e.target.value))}
                        />
                        <button aria-label="Увеличить" onClick={() => onQty(product.id, qty + 1)}>+</button>
                        <button className="remove" onClick={() => onRemove(product.id)}>Удалить</button>
                      </div>
                    </li>
                ))}
              </ul>

              <p className="total"><span>Итого</span><strong>{money(total)}</strong></p>

              <div className="cart-actions">
                <button className="btn btn-primary" onClick={() => onExport("txt")}>Скачать TXT</button>
                <button className="btn btn-secondary" onClick={() => onExport("json")}>Скачать JSON</button>
                <button className="btn btn-ghost" onClick={onClear}>Очистить</button>
              </div>
            </>
        )}
      </aside>
  );
}

//Приложение
export default function App() {
  const [cart, setCart] = usePersistentState(CART_KEY, []);
  const [filters, setFilters] = usePersistentState(FILTERS_KEY, DEFAULT_FILTERS);
  const [theme, setTheme] = usePersistentState(THEME_KEY, "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const min = filters.min === "" ? 0 : Number(filters.min);
    const max = filters.max === "" ? Infinity : Number(filters.max);
    return PRODUCTS.filter(
        (p) =>
            p.title.toLowerCase().includes(q) &&
            (filters.category === ALL || p.category === filters.category) &&
            p.price >= min &&
            p.price <= max
    );
  }, [filters]);

  const cartItems = useMemo(
      () =>
          cart
              .map(({ id, qty }) => ({ product: PRODUCTS.find((p) => p.id === id), qty }))
              .filter((i) => i.product),
      [cart]
  );
  const cartQty = useMemo(
      () => Object.fromEntries(cart.map((i) => [i.id, i.qty])),
      [cart]
  );
  const total = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = (id) =>
      setCart((prev) =>
          prev.some((i) => i.id === id)
              ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
              : [...prev, { id, qty: 1 }]
      );

  const setQty = (id, qty) => {
    const safe = Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: safe } : i)));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const exportOrder = (format) => {
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "json") {
      const data = {
        date: new Date().toISOString(),
        items: cartItems.map(({ product, qty }) => ({
          id: product.id, title: product.title, price: product.price, qty,
          sum: product.price * qty,
        })),
        total,
      };
      download(`order_${stamp}.json`, JSON.stringify(data, null, 2), "application/json");
    } else {
      const lines = cartItems.map(
          ({ product, qty }, i) =>
              `${i + 1}. ${product.title} — ${qty} × ${money(product.price)} = ${money(product.price * qty)}`
      );
      const text = [`Заказ от ${stamp}`, "", ...lines, "", `Итого: ${money(total)}`].join("\n");
      download(`order_${stamp}.txt`, text, "text/plain");
    }
  };

  return (
      <div className="app">
        <header className="topbar">
          <h1>Каталог</h1>
          <Filters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
          />
          <button
              className="btn btn-ghost theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️ Светлая тема" : "🌙 Тёмная тема"}
          </button>
        </header>

        <div className="layout">
          <main className="catalog">
            <ProductList products={visible} cartQty={cartQty} onAdd={addToCart} />
          </main>
          <Cart
              items={cartItems}
              total={total}
              onQty={setQty}
              onRemove={removeFromCart}
              onClear={() => setCart([])}
              onExport={exportOrder}
          />
        </div>
      </div>
  );
}
