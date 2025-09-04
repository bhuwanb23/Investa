import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SectionList, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import MainHeader from '../../components/MainHeader';
import LogoLoader from '../../components/LogoLoader';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  tone: 'primary' | 'warning' | 'success' | 'purple' | 'red' | 'indigo' | 'orange';
  icon: keyof typeof Ionicons.glyphMap;
  cta?: { label: string; onPress?: () => void }[];
  isNew?: boolean;
};

const NotificationsScreen: React.FC = () => {
  const [bootLoader, setBootLoader] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBootLoader(false), 800);
    return () => clearTimeout(t);
  }, []);
  const { colors } = useTheme();

  const initialToday = useMemo<NotificationItem[]>(
    () => [
      {
        id: 'today-1',
        title: 'New Module Released',
        description:
          'Advanced Portfolio Management module is now available. Start learning about asset allocation strategies.',
        timeAgo: '2 hours ago',
        tone: 'primary',
        icon: 'school-outline',
        cta: [
          { label: 'View' },
          { label: 'Dismiss' },
        ],
        isNew: true,
      },
      {
        id: 'today-2',
        title: 'SEBI Circular Summary',
        description:
          'New regulations on mutual fund investments. Key changes affecting retail investors explained.',
        timeAgo: '4 hours ago',
        tone: 'warning',
        icon: 'document-text-outline',
        cta: [
          { label: 'View' },
          { label: 'Dismiss' },
        ],
      },
      {
        id: 'today-3',
        title: 'Quiz Reminder',
        description:
          'Complete your weekly assessment on "Risk Management" before tomorrow to maintain your streak.',
        timeAgo: '6 hours ago',
        tone: 'success',
        icon: 'time-outline',
        cta: [
          { label: 'Take Quiz' },
          { label: 'Later' },
        ],
      },
    ],
    []
  );

  const initialWeek = useMemo<NotificationItem[]>(
    () => [
      {
        id: 'week-1',
        title: 'Achievement Unlocked',
        description:
          "Congratulations! You've completed 5 modules and earned the 'Learning Enthusiast' badge.",
        timeAgo: '2 days ago',
        tone: 'purple',
        icon: 'trophy-outline',
        cta: [{ label: 'View Badge' }, { label: 'Dismiss' }],
      },
      {
        id: 'week-2',
        title: 'Market Update',
        description:
          'Weekly market summary: Key indices performance and sector-wise analysis for informed investing.',
        timeAgo: '3 days ago',
        tone: 'red',
        icon: 'stats-chart-outline',
        cta: [{ label: 'Read' }, { label: 'Dismiss' }],
      },
    ],
    []
  );

  const initialEarlier = useMemo<NotificationItem[]>(
    () => [
      {
        id: 'earlier-1',
        title: 'Community Discussion',
        description:
          'Join the discussion on "Best Investment Strategies for 2024" with fellow learners and experts.',
        timeAgo: '1 week ago',
        tone: 'indigo',
        icon: 'people-outline',
        cta: [{ label: 'Join' }, { label: 'Dismiss' }],
      },
      {
        id: 'earlier-2',
        title: 'System Maintenance',
        description:
          'Scheduled maintenance completed. All features are now fully operational with improved performance.',
        timeAgo: '2 weeks ago',
        tone: 'orange',
        icon: 'notifications-outline',
        cta: [{ label: 'Dismiss' }],
      },
    ],
    []
  );

  const [today, setToday] = useState(initialToday);
  const [week, setWeek] = useState(initialWeek);
  const [earlier, setEarlier] = useState(initialEarlier);

  const palettes = getPalettes(colors);

  const sections = useMemo(
    () => [
      { key: 'today', title: 'Today', data: today, badge: `${today.length} new`, onDismiss: (id: string) => setToday((l) => l.filter((n) => n.id !== id)) },
      { key: 'week', title: 'This Week', data: week, onDismiss: (id: string) => setWeek((l) => l.filter((n) => n.id !== id)) },
      { key: 'earlier', title: 'Earlier', data: earlier, onDismiss: (id: string) => setEarlier((l) => l.filter((n) => n.id !== id)) },
    ],
    [today, week, earlier]
  );

  const totalCount = today.length + week.length + earlier.length;

  if (bootLoader) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LogoLoader message="Loading Investa..." fullscreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
      <MainHeader title="Notifications" iconName="notifications" showBackButton />
      <SectionList
        sections={sections as any}
        keyExtractor={(item: NotificationItem) => item.id}
        renderItem={({ item, section }: { item: NotificationItem; section: any }) => (
          <View style={styles.centerWrap}>
            <Card item={item} onDismiss={section.onDismiss} palettes={palettes} />
          </View>
        )}
        renderSectionHeader={({ section }: { section: any }) => (
          <View style={styles.centerWrap}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: palettes.mutedText }]}>{section.title}</Text>
              {section.badge ? (
                <View style={[styles.badgePill, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgePillText}>{section.badge}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={Platform.OS === 'web' ? false : undefined}
        disableVirtualization={Platform.OS === 'web'}
        initialNumToRender={Platform.OS === 'web' ? totalCount : undefined}
        maxToRenderPerBatch={Platform.OS === 'web' ? totalCount : undefined}
        contentContainerStyle={[styles.listContent, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// Removed static Section component in favor of responsive SectionList

const Card: React.FC<{
  item: NotificationItem;
  onDismiss: (id: string) => void;
  palettes: ReturnType<typeof getPalettes>;
}> = ({ item, onDismiss, palettes }) => {
  const { colors } = useTheme();
  const tone = palettes[item.tone];

  return (
    <View style={[styles.card, { borderColor: tone.border, backgroundColor: colors.card }]}>
      {item.isNew ? <View style={[styles.dotNew, { backgroundColor: colors.primary }]} /> : null}
      <View style={styles.cardRow}>
        <View style={[styles.iconCircle, { backgroundColor: tone.bg }]}> 
          <Ionicons name={item.icon} size={16} color={tone.fg} />
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.cardDesc, { color: palettes.secondaryText }]}>{item.description}</Text>
          <View style={styles.cardFooterRow}>
            <Text style={[styles.timeText, { color: palettes.mutedText }]}>{item.timeAgo}</Text>
            <View style={styles.actionsRow}>
              {(item.cta || []).map((c, idx) => (
                <TouchableOpacity
                  key={`${item.id}-cta-${idx}`}
                  focusable={false}
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      try { (document.activeElement as any)?.blur?.(); } catch {}
                    }
                    if (c.label.toLowerCase().includes('dismiss')) {
                      onDismiss(item.id);
                    } else if (c.onPress) {
                      c.onPress();
                    }
                  }}
                  style={[styles.ctaButton, idx === 0 ? { backgroundColor: tone.buttonBg } : undefined]}
                >
                  <Text style={[styles.ctaText, idx === 0 ? { color: tone.buttonFg } : { color: palettes.secondaryText }]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

function getPalettes(colors: { [k: string]: string }) {
  const baseMuted = '#6B7280';
  return {
    mutedText: baseMuted,
    secondaryText: '#6B7280',
    warning: { bg: 'rgba(245, 158, 11, 0.16)', fg: '#F59E0B', border: 'rgba(245, 158, 11, 0.35)', buttonBg: '#F59E0B', buttonFg: '#fff' },
    success: { bg: 'rgba(16, 185, 129, 0.16)', fg: '#10B981', border: 'rgba(16, 185, 129, 0.35)', buttonBg: '#10B981', buttonFg: '#fff' },
    primary: { bg: 'rgba(79, 70, 229, 0.16)', fg: '#4F46E5', border: 'rgba(79, 70, 229, 0.35)', buttonBg: '#4F46E5', buttonFg: '#fff' },
    purple: { bg: 'rgba(147, 51, 234, 0.16)', fg: '#9333EA', border: 'rgba(147, 51, 234, 0.35)', buttonBg: '#9333EA', buttonFg: '#fff' },
    red: { bg: 'rgba(220, 38, 38, 0.16)', fg: '#DC2626', border: 'rgba(220, 38, 38, 0.35)', buttonBg: '#DC2626', buttonFg: '#fff' },
    indigo: { bg: 'rgba(99, 102, 241, 0.16)', fg: '#6366F1', border: 'rgba(99, 102, 241, 0.35)', buttonBg: '#6366F1', buttonFg: '#fff' },
    orange: { bg: 'rgba(234, 88, 12, 0.16)', fg: '#EA580C', border: 'rgba(234, 88, 12, 0.35)', buttonBg: '#EA580C', buttonFg: '#fff' },
  } as {
    mutedText: string;
    secondaryText: string;
    primary: { bg: string; fg: string; border: string; buttonBg: string; buttonFg: string };
    warning: { bg: string; fg: string; border: string; buttonBg: string; buttonFg: string };
    success: { bg: string; fg: string; border: string; buttonBg: string; buttonFg: string };
    purple: { bg: string; fg: string; border: string; buttonBg: string; buttonFg: string };
    red: { bg: string; fg: string; border: string; buttonBg: string; buttonFg: string };
    indigo: { bg: string; fg: string; border: string; buttonBg: string; buttonFg: string };
    orange: { bg: string; fg: string; border: string; buttonBg: string; buttonFg: string };
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  centerWrap: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  badgePill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgePillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    position: 'relative',
    width: '100%',
    maxWidth: 900,
    marginBottom: 12,
  },
  dotNew: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  } as any,
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  } as any,
  ctaButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NotificationsScreen;
