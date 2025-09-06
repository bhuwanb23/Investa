import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '../../components/MainHeader';
import { Ionicons } from '@expo/vector-icons';
import { PAGE_BG, CARD_BG, TEXT_DARK, TEXT_MUTED, BORDER, PRIMARY } from './constants/courseConstants';
import ProgressDonut from './components/ProgressDonut';
import MotivationalBanner from './components/MotivationalBanner';
import StatCard from './components/StatCard';
import BadgesRow from './components/BadgesRow';
import RecentActivityItem from './components/RecentActivityItem';
import { useTranslation } from '../../language';

const ModuleProgressScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} stickyHeaderIndices={[0]}>
        <MainHeader title={t.moduleProgress || 'Module Progress'} iconName="analytics" showBackButton onBackPress={() => navigation.goBack()} />
        {/* Overview Card */}
        <View style={styles.card}> 
          <View style={styles.center}> 
            <ProgressDonut percent={70} label="" />
          </View>
          <Text style={styles.moduleTitle}>JavaScript Fundamentals</Text>
          <Text style={styles.moduleSub}>7 of 10 lessons completed</Text>

          <View style={{ marginTop: 12 }}>
            <MotivationalBanner text="You're doing great! Just 3 more lessons to complete this module." />
          </View>
        </View>

        {/* Stats */}
        <View style={{ gap: 12 }}>
          <StatCard
            icon="book"
            iconColor="#2563EB"
            iconBg="#DBEAFE"
            title="Lessons"
            subtitle="7 of 10 completed"
            right={
              <View style={{ alignItems: 'flex-end' }}>
                <View style={styles.smallTrack}><View style={[styles.smallFill, { width: '70%' }]} /></View>
                <Text style={styles.percentText}>70%</Text>
              </View>
            }
          />

          <StatCard
            icon="clipboard"
            iconColor="#16A34A"
            iconBg="#D1FAE5"
            title="Quizzes"
            subtitle="5 attempted"
            right={<View><Text style={styles.quizScore}>85%</Text><Text style={styles.quizSub}>Avg Score</Text></View>}
          />

          <View style={styles.card}> 
            <View style={styles.rowBetween}> 
              <View>
                <Text style={styles.sectionTitle}>Badges Earned</Text>
                <Text style={styles.sectionSub}>3 achievements</Text>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <BadgesRow badges={[
                { icon: 'star', from: '#F59E0B', to: '#F97316', label: 'First Quiz' },
                { icon: 'flame', from: '#60A5FA', to: '#2563EB', label: '5 Day Streak' },
                { icon: 'flash', from: '#C084FC', to: '#9333EA', label: 'Speed Learner' },
              ]} />
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={{ marginTop: 12 }}>
            <RecentActivityItem icon="checkmark" iconColor="#16A34A" iconBg="#DCFCE7" title="Completed: Functions & Scope" subtitle="2 hours ago" />
            <RecentActivityItem icon="star" iconColor="#2563EB" iconBg="#DBEAFE" title="Quiz Score: 92%" subtitle="Yesterday" />
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaBtn}>
          <Ionicons name="play" size={16} color="#fff" />
          <Text style={styles.ctaText}>Continue Learning</Text>
        </TouchableOpacity>
        <Text style={styles.nextLabel}>Next: Arrays & Objects</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PAGE_BG },
  header: { backgroundColor: CARD_BG, borderBottomWidth: 1, borderBottomColor: BORDER, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  iconBtn: { padding: 8 },
  scroll: { padding: 16, paddingBottom: 28, gap: 14 },
  card: { backgroundColor: CARD_BG, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  center: { alignItems: 'center', justifyContent: 'center' },
  moduleTitle: { textAlign: 'center', fontWeight: '800', color: TEXT_DARK, fontSize: 18, marginTop: 8 },
  moduleSub: { textAlign: 'center', color: TEXT_MUTED, marginTop: 4 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  smallTrack: { width: 64, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginTop: 4 },
  smallFill: { height: '100%', backgroundColor: PRIMARY, borderRadius: 3 },
  percentText: { fontSize: 12, color: TEXT_DARK, fontWeight: '700', marginTop: 4 },
  quizScore: { fontSize: 18, color: '#16A34A', fontWeight: '800', textAlign: 'right' },
  quizSub: { fontSize: 10, color: TEXT_MUTED, textAlign: 'right' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: TEXT_DARK },
  sectionSub: { fontSize: 12, color: TEXT_MUTED },
  ctaBtn: { backgroundColor: PRIMARY, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingVertical: 14, gap: 8 },
  ctaText: { color: '#fff', fontWeight: '800' },
  nextLabel: { textAlign: 'center', color: TEXT_MUTED, fontSize: 12 },
});

export default ModuleProgressScreen;


