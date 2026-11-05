import { money } from "@/utils/format";

export default function CartItem({ product, qty, onQty, onRemove }) {
    return (
        <li className="cart-item">
            <div className="cart-info">
                <img className="cart-thumb" src={product.image} alt="" />
                <span className="cart-name">{product.title}</span>
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
    );
}