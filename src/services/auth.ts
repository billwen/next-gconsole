import {nanoid} from 'nanoid';
import NextAuth from "next-auth";
import GitHub from "@auth/core/providers/github";

import {ds} from "@/services/data-service";
import AccountManagementAdapter from "@/services/data/account-management-adapter";

export const {
  handlers: {GET, POST},
  auth
} = NextAuth({
  adapter: AccountManagementAdapter(ds),
  session: {
    strategy: "jwt",
  },
  secret: process.env.GCONSOLE_AUTH_SECRET,
  providers: [GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,

    // Customize User Object
    profile(ghProfile) {
      const uid = nanoid(6);

      const names = (ghProfile.name || "Unknown name").split(" ");
      const [familyName, ...foreNames] = names.reverse();
      let givenName = "";
      let m: string[] = [];
      if (foreNames.length > 0) {
        [givenName, ...m] = foreNames.reverse();
      }
      const middleName = m.length > 0 ? m.join(" ") : "";

      return {
        id: `${ghProfile.id}`,
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
    },
    allowDangerousEmailAccountLinking: true
  })],

  callbacks: {
    async signIn({user, account, profile, email, credentials}) {
      console.log('signIn', {user, account, profile, email, credentials});
      return true;
    },

    // async redirect({ url, baseUrl}) {
    //   console.log('redirect', {url, baseUrl});
    //   return baseUrl;
    // },

    async session({session, user, token}) {
      console.log(session, {session, token, user});
      return session;
    },

    async jwt({token, user, account, profile}) {
      console.log('jwt', {token, user, account, profile});
      return token;
    }
  }
});
