<?php
/**
 * PHP Music Player
 * Sistem playlist otomatis berbasis folder
 */

// Konfigurasi
$uploadsDir = __DIR__ . '/uploads';
$playlistFile = __DIR__ . '/playlist.json';

// Fungsi untuk scan folder dan generate playlist
function scanMusicFolders($baseDir) {
    $playlists = [];

    // Cek apakah folder uploads ada
    if (!is_dir($baseDir)) {
        mkdir($baseDir, 0755, true);
        return $playlists;
    }

    // Scan semua folder dalam uploads
    $folders = array_diff(scandir($baseDir), ['.', '..']);

    foreach ($folders as $folder) {
        $folderPath = $baseDir . '/' . $folder;

        // Pastikan ini adalah folder
        if (is_dir($folderPath)) {
            $songs = [];

            // Scan file musik dalam folder
            $files = array_diff(scandir($folderPath), ['.', '..']);

            foreach ($files as $file) {
                $filePath = $folderPath . '/' . $file;

                // Filter hanya file audio (mp3, wav, ogg, m4a)
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($extension, ['mp3', 'wav', 'ogg', 'm4a', 'flac']) && is_file($filePath)) {
                    // Ambil nama file tanpa extension sebagai title
                    $title = pathinfo($file, PATHINFO_FILENAME);

                    // Path relatif untuk browser
                    $relativePath = 'uploads/' . $folder . '/' . $file;

                    $songs[] = [
                        'title' => $title,
                        'file' => $relativePath
                    ];
                }
            }

            // Jika ada lagu, tambahkan ke playlist
            if (!empty($songs)) {
                // Sort by title
                usort($songs, function($a, $b) {
                    return strcmp($a['title'], $b['title']);
                });

                $playlists[$folder] = $songs;
            }
        }
    }

    return $playlists;
}

// Generate playlist.json setiap kali halaman di-load
$playlists = scanMusicFolders($uploadsDir);
file_put_contents($playlistFile, json_encode($playlists, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Music Player</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1>🎵 Music Player</h1>
            <div class="header-info">
                <span id="current-playlist-name">Pilih Playlist</span>
            </div>
        </header>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Sidebar Playlist -->
            <aside class="sidebar">
                <h2>Playlists</h2>
                <div class="playlist-list" id="playlist-list">
                    <?php if (empty($playlists)): ?>
                        <div class="empty-state">
                            <p>Tidak ada playlist.</p>
                            <p class="small">Upload file MP3 ke folder /uploads/nama_playlist/</p>
                        </div>
                    <?php else: ?>
                        <?php foreach ($playlists as $playlistName => $songs): ?>
                            <div class="playlist-item" data-playlist="<?php echo htmlspecialchars($playlistName); ?>">
                                <div class="playlist-icon">📁</div>
                                <div class="playlist-info">
                                    <div class="playlist-name"><?php echo htmlspecialchars($playlistName); ?></div>
                                    <div class="playlist-count"><?php echo count($songs); ?> lagu</div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </aside>

            <!-- Main Player Area -->
            <main class="player-area">
                <!-- Now Playing -->
                <div class="now-playing">
                    <div class="album-art">
                        <div class="album-art-placeholder">
                            <span id="album-icon">🎵</span>
                        </div>
                    </div>
                    <div class="track-info">
                        <h2 id="track-title">Tidak ada lagu yang diputar</h2>
                        <p id="track-artist">Pilih playlist untuk memulai</p>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="progress-container">
                    <span class="time" id="current-time">0:00</span>
                    <div class="progress-bar" id="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                        <div class="progress-handle" id="progress-handle"></div>
                    </div>
                    <span class="time" id="duration">0:00</span>
                </div>

                <!-- Player Controls -->
                <div class="controls">
                    <button class="control-btn" id="shuffle-btn" title="Shuffle">
                        <span class="btn-icon">🔀</span>
                    </button>
                    <button class="control-btn" id="prev-btn" title="Previous">
                        <span class="btn-icon">⏮️</span>
                    </button>
                    <button class="control-btn control-btn-large" id="play-pause-btn" title="Play/Pause">
                        <span class="btn-icon">▶️</span>
                    </button>
                    <button class="control-btn" id="next-btn" title="Next">
                        <span class="btn-icon">⏭️</span>
                    </button>
                    <button class="control-btn" id="loop-btn" title="Loop">
                        <span class="btn-icon">🔁</span>
                    </button>
                </div>

                <!-- Volume Control -->
                <div class="volume-control">
                    <span class="volume-icon">🔊</span>
                    <input type="range" id="volume-slider" min="0" max="100" value="70">
                    <span class="volume-value" id="volume-value">70%</span>
                </div>

                <!-- Song List -->
                <div class="song-list-container">
                    <h3>Daftar Lagu</h3>
                    <div class="song-list" id="song-list">
                        <div class="empty-state">
                            <p>Pilih playlist di sidebar untuk melihat daftar lagu</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Audio Element (Hidden) -->
    <audio id="audio-player" preload="metadata"></audio>

    <!-- Playlist Data -->
    <script>
        const playlistsData = <?php echo json_encode($playlists); ?>;
    </script>

    <script src="script.js"></script>
</body>
</html>
