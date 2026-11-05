import { CATEGORIES } from "@/services/productService";

export default function Filters({ filters, onChange, onReset }) {
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