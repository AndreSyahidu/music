# 🎵 Music Player Pro v2.0

**Modern, Professional Music Player** dengan sistem playlist otomatis, UI/UX yang canggih, dan fitur lengkap. Didesain dengan corporate identity yang profesional menggunakan color scheme Blue/Teal.

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![PHP](https://img.shields.io/badge/PHP-7.0+-777BB4.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fitur Utama

### 🎨 UI/UX Modern
- ✅ **Glassmorphism Design** - Efek kaca blur yang modern dan elegan
- ✅ **Professional Color Scheme** - Corporate Blue (#0EA5E9) & Teal (#14B8A6)
- ✅ **Font Awesome Icons** - Icon yang jelas, tidak ambigu, dan profesional
- ✅ **Responsive Layout** - Perfect di desktop, tablet, dan mobile
- ✅ **Smooth Animations** - Transisi dan animasi yang halus dan natural

### 🌙 Dark Mode
- ✅ **Toggle Dark/Light Mode** - Tombol di sidebar untuk ganti tema
- ✅ **Persistent Theme** - Preferensi tersimpan di localStorage
- ✅ **Auto Adjust** - Semua warna dan kontras menyesuaikan otomatis

### 🎵 Player Features
- ✅ **Playlist Otomatis** - Setiap folder dalam `/uploads` = 1 playlist
- ✅ **Play/Pause/Next/Previous** - Kontrol player lengkap
- ✅ **Shuffle & Loop** - Default aktif, bisa di-toggle
- ✅ **Autoplay** - Otomatis play lagu pertama saat playlist dipilih
- ✅ **Progress Bar** - Dengan seek support (click untuk jump)
- ✅ **Volume Control** - Slider + dynamic icon berdasarkan level
- ✅ **Mute/Unmute** - Click icon volume untuk mute

### 🔍 Search Features
- ✅ **Search Playlists** - Real-time filter playlist di sidebar
- ✅ **Search Songs** - Real-time filter lagu dalam playlist
- ✅ **Clear Button** - Tombol X untuk clear search cepat

### 📊 Equalizer Visualization
- ✅ **Animated Equalizer** - Visualisasi bars yang beranimasi saat play
- ✅ **Rotating Disc** - Album artwork berputar saat musik diputar
- ✅ **Playing Indicator** - Icon yang beranimasi di daftar lagu

### ⌨️ Keyboard Controls
- ✅ **Space** - Play/Pause
- ✅ **Arrow Left/Right** - Previous/Next track
- ✅ **Shift + Arrow Left/Right** - Seek ±10 detik
- ✅ **Arrow Up/Down** - Volume ±10%
- ✅ **M** - Mute/Unmute
- ✅ **S** - Toggle Shuffle
- ✅ **L/R** - Toggle Repeat
- ✅ **T** - Toggle Theme (Dark/Light)

### 📱 Mobile Support
- ✅ **Media Session API** - Kontrol dari lock screen/notification
- ✅ **Touch Friendly** - Tombol besar dan mudah diklik
- ✅ **Swipe Support** - Gesture-friendly interface

### 📈 Dashboard Stats
- ✅ **Total Playlists** - Tampil di sidebar
- ✅ **Total Songs** - Jumlah semua lagu
- ✅ **Song Metadata** - Format, size, dan posisi lagu

### 🔄 Auto Features
- ✅ **Auto Scan** - Scan folder setiap page load
- ✅ **Auto Refresh** - Tombol refresh untuk reload playlist
- ✅ **Auto Sort** - Lagu tersort alphabetically

## 🎨 Color Palette (Corporate Identity)

```css
Primary Color:   #0EA5E9 (Sky Blue)
Secondary Color: #14B8A6 (Teal)
Accent Color:    #8B5CF6 (Purple)

Light Mode:
- Background:    #F8FAFC
- Surface:       #FFFFFF
- Text:          #0F172A

Dark Mode:
- Background:    #0F172A
- Surface:       #1E293B
- Text:          #F1F5F9
```

## 📁 Struktur Folder

```
player/
├── index.php           # Main application (PHP + HTML)
├── style.css           # Modern styling dengan CSS variables
├── script.js           # Enhanced JavaScript dengan semua fitur
├── playlist.json       # Auto-generated playlist data
├── .htaccess          # Apache configuration & security
├── README.md          # Dokumentasi lengkap
└── uploads/           # Folder untuk musik
    ├── index.html     # Access protection
    ├── README.txt     # Upload guide
    ├── lofi/          # Contoh playlist 1
    ├── quran/         # Contoh playlist 2
    └── pop/           # Contoh playlist 3
```

## 🚀 Instalasi & Deployment

### Metode 1: Upload via ZIP (Tercepat) ⚡

1. **Download & Compress**
   ```bash
   # Compress folder player menjadi ZIP
   ```

2. **Upload ke cPanel**
   - Login cPanel → File Manager → `public_html`
   - Upload `player.zip`
   - Klik kanan → Extract → Pilih `/public_html/`

3. **Set Permissions**
   - Klik kanan folder `uploads` → Change Permissions
   - Set ke `755` (rwxr-xr-x)
   - Centang "Recurse into subdirectories"

4. **Akses Player**
   ```
   https://yourdomain.com/player/
   ```

### Metode 2: Upload via FTP (FileZilla)

1. **Connect FTP**
   - Host: `ftp.yourdomain.com`
   - Username: cPanel username
   - Password: cPanel password
   - Port: 21

2. **Upload Files**
   - Drag folder `player/` ke `public_html/`

3. **Set Permissions**
   - Klik kanan `uploads` → Permissions → `755`

### Metode 3: Upload Manual via File Manager

1. **Buat Folder**
   - File Manager → `public_html` → New Folder → `player`

2. **Upload Files**
   - Masuk ke `player/` → Upload semua file

3. **Buat Struktur Uploads**
   - Buat folder `uploads/`
   - Buat subfolder untuk setiap playlist

## 🎵 Cara Menambahkan Musik

### Quick Start

1. **Buka File Manager** cPanel
2. **Navigasi** ke `/public_html/player/uploads/`
3. **Buat Folder Baru** dengan nama playlist (contoh: `rock`, `jazz`)
4. **Upload File MP3** ke folder tersebut
5. **Refresh** halaman player

### Format yang Didukung

- **MP3** - Most recommended
- **WAV** - High quality
- **OGG** - Open format
- **M4A** - Apple format
- **FLAC** - Lossless quality

### Best Practices

```
✅ Good:
uploads/rock/my-favorite-song.mp3
uploads/jazz/smooth_jazz_01.mp3

❌ Bad:
uploads/rock/song #1 (remix).mp3  (karakter khusus)
uploads/rock/lagu dengan spasi.mp3 (gunakan dash/underscore)
```

## 🎮 Penggunaan

### Cara Menggunakan Player

1. **Pilih Playlist**
   - Klik salah satu playlist di sidebar kiri
   - Playlist akan auto-load dan auto-play

2. **Kontrol Player**
   - Klik tombol Play/Pause yang besar
   - Gunakan Previous/Next untuk navigasi
   - Klik Shuffle untuk acak urutan
   - Klik Loop untuk repeat playlist

3. **Search**
   - Gunakan search bar di sidebar untuk cari playlist
   - Gunakan search di song list untuk cari lagu
   - Real-time filtering

4. **Dark Mode**
   - Klik icon moon/sun di sidebar header
   - Tema akan tersimpan otomatis

5. **Volume**
   - Gunakan slider volume
   - Klik icon speaker untuk mute/unmute
   - Icon berubah sesuai level volume

### Keyboard Shortcuts

Tombol keyboard untuk kontrol cepat:

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Next Track |
| `←` | Previous Track |
| `Shift + →` | Skip Forward 10s |
| `Shift + ←` | Skip Backward 10s |
| `↑` | Volume Up (+10%) |
| `↓` | Volume Down (-10%) |
| `M` | Mute / Unmute |
| `S` | Toggle Shuffle |
| `L` atau `R` | Toggle Repeat |
| `T` | Toggle Theme (Dark/Light) |

## 🔧 Troubleshooting

### Playlist Tidak Muncul

**Penyebab:**
- Folder uploads kosong atau tidak ada
- Permission folder salah

**Solusi:**
```bash
# Set permission folder uploads
chmod 755 uploads -R
```

### Lagu Tidak Bisa Diputar

**Penyebab:**
- Format file tidak didukung
- File corrupt
- Path file salah

**Solusi:**
1. Pastikan format MP3, WAV, OGG, M4A, atau FLAC
2. Re-upload file
3. Cek console browser (F12) untuk error

### Dark Mode Tidak Tersimpan

**Penyebab:**
- localStorage tidak aktif
- Browser private mode

**Solusi:**
- Gunakan browser normal (bukan incognito)
- Enable localStorage di browser settings

### Icon Tidak Muncul

**Penyebab:**
- CDN Font Awesome tidak bisa diakses
- Internet connection issue

**Solusi:**
- Pastikan koneksi internet stabil
- Atau download Font Awesome dan host locally

### Volume Slider Tidak Berfungsi

**Penyebab:**
- Browser autoplay policy
- Audio context blocked

**Solusi:**
- Klik sekali di halaman sebelum play
- Atau gunakan tombol play untuk start

## 🎨 Customization

### 1. Ubah Warna Theme

Edit `style.css` baris 7-13:

```css
:root {
    --primary-color: #0EA5E9;     /* Main color */
    --secondary-color: #14B8A6;   /* Secondary color */
    --accent-color: #8B5CF6;      /* Accent color */
}
```

### 2. Ubah Default Volume

Edit `script.js` baris 17:

```javascript
volume: 70  // Ubah ke nilai 0-100
```

### 3. Ubah Default Shuffle/Loop

Edit `script.js` baris 13-14:

```javascript
isShuffled: true,  // false untuk disable
isLooped: true,    // false untuk disable
```

### 4. Disable Autoplay

Edit `script.js` baris 219:

```javascript
// Comment atau hapus baris ini:
// play();
```

### 5. Ubah Font

Edit `index.php` baris 105:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

Lalu ubah di `style.css` baris 54:

```css
--font-family: 'Poppins', sans-serif;
```

## 📋 Persyaratan Sistem

### Server Requirements

- **PHP**: 7.0+ (Recommended: 7.4+)
- **Apache**: Dengan mod_rewrite enabled
- **Extensions**: Standard PHP (tidak butuh extension khusus)
- **Storage**: Minimal 100MB (tergantung jumlah musik)

### Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Opera | 76+ | ✅ Full Support |

### Features Support

- **CSS Grid**: All modern browsers
- **CSS Variables**: All modern browsers
- **Backdrop Filter**: Chrome 76+, Safari 9+
- **Media Session API**: Chrome 57+, Edge 79+
- **LocalStorage**: All modern browsers

## 🔒 Security Features

1. **Directory Protection**
   - `.htaccess` mencegah directory listing
   - `index.html` di folder uploads

2. **File Validation**
   - PHP validation untuk file extension
   - Only audio files allowed

3. **XSS Protection**
   - `escapeHtml()` function untuk sanitize
   - `htmlspecialchars()` di PHP

4. **Access Control**
   - playlist.json protected dari direct access
   - Proper file permissions (755 folders, 644 files)

## 📊 Performance

### Optimizations

- **Lazy Loading**: Audio files loaded on demand
- **Efficient Scanning**: Folder scan di-cache dalam playlist.json
- **CSS Variables**: Faster theme switching
- **Event Delegation**: Efficient event handling
- **Minimal Dependencies**: No heavy frameworks

### Loading Time

- **Initial Load**: < 1s (tanpa musik)
- **Playlist Switch**: < 100ms
- **Theme Toggle**: < 50ms
- **Search Filter**: Real-time (< 10ms)

## 🆕 Version 2.0 - What's New?

### Major Updates

1. **Complete UI Redesign**
   - Glassmorphism design
   - Professional color scheme
   - Font Awesome icons
   - Better spacing & typography

2. **Dark Mode**
   - Toggle button
   - Persistent storage
   - Smooth transitions

3. **Search Functionality**
   - Search playlists
   - Search songs
   - Real-time filtering

4. **Equalizer Visualization**
   - Animated bars
   - Rotating disc
   - Playing indicators

5. **Enhanced Controls**
   - Keyboard shortcuts
   - Media Session API
   - Better mobile support

6. **Better UX**
   - Auto-scroll to playing song
   - Smart previous (restart if > 3s)
   - Metadata display
   - Stats dashboard

## 💡 Tips & Tricks

### Organize Music Library

```
uploads/
  ├── work/          # Musik untuk bekerja
  ├── workout/       # Musik untuk olahraga
  ├── sleep/         # Musik untuk tidur
  ├── party/         # Musik untuk pesta
  └── focus/         # Musik untuk fokus
```

### Naming Convention

```
Good:
- 01-track-name.mp3
- artist-song-title.mp3
- descriptive_name.mp3

Avoid:
- track1.mp3 (kurang deskriptif)
- Song #1 (2023).mp3 (karakter khusus)
```

### Performance Tips

1. **Gunakan MP3 320kbps** untuk balance quality vs size
2. **Max 50-100 songs per playlist** untuk performa optimal
3. **Nama file pendek** (< 50 karakter)
4. **Gunakan lowercase** dan dash/underscore

## 🤝 Contributing

Contributions are welcome! Untuk improvement:

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

Free to use untuk personal dan commercial projects.

**MIT License** - Bebas digunakan, dimodifikasi, dan didistribusikan.

## 🎯 Roadmap

### Upcoming Features

- [ ] Upload musik via web interface
- [ ] Playlist editor (add/remove songs)
- [ ] Lyrics support
- [ ] Download playlist as ZIP
- [ ] Share playlist via link
- [ ] Album artwork from file metadata
- [ ] Audio waveform visualization
- [ ] Favorite songs system
- [ ] Play history
- [ ] Multiple user support

## 📧 Support & Contact

Untuk bantuan atau pertanyaan:

1. **Check Documentation** - Baca README ini lengkap
2. **Browser Console** - Press F12 untuk lihat error
3. **GitHub Issues** - Report bugs atau request features

## 🎉 Credits

- **Icons**: Font Awesome 6.5.1
- **Fonts**: Inter (Google Fonts)
- **Design**: Modern Glassmorphism UI
- **Color Palette**: Professional Corporate Blue/Teal

---

**Made with ❤️ for Music Lovers**

Enjoy your music! 🎵✨

---

## Quick Start

```bash
1. Upload folder 'player' ke public_html/
2. Set permission 755 untuk folder uploads/
3. Upload MP3 ke uploads/nama_playlist/
4. Buka https://yourdomain.com/player/
5. Enjoy! 🎵
```

**That's it! Sesimple itu!** 🚀
