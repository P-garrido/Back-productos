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

      return products[0];
    }

    const products = await connection.query("SELECT * FROM productos;");

    return products[0];
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
      tipo,
      imagen,
      precio
    } = product;

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
      const result = await connection.query(
        `DELETE FROM productos WHERE id=?;`, [id]
      );
      if (result[0].affectedRows === 1) {
        deleted = true;
      }
    }
    catch (e) {
      throw new Error("No se pudo eliminar el producto");
    }
    return deleted;
  }

  static async update({ id, product }) {
    const oldProduct = await connection.query(
      `SELECT *
      FROM productos
      WHERE id=?;`, [id]
    );

    if (oldProduct.length === 0) {
      throw new Error("Producto no encontrado");
    }

    const prod = oldProduct[0][0];


    const {
      nombre: newNombre = prod.nombre,
      descripcion: newDescripcion = prod.descripcion,
      imagen: newImagen = prod.imagen,
      precio: newPrecio = prod.precio,
      tipo: newTipo = prod.tipo,
    } = product;
    try {
      await connection.query(
        `UPDATE productos
      SET nombre=?, descripcion=?, imagen=?, precio=?, tipo=?
      WHERE id=?;`,
        [newNombre, newDescripcion, newImagen, newPrecio, newTipo, id]
      );

      const newProduct = await connection.query(
        `SELECT *
      FROM productos
      WHERE id=?;`, [id]
      );

      if (newProduct.length != 0) {
        return newProduct[0];
      }

    }
    catch (e) {
      console.log(e);
    }
    return false;
  }

}
