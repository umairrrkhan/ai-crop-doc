import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';
import { getChatSessions, deleteChatSession } from '../services/chatService';

const ChatDrawer = ({ onClose }) => {
  const navigation = useNavigation();

  const features = [
    { name: 'Agricultural Calculator', icon: 'calculator', screen: 'AgriculturalCalculator' },
    { name: 'Yield Prediction', icon: 'analytics', screen: 'YieldPrediction' },
    { name: 'Crop Revenue', icon: 'cash', screen: 'CropRevenue' },
    { name: 'Environmental Factors', icon: 'leaf', screen: 'EnvironmentalFactors' },
    { name: 'Resource Management', icon: 'water', screen: 'ResourceManagement' },
    { name: 'Soil Health', icon: 'flask', screen: 'SoilHealth' },
  ];

  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const sessions = await getChatSessions();
      setChatHistory(sessions);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChatSession(chatId);
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileSection} onPress={() => navigation.navigate('UserProfile')}>
          <Image
            source={require('../../assets/elon.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{auth.currentUser?.displayName || 'User'}</Text>
            <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Chat', params: { createNewSession: true } }],
              });
              onClose();
            }}
          >
            <LinearGradient
              colors={['#27ae60', '#2ecc71']}
              style={styles.newChatGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.newChatText}>New Chat</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureItem}
              onPress={() => {
                navigation.navigate(feature.screen);
                onClose();
              }}
            >
              <Ionicons name={feature.icon} size={20} color="#27ae60" />
              <Text style={styles.featureText}>{feature.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat History</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="#27ae60" style={styles.loader} />
          ) : chatHistory.length === 0 ? (
            <Text style={styles.emptyText}>No chat history yet</Text>
          ) : (
            chatHistory.map((chat) => (
              <View key={chat.id} style={styles.chatItem}>
                <TouchableOpacity
                  style={styles.chatContent}
                  onPress={() => {
                    // Implement chat selection logic
                    onClose();
                  }}
                >
                  <Text style={styles.chatTitle}>{chat.title}</Text>
                  <Text style={styles.chatDate}>
                    {new Date(chat.lastMessageAt?.toDate()).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.chatMenuButton}
                  onPress={() => handleDeleteChat(chat.id)}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    color: '#333',
  },
  chatDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chatMenuButton: {
    padding: 8,
  },
  newChatButton: {
    marginBottom: 8,
  },
  newChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  newChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ChatDrawer;