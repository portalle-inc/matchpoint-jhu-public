// @ts-ignore @TODO: Make this resolve
// import { version } from "../../package.json";
const version = "1";
import config from "@/config/config";

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "node-express-boilerplate API documentation",
    version,
    license: {
      name: "UNLICENSED",
      url: "",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

export default swaggerDef;
