import mysql from 'mysql2/promise';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'quimicadb'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const connection = await mysql.createConnection(connectionString);

export class ProductModel {

  static async getAll({ tipo }) {
    if (tipo) {
      const lowerCaseTipo = tipo.toLowerCase();

      const products = await connection.query(
        `SELECT * 
        FROM productos
        WHERE LOWER(tipo)=?;`, [lowerCaseTipo]
      )

      return products;
    }

    const products = await connection.query("SELECT * FROM productos;");
    return products;
  }

  static async getById({ id }) {
    const products = await connection.query(
      `SELECT *
      FROM productos
      WHERE id=?;`, [id]
    )
    if (products.length == 0) {
      return null;
    }
    return products[0];
  }


  static async create({ product }) {
    const { nombre,
      descripcion,
      imagen,
      precio,
      tipo } = product;

    try {
      await connection.query(
        `INSERT INTO productos ( nombre, descripcion, imagen, precio, tipo)
        VALUES(?,?,?,?,?);`, [nombre, descripcion, imagen, precio, tipo]
      );
      const [prod] = await connection.query(
        `SELECT *
      FROM productos
      WHERE nombre=?;`, [nombre]
      )
      if (prod.length != 0) {
        return prod[0];
      }


    }
    catch (e) {
      throw new Error("No se pudo crear el producto");
    }
    return false;

  }

  static async delete({ id }) {
    let deleted = false;
    try {
      await connection.query(
        `DELETE FROM productos WHERE id=?;`, [id]
      );
      deleted = true;
    }
    catch (e) {
      throw new Error("No se pudo eliminar el producto");
    }
    return deleted;
  }

  static async update({ id, prod }) {
    const product = await connection.query(
      `SELECT *
      FROM productos
      WHERE id=?;`, [id]
    );

    const { nombre,
      descripcion,
      imagen,
      precio,
      tipo } = prod ?? product;

    try {
      await connection.query(
        `UPDATE productos
          SET nombre=?, descripcion=?, imagen=?, precio=?, tipo=?
          WHERE id=?;`, [nombre, descripcion, imagen, precio, tipo, id]
      );

      const newProduct = await connection.query(
        `SELECT *
      FROM productos
      WHERE id=?;`, [id]
      );

      if (newProd.length != 0) {
        return newProd[0];
      }

    }
    catch (e) {
      throw new Error("No se pudo actualizar el producto");
    }
    return false;
  }




}