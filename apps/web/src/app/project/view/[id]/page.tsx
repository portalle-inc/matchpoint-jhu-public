"use client";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  useToast,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Skeleton,
} from "@chakra-ui/react";
import { trpc } from "@/utils/trpc";
import { Link, type Route } from "@/components/link";
import { useAuth } from "@/utils/user";

function ApplicationModal({
  projectId,
  isOpen,
  onOpen,
  onClose,
}: {
  projectId: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  // ask questions
  const { user } = useAuth();
  const toast = useToast();
  const { data: project } = trpc.project.getProject.useQuery({ id: projectId });
  const questions = project?.applicationQuestions;
  const [answers, setAnswers] = useState<string[]>([]);

  const { mutate, status } = trpc.application.createApplication.useMutation({
    onSuccess: () => {
      toast({
        title: "You have submitted your application!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    },
  });

  if (!project || !user || user.role !== "STUDENT") return null;

  const submitApplication = () => {
    const questionAnswers: Record<string, string> = {};
    questions?.forEach((question, index) => {
      questionAnswers[question.id] = answers[index];
    });
    mutate({
      projectId,
      questionAnswers,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Application</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {questions ? (
            questions.length > 0 ? (
              questions.map((question, index) => (
                <Box key={question.id} mb={4}>
                  <Text mb={2}>{question.question}</Text>
                  <textarea
                    value={answers[index]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                  />
                </Box>
              ))
            ) : (
              <Text>This project has no extra questions!</Text>
            )
          ) : (
            <Skeleton />
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={submitApplication}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default function DetailPage({ params: { id } }: DetailPageProps) {
  // project information
  const { data, status } = trpc.project.getProject.useQuery({ id });
  const { user, isLoading } = useAuth();
  // only display certain controls when user is logged in AND is a student
  const shouldFetch = user?.role === "STUDENT";
  // project following status
  const { data: isFollowing, refetch } = trpc.project.isFollowing.useQuery(
    {
      projectId: id,
    },
    {
      enabled: shouldFetch,
    }
  );

  // apply modal status
  const [applyOpen, setApplyOpen] = useState(false);
  const onApplyOpen = () => setApplyOpen(true);
  const onApplyClose = () => setApplyOpen(false);

  // follow/unfollow project
  const followMutation = trpc.project.setFollowProject.useMutation({
    onSuccess: async () => {
      // update following status
      await refetch();
    },
  });
  const toggleFollow = () => {
    if (!data) return;
    followMutation.mutate({
      projectId: data.id,
      follow: !isFollowing,
    });
  };

  if (status === "pending") {
    return <div>Loading...</div>;
  }
  // TODO: error handling
  if (status === "error") {
    return <div>Error</div>;
  }
  const {
    name,
    excerpt,
    description,
    createdAt,
    // TODO: add these fields to display
    applicationDeadline,
    startTerm,
    majors,
    locationType,
    sponsor: {
      user: { name: sponsorName, id: sponsorId },
    },
  } = data;

  return (
    <>
      <Box py={8} px={16}>
        <Heading as="h1" size="2xl" mb={8}>
          {name}
        </Heading>
        <Text mb={8}>{excerpt}</Text>
        <Flex mb={8}>
          <Text mr={8}>Created at: {createdAt}</Text>
          <Text>
            Sponsor:
            <Link href={`/profile/${sponsorId}` as Route}>{sponsorName}</Link>
          </Text>
        </Flex>
        {user?.role === "STUDENT" ? (
          <ButtonGroup>
            <Button colorScheme="teal" onClick={onApplyOpen}>
              Apply
            </Button>
            {shouldFetch ? (
              <Button colorScheme="teal" onClick={toggleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            ) : null}
          </ButtonGroup>
        ) : null}
        <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
      </Box>

      <ApplicationModal
        isOpen={applyOpen}
        onClose={onApplyClose}
        onOpen={onApplyOpen}
        projectId={id}
      />
    </>
  );
}
