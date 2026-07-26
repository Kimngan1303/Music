/**
 * Aura Music - Main Application Engine
 * Handles State, Playlists, Favorites, History, Navigation, YouTube oEmbed Parsing & UI Events.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Preset Songs (Popular Hits with real YouTube IDs)
  const defaultSongs = [
    {
      id: 'song-1',
      youtubeId: 'L0MK7qz13bU',
      youtubeUrl: 'https://www.youtube.com/watch?v=L0MK7qz13bU',
      title: 'Thiên Lý Ơi',
      artist: 'Jack - J97',
      thumbnail: 'https://img.youtube.com/vi/L0MK7qz13bU/hqdefault.jpg',
      duration: '3:45',
      addedAt: new Date().toISOString()
    },
    {
      id: 'song-2',
      youtubeId: 'abPMYC62668',
      youtubeUrl: 'https://www.youtube.com/watch?v=abPMYC62668',
      title: 'Cắt Đôi Nỗi Sầu',
      artist: 'Tăng Duy Tân',
      thumbnail: 'https://img.youtube.com/vi/abPMYC62668/hqdefault.jpg',
      duration: '3:12',
      addedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'song-3',
      youtubeId: 'kJQP7kiw5Fk',
      youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      title: 'Despacito',
      artist: 'Luis Fonsi ft. Daddy Yankee',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
      duration: '4:42',
      addedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'song-4',
      youtubeId: 'JGwWNGJdvx8',
      youtubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg',
      duration: '4:24',
      addedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: 'song-5',
      youtubeId: 'OPf0YbXqDm0',
      youtubeUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      thumbnail: 'https://img.youtube.com/vi/OPf0YbXqDm0/hqdefault.jpg',
      duration: '4:30',
      addedAt: new Date(Date.now() - 345600000).toISOString()
    }
  ];

  const defaultPlaylists = [
    {
      id: 'pl-chill',
      name: 'Chill & Relax',
      description: 'Giai điệu nhẹ nhàng thư giãn sau giờ làm',
      coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
      songs: ['song-1', 'song-4']
    },
    {
      id: 'pl-vpop',
      name: 'V-Pop Hits 2026',
      description: 'Những bản nhạc Việt thịnh hành nhất',
      coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
      songs: ['song-1', 'song-2']
    }
  ];

  // Global App State
  let state = {
    songs: JSON.parse(localStorage.getItem('aura_songs')) || defaultSongs,
    playlists: JSON.parse(localStorage.getItem('aura_playlists')) || defaultPlaylists,
    favorites: new Set(JSON.parse(localStorage.getItem('aura_favorites')) || ['song-1', 'song-2']),
    history: JSON.parse(localStorage.getItem('aura_history')) || [],
    currentTrackIndex: -1,
    currentPlaylistId: null,
    queue: [],
    isPlaying: false,
    isShuffle: false,
    repeatMode: 'off', // 'off', 'one', 'all'
    volume: 80,
    currentView: 'home',
    activeDetailPlaylistId: null,
    pendingAddMetadata: null
  };

  // DOM Elements
  const DOM = {
    views: document.querySelectorAll('.view-section'),
    navItems: document.querySelectorAll('.nav-item'),
    sidebarPlaylists: document.getElementById('sidebar-playlists'),
    favCountBadge: document.getElementById('fav-count-badge'),
    
    // Player Bar
    playerBar: document.getElementById('player-bar'),
    playerCover: document.getElementById('player-cover'),
    playerTitle: document.getElementById('player-title'),
    playerArtist: document.getElementById('player-artist'),
    playerBtnLike: document.getElementById('player-btn-like'),
    btnPlayPause: document.getElementById('btn-play-pause'),
    playPauseIcon: document.getElementById('play-pause-icon'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnShuffle: document.getElementById('btn-shuffle'),
    btnRepeat: document.getElementById('btn-repeat'),
    currentTimeDisplay: document.getElementById('current-time'),
    totalDurationDisplay: document.getElementById('total-duration'),
    progressWrapper: document.getElementById('progress-wrapper'),
    progressFill: document.getElementById('progress-fill'),
    progressThumb: document.getElementById('progress-thumb'),
    volumeSlider: document.getElementById('volume-slider'),
    btnMute: document.getElementById('btn-mute'),
    volumeIcon: document.getElementById('volume-icon'),
    heroVinyl: document.getElementById('hero-vinyl'),
    heroVinylImg: document.getElementById('hero-vinyl-img'),

    // Add Song Modal
    addMusicModal: document.getElementById('add-music-modal'),
    btnOpenAddModal: document.getElementById('btn-open-add-modal'),
    btnHeaderAddMusic: document.getElementById('btn-header-add-music'),
    btnHeroAddMusic: document.getElementById('btn-hero-add-music'),
    btnCloseAddModal: document.getElementById('btn-close-add-modal'),
    btnCancelAdd: document.getElementById('btn-cancel-add'),
    ytUrlInput: document.getElementById('yt-url-input'),
    btnFetchYtMetadata: document.getElementById('btn-fetch-yt-metadata'),
    ytUrlError: document.getElementById('yt-url-error'),
    songPreviewCard: document.getElementById('song-preview-card'),
    previewThumbnail: document.getElementById('preview-thumbnail'),
    previewTitle: document.getElementById('preview-title'),
    previewArtist: document.getElementById('preview-artist'),
    previewDurationVal: document.getElementById('preview-duration-val'),
    addOptionsGroup: document.getElementById('add-options-group'),
    chkAddFavorites: document.getElementById('chk-add-favorites'),
    selectTargetPlaylist: document.getElementById('select-target-playlist'),
    btnConfirmAddMusic: document.getElementById('btn-confirm-add-music'),

    // Create Playlist Modal
    createPlaylistModal: document.getElementById('create-playlist-modal'),
    btnQuickCreatePlaylist: document.getElementById('btn-quick-create-playlist'),
    btnCreatePlaylistMain: document.getElementById('btn-create-playlist-main'),
    btnClosePlaylistModal: document.getElementById('btn-close-playlist-modal'),
    btnCancelPlaylistCreate: document.getElementById('btn-cancel-playlist-create'),
    playlistNameInput: document.getElementById('playlist-name-input'),
    playlistDescInput: document.getElementById('playlist-desc-input'),
    btnConfirmCreatePlaylist: document.getElementById('btn-confirm-create-playlist'),

    // Add to Playlist Picker Modal
    pickerModal: document.getElementById('add-to-playlist-picker-modal'),
    btnClosePickerModal: document.getElementById('btn-close-picker-modal'),
    pickerPlaylistList: document.getElementById('picker-playlist-list'),

    // Visualizer
    btnVisualizerToggle: document.getElementById('btn-visualizer-toggle'),
    visualizerContainer: document.getElementById('visualizer-container'),
    btnCloseVisualizer: document.getElementById('btn-close-visualizer'),

    // Search
    globalSearchInput: document.getElementById('global-search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    
    // Theme Toggle
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIcon: document.getElementById('theme-icon'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    sidebar: document.querySelector('.sidebar')
  };

  /**
   * Initializes the Application
   */
  function init() {
    Visualizer.init();
    initYouTubePlayer();
    bindEvents();
    renderAllViews();
    updateFavoritesBadge();

    // Default Queue is all library songs
    state.queue = [...state.songs];
  }

  function saveState() {
    localStorage.setItem('aura_songs', JSON.stringify(state.songs));
    localStorage.setItem('aura_playlists', JSON.stringify(state.playlists));
    localStorage.setItem('aura_favorites', JSON.stringify(Array.from(state.favorites)));
    localStorage.setItem('aura_history', JSON.stringify(state.history));
  }

  /**
   * Initializes YouTube Player with callbacks
   */
  function initYouTubePlayer() {
    YouTubePlayer.init('youtube-player-hidden', {
      onReady: () => {
        console.log('YouTube IFrame Player is ready.');
      },
      onStateChange: (playerState) => {
        // YT.PlayerState.PLAYING = 1, PAUSED = 2
        if (playerState === 1) {
          state.isPlaying = true;
          updatePlayerControlsUI();
          Visualizer.setPlayingState(true);
          if (DOM.heroVinyl) DOM.heroVinyl.classList.add('playing');
        } else if (playerState === 2) {
          state.isPlaying = false;
          updatePlayerControlsUI();
          Visualizer.setPlayingState(false);
          if (DOM.heroVinyl) DOM.heroVinyl.classList.remove('playing');
        }
      },
      onTimeUpdate: (currentTime, duration) => {
        updateProgressUI(currentTime, duration);
      },
      onTrackEnd: () => {
        handleTrackEnd();
      },
      onError: (err) => {
        showToast('Khôn thể phát bài hát này trên YouTube.', 'error');
        playNextTrack();
      }
    });
  }

  /**
   * Updates Progress Bar and Time Counters
   */
  function updateProgressUI(currentTime, duration) {
    DOM.currentTimeDisplay.textContent = formatTime(currentTime);
    DOM.totalDurationDisplay.textContent = formatTime(duration);

    if (duration > 0) {
      const percentage = (currentTime / duration) * 100;
      DOM.progressFill.style.width = `${percentage}%`;
      DOM.progressThumb.style.left = `${percentage}%`;
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  /**
   * Plays a track by Song Object
   */
  function playSong(song, playlistId = null) {
    if (!song) return;

    if (playlistId) {
      const pl = state.playlists.find(p => p.id === playlistId);
      if (pl) {
        state.queue = state.songs.filter(s => pl.songs.includes(s.id));
      }
    } else {
      state.queue = [...state.songs];
    }

    state.currentTrackIndex = state.queue.findIndex(s => s.id === song.id);
    state.isPlaying = true;

    // Load into YouTube Player
    YouTubePlayer.loadAndPlay(song.youtubeId);

    // Update Player Bar Info
    DOM.playerTitle.textContent = song.title;
    DOM.playerArtist.textContent = song.artist;
    DOM.playerCover.src = song.thumbnail;
    if (DOM.heroVinylImg) DOM.heroVinylImg.src = song.thumbnail;

    // Like Button State
    if (state.favorites.has(song.id)) {
      DOM.playerBtnLike.classList.add('liked');
      DOM.playerBtnLike.querySelector('i').className = 'ri-heart-fill';
    } else {
      DOM.playerBtnLike.classList.remove('liked');
      DOM.playerBtnLike.querySelector('i').className = 'ri-heart-line';
    }

    // Dynamic Theme Update
    ColorExtractor.updateThemeForTrack(song);

    // Add to Recently Played History
    addToHistory(song.id);

    // Update UI highlights
    updatePlayerControlsUI();
    renderActiveSongHighlight();
  }

  function togglePlayPause() {
    if (state.currentTrackIndex === -1 && state.songs.length > 0) {
      playSong(state.songs[0]);
      return;
    }

    if (state.isPlaying) {
      YouTubePlayer.pause();
    } else {
      YouTubePlayer.play();
    }
  }

  function playNextTrack() {
    if (state.queue.length === 0) return;

    if (state.isShuffle) {
      const randomIndex = Math.floor(Math.random() * state.queue.length);
      state.currentTrackIndex = randomIndex;
    } else {
      state.currentTrackIndex = (state.currentTrackIndex + 1) % state.queue.length;
    }

    playSong(state.queue[state.currentTrackIndex]);
  }

  function playPrevTrack() {
    if (state.queue.length === 0) return;

    if (YouTubePlayer.getCurrentTime() > 3) {
      YouTubePlayer.seekTo(0);
      return;
    }

    state.currentTrackIndex = (state.currentTrackIndex - 1 + state.queue.length) % state.queue.length;
    playSong(state.queue[state.currentTrackIndex]);
  }

  function handleTrackEnd() {
    if (state.repeatMode === 'one') {
      YouTubePlayer.seekTo(0);
      YouTubePlayer.play();
    } else {
      playNextTrack();
    }
  }

  function updatePlayerControlsUI() {
    if (state.isPlaying) {
      DOM.playPauseIcon.className = 'ri-pause-fill';
    } else {
      DOM.playPauseIcon.className = 'ri-play-fill';
    }

    DOM.btnShuffle.classList.toggle('active', state.isShuffle);
    
    if (state.repeatMode === 'one') {
      DOM.btnRepeat.classList.add('active');
      DOM.btnRepeat.querySelector('i').className = 'ri-repeat-one-line';
    } else if (state.repeatMode === 'all') {
      DOM.btnRepeat.classList.add('active');
      DOM.btnRepeat.querySelector('i').className = 'ri-repeat-2-line';
    } else {
      DOM.btnRepeat.classList.remove('active');
      DOM.btnRepeat.querySelector('i').className = 'ri-repeat-2-line';
    }
  }

  /**
   * Favorites Management
   */
  function toggleFavorite(songId) {
    if (state.favorites.has(songId)) {
      state.favorites.delete(songId);
      showToast('Đã xóa khỏi danh sách Yêu thích', 'info');
    } else {
      state.favorites.add(songId);
      showToast('Đã thêm vào danh sách Yêu thích ❤️', 'success');
    }

    saveState();
    updateFavoritesBadge();
    renderFavoritesView();
    renderLibraryView();
    
    // Update player button if currently playing
    const currentSong = state.queue[state.currentTrackIndex];
    if (currentSong && currentSong.id === songId) {
      if (state.favorites.has(songId)) {
        DOM.playerBtnLike.classList.add('liked');
        DOM.playerBtnLike.querySelector('i').className = 'ri-heart-fill';
      } else {
        DOM.playerBtnLike.classList.remove('liked');
        DOM.playerBtnLike.querySelector('i').className = 'ri-heart-line';
      }
    }
  }

  function updateFavoritesBadge() {
    DOM.favCountBadge.textContent = state.favorites.size;
  }

  /**
   * History Logging
   */
  function addToHistory(songId) {
    // Remove if existing to put on top
    state.history = state.history.filter(h => h.songId !== songId);
    state.history.unshift({ songId, playedAt: new Date().toISOString() });
    if (state.history.length > 50) state.history.pop();
    saveState();
    renderHomeView();
    renderHistoryView();
  }

  /**
   * YouTube Link Parser via oEmbed API
   */
  function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  async function fetchYouTubeMetadata(url) {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      DOM.ytUrlError.textContent = 'Đường dẫn YouTube không hợp lệ. Vui lòng nhập link dạng: https://www.youtube.com/watch?v=...';
      return;
    }

    DOM.ytUrlError.textContent = '';
    DOM.btnFetchYtMetadata.innerHTML = '<i class="ri-loader-4-line spin"></i> Đang tải...';

    try {
      // Use YouTube oEmbed API to get metadata without needing API Key!
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (!response.ok) throw new Error('Không lấy được dữ liệu video');

      const data = await response.json();
      
      state.pendingAddMetadata = {
        id: `song-${Date.now()}`,
        youtubeId: videoId,
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        title: data.title || 'Bài hát YouTube',
        artist: data.author_name || 'YouTube Creator',
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        duration: '3:30', // Default fallback duration
        addedAt: new Date().toISOString()
      };

      // Show Preview UI
      DOM.previewThumbnail.src = state.pendingAddMetadata.thumbnail;
      DOM.previewTitle.textContent = state.pendingAddMetadata.title;
      DOM.previewArtist.textContent = state.pendingAddMetadata.artist;
      DOM.previewDurationVal.textContent = state.pendingAddMetadata.duration;

      DOM.songPreviewCard.style.display = 'flex';
      DOM.addOptionsGroup.style.display = 'flex';
      DOM.btnConfirmAddMusic.style.display = 'inline-flex';
      
      populateTargetPlaylistSelect();
    } catch (err) {
      DOM.ytUrlError.textContent = 'Khôn thể lấy thông tin video này. Kiểm tra xem video có bị riêng tư hoặc giới hạn không.';
    } finally {
      DOM.btnFetchYtMetadata.innerHTML = '<i class="ri-search-2-line"></i> Kiểm tra Link';
    }
  }

  function confirmAddMusic() {
    if (!state.pendingAddMetadata) return;

    const newSong = state.pendingAddMetadata;
    state.songs.unshift(newSong);

    if (DOM.chkAddFavorites.checked) {
      state.favorites.add(newSong.id);
    }

    const selectedPlId = DOM.selectTargetPlaylist.value;
    if (selectedPlId) {
      const pl = state.playlists.find(p => p.id === selectedPlId);
      if (pl && !pl.songs.includes(newSong.id)) {
        pl.songs.push(newSong.id);
      }
    }

    saveState();
    closeAddMusicModal();
    renderAllViews();
    showToast(`Đã thêm bài hát "${newSong.title}" vào Thư viện!`, 'success');
  }

  function populateTargetPlaylistSelect() {
    DOM.selectTargetPlaylist.innerHTML = '<option value="">-- Không thêm vào Playlist --</option>';
    state.playlists.forEach(pl => {
      const opt = document.createElement('option');
      opt.value = pl.id;
      opt.textContent = pl.name;
      DOM.selectTargetPlaylist.appendChild(opt);
    });
  }

  /**
   * Playlist Creation & Management
   */
  function createPlaylist(name, description) {
    if (!name.trim()) return;

    const newPl = {
      id: `pl-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Playlist cá nhân',
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
      songs: []
    };

    state.playlists.push(newPl);
    saveState();
    renderSidebarPlaylists();
    renderPlaylistsOverview();
    showToast(`Đã tạo Playlist "${newPl.name}"`, 'success');
  }

  function deletePlaylist(playlistId) {
    state.playlists = state.playlists.filter(p => p.id !== playlistId);
    saveState();
    renderSidebarPlaylists();
    renderPlaylistsOverview();
    switchView('playlists');
    showToast('Đã xóa Playlist', 'info');
  }

  function addSongToPlaylist(songId, playlistId) {
    const pl = state.playlists.find(p => p.id === playlistId);
    if (!pl) return;

    if (pl.songs.includes(songId)) {
      showToast('Bài hát đã có trong playlist này!', 'info');
      return;
    }

    pl.songs.push(songId);
    saveState();
    showToast(`Đã thêm bài hát vào playlist "${pl.name}"`, 'success');
    closePickerModal();
    if (state.currentView === 'playlist-detail') renderPlaylistDetailView(playlistId);
  }

  function removeSongFromPlaylist(songId, playlistId) {
    const pl = state.playlists.find(p => p.id === playlistId);
    if (!pl) return;

    pl.songs = pl.songs.filter(id => id !== songId);
    saveState();
    renderPlaylistDetailView(playlistId);
    showToast('Đã xóa bài hát khỏi playlist', 'info');
  }

  /**
   * View Rendering Logic
   */
  function switchView(viewName, param = null) {
    state.currentView = viewName;
    DOM.views.forEach(v => v.classList.remove('active'));
    
    DOM.navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add('active');

    if (viewName === 'home') renderHomeView();
    else if (viewName === 'library') renderLibraryView();
    else if (viewName === 'favorites') renderFavoritesView();
    else if (viewName === 'playlists') renderPlaylistsOverview();
    else if (viewName === 'playlist-detail' && param) {
      state.activeDetailPlaylistId = param;
      renderPlaylistDetailView(param);
    }
    else if (viewName === 'history') renderHistoryView();

    // Close mobile menu
    DOM.sidebar.classList.remove('active');
  }

  function renderAllViews() {
    renderSidebarPlaylists();
    renderHomeView();
    renderLibraryView();
    renderFavoritesView();
    renderPlaylistsOverview();
    renderHistoryView();
  }

  function renderSidebarPlaylists() {
    DOM.sidebarPlaylists.innerHTML = '';
    state.playlists.forEach(pl => {
      const item = document.createElement('div');
      item.className = 'sidebar-playlist-item';
      item.innerHTML = `<i class="ri-playlist-2-line"></i><span>${escapeHtml(pl.name)}</span>`;
      item.onclick = () => switchView('playlist-detail', pl.id);
      DOM.sidebarPlaylists.appendChild(item);
    });
  }

  function renderHomeView() {
    // Recently Played Grid (top 4)
    const recentGrid = document.getElementById('recently-played-grid');
    recentGrid.innerHTML = '';
    const recentSongs = state.history.slice(0, 6).map(h => state.songs.find(s => s.id === h.songId)).filter(Boolean);

    if (recentSongs.length === 0) {
      recentGrid.innerHTML = '<p class="text-muted">Chưa có lịch sử nghe nhạc.</p>';
    } else {
      recentSongs.forEach(song => {
        const card = createCardItem(song.title, song.artist, song.thumbnail, () => playSong(song));
        recentGrid.appendChild(card);
      });
    }

    // Recommended Playlists Grid
    const recGrid = document.getElementById('recommended-playlists-grid');
    recGrid.innerHTML = '';
    state.playlists.forEach(pl => {
      const card = createCardItem(pl.name, `${pl.songs.length} bài hát`, pl.coverImage, () => switchView('playlist-detail', pl.id));
      recGrid.appendChild(card);
    });

    // Recently Added Songs List
    const songsList = document.getElementById('recent-songs-list');
    songsList.innerHTML = '';
    state.songs.slice(0, 5).forEach((song, idx) => {
      songsList.appendChild(createSongRow(song, idx + 1));
    });
  }

  function renderLibraryView() {
    const listContainer = document.getElementById('library-song-list');
    listContainer.innerHTML = '';

    const sortType = document.getElementById('library-sort').value;
    let sorted = [...state.songs];

    if (sortType === 'recent') {
      sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    } else if (sortType === 'alpha') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    sorted.forEach((song, idx) => {
      listContainer.appendChild(createSongRow(song, idx + 1));
    });
  }

  function renderFavoritesView() {
    const listContainer = document.getElementById('favorites-song-list');
    listContainer.innerHTML = '';

    const favSongs = state.songs.filter(s => state.favorites.has(s.id));
    document.getElementById('fav-song-count').textContent = `${favSongs.length} bài hát`;

    if (favSongs.length === 0) {
      listContainer.innerHTML = '<div class="empty-state"><p>Chưa có bài hát yêu thích nào. Hãy nhấn biểu tượng ❤️ để thêm bài hát!</p></div>';
    } else {
      favSongs.forEach((song, idx) => {
        listContainer.appendChild(createSongRow(song, idx + 1));
      });
    }
  }

  function renderPlaylistsOverview() {
    const grid = document.getElementById('playlists-overview-grid');
    grid.innerHTML = '';

    state.playlists.forEach(pl => {
      const card = createCardItem(pl.name, `${pl.songs.length} bài hát • ${pl.description}`, pl.coverImage, () => switchView('playlist-detail', pl.id));
      grid.appendChild(card);
    });
  }

  function renderPlaylistDetailView(playlistId) {
    const pl = state.playlists.find(p => p.id === playlistId);
    if (!pl) return;

    document.getElementById('playlist-detail-title').textContent = pl.name;
    document.getElementById('playlist-detail-desc').textContent = pl.description;
    document.getElementById('playlist-detail-cover').src = pl.coverImage;
    document.getElementById('playlist-detail-count').textContent = `${pl.songs.length} bài hát`;

    const songList = document.getElementById('playlist-detail-song-list');
    songList.innerHTML = '';

    const plSongs = state.songs.filter(s => pl.songs.includes(s.id));
    if (plSongs.length === 0) {
      songList.innerHTML = '<div class="empty-state"><p>Playlist này chưa có bài hát nào. Hãy thêm nhạc vào nhé!</p></div>';
    } else {
      plSongs.forEach((song, idx) => {
        songList.appendChild(createSongRow(song, idx + 1, playlistId));
      });
    }
  }

  function renderHistoryView() {
    const listContainer = document.getElementById('history-song-list');
    listContainer.innerHTML = '';

    const histSongs = state.history.map(h => state.songs.find(s => s.id === h.songId)).filter(Boolean);

    if (histSongs.length === 0) {
      listContainer.innerHTML = '<div class="empty-state"><p>Chưa có lịch sử nghe nhạc.</p></div>';
    } else {
      histSongs.forEach((song, idx) => {
        listContainer.appendChild(createSongRow(song, idx + 1));
      });
    }
  }

  /**
   * UI Element Creators
   */
  function createCardItem(title, subtitle, coverUrl, onClick) {
    const card = document.createElement('div');
    card.className = 'card-item';
    card.innerHTML = `
      <div class="card-cover-wrapper">
        <img src="${coverUrl}" alt="Cover" class="card-cover-img">
        <button class="card-play-btn"><i class="ri-play-fill"></i></button>
      </div>
      <h4 class="card-title">${escapeHtml(title)}</h4>
      <p class="card-subtitle">${escapeHtml(subtitle)}</p>
    `;
    card.onclick = onClick;
    return card;
  }

  function createSongRow(song, index, fromPlaylistId = null) {
    const row = document.createElement('div');
    row.className = 'song-row';
    row.setAttribute('data-id', song.id);

    const isLiked = state.favorites.has(song.id);

    row.innerHTML = `
      <span class="song-index">${index}</span>
      <div class="song-thumbnail-wrapper">
        <img src="${song.thumbnail}" alt="Thumbnail">
        <div class="song-row-play-overlay"><i class="ri-play-fill"></i></div>
      </div>
      <div class="song-meta-main">
        <span class="song-row-title">${escapeHtml(song.title)}</span>
        <span class="song-row-artist">${escapeHtml(song.artist)}</span>
      </div>
      <span class="song-row-added">${new Date(song.addedAt).toLocaleDateString('vi-VN')}</span>
      <span class="song-row-duration">${song.duration}</span>
      <div class="song-row-actions">
        <button class="icon-btn-action btn-row-fav ${isLiked ? 'liked' : ''}" title="Yêu thích">
          <i class="${isLiked ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
        </button>
        <button class="icon-btn-action btn-row-add-pl" title="Thêm vào Playlist">
          <i class="ri-playlist-add-line"></i>
        </button>
        ${fromPlaylistId ? `
          <button class="icon-btn-action btn-row-remove-pl" title="Xóa khỏi Playlist">
            <i class="ri-delete-bin-line"></i>
          </button>
        ` : ''}
      </div>
    `;

    // Row Play Action
    row.querySelector('.song-thumbnail-wrapper').onclick = () => playSong(song, fromPlaylistId);
    row.querySelector('.song-meta-main').onclick = () => playSong(song, fromPlaylistId);

    // Fav Toggle
    row.querySelector('.btn-row-fav').onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(song.id);
    };

    // Add to Playlist Picker
    row.querySelector('.btn-row-add-pl').onclick = (e) => {
      e.stopPropagation();
      openPickerModal(song.id);
    };

    // Remove from Playlist
    if (fromPlaylistId) {
      row.querySelector('.btn-row-remove-pl').onclick = (e) => {
        e.stopPropagation();
        removeSongFromPlaylist(song.id, fromPlaylistId);
      };
    }

    return row;
  }

  function renderActiveSongHighlight() {
    const activeSong = state.queue[state.currentTrackIndex];
    document.querySelectorAll('.song-row').forEach(row => {
      const rowId = row.getAttribute('data-id');
      if (activeSong && rowId === activeSong.id) {
        row.classList.add('playing');
      } else {
        row.classList.remove('playing');
      }
    });
  }

  /**
   * Modals & Dialog Handlers
   */
  function openAddMusicModal() {
    DOM.addMusicModal.classList.add('active');
  }

  function closeAddMusicModal() {
    DOM.addMusicModal.classList.remove('active');
    DOM.ytUrlInput.value = '';
    DOM.ytUrlError.textContent = '';
    DOM.songPreviewCard.style.display = 'none';
    DOM.addOptionsGroup.style.display = 'none';
    DOM.btnConfirmAddMusic.style.display = 'none';
    state.pendingAddMetadata = null;
  }

  function openPickerModal(songId) {
    DOM.pickerPlaylistList.innerHTML = '';

    if (state.playlists.length === 0) {
      DOM.pickerPlaylistList.innerHTML = '<p class="text-muted">Chưa có playlist nào. Hãy tạo mới trước!</p>';
    } else {
      state.playlists.forEach(pl => {
        const item = document.createElement('div');
        item.className = 'sidebar-playlist-item';
        item.innerHTML = `<i class="ri-playlist-2-line"></i><span>${escapeHtml(pl.name)}</span>`;
        item.onclick = () => addSongToPlaylist(songId, pl.id);
        DOM.pickerPlaylistList.appendChild(item);
      });
    }

    DOM.pickerModal.classList.add('active');
  }

  function closePickerModal() {
    DOM.pickerModal.classList.remove('active');
  }

  /**
   * Bind Events & Interactivity
   */
  function bindEvents() {
    // Navigation Routing
    DOM.navItems.forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        switchView(view);
      };
    });

    // Top Header Buttons
    DOM.btnHeaderAddMusic.onclick = openAddMusicModal;
    DOM.btnOpenAddModal.onclick = openAddMusicModal;
    if (DOM.btnHeroAddMusic) DOM.btnHeroAddMusic.onclick = openAddMusicModal;

    DOM.btnCloseAddModal.onclick = closeAddMusicModal;
    DOM.btnCancelAdd.onclick = closeAddMusicModal;

    // Fetch YouTube Metadata Button
    DOM.btnFetchYtMetadata.onclick = () => {
      fetchYouTubeMetadata(DOM.ytUrlInput.value);
    };

    DOM.btnConfirmAddMusic.onclick = confirmAddMusic;

    // Quick Create Playlist Modal
    DOM.btnQuickCreatePlaylist.onclick = () => DOM.createPlaylistModal.classList.add('active');
    DOM.btnCreatePlaylistMain.onclick = () => DOM.createPlaylistModal.classList.add('active');
    DOM.btnClosePlaylistModal.onclick = () => DOM.createPlaylistModal.classList.remove('active');
    DOM.btnCancelPlaylistCreate.onclick = () => DOM.createPlaylistModal.classList.remove('active');

    DOM.btnConfirmCreatePlaylist.onclick = () => {
      createPlaylist(DOM.playlistNameInput.value, DOM.playlistDescInput.value);
      DOM.createPlaylistModal.classList.remove('active');
      DOM.playlistNameInput.value = '';
      DOM.playlistDescInput.value = '';
    };

    DOM.btnClosePickerModal.onclick = closePickerModal;

    // Player Controls
    DOM.btnPlayPause.onclick = togglePlayPause;
    DOM.btnNext.onclick = playNextTrack;
    DOM.btnPrev.onclick = playPrevTrack;

    DOM.btnShuffle.onclick = () => {
      state.isShuffle = !state.isShuffle;
      updatePlayerControlsUI();
      showToast(state.isShuffle ? 'Đã bật phát ngẫu nhiên' : 'Đã tắt phát ngẫu nhiên', 'info');
    };

    DOM.btnRepeat.onclick = () => {
      if (state.repeatMode === 'off') state.repeatMode = 'all';
      else if (state.repeatMode === 'all') state.repeatMode = 'one';
      else state.repeatMode = 'off';

      updatePlayerControlsUI();
      showToast(`Chế độ lặp: ${state.repeatMode}`, 'info');
    };

    // Like Player Button
    DOM.playerBtnLike.onclick = () => {
      const currentSong = state.queue[state.currentTrackIndex];
      if (currentSong) toggleFavorite(currentSong.id);
    };

    // Hero Buttons
    if (document.getElementById('btn-hero-play-all')) {
      document.getElementById('btn-hero-play-all').onclick = () => {
        state.isShuffle = true;
        playNextTrack();
      };
    }

    if (document.getElementById('btn-fav-play-all')) {
      document.getElementById('btn-fav-play-all').onclick = () => {
        const favs = state.songs.filter(s => state.favorites.has(s.id));
        if (favs.length > 0) {
          state.queue = favs;
          playSong(favs[0]);
        }
      };
    }

    if (document.getElementById('btn-fav-shuffle')) {
      document.getElementById('btn-fav-shuffle').onclick = () => {
        const favs = state.songs.filter(s => state.favorites.has(s.id));
        if (favs.length > 0) {
          state.queue = favs;
          state.isShuffle = true;
          playNextTrack();
        }
      };
    }

    if (document.getElementById('btn-playlist-detail-play')) {
      document.getElementById('btn-playlist-detail-play').onclick = () => {
        const pl = state.playlists.find(p => p.id === state.activeDetailPlaylistId);
        if (pl && pl.songs.length > 0) {
          const songs = state.songs.filter(s => pl.songs.includes(s.id));
          if (songs.length > 0) playSong(songs[0], pl.id);
        }
      };
    }

    if (document.getElementById('btn-delete-playlist')) {
      document.getElementById('btn-delete-playlist').onclick = () => {
        if (confirm('Bạn có chắc chắn muốn xóa playlist này không?')) {
          deletePlaylist(state.activeDetailPlaylistId);
        }
      };
    }

    // Scrub Progress Bar Seeking
    DOM.progressWrapper.onclick = (e) => {
      const rect = DOM.progressWrapper.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const duration = YouTubePlayer.getDuration();
      if (duration > 0) {
        YouTubePlayer.seekTo(duration * percentage);
      }
    };

    // Volume Slider
    DOM.volumeSlider.oninput = (e) => {
      const val = parseInt(e.target.value);
      state.volume = val;
      YouTubePlayer.setVolume(val);
      if (val === 0) DOM.volumeIcon.className = 'ri-volume-mute-line';
      else DOM.volumeIcon.className = 'ri-volume-up-line';
    };

    // Visualizer Toggle
    DOM.btnVisualizerToggle.onclick = () => {
      DOM.visualizerContainer.classList.toggle('active');
      Visualizer.startVisualizer();
    };

    DOM.btnCloseVisualizer.onclick = () => {
      DOM.visualizerContainer.classList.remove('active');
    };

    // Global Search
    DOM.globalSearchInput.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      DOM.clearSearchBtn.style.display = query ? 'block' : 'none';

      if (!query) {
        renderAllViews();
        return;
      }

      // Filter Library
      const filtered = state.songs.filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));
      const listContainer = document.getElementById('library-song-list');
      listContainer.innerHTML = '';
      if (filtered.length === 0) {
        listContainer.innerHTML = '<p class="text-muted">Không tìm thấy bài hát phù hợp.</p>';
      } else {
        filtered.forEach((song, idx) => {
          listContainer.appendChild(createSongRow(song, idx + 1));
        });
      }
      switchView('library');
    };

    DOM.clearSearchBtn.onclick = () => {
      DOM.globalSearchInput.value = '';
      DOM.clearSearchBtn.style.display = 'none';
      renderLibraryView();
    };

    // Theme Mode Toggle (Dark / Light)
    DOM.themeToggleBtn.onclick = () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      DOM.themeIcon.className = isLight ? 'ri-sun-line' : 'ri-moon-clear-line';
    };

    // Mobile Navigation Toggle
    DOM.mobileMenuBtn.onclick = () => {
      DOM.sidebar.classList.toggle('active');
    };
  }

  /**
   * Toast Notification Utility
   */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'ri-checkbox-circle-fill';
    if (type === 'error') iconClass = 'ri-error-warning-fill';
    else if (type === 'info') iconClass = 'ri-information-fill';

    toast.innerHTML = `<i class="${iconClass}"></i><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Launch App
  init();
});
