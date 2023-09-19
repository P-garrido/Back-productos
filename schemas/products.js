import z from "zod";

const ProductSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  tipo: z.string(),
  imagen: z.string().url(),
  precio: z.number().positive()
})

export function validateProduct(product) {
  return ProductSchema.safeParse(product)
}

export function validatePartialProduct(product) {
  return ProductSchema.partial().safeParse(product)
}