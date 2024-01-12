"use client";
import { useRouter } from "next/navigation";
import type { InputProps } from "@chakra-ui/react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  IconButton,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
  RadioGroup,
  Radio,
  useToast,
} from "@chakra-ui/react";
import { forwardRef, useRef, useState, useCallback } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useAuth } from "@/utils/user";
import { PasswordField } from "./password";

export function SignIn({ toggle }: { toggle: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth({
    onLoginSuccess: () => {
      router.push("/");
      toast({
        title: "Successfully logged in",
        status: "success",
      });
    },
    onLoginError(err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      }
    },
  });

  return (
    <Box>
      <Container
        maxW="lg"
        px={{ base: "0", sm: "8" }}
        py={{ base: "12", md: "24" }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={{ base: "lg", md: "xl" }}>
                Log in to your account
              </Heading>
              <Text color="fg.muted">
                Don&apos;t have an account?{" "}
                <Link onClick={toggle} textDecor="underline">
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
          <Box
            bg={{ base: "transparent", sm: "bg.surface" }}
            borderRadius={{ base: "none", sm: "xl" }}
            boxShadow={{ base: "none", sm: "md" }}
            px={{ base: "4", sm: "10" }}
            py={{ base: "0", sm: "8" }}
          >
            <Stack spacing="6">
              {errorMsg ? (
                <Box>
                  <Text color="red.500" mb="2">
                    {errorMsg}
                  </Text>
                </Box>
              ) : null}
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    type="email"
                    value={email}
                  />
                </FormControl>
                <PasswordField
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                />
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
                <Button size="sm" variant="text">
                  Forgot password?
                </Button>
              </HStack>
              <Stack spacing="6">
                <Button
                  onClick={() => {
                    login(email, password);
                  }}
                >
                  Sign in
                </Button>
                {/* <HStack>
                  <Divider />
                  <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                    or continue with
                  </Text>
                  <Divider />
                </HStack> */}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
