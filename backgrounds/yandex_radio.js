"use strict";

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name == "Yandex Radio Background Connection") {
        // called from yandex_radio content file
        // to get song data for scrobbling
        port.onMessage.addListener(function(songIdx) {
            let url = "https://music.yandex.ru/handlers/track.jsx?track=" + songIdx;

            fetch(url).then(r => r.json()).then(result => {
                let album = result.track.albums[0].title;
                let duration = Math.floor(result.track.durationMs / 1000);
                let albumNumber = result.track.albums[0].trackPosition.index;

                let songArtist = result.track.artists[0].name;
                let albumArtist = result.track.albums[0].artists[0].name;

                port.postMessage({
                    album: album,
                    duration: duration,
                    albumNumber: albumNumber,
                    albumArtist: songArtist != albumArtist ? albumArtist : null
                });
            });
        });
    }
});
