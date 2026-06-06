import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from '../../components/MainHeader';
import { aiSettingsApi, AISettingsData } from '../../services';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';
const BORDER = '#e5e7eb';
const CARD_BG = '#ffffff';

const PROVIDERS = [
  { key: 'ollama', label: 'Ollama (Local)', desc: 'Free, runs on your machine' },
  { key: 'openai', label: 'OpenAI', desc: 'GPT-4, requires API key' },
  { key: 'gemini', label: 'Google Gemini', desc: 'Free tier available' },
] as const;

const MODELS: Record<string, string[]> = {
  ollama: ['llama3', 'mistral', 'gemma', 'phi', 'codellama'],
  openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  gemini: ['gemini-pro', 'gemini-1.5-pro'],
};

const AISettingsScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [provider, setProvider] = useState('ollama');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3');

  const load = useCallback(async () => {
    try {
      const data = await aiSettingsApi.getSettings();
      setProvider(data.provider);
      setOllamaEndpoint(data.ollama_endpoint);
      setOllamaModel(data.ollama_model);
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await aiSettingsApi.updateSettings({
        provider: provider as AISettingsData['provider'],
        ollama_endpoint: ollamaEndpoint,
        ollama_model: ollamaModel,
      });
      Alert.alert('Saved', 'AI settings updated successfully.');
    } catch {
      Alert.alert('Error', 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    Alert.alert('Test Connection', 'Ensure Ollama is running, then ask a question in any lesson to verify.');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <MainHeader title="AI Settings" iconName="bulb" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <MainHeader title="AI Settings" iconName="bulb" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Provider Selection */}
        <Text style={styles.sectionLabel}>Provider</Text>
        {PROVIDERS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.providerCard, provider === p.key && styles.providerCardActive]}
            onPress={() => setProvider(p.key)}
            activeOpacity={0.7}
          >
            <View style={styles.radioOuter}>
              {provider === p.key && <View style={styles.radioInner} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.providerLabel, provider === p.key && { color: PRIMARY }]}>{p.label}</Text>
              <Text style={styles.providerDesc}>{p.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Ollama Settings */}
        {provider === 'ollama' && (
          <>
            <Text style={styles.sectionLabel}>Ollama Endpoint</Text>
            <TextInput
              style={styles.input}
              value={ollamaEndpoint}
              onChangeText={setOllamaEndpoint}
              placeholder="http://localhost:11434"
              placeholderTextColor={TEXT_MUTED}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.sectionLabel}>Model</Text>
            <View style={styles.modelRow}>
              {MODELS.ollama.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.modelChip, ollamaModel === m && styles.modelChipActive]}
                  onPress={() => setOllamaModel(m)}
                >
                  <Text style={[styles.modelChipText, ollamaModel === m && styles.modelChipTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Save & Test */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Settings</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.testBtn} onPress={handleTestConnection}>
          <Ionicons name="pulse" size={16} color={PRIMARY} />
          <Text style={styles.testBtnText}>Test Connection</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PAGE_BG },
  scroll: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: {
    color: TEXT_DARK,
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  providerCardActive: { borderColor: PRIMARY, backgroundColor: '#EEF2FF' },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },
  providerLabel: { fontWeight: '800', fontSize: 14, color: TEXT_DARK },
  providerDesc: { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT_DARK,
    backgroundColor: CARD_BG,
  },
  modelRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modelChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
  },
  modelChipActive: { borderColor: PRIMARY, backgroundColor: '#EEF2FF' },
  modelChipText: { fontSize: 13, color: TEXT_DARK, fontWeight: '600' },
  modelChipTextActive: { color: PRIMARY },
  saveBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 12,
  },
  testBtnText: { color: PRIMARY, fontWeight: '700', fontSize: 13 },
});

export default AISettingsScreen;
