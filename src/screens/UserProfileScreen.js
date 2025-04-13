import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, Animated, ScrollView } from 'react-native';
import { auth } from '../services/firebase';
import { updateProfile } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getSubscriptionTimeRemaining, renewSubscription } from '../services/subscriptionService';
import * as Haptics from 'expo-haptics';

export default function UserProfileScreen({ navigation }) {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSubscriptionInfo();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      setIsEditing(false);
      
      // Animate success
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true
        })
      ]).start();
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const loadSubscriptionInfo = async () => {
    try {
      const timeRemaining = await getSubscriptionTimeRemaining(auth.currentUser.uid);
      setSubscriptionInfo(timeRemaining);
    } catch (error) {
      console.error('Error loading subscription info:', error);
    }
  };

  const handleRenewSubscription = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await renewSubscription(auth.currentUser.uid);
      await loadSubscriptionInfo();
      Alert.alert('Success', 'Subscription renewed successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const toggleEditMode = () => {
    Haptics.selectionAsync();
    setIsEditing(!isEditing);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={['#27ae60', '#2ecc71']}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View 
        style={[styles.profileCard, { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}
      >
        <Animated.View 
          style={[styles.avatarContainer, { 
            transform: [{ scale: scaleAnim }, { rotate: spin }] 
          }]}
        >
          {auth.currentUser.photoURL ? (
            <Image
              source={{ uri: auth.currentUser.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <LinearGradient
              colors={['#2ecc71', '#27ae60']}
              style={styles.defaultAvatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.initials}>{getInitials(displayName)}</Text>
            </LinearGradient>
          )}
        </Animated.View>
        
        {isEditing ? (
          <Animated.View 
            style={[styles.editContainer, { 
              transform: [{ scale: scaleAnim }] 
            }]}
          >
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter display name"
              placeholderTextColor="#999"
              autoFocus
            />
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleUpdateProfile}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2ecc71', '#27ae60']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <TouchableOpacity 
            onPress={toggleEditMode}
            style={styles.displayNameContainer}
          >
            <Text style={styles.displayName}>{displayName || 'Set display name'}</Text>
            <View style={styles.editIconContainer}>
              <Ionicons name="pencil" size={16} color="#27ae60" />
            </View>
          </TouchableOpacity>
        )}
        
        <View style={styles.emailContainer}>
          <Ionicons name="mail-outline" size={18} color="#666" style={styles.emailIcon} />
          <Text style={styles.email}>{auth.currentUser.email}</Text>
        </View>

        {subscriptionInfo && (
          <View style={styles.subscriptionContainer}>
            <View style={styles.subscriptionInfo}>
              <Ionicons name="time-outline" size={18} color="#666" style={styles.subscriptionIcon} />
              <Text style={styles.subscriptionText}>
                Time Remaining: {subscriptionInfo.days} days, {subscriptionInfo.hours} hours
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.renewButton} 
              onPress={handleRenewSubscription}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2ecc71', '#27ae60']}
                style={styles.renewGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.renewButtonText}>Renew Subscription</Text>
                <Ionicons name="refresh" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>


      <TouchableOpacity 
        style={styles.signOutButton} 
        onPress={handleSignOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#ff6b6b', '#ff4444']}
          style={styles.signOutGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.signOutIcon} />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  contentContainer: {
    paddingBottom: 100
  },
  gradientHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 240,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  profileCard: {
    marginTop: 160,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginBottom: 20
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginTop: -90,
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    backgroundColor: '#fff'
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#fff'
  },
  defaultAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff'
  },
  initials: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff'
  },
  displayNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 8
  },
  editIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f9f4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  emailIcon: {
    marginRight: 6
  },
  email: {
    fontSize: 16,
    color: '#666'
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%'
  },
  input: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  saveButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  saveButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  signOutButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  signOutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8
  },
  signOutIcon: {
    marginRight: 8
  },
  subscriptionContainer: {
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  subscriptionIcon: {
    marginRight: 8
  },
  subscriptionText: {
    fontSize: 14,
    color: '#666'
  },
  renewButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  renewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  renewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  }
});