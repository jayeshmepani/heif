const PLAY_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
  PAUSE_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';
function togglePlay(e) {
  var t = document.getElementById(e),
    i = t.closest(".video-item"),
    n = i.querySelector(".play-btn");
  (t.paused
    ? (t.play(), i.classList.add("is-playing"), (n.innerHTML = PAUSE_ICON))
    : (t.pause(), i.classList.remove("is-playing"), (n.innerHTML = PLAY_ICON)),
    (t.onended = function () {
      (i.classList.remove("is-playing"), (n.innerHTML = PLAY_ICON));
    }));
}
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".play-btn").forEach((e) => {
    e.addEventListener("click", function () {
      const e = this.closest(".video-item").querySelector("video");
      e && e.id && togglePlay(e.id);
    });
  });
  document.querySelectorAll(".video-thumbnail").forEach((e) => {
    const t = e.querySelector("video");
    t &&
      t.id &&
      e.addEventListener("click", function (e) {
        e.target.classList.contains("play-btn") || togglePlay(t.id);
      });
  });
});
