# 🎵 PHP Music Player

Music player berbasis web dengan sistem playlist otomatis yang simple dan powerful.

## ✨ Fitur

- ✅ **Playlist Otomatis**: Setiap folder dalam `/uploads` otomatis menjadi playlist
- ✅ **Player Lengkap**: Play, Pause, Next, Previous
- ✅ **Shuffle & Loop**: Default aktif untuk pengalaman mendengar yang lebih baik
- ✅ **Autoplay**: Otomatis memutar lagu pertama saat halaman dibuka
- ✅ **Responsive**: Tampilan optimal di desktop, tablet, dan mobile
- ✅ **Keyboard Control**: Kontrol player menggunakan keyboard
- ✅ **No Database**: Semua data dari struktur folder
- ✅ **No Framework**: Pure PHP, HTML, CSS, JavaScript

## 📁 Struktur Folder

```
player/
├── index.php           # File utama aplikasi
├── style.css           # Styling
├── script.js           # JavaScript player
├── playlist.json       # Auto-generated playlist data
├── .htaccess          # Konfigurasi Apache
├── README.md          # Dokumentasi ini
└── uploads/           # Folder untuk menyimpan musik
    ├── index.html     # Proteksi folder
    ├── README.txt     # Panduan upload
    ├── lofi/          # Contoh playlist 1
    │   └── .gitkeep
    ├── quran/         # Contoh playlist 2
    │   └── .gitkeep
    └── pop/           # Contoh playlist 3
        └── .gitkeep
```

## 🚀 Cara Deploy di cPanel

### Metode 1: Upload Manual via File Manager

1. **Login ke cPanel**
   - Buka domain Anda: `https://yourdomain.com/cpanel`
   - Masukkan username dan password

2. **Buka File Manager**
   - Cari dan klik "File Manager" di cPanel
   - Navigasi ke folder `public_html`

3. **Buat Folder Player**
   - Klik "New Folder"
   - Nama: `player`
   - Klik "Create New Folder"

4. **Upload Files**
   - Masuk ke folder `player`
   - Klik "Upload"
   - Upload semua file:
     - index.php
     - style.css
     - script.js
     - .htaccess
     - README.md

5. **Buat Folder Uploads**
   - Di dalam folder `player`, buat folder `uploads`
   - Upload file `index.html` dan `README.txt` ke folder `uploads`
   - Buat folder-folder playlist (contoh: `lofi`, `quran`, `pop`)

6. **Set Permissions**
   - Klik kanan folder `uploads` → Change Permissions
   - Set ke `755` (rwxr-xr-x)
   - Centang "Recurse into subdirectories"
   - Klik "Change Permissions"

7. **Upload File Musik**
   - Masuk ke folder playlist (contoh: `uploads/lofi/`)
   - Upload file MP3 Anda

8. **Akses Player**
   - Buka browser: `https://yourdomain.com/player/`

### Metode 2: Upload via FTP (FileZilla)

1. **Download FileZilla Client**
   - https://filezilla-project.org/download.php

2. **Connect ke Server**
   - Host: `ftp.yourdomain.com` atau IP server
   - Username: cPanel username
   - Password: cPanel password
   - Port: 21

3. **Upload Folder Player**
   - Di panel kiri (local), navigasi ke folder `player` Anda
   - Di panel kanan (remote), navigasi ke `public_html`
   - Drag & drop folder `player` ke panel kanan

4. **Set Permissions**
   - Klik kanan folder `uploads` → File Permissions
   - Set Numeric value: `755`
   - Centang "Recurse into subdirectories"
   - Klik OK

5. **Akses Player**
   - Buka browser: `https://yourdomain.com/player/`

### Metode 3: Upload via ZIP (Tercepat)

1. **Compress Folder Player**
   - Compress seluruh folder `player` menjadi `player.zip`

2. **Upload di File Manager**
   - Login cPanel → File Manager → public_html
   - Klik "Upload" → pilih `player.zip`
   - Tunggu sampai upload selesai

3. **Extract ZIP**
   - Klik kanan file `player.zip`
   - Pilih "Extract"
   - Pilih destination: `/public_html/`
   - Klik "Extract File(s)"

4. **Hapus ZIP**
   - Klik kanan `player.zip` → Delete

5. **Set Permissions**
   - Klik kanan folder `uploads` → Change Permissions → 755

6. **Akses Player**
   - Buka browser: `https://yourdomain.com/player/`

## 🎵 Cara Menambahkan Musik

### Langkah 1: Buat Playlist (Folder Baru)

1. Masuk ke File Manager cPanel
2. Navigasi ke `public_html/player/uploads/`
3. Klik "New Folder"
4. Beri nama playlist (contoh: `rock`, `jazz`, `gaming`)

### Langkah 2: Upload File Musik

1. Masuk ke folder playlist yang baru dibuat
2. Klik "Upload"
3. Pilih file MP3/WAV/OGG/M4A/FLAC dari komputer Anda
4. Tunggu sampai upload selesai

### Langkah 3: Refresh Halaman

1. Buka/refresh halaman player: `https://yourdomain.com/player/`
2. Playlist baru akan muncul otomatis di sidebar
3. Klik playlist untuk mulai memutar

### Tips Upload Musik:

- **Format yang didukung**: MP3, WAV, OGG, M4A, FLAC
- **Nama file**: Gunakan nama yang jelas tanpa karakter khusus
- **Contoh**: `my-favorite-song.mp3`, `track_01.mp3`
- **Size limit**: Tergantung setting server (default 50MB per file)
- **Organize**: Pisahkan musik berdasarkan genre/mood/kategori

## ⌨️ Keyboard Shortcuts

- **Space**: Play / Pause
- **Arrow Right**: Next track
- **Arrow Left**: Previous track
- **Arrow Up**: Volume up (+10%)
- **Arrow Down**: Volume down (-10%)

## 🎮 Fitur Player

### Shuffle (Default: ON)
- Memutar lagu secara acak dari playlist
- Klik tombol 🔀 untuk toggle

### Loop (Default: ON)
- Mengulang playlist setelah lagu terakhir
- Klik tombol 🔁 untuk toggle

### Autoplay
- Otomatis memutar lagu pertama saat playlist dipilih
- Otomatis next ke lagu berikutnya

### Volume Control
- Slider volume 0-100%
- Icon berubah sesuai level volume
- Kontrol via keyboard (arrow up/down)

## 🔧 Troubleshooting

### Playlist tidak muncul
- **Solusi**: Pastikan folder uploads ada dan memiliki permission 755
- Cek apakah ada file musik di dalam folder playlist

### Lagu tidak bisa diputar
- **Solusi**:
  - Pastikan format file didukung (MP3, WAV, OGG, M4A, FLAC)
  - Cek size file tidak melebihi limit upload server
  - Pastikan path file benar (tidak ada spasi atau karakter khusus)
  - Cek browser console untuk error message

### Error "playlist.json" tidak bisa dibuat
- **Solusi**:
  - Set permission folder `player` ke 755
  - Pastikan PHP bisa write file di folder tersebut

### Audio tidak keluar suara
- **Solusi**:
  - Cek volume slider di player
  - Cek volume sistem komputer
  - Pastikan browser tidak di-mute
  - Coba browser lain (Chrome, Firefox, Safari)

### Tidak bisa upload file besar
- **Solusi**:
  - Edit file `.htaccess`, ubah `upload_max_filesize` dan `post_max_size`
  - Atau hubungi hosting provider untuk increase limit

## 📋 Persyaratan Server

- **PHP**: 7.0 atau lebih baru
- **Apache**: dengan mod_rewrite enabled
- **Extensions**: Standard PHP (tidak perlu extension khusus)
- **Storage**: Sesuai kebutuhan file musik
- **Browser**: Chrome, Firefox, Safari, Edge (modern browsers)

## 🔒 Keamanan

- ✅ `.htaccess` mencegah directory listing
- ✅ File `playlist.json` dilindungi dari akses langsung
- ✅ Folder uploads dilindungi dengan `index.html`
- ✅ Validasi extension file di PHP
- ✅ CORS header untuk audio files

## 🎨 Customization

### Mengubah Warna Theme

Edit file `style.css`, cari:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Ganti dengan warna favorit Anda.

### Mengubah Default Shuffle/Loop

Edit file `script.js`, cari:

```javascript
const playerState = {
    isShuffled: true,  // Ubah ke false untuk disable
    isLooped: true,    // Ubah ke false untuk disable
};
```

### Mengubah Volume Default

Edit file `script.js`, cari:

```html
<input type="range" id="volume-slider" min="0" max="100" value="70">
```

Ubah `value="70"` ke nilai yang Anda inginkan (0-100).

## 📝 Update Log

**Version 1.0.0** (2025-01-08)
- Initial release
- Basic player features
- Auto playlist scanning
- Shuffle & Loop
- Responsive design

## 📧 Support

Jika ada pertanyaan atau masalah:
1. Cek bagian Troubleshooting di atas
2. Pastikan semua file sudah terupload dengan benar
3. Cek error di browser console (F12)

## 📜 License

Free to use untuk personal dan commercial projects.

---

**Selamat menikmati musik Anda! 🎵**
