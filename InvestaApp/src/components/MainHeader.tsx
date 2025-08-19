import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap | any;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  showBadge?: boolean;
  avatarUri?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

const PRIMARY = '#4f46e5';

const MainHeader: React.FC<Props> = ({
  title,
  iconName,
  onNotificationsPress,
  onProfilePress,
  showBadge = true,
  avatarUri = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
  showBackButton = false,
  onBackPress,
}) => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
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
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onNotificationsPress || (() => navigation.navigate('Notifications'))}
            style={styles.actionIcon}
          >
            <Ionicons name="notifications" size={20} color="#6B7280" />
            {showBadge && <View style={styles.badge} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={onProfilePress}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 50,
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
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 32,
    height: 32,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    position: 'relative',
    marginRight: 12,
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default MainHeader;


