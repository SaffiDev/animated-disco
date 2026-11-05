import { z } from "zod";
import { ALL, DEFAULT_FILTERS } from "@/constants/config";
import { CATEGORIES, getProductById } from "@/services/productService";

const num = z.string().regex(/^\d*\.?\d*$/).catch("");

const CartSchema = z
    .array(z.object({ id: z.number().int(), qty: z.number().int().min(1).max(99) }))
    .catch([]);

const FiltersSchema = z
    .object({
        search: z.string().max(50).catch(""),
        category: z.string().refine((c) => CATEGORIES.includes(c)).catch(ALL),
        min: num,
        max: num,
    })
    .catch(DEFAULT_FILTERS);

const ThemeSchema = z.enum(["dark", "light"]).catch("dark");

export const sanitizeCart = (raw) => CartSchema.parse(raw).filter((i) => getProductById(i.id));
export const sanitizeFilters = (raw) => FiltersSchema.parse(raw);
export const sanitizeTheme = (raw) => ThemeSchema.parse(raw);