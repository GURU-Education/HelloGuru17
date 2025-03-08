"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const FreeformComponent = dynamic(
  () => import("./_components/FreeformComponent"),
  { ssr: false }
);

const queryClient = new QueryClient();

export default function RoleplayPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <FreeformComponent />
      </div>
    </QueryClientProvider>
  );
}
