import { PRODUCTS } from "../data/products";
import { ALL } from "../constants/config";

export const CATEGORIES = [ALL, ...new Set(PRODUCTS.map((p) => p.category))];

export const getProducts = () => PRODUCTS;

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id);

export function filterProducts(products, filters) {
    const q = filters.search.trim().toLowerCase();
    const min = filters.min === "" ? 0 : Number(filters.min);
    const max = filters.max === "" ? Infinity : Number(filters.max);
    return products.filter(
        (p) =>
            p.title.toLowerCase().includes(q) &&
            (filters.category === ALL || p.category === filters.category) &&
            p.price >= min &&
            p.price <= max
    );
}