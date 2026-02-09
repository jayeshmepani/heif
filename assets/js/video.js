const PLAY_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
  PAUSE_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';
let controlTimeouts = {};

function showControls(i) {
  const video = i.querySelector("video");
  if (!video) return;
  const videoId = video.id;

  i.classList.add("show-controls");

  if (controlTimeouts[videoId]) {
    clearTimeout(controlTimeouts[videoId]);
  }

  controlTimeouts[videoId] = setTimeout(() => {
    i.classList.remove("show-controls");
    delete controlTimeouts[videoId];
  }, 3000);
}

function loadVideosInBackground() {
  document.querySelectorAll("video[data-src]").forEach((video) => {
    if (!video.querySelector("source")) {
      const source = document.createElement("source");
      source.src = video.getAttribute("data-src");
      source.type = "video/mp4";
      video.appendChild(source);
      video.load();
    }
  });
}

function togglePlay(e) {
  var t = document.getElementById(e),
    i = t.closest(".video-item"),
    n = i.querySelector(".play-btn");

  // Ensure video is loaded if it hasn't been yet (fallback)
  if (!t.querySelector("source") && t.getAttribute("data-src")) {
    const source = document.createElement("source");
    source.src = t.getAttribute("data-src");
    source.type = "video/mp4";
    t.appendChild(source);
    t.load();
  }

  if (t.paused) {
    // Pause all other playing videos
    document.querySelectorAll(".video-item.is-playing").forEach((playingItem) => {
      const otherVideo = playingItem.querySelector("video");
      const otherPlayBtn = playingItem.querySelector(".play-btn");
      if (otherVideo && otherVideo.id !== e) {
        otherVideo.pause();
        playingItem.classList.remove("is-playing");
        playingItem.classList.remove("show-controls");
        if (otherPlayBtn) otherPlayBtn.innerHTML = PLAY_ICON;
        if (controlTimeouts[otherVideo.id]) {
          clearTimeout(controlTimeouts[otherVideo.id]);
          delete controlTimeouts[otherVideo.id];
        }
      }
    });

    t.play();
    i.classList.add("is-playing");
    n.innerHTML = PAUSE_ICON;
    // Show controls briefly when starting
    showControls(i);
  } else {
    t.pause();
    i.classList.remove("is-playing");
    i.classList.remove("show-controls");
    n.innerHTML = PLAY_ICON;
    if (controlTimeouts[e]) {
      clearTimeout(controlTimeouts[e]);
      delete controlTimeouts[e];
    }
  }

  t.onended = function () {
    i.classList.remove("is-playing");
    i.classList.remove("show-controls");
    n.innerHTML = PLAY_ICON;
    if (controlTimeouts[e]) {
      clearTimeout(controlTimeouts[e]);
      delete controlTimeouts[e];
    }
  };
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".play-btn").forEach((e) => {
    e.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent thumbnail click from firing
      const video = this.closest(".video-item").querySelector("video");
      if (video && video.id) {
        togglePlay(video.id);
      }
    });
  });

  document.querySelectorAll(".video-thumbnail").forEach((e) => {
    const t = e.querySelector("video");
    const i = e.closest(".video-item");
    if (t && t.id) {
      e.addEventListener("click", function (event) {
        if (event.target.classList.contains("play-btn")) return;

        if (i.classList.contains("is-playing")) {
          // If controls are already shown, a second click on the video should toggle play
          if (i.classList.contains("show-controls")) {
            togglePlay(t.id);
          } else {
            // First click on playing video just shows controls
            showControls(i);
          }
        } else {
          // If not playing, click to play
          togglePlay(t.id);
        }
      });
    }
  });
});

window.addEventListener("load", loadVideosInBackground);
