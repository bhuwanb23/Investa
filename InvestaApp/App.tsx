import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
				<SafeAreaProvider>
					<View style={{ flex: 1 }}>
						<AppShell theme={theme} />
					</View>
					<StatusBar style="auto" />
				</SafeAreaProvider>
			</PaperProvider>
		</AuthProvider>
	);
}

const AppShell = ({ theme }: { theme: any }) => {
	const { user } = useAuth();
	const [active, setActive] = useState<string | undefined>(undefined);
	const insets = useSafeAreaInsets();
	const PRIMARY = '#4f46e5';
	const MUTED = '#6B7280';

	const onStateChange = () => {
		if (navigationRef.isReady()) {
			setActive(navigationRef.getCurrentRoute()?.name);
		}
	};

	useEffect(() => {
		if (navigationRef.isReady()) setActive(navigationRef.getCurrentRoute()?.name);
	}, []);

	const colorFor = (route: string) => (active === route ? PRIMARY : MUTED);
	const labelStyle = (route: string) => [styles.navLabel, active === route && { color: PRIMARY }];

	return (
		<View style={{ flex: 1 }}>
			<NavigationContainer ref={navigationRef} theme={theme} onStateChange={onStateChange}>
				<View style={{ flex: 1, paddingBottom: user ? NAVBAR_HEIGHT + Math.max(8, insets.bottom) : insets.bottom }}>
					<AppNavigator />
				</View>
			</NavigationContainer>
			{user && (
				<View style={[styles.navbarWrapper, { marginBottom: Math.max(8, insets.bottom) }]} pointerEvents="box-none">
					<View style={styles.navbar}>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Home')}>
							<Ionicons name="home" size={20} color={colorFor('Home')} />
							<Text style={labelStyle('Home')}>Home</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Courses')}>
							<Ionicons name="library" size={20} color={colorFor('Courses')} />
							<Text style={labelStyle('Courses')}>Courses</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Trading')}>
							<Ionicons name="trending-up" size={20} color={colorFor('Trading')} />
							<Text style={labelStyle('Trading')}>Trading</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Progress')}>
							<Ionicons name="analytics" size={20} color={colorFor('Progress')} />
							<Text style={labelStyle('Progress')}>Progress</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.navItem} onPress={() => navigationRef.isReady() && navigationRef.navigate('Profile')}>
							<Ionicons name="person" size={20} color={colorFor('Profile')} />
							<Text style={labelStyle('Profile')}>Profile</Text>
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
		marginHorizontal: 0,
		marginBottom: 0,
		height: NAVBAR_HEIGHT,
		borderRadius: 0,
		backgroundColor: '#FFFFFF',
		borderTopWidth: 1,
		borderTopColor: '#E5E7EB',
		elevation: 2,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 2,
		shadowOffset: { width: 0, height: -1 },
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
