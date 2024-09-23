import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, limit, addDoc } from 'firebase/firestore';
import { db } from "@/app/firebase/firebase.config";
import { AdapterUser, AdapterSession } from 'next-auth/adapters';

export class AdapterServices {
  static async createUser(id: string, userData: Partial<AdapterUser>): Promise<void> {
    try {
      console.log('Creating user:', id, userData);
      await setDoc(doc(db, 'users', id), userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  static async getUser(id: string): Promise<AdapterUser | null> {
    try {
      console.log('Getting user with id:', id);
      const userDoc = await getDoc(doc(db, 'users', id));
      return userDoc.exists() ? { id, ...userDoc.data() } as AdapterUser : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  }

  static async getUserByEmail(email: string): Promise<AdapterUser | null> {
    try {
      console.log('Getting user by email:', email);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), limit(1));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as AdapterUser;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new Error('Failed to get user by email');
    }
  }

  static async updateUser(id: string, userData: Partial<AdapterUser>): Promise<void> {
    try {
      console.log('Updating user:', id, userData);
      await updateDoc(doc(db, 'users', id), userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      console.log('Deleting user with id:', id);
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  static async linkAccount(account: any): Promise<void> {
    try {
      console.log('Linking account:', account);
      await addDoc(collection(db, 'accounts'), account);
    } catch (error) {
      console.error('Error linking account:', error);
      throw new Error('Failed to link account');
    }
  }

  static async getUserByAccount(providerAccountId: string, provider: string): Promise<AdapterUser | null> {
    try {
      console.log('Getting user by account:', providerAccountId, provider);
      const accountsRef = collection(db, 'accounts');
      const q = query(
        accountsRef,
        where('providerAccountId', '==', providerAccountId),
        where('provider', '==', provider),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const userDoc = await getDoc(doc(db, 'users', querySnapshot.docs[0].data().userId));
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as AdapterUser : null;
    } catch (error) {
      console.error('Error getting user by account:', error);
      throw new Error('Failed to get user by account');
    }
  }

  static async unlinkAccount(providerAccountId: string, provider: string): Promise<void> {
    try {
      const accountsRef = collection(db, 'accounts');
      const q = query(
        accountsRef,
        where('providerAccountId', '==', providerAccountId),
        where('provider', '==', provider),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        await deleteDoc(querySnapshot.docs[0].ref);
      }
    } catch (error) {
      console.error('Error unlinking account:', error);
      throw new Error('Failed to unlink account');
    }
  }

  static async createSession(session: AdapterSession): Promise<AdapterSession> {
    try {
      console.log('Creating session:', session);
      const sessionRef = await addDoc(collection(db, 'sessions'), {
        ...session,
        expires: session.expires.toISOString(),
      });
      return { ...session, id: sessionRef.id };
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session');
    }
  }

  static async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
    try {
      console.log('Getting session and user with session token:', sessionToken);
      const sessionsRef = collection(db, 'sessions');
      const q = query(sessionsRef, where('sessionToken', '==', sessionToken), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const sessionData = querySnapshot.docs[0].data() as AdapterSession;
      const userDoc = await getDoc(doc(db, 'users', sessionData.userId));
      if (!userDoc.exists()) return null;

      return {
        session: { ...sessionData, expires: new Date(sessionData.expires), id: querySnapshot.docs[0].id },
        user: { id: userDoc.id, ...userDoc.data() } as AdapterUser
      };
    } catch (error) {
      console.error('Error getting session and user:', error);
      throw new Error('Failed to get session and user');
    }
  }

  static async updateSession(sessionToken: string, updatedSessionData: Partial<AdapterSession>): Promise<AdapterSession | null> {
    try {
      console.log('Updating session:', sessionToken);
      const sessionsRef = collection(db, 'sessions');
      const q = query(sessionsRef, where('sessionToken', '==', sessionToken), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const sessionDoc = querySnapshot.docs[0];
      await updateDoc(sessionDoc.ref, {
        ...updatedSessionData,
        expires: updatedSessionData.expires ? updatedSessionData.expires.toISOString() : new Date().toISOString(),
      });

      return { ...updatedSessionData, id: sessionDoc.id, expires: new Date(updatedSessionData.expires as Date) } as AdapterSession;
    } catch (error) {
      console.error('Error updating session:', error);
      throw new Error('Failed to update session');
    }
  }

  static async deleteSession(sessionToken: string): Promise<void> {
    try {
      const sessionsRef = collection(db, 'sessions');
      const q = query(sessionsRef, where('sessionToken', '==', sessionToken), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        await deleteDoc(querySnapshot.docs[0].ref);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to delete session');
    }
  }

  static async createVerificationToken(token: any): Promise<any> {
    try {
      await addDoc(collection(db, 'verificationTokens'), token);
      return token;
    } catch (error) {
      console.error('Error creating verification token:', error);
      throw new Error('Failed to create verification token');
    }
  }

  static async useVerificationToken(identifier: string, token: string): Promise<any> {
    try {
      const verificationTokensRef = collection(db, 'verificationTokens');
      const q = query(
        verificationTokensRef,
        where('identifier', '==', identifier),
        where('token', '==', token),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const verificationTokenDoc = querySnapshot.docs[0];
      await deleteDoc(verificationTokenDoc.ref);
      return verificationTokenDoc.data();
    } catch (error) {
      console.error('Error using verification token:', error);
      throw new Error('Failed to use verification token');
    }
  }
}