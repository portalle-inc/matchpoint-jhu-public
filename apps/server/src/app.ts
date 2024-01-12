import express, { ErrorRequestHandler, Express } from "express";
import cors from "cors";
import { trpcRouter } from "./routes/v2";
import passport from "passport";
import jwtStrategy from "./config/passport";
import { errorConverter, errorHandler } from "./middlewares/error";
import httpStatus from "http-status";
import mongoSanitize from "express-mongo-sanitize";
import ApiError from "./utils/ApiError";
import config from "./config/config";
import morgan from "./config/morgan";

const app: Express = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// // set security HTTP headers
// app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(xss());
app.use(mongoSanitize());

// gzip compression
// app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//   app.use('/v1/auth', authLimiter);
// }

app.use("/v2", trpcRouter)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
