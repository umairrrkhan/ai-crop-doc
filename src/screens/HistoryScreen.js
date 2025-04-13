import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getChatSessions, deleteChatSession } from '../services/chatService';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export default function HistoryScreen({ navigation }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const chatSessionRef = collection(db, 'users', userId, 'chats');
    const q = query(chatSessionRef, orderBy('lastMessageAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChatHistory(sessions);
      setIsLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('Error in chat history subscription:', error);
      setIsLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChatSession(chatId);
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { chatId: item.id })}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.chatItemGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.chatItemContent}>
          <View style={styles.chatIcon}>
            <Ionicons name="chatbubble-outline" size={24} color="#27ae60" />
          </View>
          <View style={styles.chatDetails}>
            <Text style={styles.chatTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.chatDate}>
              {new Date(item.lastMessageAt?.toDate()).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteChat(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2ecc71', '#27ae60']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Chat History</Text>
        <Text style={styles.headerSubtitle}>Your previous conversations</Text>
      </LinearGradient>

      {isLoading ? (
        <ActivityIndicator size="large" color="#27ae60" style={styles.loader} />
      ) : chatHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="#27ae60" />
          <Text style={styles.emptyText}>No chat history yet</Text>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => navigation.navigate('Chat', { createNewSession: true })}
          >
            <Text style={styles.newChatText}>Start a New Chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chatHistory}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#27ae60']}
              tintColor="#27ae60"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)'
  },
  listContainer: {
    padding: 16
  },
  chatItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  chatItemGradient: {
    borderRadius: 12
  },
  chatItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  chatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  chatDetails: {
    flex: 1,
    marginRight: 12
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4
  },
  chatDate: {
    fontSize: 14,
    color: '#666'
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24
  },
  newChatButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24
  },
  newChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});