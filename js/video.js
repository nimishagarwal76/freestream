let url = window.location.href.split("#")[1];

if (Hls.isSupported()) {
    let video = document.getElementById('video');
    var hls = new Hls();
    let decodedUrl = decodeURIComponent(url)
    hls.loadSource(decodedUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
    });
}