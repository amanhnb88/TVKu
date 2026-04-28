import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Modal } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import useAppStore from '../store/useAppStore';
import { parseM3U } from '../utils/m3uParser';
import ChannelCard from '../components/ChannelCard';

// 1. Mengimpor Video Player yang baru saja kita buat
import VideoPlayer from '../components/VideoPlayer';

const DUMMY_M3U_URL = 'https://iptv-org.github.io/iptv/countries/id.m3u';

const LiveScreen = () => {
  const { channels, setChannels, isLoading, setLoading, favorites, toggleFavorite, loadFavorites, addLog } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Membuat "ingatan" (state) untuk menyimpan channel mana yang sedang ditonton
  const [activeChannel, setActiveChannel] = useState(null);

  const loadPlaylist = async () => {
    setLoading(true);
    try {
      const response = await fetch(DUMMY_M3U_URL);
      const text = await response.text();
      const parsedData = parseM3U(text);
      setChannels(parsedData.channels);
    } catch (error) {
      addLog('Gagal memuat M3U: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    if (channels.length === 0) {
      loadPlaylist();
    }
  }, []);

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live TV</Text>
        <Text style={styles.subtitle}>{filteredChannels.length} Saluran Ditemukan</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Cari channel kesayanganmu..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#a855f7" />
          <Text style={styles.loadingText}>Memuat Siaran...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            data={filteredChannels}
            renderItem={({ item }) => (
              <ChannelCard 
                channel={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                // 3. Saat ditekan, masukkan data channel ini ke state activeChannel
                onPress={() => setActiveChannel(item)}
              />
            )}
            estimatedItemSize={85}
            contentContainerStyle={styles.listPadding}
          />
        </View>
      )}

      {/* 4. Lapisan Modal (Layar Penuh) untuk Pemutar Video */}
      <Modal
        visible={activeChannel !== null} // Hanya muncul jika ada channel yang dipilih
        animationType="slide" // Muncul dengan animasi geser dari bawah
        transparent={false}
        onRequestClose={() => setActiveChannel(null)} // Tutup video saat tombol "Back" HP ditekan
      >
        {/* Pastikan activeChannel tidak kosong sebelum merender VideoPlayer */}
        {activeChannel && (
          <VideoPlayer 
            channel={activeChannel}
            onClose={() => setActiveChannel(null)} // Tutup video saat tombol Silang (X) ditekan
          />
        )}
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050507',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#a855f7',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#1a1a24',
    color: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#a855f7',
    marginTop: 12,
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  }
});

export default LiveScreen;
