const PLAY_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
  PAUSE_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';
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

  t.paused
    ? (t.play(), i.classList.add("is-playing"), (n.innerHTML = PAUSE_ICON))
    : (t.pause(), i.classList.remove("is-playing"), (n.innerHTML = PLAY_ICON)),
    (t.onended = function () {
      i.classList.remove("is-playing"), (n.innerHTML = PLAY_ICON);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".play-btn").forEach((e) => {
    e.addEventListener("click", function () {
      const video = this.closest(".video-item").querySelector("video");
      if (video && video.id) {
        togglePlay(video.id);
      }
    });
  });

  document.querySelectorAll(".video-thumbnail").forEach((e) => {
    const t = e.querySelector("video");
    if (t && t.id) {
      e.addEventListener("click", function (event) {
        if (!event.target.classList.contains("play-btn")) {
          togglePlay(t.id);
        }
      });
    }
  });
});

window.addEventListener("load", loadVideosInBackground);
