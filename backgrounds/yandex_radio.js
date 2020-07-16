"use strict";

chrome.runtime.onConnect.addListener(port => {
    if (port.name == "Yandex Radio Background Connection") {
        // called from yandex_radio content file
        // to get song data for scrobbling
        port.onMessage.addListener(songIdx => {
            const url = "https://music.yandex.ru/handlers/track.jsx?track=" + songIdx;

            fetch(url).then(r => r.json()).then(result => {
                const album = result.track.albums[0].title;
                const duration = Math.floor(result.track.durationMs / 1000);
                const albumNumber = result.track.albums[0].trackPosition.index;

                const songArtist = result.track.artists[0].name;
                const albumArtist = result.track.albums[0].artists[0].name;

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
