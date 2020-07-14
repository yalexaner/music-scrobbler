'use strict';

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

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(song) {
        // half of the song passed
        // it can be scrobbled
        if (song.canBeScrobbled)
            console.log("Song scrobbled");

        // song just started
        // save song data to local store
        // so it can be displayed in popup
        else
            chrome.storage.local.set({title: song.title, artist: song.artist});
    });
});
