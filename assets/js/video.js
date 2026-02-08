const PLAY_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
  PAUSE_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';
function togglePlay(e) {
  var i = document.getElementById(e),
    t = i.closest(".video-item"),
    n = t.querySelector(".play-btn");
  (i.paused
    ? (i.play(), t.classList.add("is-playing"), (n.innerHTML = PAUSE_ICON))
    : (i.pause(), t.classList.remove("is-playing"), (n.innerHTML = PLAY_ICON)),
    (i.onended = function () {
      (t.classList.remove("is-playing"), (n.innerHTML = PLAY_ICON));
    }));
}
