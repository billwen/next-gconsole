import {ReactNode} from "react";

const AuthLayout = ({children}: { children: ReactNode }) => {
  return (
    <main className="min-h-screen pt-6 bg-gray-100">
      {children}
    </main>
  );
};

export default AuthLayout;
