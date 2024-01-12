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
// import { useLoginMutation, useRegisterMutation } from "@/services/auth";

export const PasswordField = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);

    const mergeRef = useMergeRefs(inputRef, ref);
    const onClickReveal = () => {
      onToggle();
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    return (
      <FormControl>
        <FormLabel htmlFor="password">Password</FormLabel>
        <InputGroup>
          <InputRightElement>
            <IconButton
              aria-label={isOpen ? "Mask password" : "Reveal password"}
              icon={!isOpen ? <ViewOffIcon /> : <ViewIcon />}
              onClick={onClickReveal}
              variant="text"
            />
          </InputRightElement>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            ref={mergeRef}
            required
            type={isOpen ? "text" : "password"}
            {...props}
          />
        </InputGroup>
      </FormControl>
    );
  }
);

PasswordField.displayName = "PasswordField";
