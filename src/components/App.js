"use client";

import { useEffect, useState, useCallback } from "react";
import "@/app/styles.css";

import { CART_KEY, FILTERS_KEY, THEME_KEY, DEFAULT_FILTERS } from "@/constants/config";
import { usePersistentState } from "@/hooks/usePersistentState";
import { getProducts, filterProducts } from "@/services/productService";
import { addItem, updateQty, removeItem, getCartItems, cartTotal, cartQtyMap } from "@/services/cartService";
import { exportOrder } from "@/services/exportService";
import { sanitizeCart, sanitizeFilters, sanitizeTheme } from "@/utils/sanitize";

import Filters from "./Filters";
import ProductList from "./ProductList";
import Cart from "./Cart";
import ProductModal from "./ProductModal";

export default function App() {
    const [cart, setCart] = usePersistentState(CART_KEY, [], sanitizeCart);
    const [filters, setFilters] = usePersistentState(FILTERS_KEY, DEFAULT_FILTERS, sanitizeFilters);
    const [theme, setTheme] = usePersistentState(THEME_KEY, "dark", sanitizeTheme);

    const [activeProductId, setActiveProductId] = useState(null);
    const closeModal = useCallback(() => setActiveProductId(null), []);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    const visible = filterProducts(getProducts(), filters);
    const cartItems = getCartItems(cart);
    const total = cartTotal(cartItems);
    const qtyMap = cartQtyMap(cart);

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
                    {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                </button>
            </header>

            <div className="layout">
                <main className="catalog">
                    <ProductList
                        products={visible}
                        cartQty={qtyMap}
                        onAdd={(id) => setCart((prev) => addItem(prev, id))}
                        onOpen={setActiveProductId}
                    />
                </main>
                <Cart
                    items={cartItems}
                    total={total}
                    onQty={(id, qty) => setCart((prev) => updateQty(prev, id, qty))}
                    onRemove={(id) => setCart((prev) => removeItem(prev, id))}
                    onClear={() => setCart([])}
                    onExport={(format) => exportOrder(cartItems, total, format)}
                />
            </div>

            <ProductModal
                productId={activeProductId}
                inCart={activeProductId != null ? qtyMap[activeProductId] : undefined}
                onClose={closeModal}
                onAdd={(id) => setCart((prev) => addItem(prev, id))}
            />
        </div>
    );
}