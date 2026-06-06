import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { CARD_BG, TEXT_DARK, TEXT_MUTED, BORDER, PRIMARY } from '../constants/courseConstants';

interface VideoPlayerProps {
  videoUrl?: string | null;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title }) => {
  const player = useVideoPlayer(videoUrl ? { uri: videoUrl } : null, p => {
    if (p) {
      p.play();
    }
  });

  if (!videoUrl) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title || 'Video'}</Text>
        </View>
        <View style={styles.placeholder}>
          <Ionicons name="play-circle" size={64} color={PRIMARY} />
          <Text style={styles.placeholderText}>No video available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit="contain"
        allowsFullscreen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 12,
  },
  header: {
    padding: 14,
    paddingBottom: 0,
  },
  title: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  placeholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  placeholderText: {
    color: TEXT_MUTED,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },
});

export default VideoPlayer;
