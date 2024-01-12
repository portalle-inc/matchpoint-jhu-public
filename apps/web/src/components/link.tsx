import NextLink from "next/link";
import { chakra } from "@chakra-ui/react";

export type { Route } from "next";

// wrap the NextLink with Chakra UI's factory function
export const Link = chakra<
  typeof NextLink,
  React.ComponentProps<typeof NextLink>
>(NextLink, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp: (prop) => ["href", "target", "children"].includes(prop),
});
