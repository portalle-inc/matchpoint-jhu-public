"use client";
import React, { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
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
import { trpc } from "@/utils/trpc";

export default function StudentDashboard() {
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
              <Card key={application.id}>
                <CardHeader>
                  <Heading size="md">{application.project.name}</Heading>
                </CardHeader>
                <CardBody>
                  <Heading size="sm">Status: {application.status}</Heading>
                  <div>
                    Sponsor:{" "}
                    <Link
                      href={`/profile/${application.project.sponsor.userId}`}
                    >
                      {application.project.sponsor.user.name}
                    </Link>
                  </div>
                </CardBody>
                <CardFooter>
                  <Link href={`/project/view/${application.project.id}`}>
                    <Button colorScheme="blue">View</Button>
                  </Link>
                </CardFooter>
              </Card>
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
