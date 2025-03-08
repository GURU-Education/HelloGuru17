import React from "react";
import { useStateManagement } from "./StateMangement";

export default function FreeformComponent() {
  const state = useStateManagement();
  return <div>FreeformComponent</div>;
}
