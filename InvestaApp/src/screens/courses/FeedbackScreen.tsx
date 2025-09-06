import React from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '../../components/MainHeader';
import FeedbackContent from './components/FeedbackContent';
import { useTranslation } from '../../language';

const FeedbackScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  // Debug log to verify language is working
  console.log('FeedbackScreen - Selected Language:', t.language);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} stickyHeaderIndices={[0]}>
        <MainHeader title={t.courseFeedback || 'Course Feedback'} iconName="chatbubbles" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <FeedbackContent />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
});

export default FeedbackScreen;


