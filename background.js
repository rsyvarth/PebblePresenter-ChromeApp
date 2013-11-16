// chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!

 var s = document.createElement('script');
s.src = chrome.extension.getURL("socket.io.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

var s = document.createElement('script');
s.src = chrome.extension.getURL("extension.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

// });