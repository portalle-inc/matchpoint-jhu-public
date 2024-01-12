import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import httpStatus from "http-status";

function toTRPCErrorCode(statusCode: number): TRPC_ERROR_CODE_KEY {
  switch (statusCode) {
    case httpStatus.BAD_REQUEST:
      return "BAD_REQUEST";
    case httpStatus.UNAUTHORIZED:
      return "UNAUTHORIZED";
    case httpStatus.FORBIDDEN:
      return "FORBIDDEN";
    case httpStatus.NOT_FOUND:
      return "NOT_FOUND";
    case httpStatus.CONFLICT:
      return "CONFLICT";
    case httpStatus.UNPROCESSABLE_ENTITY:
      return "UNPROCESSABLE_CONTENT";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
}

export default toTRPCErrorCode;