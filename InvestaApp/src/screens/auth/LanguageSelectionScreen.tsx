import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      description: 'Learn in English',
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳',
      description: 'हिंदी में सीखें',
    },
    {
      code: 'gu',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      flag: '🇮🇳',
      description: 'ગુજરાતીમાં શીખો',
    },
    {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇮🇳',
      description: 'বাংলায় শিখুন',
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳',
      description: 'தமிழில் கற்கவும்',
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳',
      description: 'తెలుగులో నేర్చుకోండి',
    },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      // Here you would typically save the language preference
      // For now, just navigate to registration
      navigation.navigate('Register', { language: selectedLanguage });
    }
  };

  const renderLanguageCard = (language: any) => (
    <TouchableOpacity
      key={language.code}
      style={[
        styles.languageCard,
        selectedLanguage === language.code && styles.selectedCard,
      ]}
      onPress={() => handleLanguageSelect(language.code)}
      activeOpacity={0.7}
    >
      <View style={styles.languageHeader}>
        <Text style={styles.flag}>{language.flag}</Text>
        <View style={styles.languageInfo}>
          <Text style={[
            styles.languageName,
            selectedLanguage === language.code && styles.selectedText,
          ]}>
            {language.name}
          </Text>
          <Text style={[
            styles.nativeName,
            selectedLanguage === language.code && styles.selectedSubtext,
          ]}>
            {language.nativeName}
          </Text>
        </View>
        {selectedLanguage === language.code && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={24} color="#0891B2" />
          </View>
        )}
      </View>
      
      <Text style={[
        styles.languageDescription,
        selectedLanguage === language.code && styles.selectedSubtext,
      ]}>
        {language.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Language</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Select Your Preferred Language</Text>
        <Text style={styles.subtitle}>
          Choose the language you'd like to use for learning. You can change this later in settings.
        </Text>

        <ScrollView 
          style={styles.languagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {languages.map(renderLanguageCard)}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedLanguage && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedLanguage}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  languagesContainer: {
    flex: 1,
  },
  languageCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0891B2',
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  nativeName: {
    fontSize: 16,
    color: '#6B7280',
  },
  checkmark: {
    marginLeft: 'auto',
  },
  languageDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  selectedText: {
    color: '#0891B2',
  },
  selectedSubtext: {
    color: '#0891B2',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891B2',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LanguageSelectionScreen;
