"use client";

import { useEffect } from "react";
import { money } from "@/utils/format";
import { getProductById } from "@/services/productService";

export default function ProductModal({ productId, inCart, onClose, onAdd }) {
    const product = productId != null ? getProductById(productId) : null;

    useEffect(() => {
        if (!product) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [product, onClose]);

    if (!product) return null;

    return (
        <div
            className="modal-backdrop"
            onClick={onClose}
        >
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.stopPropagation()} // клик внутри не закрывает
            >
                <button
                    className="modal-close"
                    aria-label="Закрыть"
                    onClick={onClose}
                >
                    ×
                </button>

                <div className="modal-media">
                    <img src={product.image} alt={product.title} />
                </div>

                <div className="modal-body">
                    <p className="card-cat">{product.category}</p>
                    <h2 id="modal-title">{product.title}</h2>
                    <p className="modal-rating">Рейтинг: {product.rating.toFixed(1)} / 5</p>
                    <p className="modal-price">{money(product.price)}</p>

                    <p className="modal-desc">
                        {product.description ||
                            `Подробное описание товара «${product.title}». Категория: ${product.category}. ` +
                            `Высокое качество, проверенный поставщик, быстрая доставка. ` +
                            `Оценка покупателей — ${product.rating.toFixed(1)} из 5.`}
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            onAdd(product.id);
                            onClose();
                        }}
                    >
                        {inCart ? `В корзине: ${inCart} — добавить ещё` : "Добавить в корзину"}
                    </button>
                </div>
            </div>
        </div>
    );
}