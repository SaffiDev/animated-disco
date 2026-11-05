import ProductCard from "./ProductCard";

export default function ProductList({ products, cartQty, onAdd, onOpen }) {
    if (!products.length) {
        return (
            <p className="empty">
                Ничего не найдено. Измените запрос или сбросьте фильтры.
            </p>
        );
    }
    return (
        <div className="grid" aria-label="Список товаров">
            {products.map((p) => (
                <ProductCard
                    key={p.id}
                    product={p}
                    inCart={cartQty[p.id]}
                    onAdd={onAdd}
                    onOpen={onOpen}
                />
            ))}
        </div>
    );
}