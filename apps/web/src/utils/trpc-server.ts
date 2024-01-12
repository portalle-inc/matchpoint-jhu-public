import {
  httpBatchLink,
} from "@trpc/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { trpc } from "./trpc";

const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
});
export const helpers = createServerSideHelpers({
  client,
  ctx: {
    authorization: undefined,
  },
});
