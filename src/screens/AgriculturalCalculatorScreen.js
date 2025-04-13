import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function AgriculturalCalculatorScreen({ navigation }) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const springAnim = useRef(new Animated.Value(0.92)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Refs for staggered animations
  const itemAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  // Header animations based on scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [220, 170],
    extrapolate: 'clamp'
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp'
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.88],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    // Initial fade in animation with spring effect
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(springAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    // Enhanced staggered animations for list items
    Animated.stagger(80, 
      itemAnimations.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true
        })
      )
    ).start();
  }, []);

  // Enhanced header animations with parallax effect
  const headerTranslateY = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [15, 0, -15],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.85, 1],
    extrapolate: 'clamp'
  });

  const headerScaleOnScroll = scrollY.interpolate({
    inputRange: [-50, 0, 100],
    outputRange: [1.1, 1, 0.95],
    extrapolate: 'clamp'
  });

  const renderCalculatorItem = ({ icon, title, description, onPress }, index) => {
    const translateY = itemAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0]
    });

    const opacity = itemAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    const scale = itemAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1]
    });

    const pressScale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(pressScale, {
        toValue: 0.97,
        friction: 8,
        tension: 40,
        useNativeDriver: true
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true
      }).start();
    };

    return (
      <Animated.View 
        style={[styles.calculatorItem, { 
          opacity,
          transform: [
            { translateY },
            { scale: Animated.multiply(scale, pressScale) }
          ]
        }]}
      >
        <TouchableOpacity 
          style={styles.calculatorButton} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
        >
          <LinearGradient
            colors={['#f5fcf8', '#eaf7ef']}
            style={styles.calculatorIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={icon} size={28} color='#27ae60' />
          </LinearGradient>
          <View style={styles.calculatorContent}>
            <Text style={styles.calculatorTitle}>{title}</Text>
            <Text style={styles.calculatorDescription}>{description}</Text>
          </View>
          <Animated.View style={[styles.arrowContainer, {
            transform: [{ scale: pressScale }]
          }]}>
            <Ionicons name='chevron-forward' size={20} color='#27ae60' />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27ae60" />
      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[
          styles.headerContainer,
          { 
            height: headerHeight,
            transform: [{ scale: headerScaleOnScroll }, { translateY: headerTranslateY }],
            opacity: headerOpacity
          }
        ]}>
          <LinearGradient
            colors={['#34d399', '#2ecc71', '#27ae60']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.Text style={[
              styles.headerTitle,
              { opacity: headerTitleOpacity }
            ]}>Agricultural Calculator</Animated.Text>
            <Animated.Text style={[styles.headerSubtitle, { opacity: headerTitleOpacity }]}>
              Smart tools for precision farming
            </Animated.Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {renderCalculatorItem({
            icon: 'calculator-outline',
            title: 'Crop Revenue Analysis',
            description: 'Calculate potential earnings based on crop type, yield, and market prices',
            onPress: () => navigation.navigate('CropRevenue')
          }, 0)}

          {renderCalculatorItem({
            icon: 'analytics-outline',
            title: 'AI Yield Predictor',
            description: 'Get personalized crop yield predictions using AI and satellite data',
            onPress: () => navigation.navigate('YieldPrediction')
          }, 1)}

          {renderCalculatorItem({
            icon: 'leaf-outline',
            title: 'Magic Soil Health Scan',
            description: 'Instant AI-powered soil analysis with visual feedback 🌱',
            onPress: () => navigation.navigate('SoilHealth')
          }, 2)}


          {renderCalculatorItem({
            icon: 'thermometer-outline',
            title: 'Environmental Factors',
            description: 'Track temperature, rainfall, and soil conditions for optimal growth',
            onPress: () => navigation.navigate('EnvironmentalFactors')
          }, 4)}

          {renderCalculatorItem({
            icon: 'water-outline',
            title: 'Resource Management',
            description: 'Calculate water usage, fertilizer requirements, and pest control needs',
            onPress: () => navigation.navigate('ResourceManagement')
          }, 5)}

          
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    height: 220,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 10
  },
  header: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 35,
    paddingHorizontal: 28,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    marginBottom: 10,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  headerSubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: 0.4,
    lineHeight: 24
  },
  cardsContainer: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  calculatorItem: {
    backgroundColor: '#fff',
    marginBottom: 18,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    transform: [{ scale: 1 }]
  },
  calculatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20
  },
  calculatorIcon: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    elevation: 3,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  calculatorContent: {
    flex: 1,
    paddingRight: 10
  },
  calculatorTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 7,
    letterSpacing: 0.3
  },
  calculatorDescription: {
    fontSize: 14.5,
    color: '#666',
    lineHeight: 21,
    letterSpacing: 0.2,
    opacity: 0.9
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  }
});