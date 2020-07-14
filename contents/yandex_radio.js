// variable to check the song has already been scrobbled
// it's need because arrive does more than one call
let currentSong = {title: null, artist: null};

let port = chrome.runtime.connect({name: "Content connection"});

// waiting for song element to be created
// then get its data and send it to background file
document.arrive(".player-controls__info", function(songData) {
    let title = songData.firstChild.textContent;
    let artist = songData.childNodes[1].firstChild.textContent;

    // 'song changed' event already called
    if (currentSong.title == title && currentSong.artist == artist) return;

    // remember the song
    currentSong.title = title;
    currentSong.artist = artist;

    port.postMessage({title: title, artist: artist});
});
