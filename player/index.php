<?php
/**
 * MBD MUSIC PLAYER PRO v3.0
 * Mobile First Music Player with Revolutionary UX
 *
 * Brand: MBD Corp
 * Copyright (c) 2025 MBD Corporation
 */

// Konfigurasi
$uploadsDir = __DIR__ . '/uploads';
$playlistFile = __DIR__ . '/playlist.json';

// Fungsi untuk scan folder dan generate playlist
function scanMusicFolders($baseDir) {
    $playlists = [];

    if (!is_dir($baseDir)) {
        mkdir($baseDir, 0755, true);
        return $playlists;
    }

    $folders = array_diff(scandir($baseDir), ['.', '..']);

    foreach ($folders as $folder) {
        $folderPath = $baseDir . '/' . $folder;

        if (is_dir($folderPath)) {
            $songs = [];
            $files = array_diff(scandir($folderPath), ['.', '..']);

            foreach ($files as $file) {
                $filePath = $folderPath . '/' . $file;
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));

                if (in_array($extension, ['mp3', 'wav', 'ogg', 'm4a', 'flac']) && is_file($filePath)) {
                    $title = pathinfo($file, PATHINFO_FILENAME);
                    $fileSize = filesize($filePath);
                    $fileSizeMB = round($fileSize / 1024 / 1024, 2);
                    $relativePath = 'uploads/' . $folder . '/' . $file;

                    $songs[] = [
                        'title' => $title,
                        'file' => $relativePath,
                        'size' => $fileSizeMB,
                        'format' => strtoupper($extension)
                    ];
                }
            }

            if (!empty($songs)) {
                usort($songs, function($a, $b) {
                    return strcmp($a['title'], $b['title']);
                });
                $playlists[$folder] = $songs;
            }
        }
    }

    return $playlists;
}

function getTotalSongs($playlists) {
    $total = 0;
    foreach ($playlists as $songs) {
        $total += count($songs);
    }
    return $total;
}

// Generate playlist
$playlists = scanMusicFolders($uploadsDir);
file_put_contents($playlistFile, json_encode($playlists, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

$totalPlaylists = count($playlists);
$totalSongs = getTotalSongs($playlists);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="theme-color" content="#0A1E3D">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="description" content="MBD Music Player - Professional Mobile-First Music Experience">

    <title>MBD Music Player Pro</title>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>">

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Google Fonts - Poppins (Modern & Professional) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- PWA Manifest -->
    <link rel="manifest" href="manifest.json">

    <link rel="stylesheet" href="style.css">
</head>
<body class="light-mode">

    <!-- Mobile App Container -->
    <div class="app-wrapper">

        <!-- Top Header Bar -->
        <header class="top-header">
            <div class="header-left">
                <button class="header-btn" id="menu-btn" aria-label="Menu">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="brand-logo">
                    <div class="logo-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="brand-text">
                        <span class="brand-name">MBD</span>
                        <span class="brand-subtitle">Music</span>
                    </div>
                </div>
            </div>
            <div class="header-right">
                <button class="header-btn" id="search-toggle-btn" aria-label="Search">
                    <i class="fas fa-search"></i>
                </button>
                <button class="header-btn" id="theme-toggle" aria-label="Toggle Theme">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
        </header>

        <!-- Search Overlay -->
        <div class="search-overlay" id="search-overlay">
            <div class="search-container-mobile">
                <button class="search-back" id="search-back">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <input type="text" id="global-search" placeholder="Search playlists or songs..." autocomplete="off">
                <button class="search-clear" id="global-search-clear" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results" id="search-results">
                <div class="search-empty">
                    <i class="fas fa-search fa-3x"></i>
                    <p>Type to search...</p>
                </div>
            </div>
        </div>

        <!-- Sidebar Menu (Slide-in) -->
        <aside class="sidebar-menu" id="sidebar-menu">
            <div class="sidebar-header">
                <h2>Your Library</h2>
                <button class="close-sidebar" id="close-sidebar">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-list-music"></i>
                    <div class="stat-info">
                        <span class="stat-number"><?php echo $totalPlaylists; ?></span>
                        <span class="stat-label">Playlists</span>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-compact-disc"></i>
                    <div class="stat-info">
                        <span class="stat-number"><?php echo $totalSongs; ?></span>
                        <span class="stat-label">Songs</span>
                    </div>
                </div>
            </div>

            <!-- Playlists -->
            <div class="sidebar-section">
                <h3 class="section-title">
                    <i class="fas fa-folder-open"></i>
                    Playlists
                </h3>
                <div class="playlist-list" id="playlist-list">
                    <?php if (empty($playlists)): ?>
                        <div class="empty-state">
                            <i class="fas fa-folder-open fa-3x"></i>
                            <h4>No Playlists</h4>
                            <p>Upload music to /uploads/</p>
                        </div>
                    <?php else: ?>
                        <?php foreach ($playlists as $playlistName => $songs): ?>
                            <div class="playlist-card" data-playlist="<?php echo htmlspecialchars($playlistName); ?>">
                                <div class="playlist-icon">
                                    <i class="fas fa-music"></i>
                                </div>
                                <div class="playlist-info">
                                    <div class="playlist-name"><?php echo htmlspecialchars($playlistName); ?></div>
                                    <div class="playlist-count"><?php echo count($songs); ?> tracks</div>
                                </div>
                                <div class="playlist-play-btn">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </aside>

        <!-- Overlay for Sidebar -->
        <div class="sidebar-overlay" id="sidebar-overlay"></div>

        <!-- Main Content Area -->
        <main class="main-view">

            <!-- Now Playing Card -->
            <div class="now-playing-card">
                <div class="album-artwork-container">
                    <div class="artwork-disc" id="artwork-disc">
                        <div class="disc-inner">
                            <i class="fas fa-compact-disc fa-4x"></i>
                        </div>
                        <div class="disc-center"></div>
                    </div>
                    <!-- Equalizer Bars -->
                    <div class="equalizer-visual" id="equalizer-visual">
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                    </div>
                </div>

                <!-- Track Info -->
                <div class="track-info-section">
                    <h1 class="track-title" id="track-title">Select a Playlist</h1>
                    <p class="track-artist" id="track-artist">MBD Music Player</p>
                    <div class="track-badges">
                        <span class="badge" id="track-format"><i class="fas fa-file-audio"></i> --</span>
                        <span class="badge" id="track-position"><i class="fas fa-list-ol"></i> -- / --</span>
                    </div>
                </div>

                <!-- Progress Section -->
                <div class="progress-section">
                    <div class="time-row">
                        <span class="time-current" id="current-time">0:00</span>
                        <span class="time-duration" id="duration">0:00</span>
                    </div>
                    <div class="progress-track" id="progress-track">
                        <div class="progress-fill-bar" id="progress-fill"></div>
                        <div class="progress-thumb" id="progress-thumb"></div>
                    </div>
                </div>

                <!-- Main Controls -->
                <div class="main-controls">
                    <button class="control-btn control-secondary" id="shuffle-btn" aria-label="Shuffle">
                        <i class="fas fa-random"></i>
                    </button>
                    <button class="control-btn control-secondary" id="prev-btn" aria-label="Previous">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="control-btn control-primary" id="play-pause-btn" aria-label="Play">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="control-btn control-secondary" id="next-btn" aria-label="Next">
                        <i class="fas fa-step-forward"></i>
                    </button>
                    <button class="control-btn control-secondary" id="loop-btn" aria-label="Repeat">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>

                <!-- Volume & More Controls -->
                <div class="secondary-controls">
                    <button class="secondary-btn" id="volume-toggle-btn" aria-label="Volume">
                        <i class="fas fa-volume-up"></i>
                        <span class="volume-badge" id="volume-badge">70%</span>
                    </button>
                    <button class="secondary-btn" id="playlist-btn" aria-label="Playlist">
                        <i class="fas fa-list"></i>
                        <span class="playlist-badge" id="playlist-badge">0</span>
                    </button>
                </div>
            </div>

            <!-- Current Playlist Section -->
            <div class="current-playlist-section" id="current-playlist-section">
                <div class="section-header">
                    <h2 id="current-playlist-title">
                        <i class="fas fa-music"></i>
                        Current Queue
                    </h2>
                </div>
                <div class="song-list-mobile" id="song-list">
                    <div class="empty-state">
                        <i class="fas fa-headphones fa-3x"></i>
                        <h3>No Playlist Selected</h3>
                        <p>Choose a playlist from the menu</p>
                    </div>
                </div>
            </div>

        </main>

        <!-- Volume Control Modal (Revolutionary UX) -->
        <div class="volume-modal" id="volume-modal">
            <div class="volume-modal-content">
                <div class="volume-modal-header">
                    <h3>
                        <i class="fas fa-volume-up"></i>
                        Volume Control
                    </h3>
                    <button class="volume-modal-close" id="volume-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Large Circular Volume Dial -->
                <div class="volume-dial-container">
                    <svg class="volume-dial-svg" viewBox="0 0 200 200">
                        <circle class="dial-bg" cx="100" cy="100" r="80"></circle>
                        <circle class="dial-progress" id="dial-progress" cx="100" cy="100" r="80"></circle>
                    </svg>
                    <div class="volume-center">
                        <div class="volume-icon-large" id="volume-icon-large">
                            <i class="fas fa-volume-up"></i>
                        </div>
                        <div class="volume-percentage" id="volume-percentage">70%</div>
                    </div>
                </div>

                <!-- Volume Slider -->
                <div class="volume-slider-wrap">
                    <button class="volume-min-btn" id="volume-min-btn">
                        <i class="fas fa-volume-off"></i>
                    </button>
                    <input type="range" id="volume-slider" class="volume-slider-input" min="0" max="100" value="70">
                    <button class="volume-max-btn" id="volume-max-btn">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>

                <!-- Quick Volume Presets -->
                <div class="volume-presets">
                    <button class="preset-btn" data-volume="25">25%</button>
                    <button class="preset-btn" data-volume="50">50%</button>
                    <button class="preset-btn" data-volume="75">75%</button>
                    <button class="preset-btn" data-volume="100">100%</button>
                </div>
            </div>
        </div>

        <!-- Bottom Safe Area -->
        <div class="bottom-safe-area"></div>
    </div>

    <!-- Audio Element -->
    <audio id="audio-player" preload="metadata"></audio>

    <!-- Loading Indicator -->
    <div class="loading-overlay" id="loading-overlay">
        <div class="loading-spinner">
            <i class="fas fa-compact-disc fa-spin"></i>
        </div>
    </div>

    <!-- Playlist Data -->
    <script>
        const playlistsData = <?php echo json_encode($playlists); ?>;
        const APP_CONFIG = {
            name: 'MBD Music Player',
            version: '3.0',
            brand: 'MBD Corp'
        };
    </script>

    <script src="script.js"></script>
</body>
</html>
