// variable to check the song has already been scrobbled
let currentSong = {title: null, artist: null};

let port = chrome.runtime.connect({name: "Content connection"});

// waiting for song element to be created
// then get its data and send it to background file
// and check for the song progress
document.arrive(".player-controls__info", function(songData) {
    let title = songData.firstChild.textContent;
    let artist = songData.childNodes[1].firstChild.textContent;

    // 'song changed' event already called
    if (currentSong.title == title && currentSong.artist == artist) return;

    // remember the song
    currentSong.title = title;
    currentSong.artist = artist;

    port.postMessage({title: title, artist: artist, canBeScrobbled: false});

    // node to observe music progress changes
    const targetNode = document.querySelector(".progress__shape_play");

    // receives slider changes of playing song
    songProgress.observe(targetNode, { attributes: true, subtree: true });
});

// observes song progress changes
const songProgress = new MutationObserver(function(mutationsList, observer) {
    const xFinal = 34;
    const yFinal = 64;

    // string with coordinates of slider
    // looks like this 'M 34.000,2.000 A 32.000,32.000 0 0,1 34.020,2.000'
    // needed the last two numbers '34.020,2.000'
    let pathData = mutationsList[0].target.getAttribute("d");

    let coordinates = pathData.split(" ").pop().split(',');
    let x = parseFloat(coordinates[0]);
    let y = parseFloat(coordinates[1]);

    // half of the song passed
    if (x < xFinal && y > yFinal) {
        port.postMessage({
            title: currentSong.title,
            artist: currentSong.artist,
            canBeScrobbled: true
        });

        // song is scrobbled
        // stop getting events of song progress changes
        observer.disconnect();
    }
});
