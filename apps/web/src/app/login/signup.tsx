
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
} from "@chakra-ui/react";
import { forwardRef, useRef, useState, useCallback } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { PasswordField } from "./password";

export function SignUp({ toggle }: { toggle: () => void }) {
  type UserRole = "STUDENT" | "SPONSOR";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("STUDENT");
  const router = useRouter();
  const queryClient = useQueryClient();

  // const mutation = useRegisterMutation({
  //   onSuccess: async () => {
  //     alert("Registered!");
  //     await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  //     router.push("/");
  //   },
  // });

  const mutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      alert("Registered!");
      console.log(data);
    },
    onError: (err) => {
      console.error(err);
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
                Create a new account
              </Heading>
              <Text color="fg.muted">
                Already have an account?{" "}
                <Link onClick={toggle} textDecor="underline">
                  Sign in
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
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    type="name"
                    value={name}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="role">You are a:</FormLabel>
                  <RadioGroup
                    onChange={(r: UserRole) => {
                      setRole(r);
                    }}
                    value={role}
                  >
                    <Stack direction="row">
                      <Radio value="STUDENT">Student</Radio>
                      <Radio value="SPONSOR">Sponsor</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
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

              <Stack spacing="6">
                <Button
                  onClick={() => {
                    mutation.mutate({ name, email, password, role });
                  }}
                >
                  Register
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