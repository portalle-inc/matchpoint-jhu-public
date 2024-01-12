import {
  Strategy as JwtStrategy,
  ExtractJwt,
  VerifyCallback,
  StrategyOptions,
} from "passport-jwt";
import config from "./config";
import { db } from "./prisma";
import { TokenType } from "@prisma/client";

const jwtOptions: StrategyOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    if (payload.type !== TokenType.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await db.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
