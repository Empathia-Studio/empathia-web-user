import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
console.log("GOOGLE_CLIENT_ID: "+GOOGLE_CLIENT_ID);
function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}

export default AuthLayout;
