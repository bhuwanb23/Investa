import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap | any;
  onNotificationsPress?: () => void;
  showBadge?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

const PRIMARY = '#4f46e5';

const MainHeader: React.FC<Props> = ({
  title,
  iconName,
  onNotificationsPress,
  showBadge = true,
  showBackButton = false,
  onBackPress,
}) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: Math.max(12, insets.top) }]}>
      <View style={styles.content}>
        <View style={styles.leftRow}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={onBackPress || (() => navigation.goBack())}
              style={styles.iconWrap}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconWrap}>
              <Ionicons name={iconName as any} size={18} color="#fff" />
            </View>
          )}
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onNotificationsPress || (() => navigation.navigate('Notifications'))}
            style={styles.actionIcon}
          >
            <Ionicons name="notifications" size={24} color="#374151" />
            {showBadge && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
  },
});

export default MainHeader;


