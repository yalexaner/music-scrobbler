"use strict";

// currently scrobbling song
const song = {
    title: null,
    artist: null,
    album: null,
    duration: null,
    albumNumber: null,
    albumArtist: null,
    startPlaying: null,
    chosenByUser: 0,
    canBeScrobbled: false
};

// connection to background file to send song data for scrobbling
const backgroundPort = chrome.runtime.connect({name: "Background connection"});

// connection to yandex_radio background file to get song data
const yandexPort = chrome.runtime.connect({name: "Yandex Radio Background Connection"});

// waiting for song element to be created
// (also is called when the song element is changed)
// then get its data and send it to background file
// and check for the song progress
document.arrive(".player-controls__info", (songData) => {
    const title = songData.firstChild.textContent;
    const artist = songData.childNodes[1].firstChild.textContent;

    // song data already exists
    if (song.title == title && song.artist == artist) return;

    // if this is not the first song
    // pass the previous song data to the
    // background file so it can be scrobbled
    if (song.title != null && song.canBeScrobbled) {
        backgroundPort.postMessage({
            title: song.title,
            artist: song.artist,
            album: song.album,
            duration: song.duration,
            albumNumber: song.albumNumber,
            albumArtist: song.albumArtist,
            startPlaying: song.startPlaying,
            chosenByUser: song.chosenByUser,
        });

        song.canBeScrobbled = false;
    };

    // remember the song
    song.title = title;
    song.artist = artist;
    song.startPlaying = Date.now();

    // save song data to local storage
    // so it can be displayed in popup
    chrome.storage.local.set({title: song.title, artist: song.artist});

    // start getting the rest song data
    retrieveSongData();

    // start observing song progress changes
    observeSongProgressChanges();
});

// get the rest song data
function retrieveSongData() {
    const songIdx = document.querySelector(".slider__item_playing")
                          .firstChild.getAttribute("data-idx");

    yandexPort.postMessage(songIdx);
}

// when the rest data is ready onMessage is called
yandexPort.onMessage.addListener(newSong => {
    song.album = newSong.album;
    song.duration = newSong.duration;
    song.albumNumber = newSong.albumNumber;
    song.albumArtist = newSong.albumArtist;
});

function observeSongProgressChanges() {
    // node to observe music progress changes
    const targetNode = document.querySelector(".progress__shape_play");

    // receives slider changes of playing song
    songProgress.observe(targetNode, { attributes: true, subtree: true });
}

// observer to observe song progress changes
const songProgress = new MutationObserver((mutationsList, observer) => {
    const xFinal = 34;
    const yFinal = 64;

    // string with coordinates of slider
    // looks like this 'M 34.000,2.000 A 32.000,32.000 0 0,1 34.020,2.000'
    // needed the last two numbers '34.020,2.000'
    const pathData = mutationsList[0].target.getAttribute("d");

    const coordinates = pathData.split(" ").pop().split(',');
    const x = parseFloat(coordinates[0]);
    const y = parseFloat(coordinates[1]);

    // half of the song passed
    if (x < xFinal && y > yFinal) {
        song.canBeScrobbled = true;

        // song is scrobbled
        // stop getting events of song progress changes
        observer.disconnect();
    }
});

// fired when the tab is being closed
window.addEventListener("unload", event => {
    // scrobble song if the half of it already past
    if (song.title != null && song.canBeScrobbled) {
        backgroundPort.postMessage({
            title: song.title,
            artist: song.artist,
            album: song.album,
            duration: song.duration,
            albumNumber: song.albumNumber,
            albumArtist: song.albumArtist,
            startPlaying: song.startPlaying,
            chosenByUser: song.chosenByUser,
        });
    };

    chrome.storage.local.clear();
});
