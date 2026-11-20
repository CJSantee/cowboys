import useSession from '../hooks/useSession';
import React from 'react';

interface AuthComponentProps {
  children: React.ReactNode;
  UnauthenticatedComponent?: React.ComponentType;
}
export default function AuthComponent({ children, UnauthenticatedComponent }: AuthComponentProps) {
  const session = useSession();

  if (session.loading || !session.user) {
    return UnauthenticatedComponent ? <UnauthenticatedComponent /> : <React.Fragment />;
  }

  return children;
}
