function playPause(a, e) {
  var s = document.getElementById(a);
  s.paused
    ? (s.play(), (e.innerHTML = '<i class="fas fa-pause"></i>'))
    : (s.pause(), (e.innerHTML = '<i class="fas fa-play"></i>'));
}
