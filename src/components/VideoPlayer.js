import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { X } from 'lucide-react-native'; // Ikon silang untuk tombol tutup

const VideoPlayer = ({ channel, onClose }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Jika error, tampilkan pesan */}
      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Gagal memutar siaran ini 😢</Text>
          <Text style={styles.errorSub}>Mungkin server sedang sibuk atau URL mati.</Text>
        </View>
      ) : (
        /* Komponen Video dari expo-av */
        <Video
          ref={videoRef}
          style={styles.video}
          source={{
            uri: channel.url,
            // Fitur Anti-Blokir: Memasukkan User-Agent jika channel membutuhkannya
            headers: channel.userAgent ? { 'User-Agent': channel.userAgent } : {},
          }}
          useNativeControls={true} // Menggunakan kontrol bawaan HP untuk play/pause/fullscreen
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true} // Auto-play saat dibuka
          onLoadStart={() => setIsLoading(true)}
          onReadyForDisplay={() => setIsLoading(false)}
          onError={(e) => {
            console.log('Video Error:', e);
            setError(true);
            setIsLoading(false);
          }}
        />
      )}

      {/* Loading Indikator saat video sedang buffering */}
      {isLoading && !error && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#a855f7" />
          <Text style={styles.loadingText}>Menyiapkan Siaran...</Text>
        </View>
      )}

      {/* Header Overlay: Tombol Tutup dan Nama Channel */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <X color="#ffffff" size={28} />
        </TouchableOpacity>
        <Text style={styles.channelName} numberOfLines={1}>{channel.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Layar hitam khas pemutar video
    justifyContent: 'center',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 40, // Jarak dari poni HP
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  channelName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 5,
  },
  loadingText: {
    color: '#a855f7',
    marginTop: 10,
    fontWeight: 'bold',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSub: {
    color: '#9ca3af',
    fontSize: 14,
  }
});

export default VideoPlayer;
