import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Piece = { left: number; delay: number; duration: number; color: string; size: number };

const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFA726', '#AB47BC'];

const CertificateConfetti: React.FC<{ count?: number } > = ({ count = 18 }) => {
	const pieces = useMemo<Piece[]>(() =>
		Array.from({ length: count }).map(() => ({
			left: Math.random() * width,
			delay: Math.random() * 1500,
			duration: 2000 + Math.random() * 2000,
			color: colors[Math.floor(Math.random() * colors.length)],
			size: 6 + Math.random() * 6,
		})),
	[count]
	);

	return (
		<View pointerEvents="none" style={styles.container}>
			{pieces.map((p, idx) => (
				<Faller key={idx} {...p} />
			))}
		</View>
	);
};

const Faller: React.FC<Piece> = ({ left, delay, duration, color, size }) => {
	const translateY = useRef(new Animated.Value(-50)).current;
	const rotate = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(translateY, { toValue: height + 50, duration, delay, easing: Easing.linear, useNativeDriver: true }),
			Animated.timing(rotate, { toValue: 1, duration, delay, easing: Easing.linear, useNativeDriver: true }),
		]).start();
	}, [delay, duration, rotate, translateY]);

	const rotateInterpolate = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });

	return (
		<Animated.View style={[styles.piece, { left, width: size, height: size, backgroundColor: color, transform: [{ translateY }, { rotate: rotateInterpolate }] }]} />
	);
};

const styles = StyleSheet.create({
	container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
	piece: { position: 'absolute', borderRadius: 2 },
});

export default CertificateConfetti;


