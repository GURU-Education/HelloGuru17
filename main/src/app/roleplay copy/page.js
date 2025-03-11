"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const RoleplayComponent = dynamic(
  () => import("./_components/RoleplayComponent"),
  { ssr: false }
);

const queryClient = new QueryClient();

export default function RoleplayPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <RoleplayComponent />
      </div>
    </QueryClientProvider>
  );
}
