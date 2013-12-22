var lineAvailable = true;

function prepareSound(fileName){
	var mySound = document.createElement('audio'); 
	var mySoundSource = document.createElement('source'); mySoundSource.src=fileName; mySoundSource.type="audio/ogg";
	mySound.appendChild(mySoundSource);
	return mySound;
}

function playSoundCallback(sound, callback){
	sound.addEventListener("ended", callback);
	sound.play();
}

//allow only one page to load at a time
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {

console.log(sender.tab ?
                "Request made from content script on page:" + sender.tab.url :
                "Request made from the extension");

	//Request to get access to the line...
	if (request.requestLine == "true"){
		console.log('>>>Requesting line access');
		if (lineAvailable){
			console.log('>>>Line is available');
			lineAvailable = false;
			sendResponse({canLoad: "true"});
			return;
		}
		else{
			console.log('>>>Line is unavailable');
			sendResponse({canLoad: "false"});
			return;
		}
	}
	//request to releast the line
	if (request.releaseLine == "true"){
		console.log('>>>Line Released');
		lineAvailable = true;
		return;
	}
	//request to play a sound
	if (request.playSound == "true"){
		console.log('>>>Sound play request');
		if (request.sound == "tone") { playSoundCallback(prepareSound("newTab.ogg"), function (){ sendResponse({toneDone: "true"}); });	console.log('>>>Played tone'); }
		if (request.sound == "dial") { playSoundCallback(prepareSound("dial.ogg"), function (){ sendResponse({dialDone: "true"}); }); console.log('>>>Played dial'); }
		if (request.sound == "data") { playSoundCallback(prepareSound("data.ogg"), function (){ sendResponse({dataDone: "true"}); }); console.log('>>>Played data'); }
		return true;
	}
});
