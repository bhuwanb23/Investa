import React from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '../../components/MainHeader';
import DownloadsContent from './components/DownloadsContent';
import { useTranslation } from '../../language';

const DownloadsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  // Debug log to verify language is working
  console.log('DownloadsScreen - Selected Language:', t.language);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} stickyHeaderIndices={[0]}>
        <MainHeader title={t.downloads} iconName="download" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1 }}>
          <DownloadsContent />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
});

export default DownloadsScreen;


