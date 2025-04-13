import { collection, doc, addDoc, getDocs, query, orderBy, limit, where, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Cache for storing chat sessions
let chatSessionsCache = [];
let lastCacheUpdate = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Initialize user document in Firestore
export const initializeUserData = async (userId, email) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      email,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
};

// Create a new chat session
export const createChatSession = async (title) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const chatSessionRef = collection(db, 'users', userId, 'chats');
    const newSession = await addDoc(chatSessionRef, {
      title,
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp()
    });

    return newSession.id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

// Add message to chat session
export const addMessageToSession = async (sessionId, message) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const messagesRef = collection(db, 'users', userId, 'chats', sessionId, 'messages');
    await addDoc(messagesRef, {
      text: message.text,
      sender: message.sender,
      timestamp: serverTimestamp(),
      status: message.status
    });

    // Update session's lastMessageAt
    const sessionRef = doc(db, 'users', userId, 'chats', sessionId);
    await updateDoc(sessionRef, {
      lastMessageAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};

// Get chat sessions with caching
export const getChatSessions = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    // Check if cache is valid
    if (lastCacheUpdate && Date.now() - lastCacheUpdate < CACHE_DURATION) {
      return chatSessionsCache;
    }

    const chatSessionRef = collection(db, 'users', userId, 'chats');
    const q = query(chatSessionRef, orderBy('lastMessageAt', 'desc'));
    const querySnapshot = await getDocs(q);

    chatSessionsCache = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    lastCacheUpdate = Date.now();

    return chatSessionsCache;
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    throw error;
  }
};

// Get messages for a specific chat session
export const getSessionMessages = async (sessionId) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const messagesRef = collection(db, 'users', userId, 'chats', sessionId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Delete a chat session and its messages
export const deleteChatSession = async (sessionId) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    // Delete all messages in the session
    const messagesRef = collection(db, 'users', userId, 'chats', sessionId, 'messages');
    const messagesSnapshot = await getDocs(messagesRef);
    const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Delete the session document
    const sessionRef = doc(db, 'users', userId, 'chats', sessionId);
    await deleteDoc(sessionRef);

    // Update cache
    chatSessionsCache = chatSessionsCache.filter(session => session.id !== sessionId);
  } catch (error) {
    console.error('Error deleting chat session:', error);
    throw error;
  }
};