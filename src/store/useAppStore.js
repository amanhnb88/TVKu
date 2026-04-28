import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAppStore = create((set, get) => ({
  // 1. Tempat Penyimpanan Data (State)
  channels: [],
  categories: [],
  favorites: [],
  isLoading: false,
  errorLogs: [],

  // 2. Fungsi untuk Memperbarui Data
  setChannels: (channels) => set({ channels }),
  setCategories: (categories) => set({ categories }),
  setLoading: (isLoading) => set({ isLoading }),

  // 3. Fitur Saluran Favorit (Tersimpan permanen di penyimpanan HP)
  loadFavorites: async () => {
    try {
      const favs = await AsyncStorage.getItem('@tvku_favorites');
      if (favs) set({ favorites: JSON.parse(favs) });
    } catch (error) {
      get().addLog('Gagal memuat favorit: ' + error.message, 'error');
    }
  },
  
  toggleFavorite: async (channelId) => {
    const { favorites } = get();
    // Cek apakah channel sudah ada di daftar favorit
    const isFav = favorites.includes(channelId);
    
    // Jika sudah ada, hapus. Jika belum, tambahkan.
    const newFavs = isFav 
      ? favorites.filter(id => id !== channelId)
      : [...favorites, channelId];
      
    set({ favorites: newFavs });
    // Simpan perubahan ke penyimpanan lokal HP
    await AsyncStorage.setItem('@tvku_favorites', JSON.stringify(newFavs));
  },

  // 4. Sistem Debugging / Perekam Error (Sesuai Bab 4 di Blueprint)
  addLog: (message, type = 'info') => {
    const newLog = { 
      id: Date.now(), 
      message, 
      type, 
      time: new Date().toLocaleTimeString() 
    };
    // Simpan log baru di urutan teratas, batas maksimal 50 log agar memori tidak berat
    set((state) => ({ errorLogs: [newLog, ...state.errorLogs].slice(0, 50) }));
  },
  clearLogs: () => set({ errorLogs: [] })
}));

export default useAppStore;
