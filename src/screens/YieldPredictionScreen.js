import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native';

export default function YieldPredictionScreen({ navigation }) {
  // Inputs
  const [cropType, setCropType] = useState('');
  const [area, setArea] = useState('');
  const [historicalYield, setHistoricalYield] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [temperature, setTemperature] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [inputErrors, setInputErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const resultAnim = React.useRef(new Animated.Value(0)).current;
  const efficiencyAnim = React.useRef(new Animated.Value(0)).current;

  // Fade in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Spin while calculating
  useEffect(() => {
    if (isCalculating) {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isCalculating]);

  // Formatting
  const formatCurrency = (value) => `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  const formatNumber = (value) => value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Crop-specific optimal conditions
  const cropConditions = {
    Wheat: { minRain: 400, maxRain: 800, minTemp: 15, maxTemp: 25 },
    Rice: { minRain: 1000, maxRain: 2000, minTemp: 20, maxTemp: 35 },
    Corn: { minRain: 500, maxRain: 1000, minTemp: 18, maxTemp: 30 },
    Default: { minRain: 500, maxRain: 1000, minTemp: 20, maxTemp: 30 },
  };

  // The hardcore prediction engine
  const handleAnalyze = async () => {
    const errors = {};
    if (!cropType) errors.cropType = 'Required';
    if (!area || isNaN(+area) || +area <= 0) errors.area = 'Positive number only';
    if (!historicalYield || isNaN(+historicalYield) || +historicalYield <= 0) errors.historicalYield = 'Positive number only';
    if (!marketPrice || isNaN(+marketPrice) || +marketPrice <= 0) errors.marketPrice = 'Positive number only';
    if (!rainfall || isNaN(+rainfall) || +rainfall < 0) errors.rainfall = 'Non-negative number only';
    if (!temperature || isNaN(+temperature)) errors.temperature = 'Valid number only';
    setInputErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsCalculating(true);
      setPrediction(null);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const areaNum = +area;
      const historicalYieldNum = +historicalYield;
      const marketPriceNum = +marketPrice;
      const rainfallNum = +rainfall;
      const temperatureNum = +temperature;

      // Get crop conditions
      const conditions = cropConditions[cropType] || cropConditions.Default;

      // Yield adjustments
      let yieldFactor = 1;
      if (rainfallNum < conditions.minRain) {
        yieldFactor *= Math.exp(-0.002 * (conditions.minRain - rainfallNum));
      } else if (rainfallNum > conditions.maxRain) {
        yieldFactor *= Math.exp(-0.002 * (rainfallNum - conditions.maxRain));
      }
      if (temperatureNum < conditions.minTemp) {
        yieldFactor *= Math.exp(-0.03 * (conditions.minTemp - temperatureNum));
      } else if (temperatureNum > conditions.maxTemp) {
        yieldFactor *= Math.exp(-0.03 * (temperatureNum - conditions.maxTemp));
      }

      // Soil quality (randomized)
      const soilQuality = 0.8 + Math.random() * 0.4;
      const randomFactor = (Math.random() - 0.5) * 0.1;
      const estimatedYieldPerHectare = historicalYieldNum * yieldFactor * soilQuality * (1 + randomFactor);
      const totalYield = estimatedYieldPerHectare * areaNum;
      const revenue = totalYield * marketPriceNum;

      // Efficiency (0-100%)
      const efficiency = Math.min(Math.max(yieldFactor * soilQuality * 100, 0), 100);

      // Risk assessment
      const risks = [];
      if (rainfallNum < conditions.minRain) risks.push('Too dry');
      if (rainfallNum > conditions.maxRain) risks.push('Too wet');
      if (temperatureNum < conditions.minTemp) risks.push('Too cold');
      if (temperatureNum > conditions.maxTemp) risks.push('Overheating');
      if (areaNum > 100) risks.push('Large area');
      const riskLevel = risks.length > 1 ? 'High' : risks.length === 1 ? 'Moderate' : 'Low';
      const riskFactors = risks.length ? `${riskLevel}: ${risks.join(', ')}` : `${riskLevel}: All good`;

      setPrediction({
        estimatedYield: totalYield,
        revenue: revenue,
        riskFactors: riskFactors,
        efficiency: efficiency,
      });

      Animated.parallel([
        Animated.timing(resultAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(efficiencyAnim, { toValue: efficiency / 100, duration: 1000, useNativeDriver: true }),
      ]).start();

      setIsCalculating(false);
    }
  };

  const rotateInterpolation = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const efficiencyRotation = efficiencyAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <LinearGradient colors={['#f5fcf7', '#e8f7ed']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="analytics" size={32} color="#27ae60" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>AI Yield Predictor</Text>
          <Text style={styles.headerSubtitle}>Next-gen crop yield forecasting</Text>
        </View>

        <Text style={styles.sectionTitle}>Crop Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Crop Type</Text>
          <TextInput style={styles.input} placeholder="e.g., Wheat, Rice, Corn" value={cropType} onChangeText={setCropType} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cultivation Area (hectares)</Text>
          <TextInput style={styles.input} placeholder="Enter area" keyboardType="numeric" value={area} onChangeText={setArea} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Historical Yield (kg/hectare)</Text>
          <TextInput style={styles.input} placeholder="Enter yield" keyboardType="numeric" value={historicalYield} onChangeText={setHistoricalYield} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Market Price ($/kg)</Text>
          <TextInput style={styles.input} placeholder="Enter price" keyboardType="numeric" value={marketPrice} onChangeText={setMarketPrice} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Average Rainfall (mm)</Text>
          <TextInput style={styles.input} placeholder="Enter rainfall" keyboardType="numeric" value={rainfall} onChangeText={setRainfall} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Average Temperature (°C)</Text>
          <TextInput style={styles.input} placeholder="Enter temp" keyboardType="numeric" value={temperature} onChangeText={setTemperature} />
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={handleAnalyze}>
          {isCalculating ? (
            <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
              <Ionicons name="analytics" size={24} color="white" />
            </Animated.View>
          ) : (
            <Ionicons name="analytics" size={24} color="white" />
          )}
          <Text style={styles.calculateButtonText}>Run AI Prediction</Text>
        </TouchableOpacity>

        {prediction && (
          <Animated.View style={{ opacity: resultAnim }}>
            <LinearGradient colors={['#e8f7ed', '#d0f0d8']} style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Prediction Results</Text>
              <View style={styles.resultRow}>
                <Ionicons name="leaf" size={24} color="#27ae60" style={styles.resultIcon} />
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultLabel}>Estimated Yield</Text>
                  <Text style={styles.resultValue}>{formatNumber(prediction.estimatedYield)} kg</Text>
                </View>
              </View>
              <View style={styles.resultRow}>
                <Ionicons name="cash" size={24} color="#27ae60" style={styles.resultIcon} />
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultLabel}>Potential Revenue</Text>
                  <Text style={styles.resultValue}>{formatCurrency(prediction.revenue)}</Text>
                </View>
              </View>
              <View style={styles.resultRow}>
                <Ionicons name="warning" size={24} color="#27ae60" style={styles.resultIcon} />
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultLabel}>Risk Factors</Text>
                  <Text
                    style={[
                      styles.resultValue,
                      prediction.riskFactors.includes('High') ? styles.riskHigh : prediction.riskFactors.includes('Moderate') ? styles.riskModerate : styles.riskLow,
                    ]}
                  >
                    {prediction.riskFactors}
                  </Text>
                </View>
              </View>
              <View style={styles.efficiencyContainer}>
                <Animated.View style={[styles.efficiencyCircle, { transform: [{ rotate: efficiencyRotation }] }]}>
                  <Text style={styles.efficiencyText}>{Math.round(prediction.efficiency)}%</Text>
                </Animated.View>
                <Text style={styles.efficiencyLabel}>Yield Efficiency</Text>
              </View>
            </LinearGradient>
            <Text style={styles.note}>Simulated prediction based on your data.</Text>
          </Animated.View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 30, padding: 20 },
  headerIcon: { marginBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#2c3e50', textAlign: 'center', marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 22 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2c3e50', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: '#e8f7ed' },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 16, marginBottom: 10, color: '#333' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  calculateButton: { backgroundColor: '#27ae60', padding: 18, borderRadius: 10, alignItems: 'center', marginVertical: 20, flexDirection: 'row', justifyContent: 'center' },
  calculateButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  resultContainer: { marginTop: 20, padding: 20, borderRadius: 15 },
  resultTitle: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20 },
  resultRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  resultIcon: { marginRight: 15 },
  resultTextContainer: { flex: 1 },
  resultLabel: { fontSize: 16, color: '#555' },
  resultValue: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
  riskHigh: { color: '#e74c3c' },
  riskModerate: { color: '#f1c40f' },
  riskLow: { color: '#27ae60' },
  efficiencyContainer: { alignItems: 'center', marginTop: 20 },
  efficiencyCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 4, borderColor: '#27ae60', justifyContent: 'center', alignItems: 'center' },
  efficiencyText: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  efficiencyLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  note: { fontSize: 12, color: '#666', marginTop: 20, textAlign: 'center' },
  floatingButton: { position: 'absolute', bottom: 30, left: 20, backgroundColor: '#27ae60', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});