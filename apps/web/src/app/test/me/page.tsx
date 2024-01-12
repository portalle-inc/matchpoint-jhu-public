"use client";

import { trpc } from "@/utils/trpc";

export default function TestMePage() {
  const query = trpc.auth.getMe.useQuery();
  // const query = undefined;

  return (
    <div>
      <p>Test me</p>
      <p>{JSON.stringify(query.data)}</p>
    </div>
  );
}
