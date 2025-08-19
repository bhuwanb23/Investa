import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  borderRadius?: number;
  style?: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = '#F3F4F6',
  progressColor = '#3B82F6',
  borderRadius = 4,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View 
      style={[
        styles.container,
        {
          height,
          backgroundColor,
          borderRadius,
        },
        style
      ]}
    >
      <View
        style={[
          styles.progressFill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: progressColor,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

export default ProgressBar;
