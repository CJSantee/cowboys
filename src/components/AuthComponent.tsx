import { useSession } from "@cjsantee/pondero-client";
import React from "react";

interface AuthComponentProps {
  children: React.ReactNode;
}
export default function AuthComponent({ children }: AuthComponentProps) {
  const session = useSession();

  if(session.loading || !session.user) {
    return <React.Fragment />
  }

  return children;
}