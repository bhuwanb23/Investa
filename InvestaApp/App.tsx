import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NavigationContainer, DefaultTheme, DarkTheme, createNavigationContainerRef } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

const NAVBAR_HEIGHT = 60;
export const navigationRef = createNavigationContainerRef<any>();

export default function App() {
	const scheme = useColorScheme();
	const theme = scheme === 'dark' ? DarkTheme : DefaultTheme;
	return (
		<AuthProvider>
			<PaperProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<AppShell theme={theme} />
				</SafeAreaView>
				<StatusBar style="auto" />
			</PaperProvider>
		</AuthProvider>
	);
}

const AppShell = ({ theme }: { theme: any }) => {
	const { user } = useAuth();
	return (
		<View style={{ flex: 1 }}>
			<NavigationContainer ref={navigationRef} theme={theme}>
				<View style={{ flex: 1, paddingBottom: user ? NAVBAR_HEIGHT + 24 : 0 }}>
					<AppNavigator />
				</View>
			</NavigationContainer>
			{user && (
				<View style={styles.navbarWrapper} pointerEvents="box-none">
					<View style={styles.navbar}>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Home')}>
							<Ionicons name="home" size={20} color="#4f46e5" />
							<Text style={styles.navLabel}>Home</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Courses')}>
							<Ionicons name="library" size={20} color="#6B7280" />
							<Text style={styles.navLabel}>Courses</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Trading')}>
							<Ionicons name="trending-up" size={20} color="#6B7280" />
							<Text style={styles.navLabel}>Trading</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Progress')}>
							<Ionicons name="analytics" size={20} color="#6B7280" />
							<Text style={styles.navLabel}>Progress</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Profile')}>
							<Ionicons name="person" size={20} color="#6B7280" />
							<Text style={styles.navLabel}>Profile</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	navbarWrapper: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 5,
	},
	navbar: {
		marginHorizontal: 12,
		marginBottom: 12,
		height: NAVBAR_HEIGHT,
		borderRadius: 16,
		backgroundColor: '#FFFFFF',
		borderTopWidth: 0,
		elevation: 8,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingHorizontal: 8,
	},
	navItem: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	navLabel: {
		marginTop: 4,
		fontSize: 11,
		fontWeight: '700',
		color: '#6B7280',
	},
});
