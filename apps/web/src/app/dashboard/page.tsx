"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Route } from "@/components/link";
import { useAuth } from "@/utils/user";
import StudentDashboard from "./student-dashboard";
import SponsorDashboard from "./sponsor-dashboard";

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not logged in</div>;
  }

  switch (user.role) {
    case "SPONSOR":
      return <SponsorDashboard />;
    case "STUDENT":
      return <StudentDashboard />;
  }
}
