import { validateProduct, validatePartialProduct } from "../schemas/products.js";

export class ProductController {

  constructor({ productModel }) {
    this.productModel = productModel;
  }

  getAll = async (req, res) => {
    const { tipo } = req.query;
    const products = await this.productModel.getAll({ tipo });
    res.json(products);
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const product = await this.productModel.getById({ id });
    if (product) {
      const imageData = {
        "type": "Buffer",
        "data": product[0].imagen.data

      };

      return res.json(product);
    }
    res.status(404).json({ message: "No se encontró el producto" });
  }

  create = async (req, res) => {
    const result = validateProduct(req.body);
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newProduct = await this.productModel.create({ product: result.data });
    res.status(201).json(newProduct);
  }

  delete = async (req, res) => {
    const { id } = req.params;
    const result = await this.productModel.delete({ id });
    if (result == false) {
      return res.status(404).message({ message: "No se encontró el producto" });
    }
    res.json({ message: "Producto eliminado" });

  }

  update = async (req, res) => {
    const result = validatePartialProduct(req.body);
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const updatedProduct = await this.productModel.update({ id, product: result.data });
    return res.json(updatedProduct);
  }
}

