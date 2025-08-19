import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [animation] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));

  const toggleSection = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleSection}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View
        style={[
          styles.content,
          {
            maxHeight: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500], // Adjust based on content height
            }),
            opacity: animation,
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  iconContainer: {
    padding: 4,
  },
  content: {
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default CollapsibleSection;
