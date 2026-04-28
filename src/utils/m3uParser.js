// Fungsi untuk membedah teks M3U menjadi data yang bisa dibaca aplikasi
export const parseM3U = (m3uString) => {
  // Pecah teks panjang menjadi barisan-barisan array berdasarkan enter (garis baru)
  const lines = m3uString.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 1. Jika baris mengandung informasi Channel (dimulai dengan #EXTINF)
    if (line.startsWith('#EXTINF:')) {
      // Mengambil data di dalam tanda kutip menggunakan sedikit trik regex
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupTitleMatch = line.match(/group-title="([^"]*)"/);
      
      // Nama channel biasanya ada di paling ujung setelah tanda koma (,)
      const nameParts = line.split(',');
      const channelName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'Channel Tanpa Nama';

      // Simpan sementara di memori
      currentChannel = {
        // Jika tidak ada ID, kita buatkan ID acak
        id: tvgIdMatch && tvgIdMatch[1] !== "" ? tvgIdMatch[1] : Math.random().toString(36).substr(2, 9),
        name: channelName.trim(),
        logo: tvgLogoMatch ? tvgLogoMatch[1] : null,
        group: groupTitleMatch ? groupTitleMatch[1] : 'Lainnya',
        userAgent: null // Default kosong
      };
    } 
    // 2. Jika baris mengandung aturan KODI (untuk siaran yang diamankan)
    else if (line.startsWith('#KODIPROP:inputstream.adaptive.stream_headers=')) {
      const uaMatch = line.match(/User-Agent=([^&]+)/i);
      if (uaMatch) {
        currentChannel.userAgent = uaMatch[1];
      }
    } 
    // 3. Jika baris tidak kosong dan tidak diawali tanda pagar (#), itu pasti URL Siaran (Link Video)
    else if (line && !line.startsWith('#')) {
      currentChannel.url = line;
      // Masukkan channel yang sudah lengkap ke dalam daftar utama
      channels.push(currentChannel);
      // Kosongkan lagi untuk persiapan membaca channel berikutnya
      currentChannel = {}; 
    }
  }

  // Membuat daftar Kategori yang unik (tidak ada nama grup ganda)
  const categories = [...new Set(channels.map(c => c.group))];

  // Kembalikan dua data sekaligus: Daftar Channel dan Daftar Kategori
  return { channels, categories };
};
