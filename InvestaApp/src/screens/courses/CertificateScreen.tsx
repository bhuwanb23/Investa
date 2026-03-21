import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PAGE_BG, TEXT_DARK, TEXT_MUTED, PRIMARY, CARD_BG } from './constants/courseConstants';
import CertificateCard from './components/CertificateCard';
import SocialShareBar from './components/SocialShareBar';
import CertificateConfetti from './components/CertificateConfetti';
import { useTranslation } from '../../language';
import api from '../../services/api';
import { MainStackParamList } from '../../navigation/AppNavigator';

type CertificateScreenRouteProp = RouteProp<MainStackParamList, 'Certificate'>;

const CertificateScreen: React.FC = () => {
	const navigation = useNavigation();
	const route = useRoute<CertificateScreenRouteProp>();
	const { courseId } = route.params;
	const { t } = useTranslation();
	
	const [loading, setLoading] = useState(true);
	const [certData, setCertData] = useState<any>(null);
	
	useEffect(() => {
		const fetchCertificate = async () => {
			try {
				setLoading(true);
				const response = await api.get(`/courses/${courseId}/certificate/`);
				setCertData(response.data);
			} catch (error: any) {
				console.error('Error fetching certificate:', error);
				Alert.alert(
					'Not Eligible',
					error.response?.data?.detail || 'You haven\'t completed all lessons in this course yet.',
					[{ text: 'OK', onPress: () => navigation.goBack() }]
				);
			} finally {
				setLoading(false);
			}
		};
		fetchCertificate();
	}, [courseId]);

	const handleShare = async () => {
		try {
			await Share.share({
				message: `I just completed the "${certData?.course_title}" course on Investa! My certificate ID is ${certData?.certificate_id}`,
			});
		} catch (error) {
			Alert.alert('Error', 'Failed to share achievement');
		}
	};

	if (loading) {
		return (
			<View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator size="large" color="#7C3AED" />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.safe}>
			<CertificateConfetti />
			<ScrollView contentContainerStyle={styles.scroll}>
				{/* Header */}
				<View style={styles.headerRow}>
					<TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={18} color="#fff" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
						<Ionicons name="share-social" size={18} color="#fff" />
					</TouchableOpacity>
				</View>

				<View style={{ alignItems: 'center', marginTop: 24, marginBottom: 16, marginHorizontal: 12 }}>
					<View style={styles.trophyCircle}>
						<Ionicons name="trophy" size={36} color="#fff" />
						<View style={styles.checkBadge}>
							<Ionicons name="checkmark" size={16} color="#fff" />
						</View>
					</View>
					<Text style={styles.congrats}>{t.congratulations}</Text>
					<Text style={styles.subtitle}>{t.youHaveCompleted}</Text>
				</View>

				<View style={{ marginHorizontal: 12, marginBottom: 20 }}>
					<CertificateCard
						userName={certData?.user_name || 'Student'}
						courseTitle={certData?.course_title || 'Course'}
						completedOn={certData?.completed_at ? new Date(certData.completed_at).toLocaleDateString() : 'Today'}
					/>
				</View>

				<View style={[styles.actions, { marginHorizontal: 12 }]}>
					<TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Downloads' as never)}>
						<Ionicons name="download" size={18} color="#fff" />
						<Text style={styles.primaryBtnText}>{t.downloadCertificate}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
						<Ionicons name="share" size={18} color="#7C3AED" />
						<Text style={styles.secondaryBtnText}>{t.shareAchievement || 'Share Achievement'}</Text>
					</TouchableOpacity>
				</View>

				<View style={{ marginHorizontal: 12 }}>
					<SocialShareBar onPress={handleShare} />
				</View>

				<View style={[styles.nextCard, { marginHorizontal: 12 }]}>
					<View style={styles.nextIconBox}>
						<Ionicons name="rocket" size={18} color="#fff" />
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.nextTitle}>{t.keepLearning || 'Keep Learning!'}</Text>
						<Text style={styles.nextMuted}>{t.nextRecommendedModule || 'Next Recommended Module:'}</Text>
						<Text style={styles.nextCourse}>Financial Market Analysis</Text>
						<TouchableOpacity style={styles.nextCta} onPress={() => navigation.navigate('Courses' as never)}>
							<Text style={styles.nextCtaText}>{t.startNextModule || 'Start Next Module'}</Text>
							<Ionicons name="arrow-forward" size={14} color="#fff" />
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: '#111827' },
	scroll: { paddingBottom: 24 },
	headerRow: { position: 'absolute', top: 16, left: 16, right: 16, zIndex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	iconBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 999 },
	trophyCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#F59E0B', 
    alignItems: 'center', 
    justifyContent: 'center', 
    alignSelf: 'center' 
  },
  checkBadge: { 
    position: 'absolute', 
    right: -2, 
    top: -2, 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: '#10B981', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  congrats: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '800', 
    textAlign: 'center', 
    marginTop: 12 
  },
  subtitle: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 14, 
    textAlign: 'center', 
    marginTop: 4 
  },
	actions: { 
    paddingHorizontal: 12, 
    gap: 10, 
    marginBottom: 16 
  },
  primaryBtn: { 
    backgroundColor: '#7C3AED', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 6, 
    paddingVertical: 12, 
    borderRadius: 12,
    minHeight: 48,
  },
  primaryBtnText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryBtn: { 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 6, 
    paddingVertical: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E9D5FF',
    minHeight: 48,
  },
  secondaryBtnText: { 
    color: '#7C3AED', 
    fontWeight: '700',
    fontSize: 14,
  },
	nextCard: { marginHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 16 },
	nextIconBox: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
	nextTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 4 },
	nextMuted: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 6 },
	nextCourse: { color: '#fff', fontWeight: '600', marginBottom: 10 },
	nextCta: { alignSelf: 'flex-start', backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
	nextCtaText: { color: '#fff', fontWeight: '700' },
});

export default CertificateScreen;


