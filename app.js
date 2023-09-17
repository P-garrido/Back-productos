import express, { json } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { productsRouter } from "./routes/products.js";


const app = express();
app.use(json());
app.disable("x-powered-by");
app.use(corsMiddleware());

//Falta ver bien lo de web (CORS)

app.use("/products", productsRouter);

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})

