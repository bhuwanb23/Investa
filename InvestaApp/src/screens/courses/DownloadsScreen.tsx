import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DetailHeader from './components/DetailHeader';
import DownloadsContent from './components/DownloadsContent';

const DownloadsScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <DetailHeader title="Downloads" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1 }}>
        <DownloadsContent />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
});

export default DownloadsScreen;


