"use strict";

const title = document.querySelector("#title");
const artist = document.querySelector("#artist");

chrome.storage.local.get({title, artist}, function(song) {
    title.textContent = song.title;
    artist.textContent = song.artist;
});
