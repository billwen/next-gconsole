import {PrismaClient, User, VerificationToken} from "@prisma/client";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {Adapter, AdapterAccount, AdapterAuthenticator, AdapterSession, AdapterUser} from "@auth/core/adapters";
import {DataService} from "@/services/data-service";
import {Awaitable} from "@auth/core/types";

export default function AccountManagementAdapter(usingDataService: DataService): Adapter {
  const sharedPrismaClient = new PrismaClient();
  const adapter = PrismaAdapter(sharedPrismaClient);

  const ds = usingDataService;

  return {
    ...adapter,
    createUser(user: AdapterUser) {
      console.log("Creating user", {user});
      return ds.createDefaultUser(user as User) as Awaitable<AdapterUser>;
    },
    getUser(id: string): Awaitable<AdapterUser | null> {
      console.log(`getting user ${id}`);
      if (adapter.getUser) {
        return adapter.getUser(id);
      }
      throw new Error('Adapter.getUser is null');
    },
    getUserByEmail(email: string): Awaitable<AdapterUser | null> {
      console.log(`getting user by email ${email}`);
      if (adapter.getUserByEmail) {
        return adapter.getUserByEmail(email);
      }

      throw new Error('Adapter.getUserByEmail is null');
    },
    getUserByAccount(providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">): Awaitable<AdapterUser | null> {
      console.log(`getting user by account id ${providerAccountId}`);
      if (adapter.getUserByAccount) {
        return adapter.getUserByAccount(providerAccountId);
      }

      throw new Error('Adapter.getUserByAccount is null');
    },
    updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Awaitable<AdapterUser> {
      console.log(`Update user`, {user});
      if (adapter.updateUser) {
        return adapter.updateUser(user);
      }

      throw new Error('Adapter.updateUser is null');
    },
    deleteUser(userId: string): Promise<void> | Awaitable<AdapterUser | null | undefined> {
      console.log(`Delete user ${userId}`);
      if (adapter.deleteUser) {
        return adapter.deleteUser(userId);
      }

      throw new Error('Adapter.deleteUser is null');
    },
    linkAccount(account: AdapterAccount): Promise<void> | Awaitable<AdapterAccount | null | undefined> {
      console.log('link account', {account});
      if (adapter.linkAccount) {
        return adapter.linkAccount(account);
      }

      throw new Error('Adapter.linkAccount is null');
    },
    unlinkAccount(providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">): Promise<void> | Awaitable<AdapterAccount | undefined> {
      console.log(`unlink account ${providerAccountId}`);
      if (adapter.unlinkAccount) {
        return adapter.unlinkAccount(providerAccountId);
      }

      throw new Error('Adapter.unlinkAccount is null');
    },
    createSession(session: { sessionToken: string; userId: string; expires: Date }): Awaitable<AdapterSession> {
      console.log(`create session `, {session});
      if (adapter.createSession) {
        return adapter.createSession(session);
      }

      throw new Error('Adapter.create session is null');
    },
    getSessionAndUser(sessionToken: string): Awaitable<{ session: AdapterSession; user: AdapterUser } | null> {
      console.log(`Get session and user ${sessionToken}`);
      if (adapter.getSessionAndUser) {
        return adapter.getSessionAndUser(sessionToken);
      }

      throw new Error('Adapter.getSessionAndUser is null');
    },
    updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Awaitable<AdapterSession | null | undefined> {
      console.log('Update session', {session});
      if (adapter.updateSession) {
        adapter.updateSession(session);
      }

      throw new Error('Adapter.updateSession is null');
    },
    deleteSession(sessionToken: string): Promise<void> | Awaitable<AdapterSession | null | undefined> {
      console.log(`Delete sesion ${sessionToken}`);
      if (adapter.deleteSession) {
        adapter.deleteSession(sessionToken);
      }

      throw new Error('Adapter.deleteSession is null');
    },
    createVerificationToken(verificationToken: VerificationToken): Awaitable<VerificationToken | null | undefined> {
      console.log(`Create verification token ${verificationToken}`);
      if (adapter.createVerificationToken) {
        return adapter.createVerificationToken(verificationToken);
      }

      throw new Error('Adapter.createVerificationToken is null');
    },
    useVerificationToken(params: { identifier: string; token: string }): Awaitable<VerificationToken | null> {
      console.log(`Use verification token`, {params});
      if (adapter.useVerificationToken) {
        return adapter.useVerificationToken(params);
      }

      throw new Error('Adapter.useVerificationToken is null');
    },
    getAccount(providerAccountId: AdapterAccount["providerAccountId"], provider: AdapterAccount["provider"]): Awaitable<AdapterAccount | null> {
      console.log(`Get Account ${providerAccountId}`);
      if (adapter.getAccount) {
        return adapter.getAccount(providerAccountId, provider);
      }

      throw new Error('Adapter.getAccount is null');
    },
    getAuthenticator(credentialID: AdapterAuthenticator["credentialID"]): Awaitable<AdapterAuthenticator | null> {
      console.log(`Get authenticator ${credentialID}`);
      if (adapter.getAuthenticator) {
        return adapter.getAuthenticator(credentialID);
      }

      throw new Error('Adapter.getAuthenticator is null');
    },
    createAuthenticator(authenticator: AdapterAuthenticator): Awaitable<AdapterAuthenticator> {
      console.log(`Create Authenticator`, {authenticator});
      if (adapter.createAuthenticator) {
        return adapter.createAuthenticator(authenticator);
      }

      throw new Error('Adapter.createAuthenticator is null');
    },
    listAuthenticatorsByUserId(userId: AdapterAuthenticator["userId"]): Awaitable<AdapterAuthenticator[]> {
      console.log(`List authenticator by ${userId}`);
      if (adapter.listAuthenticatorsByUserId) {
        return adapter.listAuthenticatorsByUserId(userId);
      }

      throw new Error('Adapter.listAuthenticatorByUserId is null');
    },
    updateAuthenticatorCounter(credentialID: AdapterAuthenticator["credentialID"], newCounter: AdapterAuthenticator["counter"]): Awaitable<AdapterAuthenticator> {
      console.log('Update authenticator', {credentialID});
      if (adapter.updateAuthenticatorCounter) {
        return adapter.updateAuthenticatorCounter(credentialID, newCounter);
      }

      throw new Error('Adapter.updateAuthenticatorCounter is null');
    }

  };
};
