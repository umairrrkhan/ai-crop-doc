import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../services/firebase';

export default function SettingsScreen({ navigation }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const renderSettingItem = ({ icon, title, description, onPress }) => (
    <Animated.View 
      style={[styles.settingItem, { 
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }]}
    >
      <TouchableOpacity 
        style={styles.settingButton} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={24} color="#27ae60" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#27ae60" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#2ecc71', '#27ae60']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.Text style={[styles.headerTitle, { opacity: fadeAnim }]}>
          Settings
        </Animated.Text>
        <Animated.Text style={[styles.headerSubtitle, { opacity: fadeAnim }]}>
          Manage your app preferences
        </Animated.Text>
      </LinearGradient>

      <View style={styles.content}>
        {renderSettingItem({
          icon: 'help-circle',
          title: 'Help & Support',
          description: 'Get assistance and find answers to common questions',
          onPress: () => navigation.navigate('HelpSupport')
        })}

        {renderSettingItem({
          icon: 'shield-checkmark',
          title: 'Privacy',
          description: 'Control your privacy settings and data',
          onPress: () => navigation.navigate('PrivacySettings')
        })}

        {renderSettingItem({
          icon: 'information-circle',
          title: 'About',
          description: 'Learn more about AI Crop Doctor',
          onPress: () => navigation.navigate('About')
        })}

        {renderSettingItem({
          icon: 'calculator',
          title: 'Crop Analysis',
          description: 'Agricultural calculations and metrics',
          onPress: () => navigation.navigate('AgriculturalCalculator')
        })}

        {renderSettingItem({
          icon: 'log-out',
          title: 'Sign Out',
          description: 'Sign out from your account',
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: 0.3
  },
  content: {
    padding: 24
  },
  settingItem: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f9f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  settingContent: {
    flex: 1,
    marginRight: 12
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: 0.2
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    letterSpacing: 0.1
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f9f4',
    justifyContent: 'center',
    alignItems: 'center'
  }
});