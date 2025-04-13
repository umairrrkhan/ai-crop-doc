import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Alert, Text, StyleSheet, Animated } from 'react-native';
import { signInWithProfile } from '../services/authService';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const inputAnim1 = useRef(new Animated.Value(-20)).current;
  const inputAnim2 = useRef(new Animated.Value(-20)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.stagger(150, [
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
      }),
      Animated.spring(inputAnim1, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(inputAnim2, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithProfile(email, password);
      navigation.navigate('MainApp');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#f5fcf7', '#e8f7ed']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.headerContainer, {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }]}>
          <Text style={styles.title}>AI Crop Doctor</Text>
          <Text style={styles.subtitle}>by All Wings AI</Text>
          <Text style={[styles.subtitle, { marginTop: 4 }]}>Smart Agricultural Assistant</Text>
        </Animated.View>

        <View style={styles.inputContainer}>
          <Animated.View style={{
            transform: [{ translateX: inputAnim1 }],
            opacity: fadeAnim
          }}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>
          <Animated.View style={{
            transform: [{ translateX: inputAnim2 }],
            opacity: fadeAnim
          }}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>
        </View>

        <Animated.View style={{
          opacity: buttonAnim,
          transform: [{ scale: buttonScale }],
          width: '100%'
        }}>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            onPressIn={() => {
              Animated.spring(buttonScale, {
                toValue: 0.95,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
              }).start();
            }}
            onPressOut={() => {
              Animated.spring(buttonScale, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
              }).start();
            }}
          >
            <LinearGradient
              colors={['#2ecc71', '#27ae60']}
              style={styles.loginGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Login</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#27ae60',
    opacity: 0.8,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  loginButton: {
    overflow: 'hidden',
    borderRadius: 16,
    width: '100%',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  loginGradient: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  registerButton: {
    marginTop: 16,
    padding: 8
  },
  registerText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: '600'
  }
});