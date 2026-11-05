import { money } from "@/utils/format";

function buildJson(items, total) {
    const rows = items.map(({ product, qty }) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        qty,
        sum: product.price * qty,
    }));
    return JSON.stringify({ date: new Date().toISOString(), items: rows, total }, null, 2);
}

function buildTxt(items, total) {
    const lines = items.map(
        ({ product, qty }, i) =>
            `${i + 1}. ${product.title} — ${qty} × ${money(product.price)} = ${money(product.price * qty)}`
    );
    return [`Заказ от ${new Date().toLocaleDateString("ru-RU")}`, "", ...lines, "", `Итого: ${money(total)}`].join("\n");
}

export function exportOrder(items, total, format) {
    const isJson = format === "json";
    const content = isJson ? buildJson(items, total) : buildTxt(items, total);
    const mime = isJson ? "application/json" : "text/plain";

    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `order_${new Date().toISOString().slice(0, 10)}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
}