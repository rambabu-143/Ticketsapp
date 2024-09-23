import { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, limit, addDoc } from 'firebase/firestore';
import { db } from "@/app/firebase/firebase.config";


export const dbAdapter: Adapter = {
    async createUser(user) {
        console.log('creating the user..', user)
        const { id, ...userData } = user;
        await setDoc(doc(db, 'users', id), userData);
        return user;    
    },

    async getUser(id) {
        console.log('getting user with id ', id)
        const userDoc = await getDoc(doc(db, 'users', id));
        if (!userDoc.exists()) return null;
        return { id, ...userDoc.data() } as AdapterUser;
    },

    async getUserByEmail(email) {
        console.log('getting user by email', email)
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as any;
    },

    async getUserByAccount({ providerAccountId, provider }) {
        console.log('getting user by account', provider)
        const accountsRef = collection(db, 'accounts');
        const q = query(accountsRef,
            where('providerAccountId', '==', providerAccountId),
            where('provider', '==', provider),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const accountDoc = querySnapshot.docs[0];
        const userDoc = await getDoc(doc(db, 'users', accountDoc.data().userId));
        if (!userDoc.exists()) return null;
        return { id: userDoc.id, ...userDoc.data() } as AdapterUser;
    },

    async updateUser(user) {
        console.log('user is updated to the user:', user)
        const { id, ...userData } = user;
        await updateDoc(doc(db, 'users', id), userData);
        return user as any;
    },

    async deleteUser(userId) {
        console.log('deleting the user having the id :', userId)
        await deleteDoc(doc(db, 'users', userId));
    },

    async linkAccount(account) {
        console.log('Linking the account', account)
        await addDoc(collection(db, 'accounts'), account);
    },

    async unlinkAccount({ providerAccountId, provider }) {
        const accountsRef = collection(db, 'accounts');
        const q = query(accountsRef,
            where('providerAccountId', '==', providerAccountId),
            where('provider', '==', provider),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            await deleteDoc(querySnapshot.docs[0].ref);
        }
    },

    async createSession(session) {
        console.log('current session is created with :', session)
        const sessionRef = await addDoc(collection(db, 'sessions'), {
            ...session,
            expires: session.expires.toISOString(),
        });
        return {
            ...session,
            id: sessionRef.id,
        };
    },

    async getSessionAndUser(sessionToken) {
        console.log('session token is ', sessionToken)
        const sessionsRef = collection(db, 'sessions');
        const q = query(sessionsRef, where('sessionToken', '==', sessionToken), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const sessionDoc = querySnapshot.docs[0];
        const session = {
            ...sessionDoc.data(),
            id: sessionDoc.id,
            expires: new Date(sessionDoc.data().expires)
        } as unknown as AdapterSession;

        const userDoc = await getDoc(doc(db, 'users', session.userId));
        if (!userDoc.exists()) return null;
        const user = { ...userDoc.data(), id: userDoc.id } as AdapterUser;

        return { session, user };
    },
    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<AdapterSession | null | undefined> {
        console.log('session is updated with the current session', session)
        const sessionsRef = collection(db, 'sessions');
        const q = query(sessionsRef, where('sessionToken', '==', session.sessionToken), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const sessionDoc = querySnapshot.docs[0];
        const updatedSession = {
            ...session,
            expires: session.expires ? session.expires.toISOString() : new Date().toISOString(),
        };
        await updateDoc(sessionDoc.ref, updatedSession);
        return {
            ...updatedSession,
            id: sessionDoc.id,
            expires: new Date(updatedSession.expires),
        } as AdapterSession;
    },

    async deleteSession(sessionToken: string) {
        const sessionsRef = collection(db, 'sessions');
        const q = query(sessionsRef, where('sessionToken', '==', sessionToken), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            await deleteDoc(querySnapshot.docs[0].ref);
        }
    },

    async createVerificationToken(token) {
        await addDoc(collection(db, 'verificationTokens'), token);
        return token;
    },

    async useVerificationToken({ identifier, token }) {
        const verificationTokensRef = collection(db, 'verificationTokens');
        const q = query(verificationTokensRef,
            where('identifier', '==', identifier),
            where('token', '==', token),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const verificationTokenDoc = querySnapshot.docs[0];
        await deleteDoc(verificationTokenDoc.ref);
        return verificationTokenDoc.data() as any;
    },
};