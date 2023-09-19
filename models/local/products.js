import { readJSON } from "../../utils.js";

const products = readJSON('./products.json');

export class ProductModel {
  static async getAll({ tipo }) {
    if (tipo) {
      return products.filter(
        prod => prod.tipo.toLowerCase() === tipo.toLowerCase()
      )
    }

    return products
  }

  static async getById({ id }) {
    const product = products.find(prod => prod.id === id)
    return product

  }

  static async create({ prod }) {
    const newProduct = {
      ...prod
    }
    products.push(newProduct);
    return newProduct
  }

  static async delete({ id }) {
    const producIndex = products.findIndex(prod => prod.id === id)
    if (producIndex === -1) return false

    products.splice(producIndex, 1)
    return true
  }

  static async update({ id, prod }) {
    const producIndex = products.findIndex(prod => prod.id === id)
    if (producIndex === -1) return false

    products[producIndex] = {
      ...products[producIndex],
      ...prod
    }

    return products[producIndex]
  }
}