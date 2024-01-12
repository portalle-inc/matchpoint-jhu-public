"use client";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Button,
  Box,
  Stack,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";
// import { useCreateProjectMutation } from "@/services/project";
import { trpc } from "@/utils/trpc";
import type { Route } from "@/components/link";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
});
type Schema = z.infer<typeof schema>;

export default function PublishPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const toast = useToast();
  const mutation = trpc.project.createProject.useMutation({
    onSuccess: ({ id }) => {
      toast({
        title: "Project created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push(`/project/view/${id}` as Route);
    },
  });
  const onSubmit = handleSubmit((d, e) => {
    e?.preventDefault();
    mutation.mutate(d);
  });

  return (
    <form onSubmit={onSubmit}>
      <FormControl id="name" isInvalid={!!errors.name}>
        <FormLabel>Project Name</FormLabel>
        <Input {...register("name")} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl id="description" isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Textarea {...register("description")} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <FormControl id="content" isInvalid={!!errors.content}>
        <Flex dir="row">
          <Box flex={1}>
            <FormLabel>Content</FormLabel>
            <Textarea {...register("content")} />
          </Box>
          <Box flex={1} px={4} py={3}>
            <Text>Preview</Text>
            <Markdown>{watch("content")}</Markdown>
          </Box>
        </Flex>
        <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit">Submit</Button>
    </form>
  );
}
