import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4f46e5';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';
const PAGE_BG = '#f9fafb';

type TabKey = 'transcript' | 'resources' | 'notes';

const LessonDetailScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('transcript');
  const [notes, setNotes] = useState('');

  const readingModeStyle = useMemo(() => ({ filter: undefined as unknown }), []);

  const transcript = [
    {
      time: '12:34',
      text:
        "In this section, we'll explore how to implement the render props pattern effectively. This pattern allows us to share code between components using a prop whose value is a function.",
      highlighted: true,
    },
    {
      time: '13:45',
      text:
        'The render props pattern is particularly useful when you need to share stateful logic between components without using higher-order components.',
    },
    {
      time: '14:22',
      text: 'Let\'s look at a practical example of how to implement this pattern in a real-world application.',
    },
  ];

  const resources = [
    { title: 'render-props-example.js', icon: 'code-outline', color: '#3b82f6' },
    { title: 'component-library.zip', icon: 'document-outline', color: '#10b981' },
    { title: 'React Patterns Documentation', icon: 'link-outline', color: '#a855f7' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, readingModeStyle as any]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable style={styles.iconBtn} android_ripple={{ color: '#e5e7eb' }}>
              <Ionicons name="arrow-back" size={18} color="#374151" />
            </Pressable>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text style={styles.headerTitle} numberOfLines={1}>Advanced React Patterns</Text>
              <Text style={styles.headerSubtitle}>Lesson 3 of 12</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable style={styles.iconBtn} android_ripple={{ color: '#e5e7eb' }}>
                <Ionicons name="book-outline" size={18} color="#374151" />
              </Pressable>
              <Pressable style={styles.iconBtn} android_ripple={{ color: '#e5e7eb' }}>
                <Ionicons name="download-outline" size={18} color="#374151" />
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Video Section */}
          <View style={styles.videoWrapper}>
            <ImageBackground
              source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/4981a96f75-3f56dca742b509160291.png' }}
              style={styles.videoImage}
            >
              <Pressable
                style={styles.playCircle}
                onPress={() => setIsPlaying(v => !v)}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={22} color="#fff" />
              </Pressable>

              <View style={styles.videoHud}>
                <View style={styles.videoHudRow}>
                  <Text style={styles.videoHudText}>12:34</Text>
                  <Text style={styles.videoHudText}>25:47</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: '50%' }]} />
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Progress bar */}
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressValue}>48%</Text>
            </View>
            <View style={styles.progressOuter}>
              <View style={[styles.progressInner, { width: '48%' }]} />
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {(['transcript', 'resources', 'notes'] as TabKey[]).map(key => {
              const isActive = key === activeTab;
              return (
                <Pressable
                  key={key}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  android_ripple={{ color: '#e5e7eb' }}
                  onPress={() => setActiveTab(key)}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {key === 'transcript' ? 'Transcript' : key === 'resources' ? 'Resources' : 'Notes'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Content */}
          {activeTab === 'transcript' && (
            <View style={styles.section}>
              {transcript.map((item, idx) => (
                <View
                  key={idx}
                  style={[styles.transcriptItem, item.highlighted && styles.transcriptItemHighlighted]}
                >
                  <View style={styles.transcriptHeaderRow}>
                    <Text style={[styles.transcriptTime, item.highlighted && styles.transcriptTimeActive]}>
                      {item.time}
                    </Text>
                    <Pressable android_ripple={{ color: '#e5e7eb' }}>
                      <Ionicons name="copy-outline" size={14} color="#9ca3af" />
                    </Pressable>
                  </View>
                  <Text style={styles.transcriptText}>{item.text}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'resources' && (
            <View style={styles.section}>
              <View style={styles.resourcesBlock}>
                <Text style={styles.resourcesTitle}>Code Examples</Text>
                {resources.slice(0, 2).map((r, idx) => (
                  <Pressable key={idx} style={styles.resourceItem} android_ripple={{ color: '#f3f4f6' }}>
                    <View style={styles.resourceLeft}>
                      <Ionicons name={r.icon as any} size={18} color={r.color} />
                      <Text style={styles.resourceText}>{r.title}</Text>
                    </View>
                    <Ionicons name="download-outline" size={16} color="#9ca3af" />
                  </Pressable>
                ))}
              </View>

              <View style={[styles.resourcesBlock, { marginTop: 12 }]}>
                <Text style={styles.resourcesTitle}>Additional Reading</Text>
                <Pressable style={styles.resourceItem} android_ripple={{ color: '#f3f4f6' }}>
                  <View style={styles.resourceLeft}>
                    <Ionicons name="link-outline" size={18} color="#a855f7" />
                    <View>
                      <Text style={styles.resourceText}>React Patterns Documentation</Text>
                      <Text style={styles.resourceMeta}>Official React docs</Text>
                    </View>
                  </View>
                  <Ionicons name="open-outline" size={16} color="#9ca3af" />
                </Pressable>
              </View>
            </View>
          )}

          {activeTab === 'notes' && (
            <View style={styles.section}>
              <View style={styles.notesCard}>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add your notes here..."
                  placeholderTextColor="#9ca3af"
                  style={styles.notesInput}
                  multiline
                />
                <View style={styles.notesFooterRow}>
                  <Text style={styles.autoSavedText}>Auto-saved</Text>
                  <Pressable style={styles.saveBtn} android_ripple={{ color: '#fde68a' }}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </Pressable>
                </View>
              </View>

              <View style={{ marginTop: 12 }}>
                <View style={styles.savedNoteCard}>
                  <View style={styles.savedNoteHeader}>
                    <Text style={styles.savedNoteTime}>2 minutes ago</Text>
                    <Pressable android_ripple={{ color: '#fee2e2' }}>
                      <Ionicons name="trash-outline" size={14} color="#9ca3af" />
                    </Pressable>
                  </View>
                  <Text style={styles.savedNoteText}>
                    Remember to practice the render props pattern with the mouse tracker example.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom actions */}
        <View style={styles.bottomBar}>
          <Pressable style={[styles.bottomBtn, styles.bottomBtnNeutral]} android_ripple={{ color: '#e5e7eb' }}>
            <Ionicons name="chevron-back" size={16} color="#111827" />
            <Text style={styles.bottomBtnNeutralText}>Previous</Text>
          </Pressable>

          <Pressable style={[styles.bottomBtn, styles.bottomBtnSuccess]} android_ripple={{ color: '#16a34a' }}>
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={styles.bottomBtnSuccessText}>Complete</Text>
          </Pressable>

          <Pressable style={[styles.bottomBtn, styles.bottomBtnPrimary]} android_ripple={{ color: '#4338ca' }}>
            <Text style={styles.bottomBtnPrimaryText}>Next</Text>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.quizCtaWrapper}>
          <Pressable style={styles.quizCta} android_ripple={{ color: '#e9d5ff' }}>
            <Ionicons name="help-circle-outline" size={18} color="#7e22ce" style={{ marginRight: 8 }} />
            <Text style={styles.quizCtaText}>Take Practice Quiz</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    height: 36,
    width: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  headerSubtitle: {
    fontSize: 11,
    color: TEXT_MUTED,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  videoWrapper: {
    backgroundColor: '#000',
  },
  videoImage: {
    aspectRatio: 16 / 9,
    justifyContent: 'center',
  },
  playCircle: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  videoHud: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 8,
  },
  videoHudRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  videoHudText: {
    color: '#fff',
    fontSize: 12,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#4b5563',
    borderRadius: 999,
  },
  progressFill: {
    height: 3,
    backgroundColor: PRIMARY,
    borderRadius: 999,
  },
  progressCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  progressValue: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  progressOuter: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
  },
  progressInner: {
    height: 8,
    backgroundColor: '#22c55e',
    borderRadius: 999,
  },
  tabsRow: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: PRIMARY,
  },
  tabText: {
    color: TEXT_MUTED,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: PRIMARY,
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  transcriptItem: {
    borderLeftWidth: 0,
    borderColor: PRIMARY,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  transcriptItemHighlighted: {
    borderLeftWidth: 4,
    backgroundColor: '#eff6ff',
  },
  transcriptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  transcriptTime: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  transcriptTimeActive: {
    color: PRIMARY,
  },
  transcriptText: {
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 20,
  },
  resourcesBlock: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    padding: 12,
  },
  resourcesTitle: {
    fontSize: 14,
    color: TEXT_DARK,
    fontWeight: '700',
    marginBottom: 10,
  },
  resourceItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resourceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceText: {
    marginLeft: 10,
    fontSize: 13,
    color: TEXT_DARK,
    fontWeight: '600',
  },
  resourceMeta: {
    marginLeft: 10,
    fontSize: 11,
    color: '#6b7280',
  },
  notesCard: {
    backgroundColor: '#fefce8',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 12,
    padding: 12,
  },
  notesInput: {
    minHeight: 120,
    color: TEXT_DARK,
    textAlignVertical: 'top',
  },
  notesFooterRow: {
    borderTopWidth: 1,
    borderTopColor: '#fde68a',
    marginTop: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoSavedText: {
    fontSize: 11,
    color: '#6b7280',
  },
  saveBtn: {
    backgroundColor: '#fde68a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f2937',
  },
  savedNoteCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },
  savedNoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  savedNoteTime: {
    fontSize: 11,
    color: '#6b7280',
  },
  savedNoteText: {
    fontSize: 13,
    color: '#1f2937',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 60,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bottomBtnNeutral: {
    backgroundColor: '#f3f4f6',
  },
  bottomBtnNeutralText: {
    marginLeft: 6,
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBtnSuccess: {
    backgroundColor: '#22c55e',
  },
  bottomBtnSuccessText: {
    marginLeft: 6,
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBtnPrimary: {
    backgroundColor: PRIMARY,
  },
  bottomBtnPrimaryText: {
    marginRight: 6,
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  quizCtaWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 12,
  },
  quizCta: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCtaText: {
    color: '#7e22ce',
    fontWeight: '700',
  },
});

export default LessonDetailScreen;
