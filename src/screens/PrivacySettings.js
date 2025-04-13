import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../services/firebase';
import { deleteUser } from 'firebase/auth';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrivacySettings({ navigation }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const deleteUserData = async (userId) => {
    try {
      // Delete all user's chats
      const chatsRef = collection(db, 'users', userId, 'chats');
      const chatsQuery = query(chatsRef);
      const chatsSnapshot = await getDocs(chatsQuery);
      
      const deletionPromises = chatsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletionPromises);

      // Delete user document if exists
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);

      // Clear local storage
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This will permanently delete all your data including chat history and cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              
              // First delete all user data
              await deleteUserData(user.uid);
              
              // Then delete the authentication account
              await deleteUser(user);
              
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const renderPrivacyItem = ({ icon, title, description }) => (
    <Animated.View style={[styles.privacyItem, { opacity: fadeAnim }]}>
      <View style={styles.privacyIcon}>
        <Ionicons name={icon} size={24} color="#27ae60" />
      </View>
      <View style={styles.privacyContent}>
        <Text style={styles.privacyTitle}>{title}</Text>
        <Text style={styles.privacyDescription}>{description}</Text>
      </View>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your data and privacy</Text>
      </View>

      {renderPrivacyItem({
        icon: 'lock-closed',
        title: 'Data Collection',
        description: 'We collect minimal data necessary for app functionality. Your crop images and chat history are stored securely.'
      })}

      {renderPrivacyItem({
        icon: 'shield-checkmark',
        title: 'Data Protection',
        description: 'Your data is encrypted and protected using industry-standard security measures.'
      })}

      {renderPrivacyItem({
        icon: 'cloud-download',
        title: 'Data Export',
        description: 'You can request a copy of your data at any time.'
      })}

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 20,
    backgroundColor: '#27ae60'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8
  },
  privacyItem: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  privacyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  privacyContent: {
    flex: 1
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});