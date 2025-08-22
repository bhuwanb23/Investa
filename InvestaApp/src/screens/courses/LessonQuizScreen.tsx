import React from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import MainHeader from '../../components/MainHeader';
import LessonQuizContent from './components/LessonQuizContent';

type ParamList = { LessonQuiz: undefined } & { LessonQuizParams?: { currentLessonId?: number; nextLessonId?: number } };

const LessonQuizScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<any>();
  const currentLessonId = route.params?.currentLessonId ?? 0;
  const nextLessonId = route.params?.nextLessonId ?? currentLessonId + 1;
  const totalQuestions = 5;
  const [currentQuestion, setCurrentQuestion] = React.useState<number>(1);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} stickyHeaderIndices={[0]}>
        <MainHeader title="Lesson Quiz" iconName="help-circle" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <LessonQuizContent
            questionIndex={currentQuestion}
            totalQuestions={totalQuestions}
            onNextQuestion={() => setCurrentQuestion(q => Math.min(totalQuestions, q + 1))}
            onCompleteQuiz={() => navigation.navigate('LessonDetail', { lessonId: String(nextLessonId) })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
});

export default LessonQuizScreen;


