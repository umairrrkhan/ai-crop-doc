import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HelpSupportScreen() {
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

  const renderHelpItem = ({ icon, title, description }) => (
    <Animated.View 
      style={[styles.helpItem, { 
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }]}
    >
      <View style={styles.helpIcon}>
        <Ionicons name={icon} size={24} color="#27ae60" />
      </View>
      <View style={styles.helpContent}>
        <Text style={styles.helpTitle}>{title}</Text>
        <Text style={styles.helpDescription}>{description}</Text>
      </View>
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
          Help & Support
        </Animated.Text>
        <Animated.Text style={[styles.headerSubtitle, { opacity: fadeAnim }]}>
          How can we help you?
        </Animated.Text>
      </LinearGradient>

      <View style={styles.content}>
        {renderHelpItem({
          icon: 'leaf',
          title: 'Plant Disease Detection',
          description: 'Learn how to use our AI-powered disease detection feature for your crops.'
        })}

        {renderHelpItem({
          icon: 'chatbubbles',
          title: 'Chat with AI',
          description: 'Get guidance on how to effectively communicate with our AI assistant.'
        })}

        {renderHelpItem({
          icon: 'book',
          title: 'Knowledge Base',
          description: 'Access our comprehensive guide about plant care and disease prevention.'
        })}

        {renderHelpItem({
          icon: 'mail',
          title: 'Contact Support',
          description: 'Reach out to our support team for additional assistance.'
        })}

        <TouchableOpacity 
          style={styles.contactButton}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#2ecc71', '#27ae60']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.contactButtonText}>Contact Us</Text>
            <Ionicons name="mail" size={20} color="#fff" style={styles.buttonIcon} />
          </LinearGradient>
        </TouchableOpacity>
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
  helpItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  helpIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  helpContent: {
    flex: 1
  },
  helpTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: 0.2
  },
  helpDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    letterSpacing: 0.1
  },
  contactButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5
  },
  buttonIcon: {
    marginLeft: 8
  }
})