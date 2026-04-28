import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native'; // Ikon Bintang

const ChannelCard = ({ channel, onPress, isFavorite, onToggleFavorite }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      // Properti khusus agar tombol bisa disorot oleh Remote Android TV
      hasTVPreferredFocus={true}
    >
      {/* Bagian Kiri: Kotak Logo Channel */}
      <View style={styles.imageContainer}>
        {channel.logo ? (
          <Image 
            source={{ uri: channel.logo }} 
            style={styles.logo} 
            resizeMode="contain"
          />
        ) : (
          // Jika tidak ada logo, tampilkan 2 huruf pertama dari nama channel
          <View style={styles.noLogo}>
            <Text style={styles.noLogoText}>{channel.name.substring(0, 2).toUpperCase()}</Text>
          </View>
        )}
      </View>
      
      {/* Bagian Tengah: Nama dan Kategori Channel */}
      <View style={styles.infoContainer}>
        <Text style={styles.channelName} numberOfLines={1}>{channel.name}</Text>
        <Text style={styles.channelGroup} numberOfLines={1}>{channel.group}</Text>
      </View>

      {/* Bagian Kanan: Tombol Favorit */}
      <TouchableOpacity style={styles.favoriteBtn} onPress={onToggleFavorite}>
        <Star 
          color={isFavorite ? '#eab308' : '#4b5563'} // Kuning jika favorit, abu-abu jika tidak
          fill={isFavorite ? '#eab308' : 'transparent'} 
          size={24} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Pengaturan Tampilan CSS
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a24', // Warna Surface Card
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#050507', // Warna Deep Background
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  noLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLogoText: {
    color: '#a855f7', // Warna ungu primary
    fontWeight: 'bold',
    fontSize: 20,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  channelName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  channelGroup: {
    color: '#9ca3af',
    fontSize: 12,
  },
  favoriteBtn: {
    padding: 10,
  }
});

export default ChannelCard;
