window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var audioCache = {};

function findIPA() {
    var ipaEls = $('.IPA');
    for (var i = 0; i < ipaEls.length; i++) {
        var jqueryDiv = $(ipaEls[i]);
        var text = jqueryDiv.text();
        var cleanIpa = trimIPA(text);
        var imageUrl = chrome.extension.getURL('play-button.svg');
        jqueryDiv.append('<img id="audio' + i + '" class="play-button" src="' + imageUrl + '" />');
        wireButton('audio' + i, cleanIpa);
    }
}

function wireButton(id, cleanIpa) {
  $('#' + id).click(function() {
    if (audioCache[cleanIpa] !== undefined) {
        playAudio(audioCache[cleanIpa]);
    } else {
        fetch("https://www.ipaaudio.click/audio", {
          method: "POST",
          body: JSON.stringify({'ipa': cleanIpa}),
          headers: {'Content-Type': 'application/json'}
        }).then(function(response) {
          return response.arrayBuffer();
        }).then(function(arrayBuffer){
            context.decodeAudioData(arrayBuffer, function(audio) {
                audioCache[cleanIpa] = audio;
                playAudio(audio);
            })
        });
    }
  })
}

function playAudio(audioData) {
        var source = context.createBufferSource();
	source.buffer = audioData;
	source.connect(context.destination);
        source.start(0);
}

function trimIPA(ipa) {
    // Trim [ipa] and /ipa/ from the ipa div
    return ipa.replace(/(^\/)|(\/$)|(^\[)|(\]$)/g, '')
}

$().ready(findIPA)
