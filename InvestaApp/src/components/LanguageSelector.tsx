import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supportedLanguages, translations, TranslationKey } from '../language';

const PRIMARY = '#4f46e5';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';
const PAGE_BG = '#f9fafb';

interface LanguageSelectorProps {
  selectedLanguage?: string;
  onLanguageSelect: (languageCode: string) => void;
  style?: any;
  currentLanguage?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage = 'en',
  onLanguageSelect,
  style,
  currentLanguage = 'en',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedLang = supportedLanguages.find(lang => lang.code === selectedLanguage) || supportedLanguages[0];
  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageSelect(languageCode);
    setIsModalVisible(false);
  };

  return (
    <>
      <Pressable
        style={[styles.selector, style]}
        android_ripple={{ color: '#f3f4f6' }}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.selectorLeft}>
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>{selectedLang.flag}</Text>
          </View>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>{selectedLang.name}</Text>
            <Text style={styles.nativeName}>{selectedLang.nativeName}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </Pressable>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.selectLanguage}</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={TEXT_DARK} />
            </Pressable>
          </View>

          <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
            {supportedLanguages.map((language) => (
              <Pressable
                key={language.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === language.code && styles.selectedLanguageItem,
                ]}
                android_ripple={{ color: '#f3f4f6' }}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <View style={styles.languageItemLeft}>
                  <View style={styles.flagContainer}>
                    <Text style={styles.flag}>{language.flag}</Text>
                  </View>
                  <View style={styles.languageInfo}>
                    <Text style={[
                      styles.languageName,
                      selectedLanguage === language.code && styles.selectedLanguageName,
                    ]}>
                      {language.name}
                    </Text>
                    <Text style={[
                      styles.nativeName,
                      selectedLanguage === language.code && styles.selectedNativeName,
                    ]}>
                      {language.nativeName}
                    </Text>
                  </View>
                </View>
                {selectedLanguage === language.code && (
                  <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flag: {
    fontSize: 20,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    color: TEXT_DARK,
    fontWeight: '700',
    fontSize: 14,
  },
  nativeName: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  languageItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedLanguageItem: {
    borderColor: PRIMARY,
    backgroundColor: '#EEF2FF',
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedLanguageName: {
    color: PRIMARY,
  },
  selectedNativeName: {
    color: PRIMARY,
    opacity: 0.8,
  },
});

export default LanguageSelector;
