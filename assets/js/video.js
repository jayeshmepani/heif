function playPause(videoId, btn) {
    var video = document.getElementById(videoId);
    if (video.paused) {
        video.play();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        video.pause();
        btn.innerHTML = '<i class="fas fa-play"></i>';
    }
}
