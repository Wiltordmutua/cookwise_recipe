import { httpRouter } from "convex/server";
import { darajaCallback } from "./tips";

const http = httpRouter();

http.route({
  path: "/daraja/callback",
  method: "POST",
  handler: darajaCallback,
});

export default http;
