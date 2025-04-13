import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function CropRevenueScreen() {
  const [cropType, setCropType] = useState('');
  const [yieldPerHectare, setYieldPerHectare] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  const [hectares, setHectares] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [fertilizerCost, setFertilizerCost] = useState('');
  const [result, setResult] = useState(null);
  const [inputErrors, setInputErrors] = useState({});

  const formatCurrency = (value) => {
    return isNaN(value) ? '' : `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  const isValidNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  const calculateRevenue = () => {
    const errors = {};
    if (!hectares || !isValidNumber(hectares)) errors.hectares = 'Valid number required';
    if (!yieldPerHectare || !isValidNumber(yieldPerHectare)) errors.yield = 'Valid number required';
    if (!marketPrice || !isValidNumber(marketPrice)) errors.price = 'Valid number required';
    if (laborCost && !isValidNumber(laborCost)) errors.labor = 'Must be a valid number';
    if (fertilizerCost && !isValidNumber(fertilizerCost)) errors.fertilizer = 'Must be a valid number';
    setInputErrors(errors);

    if (Object.keys(errors).length === 0) {
      const yieldVal = parseFloat(yieldPerHectare);
      const priceVal = parseFloat(marketPrice);
      const hectaresVal = parseFloat(hectares);
      const laborVal = laborCost ? parseFloat(laborCost) : 0;
      const fertilizerVal = fertilizerCost ? parseFloat(fertilizerCost) : 0;

      const grossRevenue = yieldVal * priceVal * hectaresVal;
      const totalCosts = (laborVal + fertilizerVal) * hectaresVal;
      const netProfit = grossRevenue - totalCosts;
      const profitMargin = grossRevenue !== 0 ? (netProfit / grossRevenue) * 100 : 0;

      setResult({
        grossRevenue,
        totalCosts,
        netProfit,
        profitMargin
      });
    }
  };

  return (
    <LinearGradient colors={['#f5fcf7', '#e8f7ed']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="analytics" size={32} color="#27ae60" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Precision Revenue Calculator</Text>
          <Text style={styles.headerSubtitle}>Comprehensive agricultural profit analysis with cost breakdown</Text>
        </View>

        <Text style={styles.sectionTitle}>Crop Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Crop Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Wheat, Rice, Corn"
            value={cropType}
            onChangeText={setCropType}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Yield (kg/hectare)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter yield per hectare"
            keyboardType="numeric"
            value={yieldPerHectare}
            onChangeText={setYieldPerHectare}
          />
          {inputErrors.yield && <Text style={styles.errorText}>{inputErrors.yield}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Market Price ($/kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter current market price"
            keyboardType="numeric"
            value={marketPrice}
            onChangeText={setMarketPrice}
          />
          {inputErrors.price && <Text style={styles.errorText}>{inputErrors.price}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Hectares</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of hectares"
            keyboardType="numeric"
            value={hectares}
            onChangeText={setHectares}
          />
          {inputErrors.hectares && <Text style={styles.errorText}>{inputErrors.hectares}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Labor Cost ($/hectare) - Optional</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter labor cost per hectare"
            keyboardType="numeric"
            value={laborCost}
            onChangeText={setLaborCost}
          />
          {inputErrors.labor && <Text style={styles.errorText}>{inputErrors.labor}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fertilizer Cost ($/hectare) - Optional</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter fertilizer cost per hectare"
            keyboardType="numeric"
            value={fertilizerCost}
            onChangeText={setFertilizerCost}
          />
          {inputErrors.fertilizer && <Text style={styles.errorText}>{inputErrors.fertilizer}</Text>}
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculateRevenue}>
          <Text style={styles.calculateButtonText}>Calculate Revenue</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Calculation Results{cropType ? ` for ${cropType}` : ''}</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Gross Revenue:</Text>
              <Text style={styles.resultValue}>{formatCurrency(result.grossRevenue)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Costs:</Text>
              <Text style={styles.resultValue}>{formatCurrency(result.totalCosts)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Net Profit:</Text>
              <Text style={styles.resultValue}>{formatCurrency(result.netProfit)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Profit Margin:</Text>
              <Text style={styles.resultValue}>{result.profitMargin.toFixed(1)}%</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20
  },
  headerIcon: {
    marginBottom: 15
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e8f7ed'
  },
  inputGroup: {
    marginBottom: 25
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333'
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  errorText: {
    color: 'red',
    marginTop: 5
  },
  calculateButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  resultContainer: {
    marginTop: 20
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  resultLabel: {
    fontSize: 16,
    color: '#666'
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60'
  }
});