/**
 * PHP Music Player - JavaScript
 * Fitur: Play/Pause, Next/Prev, Shuffle, Loop, Autoplay
 */

// State Management
const playerState = {
    currentPlaylist: null,
    currentSongs: [],
    currentIndex: 0,
    isPlaying: false,
    isShuffled: true,  // Default: ON
    isLooped: true,    // Default: ON
    shuffledIndices: []
};

// DOM Elements
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const loopBtn = document.getElementById('loop-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressHandle = document.getElementById('progress-handle');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const albumIcon = document.getElementById('album-icon');
const playlistItems = document.querySelectorAll('.playlist-item');
const songListContainer = document.getElementById('song-list');
const currentPlaylistName = document.getElementById('current-playlist-name');
const albumArtPlaceholder = document.querySelector('.album-art-placeholder');

// Initialize
function init() {
    // Set default states
    shuffleBtn.classList.add('active');  // Shuffle ON
    loopBtn.classList.add('active');     // Loop ON

    // Set volume
    audio.volume = volumeSlider.value / 100;

    // Event Listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    loopBtn.addEventListener('click', toggleLoop);
    volumeSlider.addEventListener('input', updateVolume);
    progressBar.addEventListener('click', seekTo);

    // Audio Events
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('error', handleAudioError);

    // Playlist Selection
    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            const playlistName = item.getAttribute('data-playlist');
            loadPlaylist(playlistName);
        });
    });

    // Autoplay first playlist if available
    if (playlistItems.length > 0) {
        const firstPlaylist = playlistItems[0].getAttribute('data-playlist');
        loadPlaylist(firstPlaylist);
    }
}

// Load Playlist
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

    currentPlaylistName.textContent = playlistName;

    // Shuffle if enabled
    if (playerState.isShuffled) {
        createShuffledOrder();
    }

    // Display song list
    displaySongList();

    // Autoplay first song
    loadSong(playerState.isShuffled ? playerState.shuffledIndices[0] : 0);
    play();
}

// Create Shuffled Order
function createShuffledOrder() {
    const indices = playerState.currentSongs.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    playerState.shuffledIndices = indices;
}

// Display Song List
function displaySongList() {
    songListContainer.innerHTML = '';

    if (playerState.currentSongs.length === 0) {
        songListContainer.innerHTML = '<div class="empty-state"><p>Tidak ada lagu dalam playlist ini</p></div>';
        return;
    }

    playerState.currentSongs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <span class="song-number">${index + 1}</span>
            <span class="song-title">${song.title}</span>
            <span class="song-playing-icon" style="display: none;">♪</span>
        `;

        songItem.addEventListener('click', () => {
            loadSong(index);
            play();
        });

        songListContainer.appendChild(songItem);
    });

    updateSongListUI();
}

// Update Song List UI
function updateSongListUI() {
    const songItems = songListContainer.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
        const playingIcon = item.querySelector('.song-playing-icon');
        if (index === playerState.currentIndex) {
            item.classList.add('active');
            playingIcon.style.display = 'inline';
        } else {
            item.classList.remove('active');
            playingIcon.style.display = 'none';
        }
    });
}

// Load Song
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

    updateSongListUI();
}

// Play
function play() {
    audio.play().then(() => {
        playerState.isPlaying = true;
        playPauseBtn.querySelector('.btn-icon').textContent = '⏸️';
        albumArtPlaceholder.classList.add('playing');
    }).catch(error => {
        console.error('Error saat memutar audio:', error);
    });
}

// Pause
function pause() {
    audio.pause();
    playerState.isPlaying = false;
    playPauseBtn.querySelector('.btn-icon').textContent = '▶️';
    albumArtPlaceholder.classList.remove('playing');
}

// Toggle Play/Pause
function togglePlayPause() {
    if (!playerState.currentSongs.length) {
        alert('Pilih playlist terlebih dahulu');
        return;
    }

    if (playerState.isPlaying) {
        pause();
    } else {
        play();
    }
}

// Play Next
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

// Play Previous
function playPrevious() {
    if (!playerState.currentSongs.length) return;

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

// Toggle Shuffle
function toggleShuffle() {
    playerState.isShuffled = !playerState.isShuffled;

    if (playerState.isShuffled) {
        shuffleBtn.classList.add('active');
        createShuffledOrder();
    } else {
        shuffleBtn.classList.remove('active');
    }
}

// Toggle Loop
function toggleLoop() {
    playerState.isLooped = !playerState.isLooped;

    if (playerState.isLooped) {
        loopBtn.classList.add('active');
    } else {
        loopBtn.classList.remove('active');
    }
}

// Handle Song End
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

// Update Volume
function updateVolume() {
    const volume = volumeSlider.value;
    audio.volume = volume / 100;
    volumeValue.textContent = volume + '%';

    // Update icon based on volume
    const volumeIcon = document.querySelector('.volume-icon');
    if (volume == 0) {
        volumeIcon.textContent = '🔇';
    } else if (volume < 50) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
}

// Update Duration
function updateDuration() {
    if (!isNaN(audio.duration)) {
        durationEl.textContent = formatTime(audio.duration);
    }
}

// Update Progress
function updateProgress() {
    if (!isNaN(audio.duration) && audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        progressHandle.style.left = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

// Seek To
function seekTo(e) {
    if (!playerState.currentSongs.length || isNaN(audio.duration)) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
}

// Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Handle Audio Error
function handleAudioError(e) {
    console.error('Error loading audio:', e);
    trackTitle.textContent = 'Error memuat lagu';
    trackArtist.textContent = 'File mungkin rusak atau tidak ditemukan';
}

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowRight':
            playNext();
            break;
        case 'ArrowLeft':
            playPrevious();
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
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
