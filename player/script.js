/**
 * MUSIC PLAYER PRO - JAVASCRIPT
 * Version 2.0 - Enhanced Features
 * Features: Search, Dark Mode, Equalizer, Keyboard Controls
 */

// ========== STATE MANAGEMENT ==========
const playerState = {
    currentPlaylist: null,
    currentSongs: [],
    currentIndex: 0,
    isPlaying: false,
    isShuffled: true,  // Default ON
    isLooped: true,    // Default ON
    shuffledIndices: [],
    theme: 'light',    // light or dark
    volume: 70
};

// ========== DOM ELEMENTS ==========
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const loopBtn = document.getElementById('loop-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const volumeBtn = document.getElementById('volume-btn');
const volumeFill = document.getElementById('volume-fill');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressHandle = document.getElementById('progress-handle');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const trackFormat = document.getElementById('track-format');
const trackSize = document.getElementById('track-size');
const trackPosition = document.getElementById('track-position');
const playlistItems = document.querySelectorAll('.playlist-item');
const songListContainer = document.getElementById('song-list');
const songListTitle = document.getElementById('song-list-title');
const currentLocation = document.getElementById('current-location');
const artworkWrapper = document.getElementById('artwork-wrapper');
const artworkDisc = artworkWrapper.querySelector('.artwork-disc');
const equalizer = document.getElementById('equalizer');
const themeToggle = document.getElementById('theme-toggle');
const refreshBtn = document.getElementById('refresh-btn');
const playlistSearch = document.getElementById('playlist-search');
const searchClear = document.getElementById('search-clear');
const songSearch = document.getElementById('song-search');

// ========== INITIALIZATION ==========
function init() {
    // Load saved theme
    loadTheme();

    // Set default states
    shuffleBtn.classList.add('active');
    loopBtn.classList.add('active');

    // Set volume
    updateVolume();

    // Event Listeners - Player Controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    loopBtn.addEventListener('click', toggleLoop);

    // Volume Controls
    volumeSlider.addEventListener('input', updateVolume);
    volumeBtn.addEventListener('click', toggleMute);

    // Progress Bar
    progressBar.addEventListener('click', seekTo);

    // Audio Events
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('error', handleAudioError);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Playlist Selection
    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            const playlistName = item.getAttribute('data-playlist');
            loadPlaylist(playlistName);
        });
    });

    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Refresh Button
    refreshBtn.addEventListener('click', refreshPlaylists);

    // Search Functions
    playlistSearch.addEventListener('input', filterPlaylists);
    searchClear.addEventListener('click', clearPlaylistSearch);
    songSearch.addEventListener('input', filterSongs);

    // Keyboard Controls
    setupKeyboardControls();

    // Autoplay first playlist if available
    if (playlistItems.length > 0 && Object.keys(playlistsData).length > 0) {
        const firstPlaylist = playlistItems[0].getAttribute('data-playlist');
        loadPlaylist(firstPlaylist);
    }
}

// ========== THEME MANAGEMENT ==========
function loadTheme() {
    const savedTheme = localStorage.getItem('musicPlayerTheme') || 'light';
    playerState.theme = savedTheme;
    applyTheme(savedTheme);
}

function toggleTheme() {
    const newTheme = playerState.theme === 'light' ? 'dark' : 'light';
    playerState.theme = newTheme;
    applyTheme(newTheme);
    localStorage.setItem('musicPlayerTheme', newTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// ========== SEARCH FUNCTIONS ==========
function filterPlaylists() {
    const query = playlistSearch.value.toLowerCase().trim();

    if (query) {
        searchClear.style.display = 'block';
    } else {
        searchClear.style.display = 'none';
    }

    playlistItems.forEach(item => {
        const playlistName = item.getAttribute('data-playlist').toLowerCase();
        if (playlistName.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function clearPlaylistSearch() {
    playlistSearch.value = '';
    searchClear.style.display = 'none';
    playlistItems.forEach(item => {
        item.style.display = 'flex';
    });
    playlistSearch.focus();
}

function filterSongs() {
    const query = songSearch.value.toLowerCase().trim();
    const songRows = songListContainer.querySelectorAll('.song-row');

    songRows.forEach(row => {
        const songName = row.querySelector('.song-name').textContent.toLowerCase();
        if (songName.includes(query)) {
            row.style.display = 'grid';
        } else {
            row.style.display = 'none';
        }
    });
}

// ========== PLAYLIST MANAGEMENT ==========
function loadPlaylist(playlistName) {
    if (!playlistsData[playlistName]) {
        console.error('Playlist tidak ditemukan:', playlistName);
        return;
    }

    playerState.currentPlaylist = playlistName;
    playerState.currentSongs = playlistsData[playlistName];
    playerState.currentIndex = 0;

    // Update UI
    playlistItems.forEach(item => {
        if (item.getAttribute('data-playlist') === playlistName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    currentLocation.textContent = playlistName;
    songListTitle.innerHTML = `<i class="fas fa-list-music"></i> ${playlistName}`;

    // Shuffle if enabled
    if (playerState.isShuffled) {
        createShuffledOrder();
    }

    // Display song list
    displaySongList();

    // Load and autoplay first song
    loadSong(playerState.isShuffled ? playerState.shuffledIndices[0] : 0);
    play();
}

function createShuffledOrder() {
    const indices = playerState.currentSongs.map((_, i) => i);
    // Fisher-Yates shuffle algorithm
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    playerState.shuffledIndices = indices;
}

function displaySongList() {
    songListContainer.innerHTML = '';
    songSearch.value = '';

    if (playerState.currentSongs.length === 0) {
        songListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-music fa-3x"></i>
                <h3>No Songs Found</h3>
                <p>This playlist appears to be empty</p>
            </div>
        `;
        return;
    }

    playerState.currentSongs.forEach((song, index) => {
        const songRow = document.createElement('div');
        songRow.className = 'song-row';
        songRow.innerHTML = `
            <div class="song-number">${index + 1}</div>
            <div class="song-info">
                <div class="song-name">${escapeHtml(song.title)}</div>
            </div>
            <div class="song-format">${song.format || 'MP3'}</div>
            <div class="song-size">${song.size || '0.00'} MB</div>
            <div class="song-duration">
                <i class="fas fa-play-circle song-playing-icon" style="display: none;"></i>
            </div>
        `;

        songRow.addEventListener('click', () => {
            loadSong(index);
            play();
        });

        songListContainer.appendChild(songRow);
    });

    updateSongListUI();
}

function updateSongListUI() {
    const songRows = songListContainer.querySelectorAll('.song-row');
    songRows.forEach((row, index) => {
        const playingIcon = row.querySelector('.song-playing-icon');
        if (index === playerState.currentIndex) {
            row.classList.add('active');
            if (playingIcon) playingIcon.style.display = 'inline';
        } else {
            row.classList.remove('active');
            if (playingIcon) playingIcon.style.display = 'none';
        }
    });

    // Scroll to active song
    const activeRow = songListContainer.querySelector('.song-row.active');
    if (activeRow) {
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ========== PLAYBACK CONTROLS ==========
function loadSong(index) {
    if (!playerState.currentSongs[index]) {
        console.error('Lagu tidak ditemukan pada index:', index);
        return;
    }

    playerState.currentIndex = index;
    const song = playerState.currentSongs[index];

    audio.src = song.file;
    trackTitle.textContent = song.title;
    trackArtist.textContent = playerState.currentPlaylist;

    // Update metadata
    trackFormat.innerHTML = `<i class="fas fa-file-audio"></i> ${song.format || 'MP3'}`;
    trackSize.innerHTML = `<i class="fas fa-database"></i> ${song.size || '0.00'} MB`;
    trackPosition.innerHTML = `<i class="fas fa-list-ol"></i> ${index + 1} / ${playerState.currentSongs.length}`;

    updateSongListUI();
}

function play() {
    audio.play().then(() => {
        playerState.isPlaying = true;
        playPauseBtn.querySelector('i').className = 'fas fa-pause';
        artworkDisc.classList.add('playing');
        equalizer.classList.add('active');
    }).catch(error => {
        console.error('Error saat memutar audio:', error);
        showNotification('Unable to play audio', 'error');
    });
}

function pause() {
    audio.pause();
    playerState.isPlaying = false;
    playPauseBtn.querySelector('i').className = 'fas fa-play';
    artworkDisc.classList.remove('playing');
    equalizer.classList.remove('active');
}

function togglePlayPause() {
    if (!playerState.currentSongs.length) {
        showNotification('Please select a playlist first', 'info');
        return;
    }

    if (playerState.isPlaying) {
        pause();
    } else {
        play();
    }
}

function playNext() {
    if (!playerState.currentSongs.length) return;

    if (playerState.isShuffled) {
        const currentShuffleIndex = playerState.shuffledIndices.indexOf(playerState.currentIndex);
        const nextShuffleIndex = (currentShuffleIndex + 1) % playerState.shuffledIndices.length;
        loadSong(playerState.shuffledIndices[nextShuffleIndex]);
    } else {
        const nextIndex = (playerState.currentIndex + 1) % playerState.currentSongs.length;
        loadSong(nextIndex);
    }

    play();
}

function playPrevious() {
    if (!playerState.currentSongs.length) return;

    // If more than 3 seconds played, restart current song
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    if (playerState.isShuffled) {
        const currentShuffleIndex = playerState.shuffledIndices.indexOf(playerState.currentIndex);
        const prevShuffleIndex = currentShuffleIndex === 0
            ? playerState.shuffledIndices.length - 1
            : currentShuffleIndex - 1;
        loadSong(playerState.shuffledIndices[prevShuffleIndex]);
    } else {
        const prevIndex = playerState.currentIndex === 0
            ? playerState.currentSongs.length - 1
            : playerState.currentIndex - 1;
        loadSong(prevIndex);
    }

    play();
}

function toggleShuffle() {
    playerState.isShuffled = !playerState.isShuffled;

    if (playerState.isShuffled) {
        shuffleBtn.classList.add('active');
        createShuffledOrder();
        showNotification('Shuffle enabled', 'success');
    } else {
        shuffleBtn.classList.remove('active');
        showNotification('Shuffle disabled', 'info');
    }
}

function toggleLoop() {
    playerState.isLooped = !playerState.isLooped;

    if (playerState.isLooped) {
        loopBtn.classList.add('active');
        showNotification('Repeat enabled', 'success');
    } else {
        loopBtn.classList.remove('active');
        showNotification('Repeat disabled', 'info');
    }
}

function handleSongEnd() {
    if (playerState.isLooped) {
        playNext();
    } else {
        // Check if it's the last song
        if (playerState.isShuffled) {
            const currentShuffleIndex = playerState.shuffledIndices.indexOf(playerState.currentIndex);
            if (currentShuffleIndex < playerState.shuffledIndices.length - 1) {
                playNext();
            } else {
                pause();
            }
        } else {
            if (playerState.currentIndex < playerState.currentSongs.length - 1) {
                playNext();
            } else {
                pause();
            }
        }
    }
}

// ========== VOLUME CONTROLS ==========
function updateVolume() {
    const volume = volumeSlider.value;
    playerState.volume = volume;
    audio.volume = volume / 100;
    volumeValue.textContent = volume + '%';
    volumeFill.style.width = volume + '%';

    // Update icon
    const icon = volumeBtn.querySelector('i');
    if (volume == 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (volume < 30) {
        icon.className = 'fas fa-volume-off';
    } else if (volume < 70) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
}

function toggleMute() {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeSlider.value = 0;
    } else {
        audio.volume = playerState.volume / 100;
        volumeSlider.value = playerState.volume;
    }
    updateVolume();
}

// ========== PROGRESS CONTROLS ==========
function updateDuration() {
    if (!isNaN(audio.duration)) {
        durationEl.textContent = formatTime(audio.duration);
    }
}

function updateProgress() {
    if (!isNaN(audio.duration) && audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        progressHandle.style.left = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

function seekTo(e) {
    if (!playerState.currentSongs.length || isNaN(audio.duration)) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ========== EVENT HANDLERS ==========
function onPlay() {
    playerState.isPlaying = true;
    playPauseBtn.querySelector('i').className = 'fas fa-pause';
    artworkDisc.classList.add('playing');
    equalizer.classList.add('active');
}

function onPause() {
    playerState.isPlaying = false;
    playPauseBtn.querySelector('i').className = 'fas fa-play';
    artworkDisc.classList.remove('playing');
    equalizer.classList.remove('active');
}

function handleAudioError(e) {
    console.error('Error loading audio:', e);
    trackTitle.textContent = 'Error loading song';
    trackArtist.textContent = 'File may be corrupted or not found';
    showNotification('Failed to load audio file', 'error');
}

function refreshPlaylists() {
    showNotification('Refreshing playlists...', 'info');
    setTimeout(() => {
        location.reload();
    }, 500);
}

// ========== KEYBOARD CONTROLS ==========
function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT') return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (e.shiftKey) {
                    // Skip forward 10 seconds
                    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
                } else {
                    playNext();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (e.shiftKey) {
                    // Skip backward 10 seconds
                    audio.currentTime = Math.max(0, audio.currentTime - 10);
                } else {
                    playPrevious();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
                updateVolume();
                break;
            case 'ArrowDown':
                e.preventDefault();
                volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
                updateVolume();
                break;
            case 'KeyM':
                toggleMute();
                break;
            case 'KeyS':
                toggleShuffle();
                break;
            case 'KeyL':
            case 'KeyR':
                toggleLoop();
                break;
            case 'KeyT':
                toggleTheme();
                break;
        }
    });
}

// ========== UTILITY FUNCTIONS ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Simple console notification for now
    // In production, you could add a toast notification system
    console.log(`[${type.toUpperCase()}] ${message}`);

    // You can enhance this with a toast library or custom notification UI
}

// ========== INITIALIZE ON LOAD ==========
document.addEventListener('DOMContentLoaded', init);

// ========== MEDIA SESSION API (for mobile/browser controls) ==========
if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', playNext);

    audio.addEventListener('loadedmetadata', () => {
        const song = playerState.currentSongs[playerState.currentIndex];
        if (song) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: playerState.currentPlaylist,
                album: playerState.currentPlaylist
            });
        }
    });
}

// ========== SERVICE WORKER (Optional - for offline support) ==========
if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js').catch(() => {});
}

console.log('%c🎵 Music Player Pro v2.0', 'color: #0EA5E9; font-size: 20px; font-weight: bold;');
console.log('%cKeyboard Shortcuts:', 'color: #14B8A6; font-size: 14px; font-weight: bold;');
console.log('Space: Play/Pause');
console.log('Arrow Left/Right: Previous/Next track');
console.log('Shift + Arrow Left/Right: Seek ±10s');
console.log('Arrow Up/Down: Volume ±10%');
console.log('M: Mute/Unmute');
console.log('S: Toggle Shuffle');
console.log('L/R: Toggle Repeat');
console.log('T: Toggle Theme');
