window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
function findIPA() {
    var ipaEls = $('.IPA');
    for (var i = 0; i < ipaEls.length; i++) {
        var jqueryDiv = $(ipaEls[i]);
        var text = jqueryDiv.text();
        var cleanIpa = trimIPA(text);
        var imageUrl = chrome.extension.getURL('play-button.svg');
        jqueryDiv.append('<img id="audio' + i + '" style="width: 18px; opacity: .8;" src="' + imageUrl + '" />');
        wireButton('audio' + i, cleanIpa);
    }
}

function wireButton(id, cleanIpa) {
  $('#' + id).click(function() {
    fetch("https://www.ipaaudio.click/audio", {
      method: "POST",
      body: JSON.stringify({'ipa': cleanIpa}),
      headers: {'Content-Type': 'application/json'}
    }).then(function(response) {
      return response.arrayBuffer();
    }).then(function(arrayBuffer){
        // TODO: don't rerun
        var source = context.createBufferSource();
        context.decodeAudioData(arrayBuffer, function(decodedData) {
            if (!source.buffer) {
                source.buffer = decodedData;
                source.connect(context.destination);
            }
            source.start(0);
        })
    });
  })
}

function trimIPA(ipa) {
    // Trim [ipa] and /ipa/ from the ipa div
    return ipa.replace(/(^\/)|(\/$)|(^\[)|(\]$)/g, '')
}

$().ready(findIPA)