"use strict";

const title = document.querySelector("#title");
const artist = document.querySelector("#artist");

chrome.storage.local.get({title, artist}, function(song) {
    if (Object.keys(song.title).length !== 0 && song.title.constructor !== Object) {
        title.textContent = song.title;
        artist.textContent = song.artist;
    };
});
