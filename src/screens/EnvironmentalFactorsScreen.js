import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export default function EnvironmentalFactorsScreen({ navigation }) {
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [soilPH, setSoilPH] = useState("");
  const [result, setResult] = useState(null);
  const springAnim = React.useRef(new Animated.Value(0)).current;

  const validateInput = (value, type) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      Alert.alert("Invalid Input", `Please enter a valid number for ${type}`);
      return false;
    }
    switch (type) {
      case "temperature":
        if (num < -20 || num > 50) {
          Alert.alert(
            "Invalid Temperature",
            "Temperature should be between -20°C and 50°C"
          );
          return false;
        }
        break;
      case "rainfall":
        if (num < 0 || num > 5000) {
          Alert.alert(
            "Invalid Rainfall",
            "Rainfall should be between 0 and 5000 mm/month"
          );
          return false;
        }
        break;
      case "pH":
        if (num < 0 || num > 14) {
          Alert.alert("Invalid pH", "pH should be between 0 and 14");
          return false;
        }
        break;
    }
    return true;
  };

  const getTemperatureAnalysis = (temp) => {
    if (temp < 10)
      return {
        status: "Too Cold",
        detail: "Consider greenhouse cultivation or cold-resistant crops.",
        score: 0.2,
      };
    else if (temp < 15)
      return {
        status: "Cool",
        detail: "Suitable for cool-season crops like lettuce or spinach.",
        score: 0.4,
      };
    else if (temp < 20)
      return {
        status: "Mild",
        detail: "Good for a variety of crops; monitor for sudden changes.",
        score: 0.6,
      };
    else if (temp <= 35)
      return {
        status: "Optimal",
        detail: "Ideal temperature range for most crops.",
        score: 1.0,
      };
    else if (temp <= 40)
      return {
        status: "Warm",
        detail: "Monitor for heat stress; provide shade or increase watering.",
        score: 0.6,
      };
    else
      return {
        status: "Too Hot",
        detail: "High risk of crop damage; implement cooling measures.",
        score: 0.2,
      };
  };

  const getRainfallAnalysis = (rain) => {
    if (rain < 200)
      return {
        status: "Very Low",
        detail: "Severe drought conditions; irrigation essential.",
        score: 0.2,
      };
    else if (rain < 350)
      return {
        status: "Low",
        detail: "May need supplemental irrigation.",
        score: 0.4,
      };
    else if (rain < 500)
      return {
        status: "Moderate",
        detail: "Suitable for some crops; monitor soil moisture.",
        score: 0.6,
      };
    else if (rain <= 1500)
      return {
        status: "Optimal",
        detail: "Perfect moisture levels for crop growth.",
        score: 1.0,
      };
    else if (rain <= 1750)
      return {
        status: "High",
        detail: "Monitor for waterlogging; ensure good drainage.",
        score: 0.6,
      };
    else if (rain <= 2000)
      return {
        status: "Very High",
        detail: "Risk of flooding; consider raised beds.",
        score: 0.4,
      };
    else
      return {
        status: "Excessive",
        detail: "High risk of flooding; implement flood mitigation strategies.",
        score: 0.2,
      };
  };

  const getSoilPHAnalysis = (ph) => {
    if (ph < 5.0)
      return {
        status: "Strongly Acidic",
        detail: "Highly acidic; apply lime to raise pH.",
        score: 0.2,
      };
    else if (ph < 5.5)
      return {
        status: "Moderately Acidic",
        detail: "Slightly acidic; may need pH adjustment for some crops.",
        score: 0.6,
      };
    else if (ph <= 7.0)
      return {
        status: "Optimal",
        detail: "Ideal pH for most crops.",
        score: 1.0,
      };
    else if (ph <= 8.0)
      return {
        status: "Moderately Alkaline",
        detail: "Slightly alkaline; may need sulfur for some crops.",
        score: 0.6,
      };
    else
      return {
        status: "Strongly Alkaline",
        detail: "Highly alkaline; apply sulfur or use acidifying fertilizers.",
        score: 0.2,
      };
  };

  const getOverallSummary = (score) => {
    if (score >= 90) return "Excellent conditions for crop growth.";
    else if (score >= 70) return "Good conditions; minor adjustments may optimize yields.";
    else if (score >= 50) return "Fair conditions; attention needed to improve factors.";
    else return "Poor conditions; significant improvements required.";
  };

  const getStatusColor = (score) => {
    if (score >= 0.8) return "#27ae60"; // green
    if (score >= 0.5) return "#f1c40f"; // yellow
    return "#e74c3c"; // red
  };

  const analyzeConditions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (
      !validateInput(temperature, "temperature") ||
      !validateInput(rainfall, "rainfall") ||
      !validateInput(soilPH, "pH")
    ) {
      return;
    }

    const temp = parseFloat(temperature);
    const rain = parseFloat(rainfall);
    const ph = parseFloat(soilPH);

    const tempAnalysis = getTemperatureAnalysis(temp);
    const rainAnalysis = getRainfallAnalysis(rain);
    const phAnalysis = getSoilPHAnalysis(ph);

    const averageScore = ((tempAnalysis.score + rainAnalysis.score + phAnalysis.score) / 3) * 100;
    const overallSummary = getOverallSummary(averageScore);

    setResult({
      temperature: tempAnalysis,
      rainfall: rainAnalysis,
      soilPH: phAnalysis,
      overall: { score: averageScore.toFixed(1), summary: overallSummary },
    });

    Animated.spring(springAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient colors={["#f5fcf7", "#e8f7ed"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="thermometer" size={32} color="#27ae60" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Environmental Analysis</Text>
          <Text style={styles.headerSubtitle}>Monitor conditions for optimal crop growth</Text>
        </View>

        <Text style={styles.sectionTitle}>Environmental Factors</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Average Temperature (°C)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter daily average temperature"
            keyboardType="numeric"
            value={temperature}
            onChangeText={setTemperature}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rainfall (mm/month)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter monthly rainfall"
            keyboardType="numeric"
            value={rainfall}
            onChangeText={setRainfall}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Soil pH Level</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter soil pH value"
            keyboardType="numeric"
            value={soilPH}
            onChangeText={setSoilPH}
          />
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={analyzeConditions}>
          <Text style={styles.calculateButtonText}>Analyze Conditions</Text>
        </TouchableOpacity>

        {result && (
          <Animated.View style={{ opacity: springAnim, transform: [{ scale: springAnim }] }}>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Analysis Results</Text>

              <View style={styles.factorContainer}>
                <Text style={styles.factorLabel}>Temperature:</Text>
                <Text
                  style={[styles.factorStatus, { color: getStatusColor(result.temperature.score) }]}
                >
                  {result.temperature.status}
                </Text>
                <Text style={styles.factorDetail}>{result.temperature.detail}</Text>
              </View>

              <View style={styles.factorContainer}>
                <Text style={styles.factorLabel}>Rainfall:</Text>
                <Text
                  style={[styles.factorStatus, { color: getStatusColor(result.rainfall.score) }]}
                >
                  {result.rainfall.status}
                </Text>
                <Text style={styles.factorDetail}>{result.rainfall.detail}</Text>
              </View>

              <View style={styles.factorContainer}>
                <Text style={styles.factorLabel}>Soil pH:</Text>
                <Text
                  style={[styles.factorStatus, { color: getStatusColor(result.soilPH.score) }]}
                >
                  {result.soilPH.status}
                </Text>
                <Text style={styles.factorDetail}>{result.soilPH.detail}</Text>
              </View>

              <View style={styles.overallContainer}>
                <Text style={styles.overallLabel}>Overall Suitability:</Text>
                <Text
                  style={[
                    styles.overallScore,
                    { color: getStatusColor(result.overall.score / 100) },
                  ]}
                >
                  {result.overall.score}%
                </Text>
                <Text style={styles.overallSummary}>{result.overall.summary}</Text>
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
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
  },
  headerIcon: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#e8f7ed",
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  calculateButton: {
    backgroundColor: "#27ae60",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  calculateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  factorContainer: {
    marginBottom: 15,
  },
  factorLabel: {
    fontSize: 16,
    color: "#666",
  },
  factorStatus: {
    fontSize: 16,
    fontWeight: "bold",
  },
  factorDetail: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  overallContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  overallLabel: {
    fontSize: 18,
    color: "#333",
  },
  overallScore: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
  },
  overallSummary: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});