import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CARD_BG, BORDER, TEXT_DARK, TEXT_MUTED, PRIMARY } from '../constants/courseConstants';

type DownloadStatus = 'Completed' | 'In Progress';
type DownloadItem = {
  id: string;
  kind: 'video' | 'text' | 'infographic';
  title: string;
  subtitle: string;
  size: string;
  downloadedAgo: string;
  status: DownloadStatus;
};

const DownloadsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Completed' | 'In Progress'>('All');
  const [items, setItems] = useState<DownloadItem[]>([ 
    { id: '1', kind: 'video', title: 'Introduction to React Hooks', subtitle: 'React Fundamentals • Chapter 3', size: '245 MB', downloadedAgo: '2h ago', status: 'Completed' },
    { id: '2', kind: 'text', title: 'CSS Grid Layout Guide', subtitle: 'CSS Mastery • Chapter 8', size: '12 MB', downloadedAgo: '1d ago', status: 'In Progress' },
    { id: '3', kind: 'infographic', title: 'JavaScript Performance Tips', subtitle: 'JavaScript Advanced • Infographic', size: '8 MB', downloadedAgo: '3d ago', status: 'Completed' },
    { id: '4', kind: 'video', title: 'Node.js Authentication', subtitle: 'Backend Development • Chapter 12', size: '389 MB', downloadedAgo: '5d ago', status: 'In Progress' },
    { id: '5', kind: 'text', title: 'Database Design Principles', subtitle: 'Database Fundamentals • Chapter 2', size: '18 MB', downloadedAgo: '1w ago', status: 'Completed' },
  ]);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return items;
    return items.filter(i => i.status === activeTab);
  }, [items, activeTab]);

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const removeAll = () => setItems([]);

  const iconForKind = (kind: DownloadItem['kind']) => {
    switch (kind) {
      case 'video':
        return { name: 'play', bg: '#FEE2E2', color: '#EF4444' } as const;
      case 'text':
        return { name: 'document-text-outline', bg: '#DBEAFE', color: '#2563EB' } as const;
      case 'infographic':
        return { name: 'bar-chart-outline', bg: '#EDE9FE', color: '#9333EA' } as const;
      default:
        return { name: 'document-outline', bg: '#F3F4F6', color: '#6B7280' } as const;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Storage Usage */}
      <View style={styles.card}> 
        <View style={styles.rowBetween}>
          <View style={styles.rowCenter}> 
            <Ionicons name="server-outline" size={18} color={PRIMARY} />
            <Text style={styles.cardTitle}>Storage Usage</Text>
          </View>
          <Text style={styles.cardHint}>2.4 GB / 16 GB</Text>
        </View>
        <View style={styles.track}><View style={styles.fill} /></View>
        <Text style={styles.mutedXs}>13.6 GB available</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsWrap}>
        {(['All','Completed','In Progress'] as const).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filtered.map(item => {
          const icon = iconForKind(item.kind);
          const statusColor = item.status === 'Completed' ? '#16A34A' : '#EA580C';
          const statusBg = item.status === 'Completed' ? '#DCFCE7' : '#FFEDD5';
          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemRow}>
                <View style={[styles.itemIcon, { backgroundColor: icon.bg }]}> 
                  <Ionicons name={icon.name as any} size={18} color={icon.color} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={[styles.statusPill, { backgroundColor: statusBg }]}> 
                      <View style={[styles.dot, { backgroundColor: statusColor }]} />
                      <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.metaText}>{item.size} • Downloaded {item.downloadedAgo}</Text>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '700' }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={removeAll}>
          <Ionicons name="trash-outline" size={16} color="#374151" />
          <Text style={styles.secondaryText}>Remove All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn}>
          <Ionicons name="download-outline" size={16} color="#FFFFFF" />
          <Text style={styles.primaryText}>Download More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 as any },
  cardTitle: { marginLeft: 8, fontSize: 13, fontWeight: '700', color: TEXT_DARK },
  cardHint: { fontSize: 11, color: TEXT_MUTED },
  track: { marginTop: 8, height: 8, backgroundColor: '#E5E7EB', borderRadius: 999 },
  fill: { height: '100%', width: '15%', backgroundColor: PRIMARY, borderRadius: 999 },
  mutedXs: { marginTop: 8, fontSize: 11, color: TEXT_MUTED },

  tabsWrap: { marginHorizontal: 16, marginTop: 16, backgroundColor: '#F3F4F6', borderRadius: 10, padding: 4, flexDirection: 'row' },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: PRIMARY },
  tabText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#FFFFFF' },

  itemCard: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 as any },
  itemIcon: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 14, fontWeight: '700', color: TEXT_DARK },
  itemSubtitle: { marginTop: 2, fontSize: 12, color: TEXT_MUTED },
  metaText: { marginTop: 6, fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, gap: 6 as any },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '800' },

  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: BORDER, padding: 16, flexDirection: 'row', gap: 12 as any },
  secondaryBtn: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 as any },
  secondaryText: { color: '#374151', fontWeight: '700', fontSize: 13 },
  primaryBtn: { flex: 1, backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 as any },
  primaryText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
});

export default DownloadsContent;


