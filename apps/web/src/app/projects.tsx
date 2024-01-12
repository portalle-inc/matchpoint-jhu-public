"use client";
import {
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Box,
  Flex,
  ButtonGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Link, type Route } from "@/components/link";
import { type RouterOutput, trpc } from "@/utils/trpc";
import { useAuth } from "@/utils/user";

function Project({
  project,
}: {
  project: RouterOutput["project"]["getProjects"]["body"][0];
}) {
  const { user } = useAuth();
  const shouldFetch = user?.role === "STUDENT";
  const { data: isFollowing, refetch } = trpc.project.isFollowing.useQuery(
    {
      projectId: project.id,
    },
    {
      enabled: shouldFetch,
    }
  );
  const followMutation = trpc.project.setFollowProject.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const toggleFollow = () => {
    followMutation.mutate({
      projectId: project.id,
      follow: !isFollowing,
    });
  };

  return (
    <Card key={project.id}>
      <CardHeader>
        <Heading size="md">{project.name}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{project.description}</Text>
      </CardBody>
      <CardFooter>
        <ButtonGroup>
          <Link href={`/project/view/${project.id}` as Route}>
            <Button colorScheme="blue">View</Button>
          </Link>
          {shouldFetch ? (
            <Button colorScheme="teal" onClick={toggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          ) : null}
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default function Projects() {
  const [page, setPage] = useState(1);
  const results = trpc.project.getProjects.useQuery(
    { page },
    { placeholderData: keepPreviousData, refetchInterval: 2 * 60 * 1000 }
  );
  const { data, status, error } = results;
  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Box p={8}>
      <SimpleGrid columns={3} spacing={10}>
        {status === "success"
          ? data.body.map((project) => (
              <Project key={project.id} project={project} />
            ))
          : "loading..."}
      </SimpleGrid>
      {/* left and right page navigation */}
      <Flex justifyContent="space-between" p={20}>
        <Button
          isDisabled={status !== "success" || data.meta.isLastPage}
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
