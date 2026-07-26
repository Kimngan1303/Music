/**
 * YouTube IFrame Player API Wrapper
 * Controls audio/video playback silently via YouTube embedded API.
 */
const YouTubePlayer = (function () {
  let player = null;
  let isReady = false;
  let currentVideoId = null;
  let updateTimer = null;
  let callbacks = {
    onReady: null,
    onStateChange: null,
    onTimeUpdate: null,
    onTrackEnd: null,
    onError: null
  };

  /**
   * Initializes YouTube Player instance when API is loaded
   */
  function init(containerId, options = {}) {
    callbacks = { ...callbacks, ...options };

    window.onYouTubeIframeAPIReady = function () {
      createPlayer(containerId);
    };

    if (window.YT && window.YT.Player) {
      createPlayer(containerId);
    }
  }

  function createPlayer(containerId) {
    if (player) return;

    player = new YT.Player(containerId, {
      height: '1',
      width: '1',
      videoId: '',
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: handlePlayerReady,
        onStateChange: handlePlayerStateChange,
        onError: handlePlayerError
      }
    });
  }

  function handlePlayerReady(event) {
    isReady = true;
    if (callbacks.onReady) callbacks.onReady();
    startProgressTimer();
  }

  function handlePlayerStateChange(event) {
    const state = event.data;
    // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
    if (callbacks.onStateChange) {
      callbacks.onStateChange(state);
    }

    if (state === YT.PlayerState.ENDED) {
      if (callbacks.onTrackEnd) callbacks.onTrackEnd();
    }
  }

  function handlePlayerError(event) {
    console.warn('YouTube Player Error:', event.data);
    if (callbacks.onError) callbacks.onError(event.data);
  }

  function startProgressTimer() {
    if (updateTimer) clearInterval(updateTimer);
    updateTimer = setInterval(() => {
      if (isReady && player && typeof player.getCurrentTime === 'function') {
        const currentTime = player.getCurrentTime() || 0;
        const duration = player.getDuration() || 0;
        if (callbacks.onTimeUpdate) {
          callbacks.onTimeUpdate(currentTime, duration);
        }
      }
    }, 500);
  }

  /**
   * Loads and plays video by YouTube ID
   */
  function loadAndPlay(videoId) {
    currentVideoId = videoId;
    if (!isReady || !player) return;
    if (typeof player.loadVideoById === 'function') {
      player.loadVideoById(videoId);
    }
  }

  function play() {
    if (isReady && player && typeof player.playVideo === 'function') {
      player.playVideo();
    }
  }

  function pause() {
    if (isReady && player && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    }
  }

  function seekTo(seconds) {
    if (isReady && player && typeof player.seekTo === 'function') {
      player.seekTo(seconds, true);
    }
  }

  function setVolume(volumePercentage) {
    if (isReady && player && typeof player.setVolume === 'function') {
      player.setVolume(volumePercentage);
    }
  }

  function getCurrentTime() {
    return (isReady && player && typeof player.getCurrentTime === 'function') ? player.getCurrentTime() : 0;
  }

  function getDuration() {
    return (isReady && player && typeof player.getDuration === 'function') ? player.getDuration() : 0;
  }

  return {
    init: init,
    loadAndPlay: loadAndPlay,
    play: play,
    pause: pause,
    seekTo: seekTo,
    setVolume: setVolume,
    getCurrentTime: getCurrentTime,
    getDuration: getDuration
  };
})();
