/**
 * MBD MUSIC PLAYER PRO v3.0
 * Mobile First • Revolutionary Volume • Touch Optimized
 * Copyright (c) 2025 MBD Corporation
 */

console.log('%c🎵 MBD Music Player Pro v3.0', 'color: #F59E0B; font-size: 20px; font-weight: bold;');
console.log('%cMobile First • Revolutionary Volume Control', 'color: #0A1E3D; font-size: 12px;');

// ========== STATE ==========
const state = {
    currentPlaylist: null,
    currentSongs: [],
    currentIndex: 0,
    isPlaying: false,
    isShuffled: true,
    isLooped: true,
    shuffledIndices: [],
    theme: 'light',
    volume: 70
};

// ========== DOM ELEMENTS ==========
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const loopBtn = document.getElementById('loop-btn');
const progressTrack = document.getElementById('progress-track');
const progressFill = document.getElementById('progress-fill');
const progressThumb = document.getElementById('progress-thumb');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const trackFormat = document.getElementById('track-format');
const trackPosition = document.getElementById('track-position');
const artworkDisc = document.getElementById('artwork-disc');
const equalizerVisual = document.getElementById('equalizer-visual');
const songList = document.getElementById('song-list');
const currentPlaylistTitle = document.getElementById('current-playlist-title');

// Mobile Navigation
const menuBtn = document.getElementById('menu-btn');
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebar = document.getElementById('close-sidebar');
const searchToggleBtn = document.getElementById('search-toggle-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchBack = document.getElementById('search-back');
const globalSearch = document.getElementById('global-search');
const globalSearchClear = document.getElementById('global-search-clear');
const searchResults = document.getElementById('search-results');
const themeToggle = document.getElementById('theme-toggle');

// Volume Control
const volumeToggleBtn = document.getElementById('volume-toggle-btn');
const volumeModal = document.getElementById('volume-modal');
const volumeModalClose = document.getElementById('volume-modal-close');
const volumeSlider = document.getElementById('volume-slider');
const volumePercentage = document.getElementById('volume-percentage');
const volumeIconLarge = document.getElementById('volume-icon-large');
const volumeBadge = document.getElementById('volume-badge');
const dialProgress = document.getElementById('dial-progress');
const volumeMinBtn = document.getElementById('volume-min-btn');
const volumeMaxBtn = document.getElementById('volume-max-btn');
const presetBtns = document.querySelectorAll('.preset-btn');

// Playlists
const playlistCards = document.querySelectorAll('.playlist-card');
const playlistBtn = document.getElementById('playlist-btn');
const playlistBadge = document.getElementById('playlist-badge');

// ========== INIT ==========
function init() {
    loadTheme();
    shuffleBtn.classList.add('active');
    loopBtn.classList.add('active');
    updateVolume();

    // Player
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    loopBtn.addEventListener('click', toggleLoop);

    // Progress
    progressTrack.addEventListener('click', seekTo);

    // Audio
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Navigation
    menuBtn.addEventListener('click', openSidebar);
    closeSidebar.addEventListener('click', closeSidebarMenu);
    sidebarOverlay.addEventListener('click', closeSidebarMenu);
    searchToggleBtn.addEventListener('click', openSearch);
    searchBack.addEventListener('click', closeSearch);
    themeToggle.addEventListener('click', toggleTheme);

    // Search
    globalSearch.addEventListener('input', handleGlobalSearch);
    globalSearchClear.addEventListener('click', clearGlobalSearch);

    // Volume
    volumeToggleBtn.addEventListener('click', openVolumeModal);
    volumeModalClose.addEventListener('click', closeVolumeModal);
    volumeModal.addEventListener('click', e => {
        if (e.target === volumeModal) closeVolumeModal();
    });
    volumeSlider.addEventListener('input', updateVolume);
    volumeMinBtn.addEventListener('click', () => setVolume(0));
    volumeMaxBtn.addEventListener('click', () => setVolume(100));

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setVolume(parseInt(btn.dataset.volume));
        });
    });

    // Playlists
    playlistCards.forEach(card => {
        card.addEventListener('click', () => {
            loadPlaylist(card.dataset.playlist);
            closeSidebarMenu();
        });
    });

    playlistBtn.addEventListener('click', () => {
        const section = document.getElementById('current-playlist-section');
        section.scrollIntoView({ behavior: 'smooth' });
    });

    // Keyboard
    setupKeyboard();

    // Autoplay
    if (playlistCards.length > 0) {
        const first = playlistCards[0].dataset.playlist;
        loadPlaylist(first);
    }

    updatePlaylistBadge();
    createVolumeSVGGradient();
}

// ========== THEME ==========
function loadTheme() {
    const saved = localStorage.getItem('mbdTheme') || 'light';
    state.theme = saved;
    applyTheme(saved);
}

function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    state.theme = newTheme;
    applyTheme(newTheme);
    localStorage.setItem('mbdTheme', newTheme);
}

function applyTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme + '-mode');
    themeToggle.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

// ========== NAVIGATION ==========
function openSidebar() {
    sidebarMenu.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebarMenu() {
    sidebarMenu.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function openSearch() {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    globalSearch.focus();
}

function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    globalSearch.value = '';
    globalSearchClear.style.display = 'none';
}

// ========== SEARCH ==========
function handleGlobalSearch() {
    const query = globalSearch.value.toLowerCase().trim();

    if (query) {
        globalSearchClear.style.display = 'block';
        performSearch(query);
    } else {
        globalSearchClear.style.display = 'none';
        showSearchEmpty();
    }
}

function clearGlobalSearch() {
    globalSearch.value = '';
    globalSearchClear.style.display = 'none';
    showSearchEmpty();
    globalSearch.focus();
}

function performSearch(query) {
    searchResults.innerHTML = '';
    let found = false;

    // Search playlists
    Object.keys(playlistsData).forEach(playlistName => {
        if (playlistName.toLowerCase().includes(query)) {
            const card = createSearchPlaylistCard(playlistName);
            searchResults.appendChild(card);
            found = true;
        }

        // Search songs in playlist
        playlistsData[playlistName].forEach((song, idx) => {
            if (song.title.toLowerCase().includes(query)) {
                const card = createSearchSongCard(song, playlistName, idx);
                searchResults.appendChild(card);
                found = true;
            }
        });
    });

    if (!found) {
        searchResults.innerHTML = '<div class="search-empty"><i class="fas fa-search fa-3x"></i><p>No results found</p></div>';
    }
}

function createSearchPlaylistCard(name) {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.innerHTML = `
        <div class="playlist-icon"><i class="fas fa-music"></i></div>
        <div class="playlist-info">
            <div class="playlist-name">${escapeHtml(name)}</div>
            <div class="playlist-count">${playlistsData[name].length} tracks</div>
        </div>
        <div class="playlist-play-btn"><i class="fas fa-play"></i></div>
    `;
    card.addEventListener('click', () => {
        loadPlaylist(name);
        closeSearch();
    });
    return card;
}

function createSearchSongCard(song, playlist, idx) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
        <div class="song-number">${idx + 1}</div>
        <div class="song-details">
            <div class="song-name">${escapeHtml(song.title)}</div>
            <div class="song-meta">${playlist}</div>
        </div>
    `;
    card.addEventListener('click', () => {
        loadPlaylist(playlist);
        setTimeout(() => loadSong(idx), 100);
        setTimeout(() => play(), 200);
        closeSearch();
    });
    return card;
}

function showSearchEmpty() {
    searchResults.innerHTML = '<div class="search-empty"><i class="fas fa-search fa-3x"></i><p>Type to search...</p></div>';
}

// ========== VOLUME ==========
function openVolumeModal() {
    volumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateVolumeDisplay();
}

function closeVolumeModal() {
    volumeModal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateVolume() {
    const vol = volumeSlider.value;
    state.volume = vol;
    audio.volume = vol / 100;
    updateVolumeDisplay();
}

function setVolume(vol) {
    volumeSlider.value = vol;
    updateVolume();
}

function updateVolumeDisplay() {
    const vol = volumeSlider.value;
    volumePercentage.textContent = vol + '%';
    volumeBadge.textContent = vol + '%';

    // Circular dial (circumference = 2 * PI * 80 = 502.4)
    const circumference = 502.4;
    const offset = circumference - (vol / 100) * circumference;
    if (dialProgress) {
        dialProgress.style.strokeDashoffset = offset;
    }

    // Icon
    const icon = volumeIconLarge.querySelector('i');
    if (vol == 0) icon.className = 'fas fa-volume-mute';
    else if (vol < 30) icon.className = 'fas fa-volume-off';
    else if (vol < 70) icon.className = 'fas fa-volume-down';
    else icon.className = 'fas fa-volume-up';
}

function createVolumeSVGGradient() {
    const svg = document.querySelector('.volume-dial-svg');
    if (!svg) return;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', 'volume-gradient');
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '0%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#0A1E3D');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#F59E0B');

    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.insertBefore(defs, svg.firstChild);
}

// ========== PLAYLIST ==========
function loadPlaylist(name) {
    if (!playlistsData[name]) return;

    state.currentPlaylist = name;
    state.currentSongs = playlistsData[name];
    state.currentIndex = 0;

    playlistCards.forEach(card => {
        card.classList.toggle('active', card.dataset.playlist === name);
    });

    currentPlaylistTitle.innerHTML = `<i class="fas fa-music"></i> ${name}`;

    if (state.isShuffled) createShuffledOrder();

    displaySongList();
    loadSong(state.isShuffled ? state.shuffledIndices[0] : 0);
    play();
}

function createShuffledOrder() {
    const indices = state.currentSongs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    state.shuffledIndices = indices;
}

function displaySongList() {
    songList.innerHTML = '';

    if (!state.currentSongs.length) {
        songList.innerHTML = '<div class="empty-state"><i class="fas fa-music fa-3x"></i><h3>No Songs</h3><p>This playlist is empty</p></div>';
        return;
    }

    state.currentSongs.forEach((song, idx) => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="song-number">${idx + 1}</div>
            <div class="song-details">
                <div class="song-name">${escapeHtml(song.title)}</div>
                <div class="song-meta">${song.format || 'MP3'}</div>
            </div>
            <i class="fas fa-play-circle song-playing-icon" style="display:none;"></i>
        `;
        card.addEventListener('click', () => {
            loadSong(idx);
            play();
        });
        songList.appendChild(card);
    });

    updateSongListUI();
    updatePlaylistBadge();
}

function updateSongListUI() {
    const cards = songList.querySelectorAll('.song-card');
    cards.forEach((card, idx) => {
        const icon = card.querySelector('.song-playing-icon');
        if (idx === state.currentIndex) {
            card.classList.add('active');
            if (icon) icon.style.display = 'inline';
        } else {
            card.classList.remove('active');
            if (icon) icon.style.display = 'none';
        }
    });
}

function updatePlaylistBadge() {
    playlistBadge.textContent = state.currentSongs.length;
}

// ========== PLAYBACK ==========
function loadSong(idx) {
    if (!state.currentSongs[idx]) return;

    state.currentIndex = idx;
    const song = state.currentSongs[idx];

    audio.src = song.file;
    trackTitle.textContent = song.title;
    trackArtist.textContent = state.currentPlaylist;
    trackFormat.innerHTML = `<i class="fas fa-file-audio"></i> ${song.format || 'MP3'}`;
    trackPosition.innerHTML = `<i class="fas fa-list-ol"></i> ${idx + 1} / ${state.currentSongs.length}`;

    updateSongListUI();
}

function play() {
    audio.play().then(() => {
        state.isPlaying = true;
    }).catch(err => console.error('Play error:', err));
}

function pause() {
    audio.pause();
    state.isPlaying = false;
}

function togglePlayPause() {
    if (!state.currentSongs.length) return;
    state.isPlaying ? pause() : play();
}

function playNext() {
    if (!state.currentSongs.length) return;

    if (state.isShuffled) {
        const idx = state.shuffledIndices.indexOf(state.currentIndex);
        const next = (idx + 1) % state.shuffledIndices.length;
        loadSong(state.shuffledIndices[next]);
    } else {
        const next = (state.currentIndex + 1) % state.currentSongs.length;
        loadSong(next);
    }
    play();
}

function playPrevious() {
    if (!state.currentSongs.length) return;

    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    if (state.isShuffled) {
        const idx = state.shuffledIndices.indexOf(state.currentIndex);
        const prev = idx === 0 ? state.shuffledIndices.length - 1 : idx - 1;
        loadSong(state.shuffledIndices[prev]);
    } else {
        const prev = state.currentIndex === 0 ? state.currentSongs.length - 1 : state.currentIndex - 1;
        loadSong(prev);
    }
    play();
}

function toggleShuffle() {
    state.isShuffled = !state.isShuffled;
    shuffleBtn.classList.toggle('active', state.isShuffled);
    if (state.isShuffled) createShuffledOrder();
}

function toggleLoop() {
    state.isLooped = !state.isLooped;
    loopBtn.classList.toggle('active', state.isLooped);
}

function handleSongEnd() {
    if (state.isLooped) {
        playNext();
    } else {
        const isLast = state.isShuffled
            ? state.shuffledIndices.indexOf(state.currentIndex) === state.shuffledIndices.length - 1
            : state.currentIndex === state.currentSongs.length - 1;
        if (!isLast) playNext();
        else pause();
    }
}

function onPlay() {
    state.isPlaying = true;
    playPauseBtn.querySelector('i').className = 'fas fa-pause';
    artworkDisc.classList.add('playing');
    equalizerVisual.classList.add('active');
}

function onPause() {
    state.isPlaying = false;
    playPauseBtn.querySelector('i').className = 'fas fa-play';
    artworkDisc.classList.remove('playing');
    equalizerVisual.classList.remove('active');
}

// ========== PROGRESS ==========
function updateDuration() {
    if (!isNaN(audio.duration)) {
        durationEl.textContent = formatTime(audio.duration);
    }
}

function updateProgress() {
    if (!isNaN(audio.duration) && audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        progressThumb.style.left = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

function seekTo(e) {
    if (!state.currentSongs.length || isNaN(audio.duration)) return;
    const rect = progressTrack.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
}

function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ========== KEYBOARD ==========
function setupKeyboard() {
    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT') return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                e.shiftKey ? audio.currentTime = Math.min(audio.duration, audio.currentTime + 10) : playNext();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                e.shiftKey ? audio.currentTime = Math.max(0, audio.currentTime - 10) : playPrevious();
                break;
            case 'ArrowUp':
                e.preventDefault();
                setVolume(Math.min(100, parseInt(volumeSlider.value) + 10));
                break;
            case 'ArrowDown':
                e.preventDefault();
                setVolume(Math.max(0, parseInt(volumeSlider.value) - 10));
                break;
        }
    });
}

// ========== UTILS ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== MEDIA SESSION ==========
if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', playNext);

    audio.addEventListener('loadedmetadata', () => {
        const song = state.currentSongs[state.currentIndex];
        if (song) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: state.currentPlaylist,
                album: 'MBD Music Player'
            });
        }
    });
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', init);
