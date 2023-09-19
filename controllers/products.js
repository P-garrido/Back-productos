import { ProductModel } from "../models/mysql/products.js";
import { validateProduct, validatePartialProduct } from "../schemas/products.js";

export class ProductController {
  static async getAll(req, res) {
    const { tipo } = req.query;
    const products = await ProductModel.getAll({ tipo });
    res.json(products);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const product = await ProductModel.getById({ id });
    if (product) {
      return res.json(product);
    }
    res.status(404).json({ message: "No se encontró el producto" });
  }

  static async create(req, res) {
    const result = validateProduct(req.body);
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newProduct = await ProductModel.create({ product: result.data });
    res.status(201).json(newProduct);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await ProductModel.delete({ id });
    if (result == false) {
      return res.status(404).message({ message: "No se encontró el producto" });
    }
    res.json({ message: "Producto eliminado" });

  }

  static async update(req, res) {
    const result = validatePartialProduct(req.body);
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const updatedProduct = await ProductModel.update({ id, product: result.data });
    return res.json(updatedProduct);
  }
}