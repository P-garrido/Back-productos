import { mysql } from 'mysql2/promise';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'quimica'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const connection = await mysql.connection(connectionString);

export class MovieModel {

  static async getAll({ tipo }) {
    if (tipo) {
      const lowerCaseTipo = tipo.toLowerCase();

      const products = await connection.query(
        `SELECT p.id, nombre, imagen, p.descripcion, precio  
        FROM tipos t
        INNER JOIN productos_tipos pt ON t.id=pt.id_tipo
        INNER JOIN productos p ON pt.id_prod=p.id
        WHERE LOWER(t.descripcion)=?;`, [lowerCaseTipo]
      )

      return products;
    }

    const products = await connection.query("SELECT * FROM productos;");
    return products;
  }

  static async getById({ id }) {
    const products = await connection.query(
      `SELECT *
      FROM products
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
      precio } = product; //VER QUE ONDA EL TIPO
  }
}