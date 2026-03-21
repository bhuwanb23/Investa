import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SectionList, Platform, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import MainHeader from '../../components/MainHeader';
import LogoLoader from '../../components/LogoLoader';
import { useNotifications } from '../../hooks/useNotifications';
import { Notification } from '../../services/notificationsApi';

type NotificationItem = {
  id: string;
  realId: number;
  title: string;
  description: string;
  timeAgo: string;
  tone: 'primary' | 'warning' | 'success' | 'purple' | 'red' | 'indigo' | 'orange';
  icon: keyof typeof Ionicons.glyphMap;
  cta?: { label: string; onPress?: () => void }[];
  isNew?: boolean;
};

const NotificationsScreen: React.FC = () => {
  const { notifications, fetchNotifications, markAsRead, isLoading } = useNotifications();
  const [bootLoader, setBootLoader] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBootLoader(false), 800);
    fetchNotifications();
    return () => clearTimeout(t);
  }, []);

  const { colors } = useTheme();

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const getTone = (type: string): NotificationItem['tone'] => {
    switch(type) {
      case 'trading': return 'primary';
      case 'learning': return 'indigo';
      case 'achievement': return 'purple';
      case 'security': return 'red';
      default: return 'orange';
    }
  };

  const getIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch(type) {
      case 'trading': return 'trending-up-outline';
      case 'learning': return 'school-outline';
      case 'achievement': return 'trophy-outline';
      case 'security': return 'shield-checkmark-outline';
      default: return 'notifications-outline';
    }
  };

  const mappedNotifications = useMemo(() => {
    return notifications.map(n => ({
      id: `notif-${n.id}`,
      realId: n.id,
      title: n.title,
      description: n.message,
      timeAgo: getTimeAgo(n.created_at),
      tone: getTone(n.notification_type),
      icon: getIcon(n.notification_type),
      isNew: !n.read,
      cta: n.read ? [] : [{ label: 'Mark as read' }]
    } as NotificationItem));
  }, [notifications]);

  const sections = useMemo(() => {
    const today: NotificationItem[] = [];
    const thisWeek: NotificationItem[] = [];
    const earlier: NotificationItem[] = [];

    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    notifications.forEach((n, index) => {
      const item = mappedNotifications[index];
      const nDate = new Date(n.created_at);
      
      if (nDate >= todayDate) {
        today.push(item);
      } else if (nDate >= weekAgo) {
        thisWeek.push(item);
      } else {
        earlier.push(item);
      }
    });

    const result = [];
    if (today.length > 0) result.push({ key: 'today', title: 'Today', data: today, badge: `${today.filter(n => n.isNew).length} new`, onDismiss: markAsRead });
    if (thisWeek.length > 0) result.push({ key: 'week', title: 'This Week', data: thisWeek, onDismiss: markAsRead });
    if (earlier.length > 0) result.push({ key: 'earlier', title: 'Earlier', data: earlier, onDismiss: markAsRead });
    
    return result;
  }, [notifications, mappedNotifications, markAsRead]);

  const totalCount = notifications.length;

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
      {notifications.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color={colors.text} style={{ opacity: 0.2 }} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No notifications yet</Text>
        </View>
      ) : (
        <SectionList
          sections={sections as any}
          keyExtractor={(item: NotificationItem) => item.id}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchNotifications} />
          }
          renderItem={({ item, section }: { item: NotificationItem; section: any }) => (
            <View style={styles.centerWrap}>
              <Card item={item} onDismiss={() => section.onDismiss(item.realId)} palettes={getPalettes(colors)} />
            </View>
          )}
          renderSectionHeader={({ section }: { section: any }) => (
            <View style={styles.centerWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: getPalettes(colors).mutedText }]}>{section.title}</Text>
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
      )}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
});

export default NotificationsScreen;
