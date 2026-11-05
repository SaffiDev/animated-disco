import { money } from "../utils/format";

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

export default function ProductCard({ product, inCart, onAdd, onOpen }) {
    return (
        <div
            className="card"
            role="button"
            tabIndex={0}
            onClick={() => onOpen(product.id)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(product.id);
                }
            }}
        >
            <div className="card-media">
                <img src={product.image} alt={product.title} loading="lazy" />
            </div>
            <div className="card-body">
                <p className="card-cat">{product.category}</p>
                <h3 className="card-title">{product.title}</h3>
                <Stars rating={product.rating} />
                <p className="card-price">{money(product.price)}</p>
                <button
                    className="btn btn-primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd(product.id);
                    }}
                >
                    {inCart ? `В корзине: ${inCart}` : "В корзину"}
                </button>
            </div>
        </div>
    );
}