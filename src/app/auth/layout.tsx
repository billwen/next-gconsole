import {ReactNode} from "react";

const AuthLayout = ({children}: { children: ReactNode }) => {
  return (
    <div>
      <div>
        Auth header
      </div>
      <main>
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
