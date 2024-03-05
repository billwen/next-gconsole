"use client";

import {FC} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaGithub} from "react-icons/fa";
import {signIn} from "next-auth/react";

interface AuthenticationFormProps {
  formTitle: string;

  showOauth?: boolean;
}

export const AuthenticationForm: FC<AuthenticationFormProps> = ({formTitle, showOauth}) => {

  const onClickLogin = (provider: string) => {
    switch (provider) {
      case 'github':
        console.log("Github login");
        signIn('github', {
          callbackUrl: "/"
        });
        break;
    }

    // Do nothing
  };

  return (
    <Card className="w-[400px] shadow-card mx-auto">
      <CardHeader>
        <div className="w-full ml-6 text-3xl font-semibold">
          {formTitle}
        </div>
      </CardHeader>

      <CardContent>

      </CardContent>

      {showOauth && (
        <CardFooter>
          <div className="w-full">
            <Button className="w-full" onClick={onClickLogin.bind(null, "github")}>
              <FaGithub className="h-5 w-5 mr-6"/>
              <span className="">Login with Github</span>
            </Button>
          </div>
        </CardFooter>
      )}
      <CardFooter>

      </CardFooter>

    </Card>
  );
};
