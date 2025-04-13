import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResourceManagementScreen({ navigation }) {
  const [waterUsage, setWaterUsage] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [pesticide, setPesticide] = useState('');
  const [cropArea, setCropArea] = useState('');
  const [cropType, setCropType] = useState('');
  const [waterValid, setWaterValid] = useState(true);
  const [fertValid, setFertValid] = useState(true);
  const [pestValid, setPestValid] = useState(true);
  const [areaValid, setAreaValid] = useState(true);
  const [result, setResult] = useState(null);
  const resultAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(resultAnim, {
      toValue: result ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [result]);

  // Optimal resource usage per hectare for different crops
  const optimalResources = {
    wheat: { water: 500, fertilizer: 200, pesticide: 5 },
    rice: { water: 1500, fertilizer: 300, pesticide: 10 },
    corn: { water: 800, fertilizer: 250, pesticide: 7 },
    default: { water: 800, fertilizer: 250, pesticide: 7 },
  };

  // Validation handlers
  const handleWaterChange = (text) => {
    setWaterUsage(text);
    const num = parseFloat(text);
    setWaterValid(!isNaN(num) && num > 0);
  };

  const handleFertChange = (text) => {
    setFertilizer(text);
    const num = parseFloat(text);
    setFertValid(!isNaN(num) && num > 0);
  };

  const handlePestChange = (text) => {
    setPesticide(text);
    const num = parseFloat(text);
    setPestValid(!isNaN(num) && num > 0);
  };

  const handleAreaChange = (text) => {
    setCropArea(text);
    const num = parseFloat(text);
    setAreaValid(!isNaN(num) && num > 0);
  };

  // Optimization analysis
  const getResourceAnalysis = (userValue, optimalValue, resource, unit, costPerUnit, area) => {
    const diff = userValue - optimalValue;
    const efficiency = Math.min(100, Math.max(0, (1 - Math.abs(diff) / optimalValue) * 100));
    const total = userValue * area;
    const cost = total * costPerUnit;

    let suggestion = '';
    if (Math.abs(diff) / optimalValue > 0.1) { // More than 10% deviation
      if (diff > 0) {
        const excess = diff * area;
        const costSavings = excess * costPerUnit;
        suggestion = `Reduce by ${excess.toFixed(2)} ${unit} to save $${costSavings.toFixed(2)} and optimize usage.`;
      } else {
        const shortage = Math.abs(diff) * area;
        suggestion = `Increase by ${shortage.toFixed(2)} ${unit} to improve yield potential.`;
      }
    } else {
      suggestion = 'Usage is near optimal.';
    }

    return { total, cost, efficiency, suggestion };
  };

  const calculateResources = () => {
    if (!waterUsage || !fertilizer || !pesticide || !cropArea || !cropType ||
        !waterValid || !fertValid || !pestValid || !areaValid) {
      return;
    }

    const water = parseFloat(waterUsage);
    const fert = parseFloat(fertilizer);
    const pest = parseFloat(pesticide);
    const area = parseFloat(cropArea);

    const cropKey = cropType.toLowerCase();
    const optimal = optimalResources[cropKey] || optimalResources.default;

    const waterAnalysis = getResourceAnalysis(water, optimal.water, 'Water', 'm³', 0.5, area);
    const fertAnalysis = getResourceAnalysis(fert, optimal.fertilizer, 'Fertilizer', 'kg', 2, area);
    const pestAnalysis = getResourceAnalysis(pest, optimal.pesticide, 'Pesticide', 'L', 5, area);

    const totalCost = waterAnalysis.cost + fertAnalysis.cost + pestAnalysis.cost;
    const totalEfficiency = (waterAnalysis.efficiency + fertAnalysis.efficiency + pestAnalysis.efficiency) / 3;

    setResult({
      water: waterAnalysis,
      fertilizer: fertAnalysis,
      pesticide: pestAnalysis,
      totalCost,
      totalEfficiency,
    });
  };

  const resetInputs = () => {
    setWaterUsage('');
    setFertilizer('');
    setPesticide('');
    setCropArea('');
    setCropType('');
    setWaterValid(true);
    setFertValid(true);
    setPestValid(true);
    setAreaValid(true);
    setResult(null);
  };

  return (
    <LinearGradient colors={['#f5fcf7', '#e8f7ed']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="settings" size={32} color="#27ae60" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Resource Management</Text>
          <Text style={styles.headerSubtitle}>Optimize your resource allocation</Text>
        </View>

        <Text style={styles.sectionTitle}>Resource Inputs</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Crop Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter crop type"
            value={cropType}
            onChangeText={setCropType}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Crop Area (hectares)</Text>
          <TextInput
            style={[styles.input, !areaValid && styles.inputError]}
            placeholder="Enter area in hectares"
            keyboardType="numeric"
            value={cropArea}
            onChangeText={handleAreaChange}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Water Usage (m³/hectare)</Text>
          <TextInput
            style={[styles.input, !waterValid && styles.inputError]}
            placeholder="Enter water usage"
            keyboardType="numeric"
            value={waterUsage}
            onChangeText={handleWaterChange}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fertilizer (kg/hectare)</Text>
          <TextInput
            style={[styles.input, !fertValid && styles.inputError]}
            placeholder="Enter fertilizer amount"
            keyboardType="numeric"
            value={fertilizer}
            onChangeText={handleFertChange}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pesticide (L/hectare)</Text>
          <TextInput
            style={[styles.input, !pestValid && styles.inputError]}
            placeholder="Enter pesticide amount"
            keyboardType="numeric"
            value={pesticide}
            onChangeText={handlePestChange}
          />
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculateResources}>
          <Text style={styles.calculateButtonText}>Calculate Requirements</Text>
        </TouchableOpacity>

        {result && (
          <Animated.View style={[styles.resultContainer, { opacity: resultAnim }]}>
            <Text style={styles.resultTitle}>Resource Optimization Results</Text>

            <View style={styles.resultRow}>
              <Ionicons name="water" size={20} color="#27ae60" style={styles.resultIcon} />
              <View style={styles.resultText}>
                <Text style={styles.resultLabel}>Water:</Text>
                <Text style={styles.resultValue}>{result.water.total.toFixed(2)} m³ (${result.water.cost.toFixed(2)})</Text>
              </View>
            </View>
            <Text style={styles.resultDetail}>Efficiency: {result.water.efficiency.toFixed(0)}% - {result.water.suggestion}</Text>

            <View style={styles.resultRow}>
              <Ionicons name="nutrition" size={20} color="#27ae60" style={styles.resultIcon} />
              <View style={styles.resultText}>
                <Text style={styles.resultLabel}>Fertilizer:</Text>
                <Text style={styles.resultValue}>{result.fertilizer.total.toFixed(2)} kg (${result.fertilizer.cost.toFixed(2)})</Text>
              </View>
            </View>
            <Text style={styles.resultDetail}>Efficiency: {result.fertilizer.efficiency.toFixed(0)}% - {result.fertilizer.suggestion}</Text>

            <View style={styles.resultRow}>
              <Ionicons name="bug" size={20} color="#27ae60" style={styles.resultIcon} />
              <View style={styles.resultText}>
                <Text style={styles.resultLabel}>Pesticide:</Text>
                <Text style={styles.resultValue}>{result.pesticide.total.toFixed(2)} L (${result.pesticide.cost.toFixed(2)})</Text>
              </View>
            </View>
            <Text style={styles.resultDetail}>Efficiency: {result.pesticide.efficiency.toFixed(0)}% - {result.pesticide.suggestion}</Text>

            <View style={styles.resultRow}>
              <Ionicons name="cash" size={20} color="#27ae60" style={styles.resultIcon} />
              <View style={styles.resultText}>
                <Text style={styles.resultLabel}>Total Cost:</Text>
                <Text style={styles.resultValue}>${result.totalCost.toFixed(2)}</Text>
              </View>
            </View>
            <Text style={styles.resultDetail}>Overall Efficiency: {result.totalEfficiency.toFixed(0)}%</Text>

            <TouchableOpacity style={styles.resetButton} onPress={resetInputs}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
  },
  headerIcon: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e8f7ed',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  calculateButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultIcon: {
    marginRight: 10,
  },
  resultText: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  resultDetail: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
    marginLeft: 30,
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});