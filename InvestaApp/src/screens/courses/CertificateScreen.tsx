import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PAGE_BG, TEXT_DARK, TEXT_MUTED, PRIMARY, CARD_BG } from './constants/courseConstants';
import CertificateCard from './components/CertificateCard';
import SocialShareBar from './components/SocialShareBar';
import CertificateConfetti from './components/CertificateConfetti';

const CertificateScreen: React.FC = () => {
	const navigation = useNavigation();

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.gradientTop} />
			<CertificateConfetti />
			<ScrollView contentContainerStyle={styles.scroll}>
				{/* Header */}
				<View style={styles.headerRow}>
					<TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={18} color="#fff" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconBtn}>
						<Ionicons name="share-social" size={18} color="#fff" />
					</TouchableOpacity>
				</View>

				<View style={{ alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
					<View style={styles.trophyCircle}>
						<Ionicons name="trophy" size={36} color="#fff" />
						<View style={styles.checkBadge}>
							<Ionicons name="checkmark" size={16} color="#fff" />
						</View>
					</View>
					<Text style={styles.congrats}>Congratulations!</Text>
					<Text style={styles.subtitle}>You've successfully completed</Text>
				</View>

				<View style={{ marginHorizontal: 16, marginBottom: 20 }}>
					<CertificateCard
						userName="Sarah Johnson"
						courseTitle="Advanced React Development"
						completedOn="January 15, 2024"
					/>
				</View>

				<View style={styles.actions}>
					<TouchableOpacity style={styles.primaryBtn}>
						<Ionicons name="download" size={18} color="#fff" />
						<Text style={styles.primaryBtnText}>Download Certificate</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.secondaryBtn}>
						<Ionicons name="share" size={18} color="#7C3AED" />
						<Text style={styles.secondaryBtnText}>Share Achievement</Text>
					</TouchableOpacity>
				</View>

				<SocialShareBar onPress={() => {}} />

				<View style={styles.nextCard}>
					<View style={styles.nextIconBox}>
						<Ionicons name="rocket" size={18} color="#fff" />
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.nextTitle}>Keep Learning!</Text>
						<Text style={styles.nextMuted}>Next Recommended Module:</Text>
						<Text style={styles.nextCourse}>Node.js Backend Development</Text>
						<TouchableOpacity style={styles.nextCta}>
							<Text style={styles.nextCtaText}>Start Next Module</Text>
							<Ionicons name="arrow-forward" size={14} color="#fff" />
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.bottomNav}>
					<TouchableOpacity style={styles.navItem}>
						<Ionicons name="home" size={18} color="rgba(255,255,255,0.6)" />
						<Text style={styles.navTextDim}>Home</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.navItem}>
						<Ionicons name="book" size={18} color="rgba(255,255,255,0.6)" />
						<Text style={styles.navTextDim}>Courses</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.navItem}>
						<Ionicons name="trophy" size={18} color="#FACC15" />
						<Text style={styles.navTextBright}>Progress</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.navItem}>
						<Ionicons name="person" size={18} color="rgba(255,255,255,0.6)" />
						<Text style={styles.navTextDim}>Profile</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: '#111827' },
	scroll: { paddingBottom: 24 },
	gradientTop: { height: 200, backgroundColor: '#4F46E5' },
	headerRow: { position: 'absolute', top: 16, left: 16, right: 16, zIndex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	iconBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 999 },
	trophyCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
	checkBadge: { position: 'absolute', right: -2, top: -2, width: 28, height: 28, borderRadius: 14, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
	congrats: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 12 },
	subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, textAlign: 'center', marginTop: 4 },
	actions: { paddingHorizontal: 16, gap: 12, marginBottom: 16 },
	primaryBtn: { backgroundColor: '#7C3AED', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
	primaryBtnText: { color: '#fff', fontWeight: '700' },
	secondaryBtn: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E9D5FF' },
	secondaryBtnText: { color: '#7C3AED', fontWeight: '700' },
	nextCard: { marginHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 16 },
	nextIconBox: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
	nextTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 4 },
	nextMuted: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 6 },
	nextCourse: { color: '#fff', fontWeight: '600', marginBottom: 10 },
	nextCta: { alignSelf: 'flex-start', backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
	nextCtaText: { color: '#fff', fontWeight: '700' },
	bottomNav: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28 },
	navItem: { alignItems: 'center', gap: 4 },
	navTextDim: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
	navTextBright: { color: '#FACC15', fontSize: 12, fontWeight: '600' },
});

export default CertificateScreen;


