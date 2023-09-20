import express, { json } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { createProductRouter } from "./routes/products.js";




export const createApp = ({ productModel }) => {
  const app = express();
  app.use(json());
  app.disable("x-powered-by");
  app.use(corsMiddleware());


  //Falta ver bien lo de web (CORS)

  app.use("/products", createProductRouter({ productModel })); //ARREGLAR UPDATE EN MYSQL Y COMO DEVOLVER IMÁGEN

  const PORT = process.env.PORT ?? 1234;

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
  })

}

