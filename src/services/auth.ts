import {nanoid} from 'nanoid';
import NextAuth from "next-auth";
import GitHub from "@auth/core/providers/github";
import AccountManagementAdapter from "@/services/accountManagementAdapter";

import {ds} from "@/services/db";

export const {
  handlers: {GET, POST},
  auth
} = NextAuth({
  adapter: AccountManagementAdapter(ds),
  session: {
    strategy: "jwt",
  },
  providers: [GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,

    // Customize User Object
    profile(ghProfile) {
      const uid = nanoid(6);

      const names = (ghProfile.name || "Unknow name").split(" ");
      const [familyName, ...foreNames] = names.reverse();
      let givenName = "";
      let m: string[] = [];
      if (foreNames.length > 0) {
        [givenName, ...m] = foreNames.reverse();
      }
      const middleName = m.length > 0 ? m.join(" ") : "";

      return {
        username: `github_${ghProfile.login || uid}`,
        builtIn: false,
        givenName,
        middleName,
        familyName,
        email: ghProfile.email,
        emailVerified: null,
        enabled: true,
        expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 365 * 10),
        avatarUrl: ghProfile.avatar_url
      }
    }
  })],
});
