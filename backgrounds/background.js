"use strict";

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'radio.yandex.ru'},
            })],

            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onConnect.addListener(port => {
    if (port.name == "Background connection") {
        // called from yandex_radio content file
        // to scrobble the song
        port.onMessage.addListener(song => {
            // half of the song passed
            // it can be scrobbled
            console.log("Song: " + song.artist + " - " + song.title + " (" + song.duration + " seconds)");
            console.log("Album: " + song.albumArtist + " - " + song.album + " (" + song.albumNumber + " in album)");
            console.log("Time: " + song.startPlaying);
       });
    }
});
