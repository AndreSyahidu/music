<?php
/**
 * PHP Music Player Pro
 * Advanced music player with modern UI/UX
 * Version 2.0
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

                    // Get file size
                    $fileSize = filesize($filePath);
                    $fileSizeMB = round($fileSize / 1024 / 1024, 2);

                    // Path relatif untuk browser
                    $relativePath = 'uploads/' . $folder . '/' . $file;

                    $songs[] = [
                        'title' => $title,
                        'file' => $relativePath,
                        'size' => $fileSizeMB,
                        'format' => strtoupper($extension)
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

// Get total songs count
function getTotalSongs($playlists) {
    $total = 0;
    foreach ($playlists as $songs) {
        $total += count($songs);
    }
    return $total;
}

// Generate playlist.json setiap kali halaman di-load
$playlists = scanMusicFolders($uploadsDir);
file_put_contents($playlistFile, json_encode($playlists, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

$totalPlaylists = count($playlists);
$totalSongs = getTotalSongs($playlists);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0F172A">
    <title>Music Player Pro - Modern Audio Experience</title>

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="style.css">
</head>
<body class="light-mode">
    <!-- Main Container -->
    <div class="app-container">

        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <i class="fas fa-compact-disc fa-spin-slow"></i>
                    <h1>Music Player</h1>
                </div>
                <button class="theme-toggle" id="theme-toggle" title="Toggle Dark Mode">
                    <i class="fas fa-moon"></i>
                </button>
            </div>

            <!-- Stats -->
            <div class="stats-container">
                <div class="stat-item">
                    <i class="fas fa-list"></i>
                    <div class="stat-info">
                        <span class="stat-value"><?php echo $totalPlaylists; ?></span>
                        <span class="stat-label">Playlists</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-music"></i>
                    <div class="stat-info">
                        <span class="stat-value"><?php echo $totalSongs; ?></span>
                        <span class="stat-label">Songs</span>
                    </div>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="search-container">
                <i class="fas fa-search"></i>
                <input type="text" id="playlist-search" placeholder="Search playlists..." autocomplete="off">
                <button class="search-clear" id="search-clear" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Playlist List -->
            <div class="playlist-section">
                <h2 class="section-title">
                    <i class="fas fa-folder-open"></i>
                    Your Playlists
                </h2>
                <div class="playlist-list" id="playlist-list">
                    <?php if (empty($playlists)): ?>
                        <div class="empty-state">
                            <i class="fas fa-folder-open fa-3x"></i>
                            <h3>No Playlists Yet</h3>
                            <p>Upload music files to /uploads/playlist_name/</p>
                            <button class="btn-primary" onclick="alert('Upload via FTP or cPanel File Manager to /uploads/ folder')">
                                <i class="fas fa-upload"></i> How to Upload
                            </button>
                        </div>
                    <?php else: ?>
                        <?php foreach ($playlists as $playlistName => $songs): ?>
                            <div class="playlist-item" data-playlist="<?php echo htmlspecialchars($playlistName); ?>" data-count="<?php echo count($songs); ?>">
                                <div class="playlist-icon">
                                    <i class="fas fa-compact-disc"></i>
                                </div>
                                <div class="playlist-info">
                                    <div class="playlist-name"><?php echo htmlspecialchars($playlistName); ?></div>
                                    <div class="playlist-meta">
                                        <span><i class="fas fa-music"></i> <?php echo count($songs); ?> tracks</span>
                                    </div>
                                </div>
                                <div class="playlist-action">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">

            <!-- Top Bar -->
            <div class="top-bar">
                <div class="breadcrumb">
                    <i class="fas fa-home"></i>
                    <span id="current-location">Home</span>
                </div>
                <div class="top-actions">
                    <button class="btn-icon" id="refresh-btn" title="Refresh Playlists">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>

            <!-- Now Playing Section -->
            <div class="now-playing-section">
                <div class="album-artwork">
                    <div class="artwork-wrapper" id="artwork-wrapper">
                        <div class="artwork-disc">
                            <i class="fas fa-compact-disc fa-5x"></i>
                        </div>
                        <!-- Equalizer -->
                        <div class="equalizer" id="equalizer">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </div>
                    </div>
                </div>

                <div class="track-details">
                    <div class="track-header">
                        <h1 class="track-title" id="track-title">Select a Playlist to Start</h1>
                        <p class="track-artist" id="track-artist">Music Player Pro</p>
                    </div>

                    <div class="track-meta">
                        <span class="meta-item" id="track-format">
                            <i class="fas fa-file-audio"></i> --
                        </span>
                        <span class="meta-item" id="track-size">
                            <i class="fas fa-database"></i> --
                        </span>
                        <span class="meta-item" id="track-position">
                            <i class="fas fa-list-ol"></i> -- / --
                        </span>
                    </div>

                    <!-- Progress Bar -->
                    <div class="progress-section">
                        <div class="time-display">
                            <span id="current-time">0:00</span>
                            <span id="duration">0:00</span>
                        </div>
                        <div class="progress-bar" id="progress-bar">
                            <div class="progress-buffer" id="progress-buffer"></div>
                            <div class="progress-fill" id="progress-fill"></div>
                            <div class="progress-handle" id="progress-handle"></div>
                        </div>
                    </div>

                    <!-- Player Controls -->
                    <div class="player-controls">
                        <div class="control-group">
                            <button class="control-btn" id="shuffle-btn" title="Shuffle">
                                <i class="fas fa-random"></i>
                            </button>
                            <button class="control-btn" id="prev-btn" title="Previous Track">
                                <i class="fas fa-step-backward"></i>
                            </button>
                            <button class="control-btn control-btn-primary" id="play-pause-btn" title="Play/Pause">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="control-btn" id="next-btn" title="Next Track">
                                <i class="fas fa-step-forward"></i>
                            </button>
                            <button class="control-btn" id="loop-btn" title="Repeat">
                                <i class="fas fa-redo"></i>
                            </button>
                        </div>

                        <!-- Volume Control -->
                        <div class="volume-control">
                            <button class="volume-btn" id="volume-btn">
                                <i class="fas fa-volume-up"></i>
                            </button>
                            <div class="volume-slider-container">
                                <input type="range" id="volume-slider" min="0" max="100" value="70" class="volume-slider">
                                <div class="volume-fill" id="volume-fill"></div>
                            </div>
                            <span class="volume-value" id="volume-value">70%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Song List Section -->
            <div class="song-list-section">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="fas fa-list-music"></i>
                        <span id="song-list-title">Queue</span>
                    </h2>
                    <div class="section-actions">
                        <div class="search-songs-container">
                            <i class="fas fa-search"></i>
                            <input type="text" id="song-search" placeholder="Search in current playlist...">
                        </div>
                    </div>
                </div>

                <div class="song-list-table" id="song-list">
                    <div class="empty-state">
                        <i class="fas fa-headphones fa-3x"></i>
                        <h3>No Playlist Selected</h3>
                        <p>Choose a playlist from the sidebar to view songs</p>
                    </div>
                </div>
            </div>

        </main>
    </div>

    <!-- Audio Element -->
    <audio id="audio-player" preload="metadata"></audio>

    <!-- Playlist Data -->
    <script>
        const playlistsData = <?php echo json_encode($playlists); ?>;
    </script>

    <script src="script.js"></script>
</body>
</html>
