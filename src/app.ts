import express, { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import dotenv from "dotenv";

const app = express();

const routes = Router();
app.use(morgan("dev"));

dotenv.config();

routes.get("/proxy-server/", (request, response) => {
  return response.status(200).send({
    status: "Success",
    message: "ProxyServer is running",
  });
});

//Auth middleware
app.use("", (request, response, next) => {
  console.log(process.env.App_Name);

  if (request.headers.app_client_token !== process.env.App_Client_Secret) {
    return response.sendStatus(401);
  }

  if (request.headers.app_client !== process.env.App_Name) {
    return response.sendStatus(401);
  }

  next();
});

app.use(
  "/private/api/service",
  createProxyMiddleware({
    target: process.env.API_DEV_Server,
    changeOrigin: true,
    pathRewrite: {
      [`^/private/api/service`]: "",
    },
    secure: false,
    headers: {
      ITSAPP_LANG: "en-EN",
    },
  })
);

app.use(routes);

export { app };
