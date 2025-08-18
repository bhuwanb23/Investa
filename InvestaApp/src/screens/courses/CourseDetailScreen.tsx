import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4f46e5';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';
const CARD_BG = '#ffffff';
const PAGE_BG = '#f9fafb';

const CourseDetailScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}> 
      <View style={styles.container}> 
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerWrapper}>
            <ImageBackground
              source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/1c801c095c-b026bbaae17a99cc663d.png' }}
              resizeMode="cover"
              style={styles.headerImage}
            >
              <View style={styles.headerOverlay} />
              <View style={styles.headerTopRow}>
                <Pressable style={styles.roundIconButton} android_ripple={{ color: 'rgba(255,255,255,0.2)' }}>
                  <Ionicons name="arrow-back" size={20} color="#fff" />
                </Pressable>
                <Pressable style={styles.roundIconButton} android_ripple={{ color: 'rgba(255,255,255,0.2)' }}>
                  <Ionicons name="bookmark-outline" size={20} color="#fff" />
                </Pressable>
              </View>

              <View style={styles.headerBottomArea}>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: PRIMARY }]}>
                    <Text style={styles.badgeText}>Beginner</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#22c55e' }]}>
                    <Text style={styles.badgeText}>Certificate</Text>
                  </View>
                </View>
                <Text style={styles.headerTitle}>Complete JavaScript Mastery</Text>
                <Text style={styles.headerSubtitle}>From Zero to Full-Stack Developer</Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statsGridItem}>
              <Text style={styles.statsValue}>4.8</Text>
              <Text style={styles.statsLabel}>Rating</Text>
              <View style={styles.starsRow}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Ionicons key={idx} name="star" size={12} color="#facc15" style={{ marginRight: 2 }} />
                ))}
              </View>
            </View>
            <View style={styles.statsGridItem}>
              <Text style={styles.statsValue}>12h</Text>
              <Text style={styles.statsLabel}>Duration</Text>
            </View>
            <View style={styles.statsGridItem}>
              <Text style={styles.statsValue}>2.3k</Text>
              <Text style={styles.statsLabel}>Students</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.instructorRow}>
              <Image
                source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg' }}
                style={styles.instructorAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.instructorName}>Sarah Johnson</Text>
                <Text style={styles.instructorTitle}>Senior Full-Stack Developer</Text>
                <View style={styles.inlineRow}>
                  <Ionicons name="star" size={12} color="#facc15" />
                  <Text style={styles.inlineMetaText}>4.9 • 15k students</Text>
                </View>
              </View>
              <Pressable style={styles.linkButton} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkButtonText}>Follow</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What you'll learn</Text>
            <View style={styles.bulletList}>
              {[
                'Master JavaScript fundamentals and ES6+ features',
                'Build interactive web applications from scratch',
                'Understand DOM manipulation and event handling',
                'Deploy projects to production environments',
              ].map((text, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" style={{ marginTop: 2 }} />
                  <Text style={styles.bulletText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Course Content</Text>
              <Text style={styles.subtitleMuted}>8 sections • 45 lectures</Text>
            </View>

            {[
              { title: 'Introduction to JavaScript', meta: '6 lectures • 45 min' },
              { title: 'Variables and Data Types', meta: '5 lectures • 38 min' },
              { title: 'Functions and Scope', meta: '7 lectures • 52 min' },
            ].map((item, idx) => (
              <View key={idx} style={styles.listCard}>
                <Pressable style={styles.listCardPressable} android_ripple={{ color: '#f3f4f6' }}>
                  <View>
                    <Text style={styles.listCardTitle}>{item.title}</Text>
                    <Text style={styles.listCardMeta}>{item.meta}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color="#9ca3af" />
                </Pressable>
              </View>
            ))}

            <Pressable style={styles.showAllButton} android_ripple={{ color: '#e5e7eb' }}>
              <Text style={styles.linkText}>Show all sections</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview Lesson</Text>
            <View style={styles.previewCard}>
              <ImageBackground
                source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/bad04d7dd9-c8347d58916f3c96b688.png' }}
                style={styles.previewImage}
                imageStyle={{ borderRadius: 12 }}
              >
                <View style={styles.previewOverlay} />
                <Pressable style={styles.playButton} android_ripple={{ color: 'rgba(0,0,0,0.06)' }}>
                  <Ionicons name="play" size={22} color="#111827" />
                </Pressable>
                <View style={styles.previewCaptionLeft}>
                  <Text style={styles.previewCaptionText}>Setting up your development environment</Text>
                </View>
                <View style={styles.previewCaptionRight}>
                  <Text style={styles.previewDuration}>5:32</Text>
                </View>
              </ImageBackground>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prerequisites</Text>
            <View style={[styles.infoCard, { borderColor: '#bfdbfe', backgroundColor: '#eff6ff' }]}>
              <View style={styles.inlineRow}>
                <Ionicons name="information-circle" size={18} color={PRIMARY} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoPrimary]}>No prior programming experience required</Text>
                  <Text style={[styles.infoSecondary]}>Basic computer skills and internet access</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Pressable android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkText}>See all</Text>
              </Pressable>
            </View>

            {[
              {
                name: 'Emma Wilson',
                avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
                when: '2 days ago',
                text: 'Excellent course! The explanations are clear and the projects are really helpful for understanding concepts.',
              },
              {
                name: 'Alex Chen',
                avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
                when: '1 week ago',
                text: "Perfect for beginners. Sarah's teaching style is engaging and easy to follow.",
              },
            ].map((review, idx) => (
              <View key={idx} style={styles.reviewItem}>
                <View style={styles.reviewHeaderRow}>
                  <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.reviewNameRow}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <View style={styles.starsRow}>
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Ionicons key={starIdx} name="star" size={12} color="#facc15" style={{ marginRight: 2 }} />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewWhen}>{review.when}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footerBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.priceText}>$79</Text>
            <Text style={styles.compareAtText}>$199</Text>
          </View>
          <Pressable style={styles.primaryButton} android_ripple={{ color: '#4338ca' }}>
            <Text style={styles.primaryButtonText}>Enroll Now</Text>
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
  scrollContent: {
    paddingBottom: 96,
  },
  headerWrapper: {
    height: 240,
    marginBottom: 12,
    backgroundColor: '#000',
  },
  headerImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  headerTopRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundIconButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  headerTitle: {
    marginTop: 6,
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  statsCard: {
    backgroundColor: CARD_BG,
    marginHorizontal: 16,
    marginTop: -24,
    borderRadius: 16,
    elevation: 4,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsGridItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsValue: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  statsLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorAvatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  instructorName: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  instructorTitle: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  inlineMetaText: {
    marginLeft: 6,
    fontSize: 11,
    color: '#6b7280',
  },
  linkButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  linkButtonText: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  subtitleMuted: {
    fontSize: 12,
    color: '#6b7280',
  },
  bulletList: {
    gap: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletText: {
    marginLeft: 10,
    color: '#374151',
    fontSize: 13,
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  listCardPressable: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  listCardMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
  showAllButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  linkText: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: '600',
  },
  previewCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
  },
  playButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  previewCaptionLeft: {
    position: 'absolute',
    left: 12,
    bottom: 8,
    right: 68,
  },
  previewCaptionText: {
    color: '#fff',
    fontSize: 12,
  },
  previewCaptionRight: {
    position: 'absolute',
    right: 12,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewDuration: {
    color: '#fff',
    fontSize: 11,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#eff6ff',
  },
  infoPrimary: {
    color: '#1e3a8a',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSecondary: {
    color: '#2563eb',
    fontSize: 12,
    marginTop: 2,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 12,
    marginBottom: 12,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewAvatar: {
    height: 28,
    width: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewName: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  reviewWhen: {
    fontSize: 11,
    color: '#9ca3af',
  },
  reviewText: {
    fontSize: 13,
    color: '#374151',
  },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_DARK,
    lineHeight: 20,
  },
  compareAtText: {
    fontSize: 12,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  primaryButton: {
    marginLeft: 12,
    flex: 1,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CourseDetailScreen;
