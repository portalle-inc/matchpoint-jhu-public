"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Box, Heading, Button } from "@chakra-ui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Box>
      <Heading>Something went wrong!</Heading>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => {
            reset();
          }
        }
      >
        Try again
      </Button>
    </Box>
  );
}
