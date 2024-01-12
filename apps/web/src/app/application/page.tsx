"use client";
import React, { useState } from "react";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  StatUpArrow,
  useToast,
} from "@chakra-ui/react";
import type { Route } from "next";
import { type RouterOutput, trpc } from "@/utils/trpc";

interface ApplicationProps {
  application: RouterOutput["application"]["getApplications"]["body"][0];
}

function Application({ application }: ApplicationProps) {
  const toast = useToast();
  const utils = trpc.useUtils();
  const mutation = trpc.application.updateApplication.useMutation({
    onSuccess: async () => {
      toast({
        title: "Status updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await utils.application.getApplications.invalidate();
    },
  });

  const updateStatus = (
    id: string,
    newStatus: "PENDING" | "ACCEPTED" | "REJECTED"
  ) => {
    mutation.mutate({ id, status: newStatus });
  };
  return (
    <Card key={application.id}>
      <CardHeader>
        <Heading size="md">{application.project.name || "Loading"}</Heading>
      </CardHeader>
      <CardBody>
        <Heading size="sm">Status: {application.status}</Heading>
        <p>
          Applicant:{" "}
          <Link href={`/profile/${application.studentId}` as Route}>
            {application.student.user.name}
          </Link>
        </p>
      </CardBody>
      <CardFooter>
        {application.status === "PENDING" ? (
          <>
            <Button
              colorScheme="green"
              onClick={() => updateStatus(application.id, "ACCEPTED")}
            >
              Accept
            </Button>
            <Button
              colorScheme="red"
              onClick={() => updateStatus(application.id, "REJECTED")}
            >
              Reject
            </Button>
          </>
        ) : (
          <Button
            colorScheme="blue"
            onClick={() => updateStatus(application.id, "PENDING")}
          >
            Convert to pending
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function SponsorDashboard() {
  const [page, setPage] = useState(1);
  const { data, status } = trpc.application.getApplications.useQuery(
    { page, limit: 12, status: "PENDING" },
    { placeholderData: keepPreviousData }
  );

  return (
    <Box p={8}>
      <SimpleGrid columns={3} spacing={10}>
        {status === "success"
          ? data.body.map((application) => (
              <Application application={application} key={application.id} />
            ))
          : "Loading..."}
      </SimpleGrid>
      {/* left and right page navigation */}
      <Flex justifyContent="space-between" p={20}>
        <Button
          isDisabled={status !== "success" || data.meta.isFirstPage}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </Button>

        <Button
          isDisabled={status !== "success" || data.meta.isLastPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
}
