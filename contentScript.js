
/////////////////////////////////////////////////////////////////////////////////////////
//Initial blocker div tag...
var body = document.getElementsByTagName('body')[0];

var blocker = document.createElement('div'); 
blocker.style.position="absolute"; 
blocker.style.top="0px"; 
blocker.style.left="0px"; 
blocker.style.width="100%"; 
blocker.style.height="100%"; 
blocker.style.backgroundColor="white"; 
blocker.style.textAlign="center"; 
blocker.style.zIndex="99999999";
blocker.innerHTML = "<p style='font-size:large;'><br><br>Waiting for line...</p>";
body.appendChild(blocker);

/////////////////////////////////////////////////////////////////////////////////////////
//functions for making the page look like it is loading slowly

var p = 0;
var loadfunc;

function loadPage(){
	blocker.innerHTML = "";
	loadfunc = window.setInterval(function(){step()}, 60);
}
function step(){
	if (p<100){
		var num = Math.floor((Math.random()*10)-5);
		if (num>0){
			p+=num;
		}
	}
	else
	{
		clearInterval(loadfunc);
		blocker.style.width="0px";
		blocker.style.height="0px";
	}
	blocker.style.top = p+"%";
	blocker.style.height = (100-p)+"%";
}

/////////////////////////////////////////////////////////////////////////////////////////
//soundy stuff

var lineFunc;

lineFunc = window.setInterval(function(){requestLine()}, 10);

function doneData(response){
	chrome.runtime.sendMessage({releaseLine: "true"}, function(response) {});
}

function doneDial(response){
	window.setTimeout(loadPage, 2000);
	chrome.runtime.sendMessage({playSound: "true", sound: "data"}, doneData);
}

function doneTone(response){
	blocker.innerHTML = "<p style='font-size:large;'><br><br>Dialing, please wait...</p>";
	chrome.runtime.sendMessage({playSound: "true", sound: "dial"}, doneDial);	
}

function requestLine(){
chrome.runtime.sendMessage({requestLine: "true"}, function(response) {
	if (response.canLoad == "true") {

		clearInterval(lineFunc);
		console.log('Playing first sound');
		chrome.runtime.sendMessage({playSound: "true", sound: "tone"}, doneTone);

	}
});
}

