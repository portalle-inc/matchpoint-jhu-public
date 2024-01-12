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
import { forwardRef, useRef, useState, useCallback, useEffect } from "react";

import { useAuth } from "@/utils/user";
import { SignIn } from "./signin";
import { SignUp } from "./signup";

export function Login() {
  const { user, isLoading } = useAuth();
  const [signIn, setSignIn] = useState(true);
  const router = useRouter();
  const toast = useToast();

  const toggle = useCallback(() => {
    setSignIn((prev) => !prev);
  }, []);

  useEffect(() => {
    if (user) {
      toast({
        title: "You are already logged in!",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    }
    // only run once on page amount to prevent
    // extra toasts on status updates -- this is only
    // a single gatekeeper for the login route
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return signIn ? <SignIn toggle={toggle} /> : <SignUp toggle={toggle} />;
}
