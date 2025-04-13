import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function SoilHealthScreen({ navigation }) {
  const [soilPH, setSoilPH] = useState('');
  const [nutrients, setNutrients] = useState('');
  const [moisture, setMoisture] = useState('');
  const [organicMatter, setOrganicMatter] = useState('');
  const [result, setResult] = useState(null);
  const resultAnim = React.useRef(new Animated.Value(0)).current;

  // Validate all inputs
  const validateInputs = () => {
    const errors = {};
    const ph = parseFloat(soilPH);
    const moist = parseFloat(moisture);

    if (isNaN(ph) || ph < 0 || ph > 14) {
      errors.soilPH = 'pH must be between 0 and 14';
    }
    if (isNaN(moist) || moist < 0 || moist > 100) {
      errors.moisture = 'Moisture must be between 0 and 100';
    }
    if (!nutrients) {
      errors.nutrients = 'Nutrient level is required';
    }
    if (!organicMatter) {
      errors.organicMatter = 'Organic matter level is required';
    }
    return errors;
  };

  // Analyze pH
  const getPhAnalysis = (ph) => {
    if (ph >= 6.0 && ph <= 7.5) {
      return { status: 'Optimal', recommendation: 'No action needed.' };
    } else if (ph < 6.0) {
      return { status: 'Too Acidic', recommendation: 'Consider adding lime to raise pH.' };
    } else {
      return { status: 'Too Alkaline', recommendation: 'Consider adding sulfur or organic matter to lower pH.' };
    }
  };

  // Analyze moisture
  const getMoistureAnalysis = (moist) => {
    if (moist >= 60 && moist <= 80) {
      return { status: 'Optimal', recommendation: 'No action needed.' };
    } else if (moist < 60) {
      return { status: 'Too Dry', recommendation: 'Increase irrigation or consider drought-resistant crops.' };
    } else {
      return { status: 'Too Wet', recommendation: 'Improve drainage or consider raised beds.' };
    }
  };

  // Analyze nutrients
  const getNutrientsAnalysis = (nutrients) => {
    const level = nutrients.toLowerCase();
    if (level === 'low') {
      return { status: 'Low', recommendation: 'Consider adding fertilizers or compost.' };
    } else if (level === 'medium') {
      return { status: 'Medium', recommendation: 'Nutrient levels are adequate.' };
    } else if (level === 'high') {
      return { status: 'High', recommendation: 'Be cautious with additional fertilizers to avoid over-fertilization.' };
    } else {
      return { status: 'Unknown', recommendation: 'Please enter low, medium, or high.' };
    }
  };

  // Analyze organic matter
  const getOrganicMatterAnalysis = (organic) => {
    const level = organic.toLowerCase();
    if (level === 'low') {
      return { status: 'Low', recommendation: 'Add compost or organic mulch to improve soil structure.' };
    } else if (level === 'medium') {
      return { status: 'Medium', recommendation: 'Organic matter is sufficient.' };
    } else if (level === 'high') {
      return { status: 'High', recommendation: 'Excellent organic matter content.' };
    } else {
      return { status: 'Unknown', recommendation: 'Please enter low, medium, or high.' };
    }
  };

  // Main analysis function
  const analyzeSoil = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      Alert.alert('Error', firstError);
      return;
    }

    const ph = parseFloat(soilPH);
    const moist = parseFloat(moisture);

    setResult({
      ph: getPhAnalysis(ph),
      moisture: getMoistureAnalysis(moist),
      nutrients: getNutrientsAnalysis(nutrients),
      organicMatter: getOrganicMatterAnalysis(organicMatter),
    });

    Animated.timing(resultAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient colors={['#f5fcf7', '#e8f7ed']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="leaf" size={32} color="#27ae60" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Soil Health Analysis</Text>
          <Text style={styles.headerSubtitle}>Monitor and optimize your soil conditions</Text>
        </View>

        <Text style={styles.sectionTitle}>Soil Metrics</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Soil pH Level</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter soil pH (0-14)"
            keyboardType="numeric"
            value={soilPH}
            onChangeText={setSoilPH}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nutrient Level</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter level (low, medium, high)"
            value={nutrients}
            onChangeText={setNutrients}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Moisture Content (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter moisture percentage (0-100)"
            keyboardType="numeric"
            value={moisture}
            onChangeText={setMoisture}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Organic Matter</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter level (low, medium, high)"
            value={organicMatter}
            onChangeText={setOrganicMatter}
          />
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={analyzeSoil}>
          <Text style={styles.calculateButtonText}>Analyze Soil Health</Text>
        </TouchableOpacity>

        {result && (
          <Animated.View style={{ opacity: resultAnim }}>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Analysis Results</Text>

              <View style={styles.resultMetric}>
                <View style={styles.resultRow}>
                  <Ionicons name="flask" size={20} color="#27ae60" style={styles.resultIcon} />
                  <View style={styles.metricInfo}>
                    <Text style={styles.resultLabel}>pH</Text>
                    <Text style={[styles.resultValue, result.ph.status === 'Optimal' ? styles.optimal : styles.notOptimal]}>
                      {result.ph.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.recommendation}>{result.ph.recommendation}</Text>
              </View>

              <View style={styles.resultMetric}>
                <View style={styles.resultRow}>
                  <Ionicons name="water" size={20} color="#27ae60" style={styles.resultIcon} />
                  <View style={styles.metricInfo}>
                    <Text style={styles.resultLabel}>Moisture</Text>
                    <Text style={[styles.resultValue, result.moisture.status === 'Optimal' ? styles.optimal : styles.notOptimal]}>
                      {result.moisture.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.recommendation}>{result.moisture.recommendation}</Text>
              </View>

              <View style={styles.resultMetric}>
                <View style={styles.resultRow}>
                  <Ionicons name="nutrition" size={20} color="#27ae60" style={styles.resultIcon} />
                  <View style={styles.metricInfo}>
                    <Text style={styles.resultLabel}>Nutrients</Text>
                    <Text style={styles.resultValue}>{result.nutrients.status}</Text>
                  </View>
                </View>
                <Text style={styles.recommendation}>{result.nutrients.recommendation}</Text>
              </View>

              <View style={styles.resultMetric}>
                <View style={styles.resultRow}>
                  <Ionicons name="leaf" size={20} color="#27ae60" style={styles.resultIcon} />
                  <View style={styles.metricInfo}>
                    <Text style={styles.resultLabel}>Organic Matter</Text>
                    <Text style={styles.resultValue}>{result.organicMatter.status}</Text>
                  </View>
                </View>
                <Text style={styles.recommendation}>{result.organicMatter.recommendation}</Text>
              </View>
            </View>
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
  resultMetric: {
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIcon: {
    marginRight: 10,
  },
  metricInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optimal: {
    color: '#27ae60',
  },
  notOptimal: {
    color: '#e74c3c',
  },
  recommendation: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginLeft: 30,
  },
});