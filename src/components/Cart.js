import CartItem from "./CartItem";
import { money } from "@/utils/format";

export default function Cart({ items, total, onQty, onRemove, onClear, onExport }) {
    const count = items.reduce((s, i) => s + i.qty, 0);
    return (
        <div className="cart" aria-label="Корзина">
            <h2>
                Корзина {count > 0 && <span className="badge">{count}</span>}
            </h2>

            {items.length === 0 ? (
                <p className="empty">Пока пусто. Добавьте товар из каталога.</p>
            ) : (
                <>
                    <ul className="cart-list">
                        {items.map(({ product, qty }) => (
                            <CartItem
                                key={product.id}
                                product={product}
                                qty={qty}
                                onQty={onQty}
                                onRemove={onRemove}
                            />
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
        </div>
    );
}