// variable to check the song has already been scrobbled
// it's need because arrive does more than one call
let currentSong = {"artist": null, "song": null};

let port = chrome.runtime.connect({name: "Content connection"});

// waiting for element to be created
// then get its data and send it to background
document.arrive(".player-controls__info", {existing: true}, function(songData) {
    let songName = songData.firstChild.textContent;
    let artistName = songData.childNodes[1].firstChild.textContent;

    // duplicate song change
    if (currentSong["artist"] == artistName && currentSong["song"] == songName) return;

    // remember the song
    currentSong["artist"] = artistName;
    currentSong["song"] = songName;

    port.postMessage({artist: artistName, song: songName});
});
