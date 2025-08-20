import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DetailHeader from './components/DetailHeader';
import FeedbackContent from './components/FeedbackContent';

const FeedbackScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <DetailHeader title="Course Feedback" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1 }}>
        <FeedbackContent />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
});

export default FeedbackScreen;


