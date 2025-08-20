import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DetailHeader from './components/DetailHeader';
import LessonQuizContent from './components/LessonQuizContent';

const LessonQuizScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <DetailHeader title="Lesson Quiz" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1 }}>
        <LessonQuizContent />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
});

export default LessonQuizScreen;


