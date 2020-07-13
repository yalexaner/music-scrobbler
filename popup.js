const artist = document.querySelector("#artist");
const song = document.querySelector("#song");

chrome.storage.local.get(["artist", "song"], function(result) {
    artist.textContent = result["artist"];
    song.textContent = result["song"];
});
