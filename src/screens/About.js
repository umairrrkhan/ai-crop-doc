import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function About() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderAboutItem = ({ icon, title, description }) => (
    <Animated.View style={[styles.aboutItem, { opacity: fadeAnim }]}>
      <View style={styles.aboutIcon}>
        <Ionicons name={icon} size={24} color="#27ae60" />
      </View>
      <View style={styles.aboutContent}>
        <Text style={styles.aboutTitle}>{title}</Text>
        <Text style={styles.aboutDescription}>{description}</Text>
      </View>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About AI Crop Doctor</Text>
        <Text style={styles.headerSubtitle}>A Product of All Wings AI</Text>
        <Text style={[styles.headerSubtitle, { marginTop: 4 }]}>Your Smart Farming Assistant</Text>
      </View>

      {renderAboutItem({
        icon: 'leaf',
        title: 'AI-Powered Disease Detection',
        description: 'Our advanced AI technology helps identify crop diseases with high accuracy, providing instant diagnosis and treatment recommendations.'
      })}

      {renderAboutItem({
        icon: 'chatbubbles',
        title: 'Expert Chat Assistant',
        description: 'Get real-time advice from our AI assistant trained on extensive agricultural knowledge.'
      })}

      {renderAboutItem({
        icon: 'analytics',
        title: 'Smart Analytics',
        description: 'Track your crop health history and get insights to improve your farming practices.'
      })}

      {renderAboutItem({
        icon: 'information-circle',
        title: 'About Us',
        description: 'AI Crop Doctor is proudly developed by All Wings AI, a leading innovator in agricultural technology solutions.'
      })}

      {renderAboutItem({
        icon: 'code-working',
        title: 'Version',
        description: 'AI Crop Doctor v1.0.0'
      })}

      <TouchableOpacity 
        style={styles.websiteButton}
        onPress={() => Linking.openURL('mailto:allwingsai@gmail.com')}
      >
        <Text style={styles.websiteButtonText}>Contact Us</Text>
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
  aboutItem: {
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
  aboutIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  aboutContent: {
    flex: 1
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  websiteButton: {
    backgroundColor: '#27ae60',
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});