import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createUserWithProfile = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithProfile = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store auth state in AsyncStorage
    await AsyncStorage.setItem('user_session', JSON.stringify({
      uid: user.uid,
      email: user.email,
      lastLogin: new Date().toISOString()
    }));

    // Update last login time in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date().toISOString(),
    }, { merge: true });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    await AsyncStorage.removeItem('user_session');
  } catch (error) {
    throw error;
  }
};