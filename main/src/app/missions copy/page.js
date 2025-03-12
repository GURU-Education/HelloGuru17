"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const MissionComponent = dynamic(
  () => import("./_components/MissionComponent"),
  { ssr: false }
);

const queryClient = new QueryClient();

export default function RoleplayPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <MissionComponent />
      </div>
    </QueryClientProvider>
  );
}
