import React from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import MainHeader from '../../components/MainHeader';
import LessonQuizContent from './components/LessonQuizContent';

type ParamList = { 
  LessonQuiz: { 
    currentLessonId?: number; 
    nextLessonId?: number; 
  } 
};

const LessonQuizScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<ParamList, 'LessonQuiz'>>();
  const currentLessonId = route.params?.currentLessonId ?? 0;
  const nextLessonId = route.params?.nextLessonId ?? currentLessonId + 1;

  const handleCompleteQuiz = () => {
    // Navigate back to lesson detail or to next lesson
    navigation.navigate('LessonDetail', { lessonId: String(nextLessonId) });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} stickyHeaderIndices={[0]}>
        <MainHeader 
          title="Lesson Quiz" 
          iconName="help-circle" 
          showBackButton 
          onBackPress={() => navigation.goBack()} 
        />
        <View style={styles.container}>
          <LessonQuizContent
            questionIndex={1}
            totalQuestions={5}
            onNextQuestion={() => {}}
            onCompleteQuiz={handleCompleteQuiz}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default LessonQuizScreen;


