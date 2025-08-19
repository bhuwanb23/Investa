import 'react-native-reanimated';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
	return (
		<AuthProvider>
			<PaperProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<AppNavigator />
				</SafeAreaView>
				<StatusBar style="auto" />
			</PaperProvider>
		</AuthProvider>
	);
}
