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

// save song data to local store
// so it can be displayed in popup
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        chrome.storage.local.set({artist: msg.artist, song: msg.song});
    });
});
