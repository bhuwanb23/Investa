import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { TEXT_DARK, PRIMARY, TEXT_MUTED } from '../constants/courseConstants';

type Props = {
	percent: number; // 0-100
	size?: number; // px
	strokeWidth?: number; // px
	label?: string;
};

const ProgressDonut: React.FC<Props> = ({ percent, size = 128, strokeWidth = 10, label }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const clamped = Math.max(0, Math.min(100, percent));
	const dashOffset = circumference * (1 - clamped / 100);

	return (
		<View style={{ width: size, height: size }}>
			<View style={styles.svgWrap}>
				<Svg width={size} height={size}>
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="#E5E7EB"
						strokeWidth={strokeWidth}
						fill="none"
					/>
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={PRIMARY}
						strokeWidth={strokeWidth}
						fill="none"
						strokeDasharray={`${circumference}`}
						strokeDashoffset={dashOffset}
						strokeLinecap="round"
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
					/>
				</Svg>
			</View>
			<View style={styles.center}>
				<Text style={styles.percentText}>{clamped}%</Text>
				{!!label && <Text style={styles.labelText}>{label}</Text>}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	svgWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
	center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
	percentText: { fontSize: 22, fontWeight: '800', color: PRIMARY },
	labelText: { fontSize: 12, color: TEXT_MUTED, marginTop: 4 },
});

export default ProgressDonut;


