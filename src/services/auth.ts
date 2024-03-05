import NextAuth from "next-auth";
import GitHub from "@auth/core/providers/github";
import AccountManagementAdapter from "@/services/accountManagementAdapter";

export const {
  handlers: {GET, POST},
  auth
} = NextAuth({
  adapter: AccountManagementAdapter(),
  session: {
    strategy: "jwt",
  },
  providers: [GitHub],
});
