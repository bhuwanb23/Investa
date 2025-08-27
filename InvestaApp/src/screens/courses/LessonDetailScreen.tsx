import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import MainHeader from '../../components/MainHeader';
import { Ionicons } from '@expo/vector-icons';
import { PAGE_BG, TEXT_DARK, TEXT_MUTED, BORDER, CARD_BG, PRIMARY, VIDEO_DATA } from './constants/courseConstants';
import { fetchLessonDetail, markLessonCompleted } from './utils/coursesApi';

// Local-first lesson detail with backend when available
type Language = { id: number; code: string; name: string; native_name: string };
type Course = { id: number; title: string; description: string; language: Language; difficulty_level: 'beginner'|'intermediate'|'advanced'; estimated_duration: number };
type LessonDetail = { id: number; title: string; order: number; estimated_duration: number; content?: string; video_url?: string | null; course: Course };

type ParamList = {
  LessonDetail: { lessonId: string; courseId?: string };
};

const { width } = Dimensions.get('window');

const LessonDetailScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<ParamList, 'LessonDetail'>>();
  const lessonId = Number(route.params?.lessonId);
  const courseId = route.params?.courseId;
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showAskMeModal, setShowAskMeModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      if (Number.isFinite(lessonId) && lessonId > 0) {
        const data = await fetchLessonDetail(lessonId);
        setLesson({
          id: data.id,
          title: data.title,
          order: data.order,
          estimated_duration: data.estimated_duration,
          content: data.content,
          video_url: data.video_url || undefined,
          course: data.course as any,
        });
      } else {
        setError('Lesson not found');
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkCompleted = async () => {
    try {
      setCompleting(true);
      await markLessonCompleted(lessonId);
      setCompleted(true);
      
      // Navigate back to lesson list with completion info
      setTimeout(() => {
        navigation.navigate('LessonList', { 
          completedLessonId: lessonId, 
          courseId: courseId,
          lessonCompleted: true // Add this flag to indicate completion
        });
      }, 300);
    } catch (e) {
      console.error('Error marking lesson as completed:', e);
      // Still reflect completion locally and navigate
      setCompleted(true);
      setTimeout(() => {
        navigation.navigate('LessonList', { 
          completedLessonId: lessonId, 
          courseId: courseId,
          lessonCompleted: true
        });
      }, 300);
    } finally {
      setCompleting(false);
    }
  };

  const handleAskQuestion = () => {
    if (!question.trim()) {
      Alert.alert('Please enter a question');
      return;
    }
    
    // Simulate AI response
    Alert.alert(
      'AI Assistant',
      `Here's an answer to your question: "${question}"\n\nThis is a sample AI response. In a real implementation, this would connect to an AI service to provide contextual answers based on the lesson content.`,
      [
        { text: 'Ask Another Question', onPress: () => setQuestion('') },
        { text: 'Close', style: 'cancel' }
      ]
    );
    setShowAskMeModal(false);
    setQuestion('');
  };

  const handleShare = () => {
    Alert.alert('Share', `Sharing lesson: ${lesson?.title}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderVideoPlayer = () => (
    <View style={styles.videoContainer}>
      <View style={styles.videoHeader}>
        <Text style={styles.videoTitle}>{VIDEO_DATA.title}</Text>
        <View style={styles.videoMeta}>
          <Ionicons name="time" size={14} color={TEXT_MUTED} />
          <Text style={styles.videoDuration}>{VIDEO_DATA.duration}</Text>
        </View>
      </View>
      
      <View style={styles.videoPlayer}>
        <View style={styles.videoPlaceholder}>
          <Ionicons name="play-circle" size={64} color={PRIMARY} />
          <Text style={styles.videoPlaceholderText}>Video Player</Text>
          <Text style={styles.videoDescription}>{VIDEO_DATA.description}</Text>
        </View>
        
        <View style={styles.videoControls}>
          <TouchableOpacity style={styles.controlButton} onPress={() => setShowCaptions(!showCaptions)}>
            <Ionicons name={showCaptions ? "eye" : "eye-outline"} size={20} color={TEXT_DARK} />
            <Text style={styles.controlText}>CC</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={() => setShowTranscript(!showTranscript)}>
            <Ionicons name="document-text" size={20} color={TEXT_DARK} />
            <Text style={styles.controlText}>Transcript</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={handleShare}>
            <Ionicons name="share" size={20} color={TEXT_DARK} />
            <Text style={styles.controlText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showCaptions && (
        <View style={styles.captionsContainer}>
          <Text style={styles.captionsTitle}>Captions</Text>
          <ScrollView style={styles.captionsList} showsVerticalScrollIndicator={false}>
            {VIDEO_DATA.captions.map((caption, index) => (
              <TouchableOpacity key={index} style={styles.captionItem}>
                <Text style={styles.captionTime}>{caption.time}</Text>
                <Text style={styles.captionText}>{caption.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {showTranscript && (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptTitle}>Full Transcript</Text>
          <ScrollView style={styles.transcriptList} showsVerticalScrollIndicator={false}>
            {VIDEO_DATA.transcript.map((item, index) => (
              <View key={index} style={styles.transcriptItem}>
                <Text style={styles.transcriptTime}>{item.time}</Text>
                <Text style={styles.transcriptText}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderAskMeSection = () => (
    <View style={styles.askMeContainer}>
      <View style={styles.askMeHeader}>
        <Ionicons name="chatbubble-ellipses" size={24} color={PRIMARY} />
        <Text style={styles.askMeTitle}>Ask Me Anything</Text>
      </View>
      <Text style={styles.askMeDescription}>
        Have questions about this lesson? Ask our AI assistant for help!
      </Text>
      <TouchableOpacity style={styles.askMeButton} onPress={() => setShowAskMeModal(true)}>
        <Ionicons name="help-circle" size={20} color="#FFFFFF" />
        <Text style={styles.askMeButtonText}>Ask a Question</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} stickyHeaderIndices={[0]}>
        <MainHeader title={lesson?.title || 'Lesson'} iconName="book" showBackButton onBackPress={() => navigation.goBack()} />
        
        {loading ? (
          <View style={styles.center}> 
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={styles.loadingText}>Loading lesson…</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={load}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : lesson ? (
          <View>
            {/* Video Section */}
            {renderVideoPlayer()}

            {/* Ask Me Section */}
            {renderAskMeSection()}

            {/* Content Section */}
            <View style={styles.contentCard}>
              <Text style={styles.contentText}>{lesson.content || 'No content available.'}</Text>
            </View>

            {/* Key Takeaways */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeading}>Key Takeaways</Text>
              <View style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Functions are reusable blocks of code that perform specific tasks</Text>
              </View>
              <View style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>They accept parameters (inputs) and can return values (outputs)</Text>
              </View>
              <View style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Functions make code more organized, readable, and maintainable</Text>
              </View>
            </View>

            {/* Example Snippet */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeading}>Example</Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeLine}>{`// Function definition`}</Text>
                <Text style={styles.codeLine}>{`function greet(name) {`}</Text>
                <Text style={styles.codeLine}>{`  return "Hello, " + name + "!";`}</Text>
                <Text style={styles.codeLine}>{`}`}</Text>
                <Text style={styles.codeLine}>{``}</Text>
                <Text style={styles.codeLine}>{`// Function call`}</Text>
                <Text style={styles.codeLine}>{`const message = greet("World");`}</Text>
                <Text style={styles.codeLine}>{`console.log(message); // "Hello, World!"`}</Text>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeading}>Your Progress</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFillStrong, { width: `${Math.min(100, (lesson.estimated_duration / 20) * 20)}%` }]} />
              </View>
              <Text style={styles.smallMuted}>Estimated {lesson.estimated_duration} minutes</Text>
            </View>

            {/* Quiz Section */}
            <View style={styles.quizSection}>
              <View style={styles.quizHeader}>
                <Ionicons name="help-circle" size={24} color="#10B981" />
                <Text style={styles.quizTitle}>Ready to Test Your Knowledge?</Text>
              </View>
              <Text style={styles.quizDescription}>
                Take a quick quiz to reinforce what you've learned in this lesson.
              </Text>
              <TouchableOpacity 
                style={styles.quizButton}
                onPress={() => (navigation as any).navigate('LessonQuiz', { lessonId: String(lessonId), courseId })}
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
                <Text style={styles.quizButtonText}>Start Quiz</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, completed && { backgroundColor: '#10B981' }]}
              onPress={() => {
                handleMarkCompleted();
              }}
              disabled={completing}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {completed ? 'Completed' : (completing ? 'Marking…' : 'Mark as Completed')}
              </Text>
            </TouchableOpacity>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={[styles.secondaryBtnOutline, { borderColor: '#E5E7EB' }]} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={14} color={TEXT_DARK} />
                <Text style={styles.secondaryBtnOutlineText}>Back to Lessons</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Ask Me Modal */}
      <Modal
        visible={showAskMeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAskMeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ask Me Anything</Text>
              <TouchableOpacity onPress={() => setShowAskMeModal(false)}>
                <Ionicons name="close" size={24} color={TEXT_DARK} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalDescription}>
              Ask any question about this lesson and get instant help from our AI assistant.
            </Text>
            
            <TextInput
              style={styles.questionInput}
              placeholder="Type your question here..."
              value={question}
              onChangeText={setQuestion}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowAskMeModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.askButton, !question.trim() && styles.askButtonDisabled]} 
                onPress={handleAskQuestion}
                disabled={!question.trim()}
              >
                <Ionicons name="send" size={16} color="#FFFFFF" />
                <Text style={styles.askButtonText}>Ask Question</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PAGE_BG },
  scroll: { paddingBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 10, color: TEXT_MUTED },
  errorText: { color: '#DC2626', marginBottom: 12 },
  retryBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: PRIMARY, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '700' },
  hero: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 16 },
  title: { color: TEXT_DARK, fontSize: 16, fontWeight: '900' },
  meta: { color: TEXT_MUTED, fontSize: 12, fontWeight: '700', marginTop: 6 },
  videoText: { color: TEXT_MUTED, marginTop: 6 },
  contentCard: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 16, marginHorizontal: 12 },
  contentText: { color: TEXT_DARK, fontSize: 14, lineHeight: 20 },
  primaryBtn: { 
    backgroundColor: PRIMARY, 
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginHorizontal: 12,
    minHeight: 48,
  },
  primaryBtnText: { 
    color: '#fff', 
    fontWeight: '800',
    fontSize: 14,
  },
  cardSection: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 16, marginHorizontal: 12 },
  sectionHeading: { color: TEXT_DARK, fontWeight: '800', marginBottom: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY, marginTop: 6, marginRight: 10 },
  bulletText: { color: TEXT_DARK, flex: 1 },
  codeBlock: { backgroundColor: '#0B1020', borderRadius: 10, padding: 12 },
  codeLine: { color: '#E5E7EB', fontFamily: 'monospace' as any, fontSize: 12 },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden', marginTop: 8 },
  progressFillStrong: { height: '100%', backgroundColor: PRIMARY, borderRadius: 999 },
  smallMuted: { color: TEXT_MUTED, fontSize: 12, marginTop: 6 },
  actionsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12, 
    marginHorizontal: 12,
    gap: 8,
  },
  secondaryBtnOutline: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    borderWidth: 1, 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  secondaryBtnOutlineText: { 
    color: TEXT_DARK, 
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: PRIMARY, 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  secondaryBtnText: { 
    color: '#fff', 
    fontWeight: '800',
    fontSize: 13,
  },
  videoContainer: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    marginHorizontal: 12,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  videoTitle: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '900',
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoDuration: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  videoPlayer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  videoPlaceholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  videoDescription: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  captionsContainer: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  captionsTitle: {
    color: TEXT_DARK,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  captionsList: {
    maxHeight: 150,
  },
  captionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  captionTime: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  captionText: {
    color: TEXT_DARK,
    fontSize: 12,
    fontWeight: '700',
  },
  transcriptContainer: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  transcriptTitle: {
    color: TEXT_DARK,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  transcriptList: {
    maxHeight: 150,
  },
  transcriptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  transcriptTime: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  transcriptText: {
    color: TEXT_DARK,
    fontSize: 12,
    fontWeight: '700',
  },
  askMeContainer: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    marginHorizontal: 12,
  },
  askMeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  askMeTitle: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
  },
  askMeDescription: {
    color: TEXT_MUTED,
    fontSize: 14,
    marginBottom: 16,
  },
  askMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    minHeight: 40,
  },
  askMeButtonText: {
    color: '#fff',
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 13,
  },
  quizSection: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    marginHorizontal: 12,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizTitle: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
  },
  quizDescription: {
    color: TEXT_MUTED,
    fontSize: 14,
    marginBottom: 16,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    minHeight: 40,
  },
  quizButtonText: {
    color: '#fff',
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  modalTitle: {
    color: TEXT_DARK,
    fontSize: 20,
    fontWeight: '900',
  },
  modalDescription: {
    color: TEXT_MUTED,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  questionInput: {
    width: '100%',
    height: 100,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  askButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  askButtonText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default LessonDetailScreen;


