import { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";
import { AdapterServices } from "../../FirebaseAdapters";

export const dbAdapter: Adapter = {
  async createUser(user) {
    const { id, ...userData } = user;
    await AdapterServices.createUser(id, userData);
    return user as AdapterUser;
  },

  async getUser(id) {
    return (await AdapterServices.getUser(id)) as AdapterUser | null;
  },

  async getUserByEmail(email) {
    return (await AdapterServices.getUserByEmail(email)) as AdapterUser | null;
  },

  async getUserByAccount({ providerAccountId, provider }) {
    return (await AdapterServices.getUserByAccount(providerAccountId, provider)) as AdapterUser | null;
  },

  async updateUser(user) {
    const { id, ...userData } = user;
    await AdapterServices.updateUser(id, userData);
    return user as AdapterUser;
  },

  async deleteUser(userId) {
    await AdapterServices.deleteUser(userId);
  },

  async linkAccount(account) {
    await AdapterServices.linkAccount(account);
  },

  async unlinkAccount({ providerAccountId, provider }) {
    await AdapterServices.unlinkAccount(providerAccountId, provider);
  },

  async createSession(session) {
    return (await AdapterServices.createSession(session)) as AdapterSession;
  },

  async getSessionAndUser(sessionToken) {
    const result = await AdapterServices.getSessionAndUser(sessionToken);
    return result ? {
      session: result.session as AdapterSession,
      user: result.user as AdapterUser
    } : null;
  },

  async updateSession(session) {
    return (await AdapterServices.updateSession(session.sessionToken, session)) as AdapterSession | null;
  },

  async deleteSession(sessionToken) {
    await AdapterServices.deleteSession(sessionToken);
  },

  async createVerificationToken(token) {
    return await AdapterServices.createVerificationToken(token);
  },

  async useVerificationToken({ identifier, token }) {
    return await AdapterServices.useVerificationToken(identifier, token);
  }
};