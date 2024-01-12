"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import type { Route } from "next";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useAuth } from "@/utils/user";

interface NavLinkProps {
  children: React.ReactNode;
}

const Links: {
  name: string;
  href: Route;
  protected: boolean | "SPONSOR" | "STUDENT";
}[] = [
  { name: "Dashboard", href: "/dashboard", protected: true },
  { name: "Projects", href: "/", protected: false },
  { name: "Applications", href: "/application", protected: "SPONSOR" },
];

function NavLink(props: NavLinkProps) {
  const { children } = props;
  return (
    <Box
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      px={2}
      py={1}
      rounded="md"
    >
      {children}
    </Box>
  );
}

export function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user, logout } = useAuth({
    onLogoutSuccess: () => {
      toast({
        title: "Successfully logged out",
        status: "success",
      });
    },
  });
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/login";

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex alignItems="center" h={16} justifyContent="space-between">
        <IconButton
          aria-label="Open Menu"
          display={{ md: "none" }}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={isOpen ? onClose : onOpen}
          size="md"
        />
        <HStack alignItems="center" spacing={8}>
          <NextLink href="/">
            <Box>Logo</Box>
          </NextLink>
          <HStack as="nav" display={{ base: "none", md: "flex" }} spacing={4}>
            {Links.map((link) =>
              (
                typeof link.protected === "string"
                  ? user?.role !== link.protected
                  : link.protected && !user
              ) ? null : (
                <NavLink key={link.name}>
                  <NextLink href={link.href}>{link.name}</NextLink>
                </NavLink>
              )
            )}
          </HStack>
        </HStack>
        <Flex alignItems="center">
          {isAuthPage || !user ? (
            <NextLink href="/login">
              <Button
                colorScheme="teal"
                mr={4}
                size="sm"
                variant="solid"

                // display={loggedIn() ? "block" : "none"}
              >
                Sign In
              </Button>
            </NextLink>
          ) : null}

          {!user || isAuthPage ? null : (
            <Menu>
              <MenuButton
                as={Button}
                cursor="pointer"
                minW={0}
                rounded="full"
                variant="link"
              >
                <Avatar name={user.name} size="sm" />
              </MenuButton>
              <MenuList>
                <MenuItem>Current: {user.name}</MenuItem>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem
                  cursor="pointer"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box display={{ md: "none" }} pb={4}>
          <Stack as="nav" spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.name}>
                <NextLink href={link.href}>{link.name}</NextLink>
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
