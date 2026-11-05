import { getProductById } from "./productService";

export function addItem(cart, id) {
    return cart.some((i) => i.id === id)
        ? cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...cart, { id, qty: 1 }];
}

export function updateQty(cart, id, qty) {
    const safe = Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
    return cart.map((i) => (i.id === id ? { ...i, qty: safe } : i));
}

export const removeItem = (cart, id) => cart.filter((i) => i.id !== id);

export const getCartItems = (cart) =>
    cart
        .map(({ id, qty }) => ({ product: getProductById(id), qty }))
        .filter((i) => i.product);

export const cartTotal = (items) =>
    items.reduce((s, i) => s + i.product.price * i.qty, 0);

export const cartQtyMap = (cart) =>
    Object.fromEntries(cart.map((i) => [i.id, i.qty]));