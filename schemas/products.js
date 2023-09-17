import z from "zod";

const ProductSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string(),
  tipo: z.array(z.string()),
  imagen: z.string().url().endsWith(".jpg"),
  precio: z.string()
})

export function validateProduct(product) {
  return ProductSchema.safeParse(product)
}

export function validatePartialProduct(product) {
  return ProductSchema.partial().safeParse(product)
}