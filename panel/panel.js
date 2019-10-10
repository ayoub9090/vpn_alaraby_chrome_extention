 
 var bgPage = chrome.extension.getBackgroundPage();
  
 var once = true

 
 
 document.addEventListener('DOMContentLoaded', function() {
	
		  
 if(bgPage.dis) {
	 
		 document.getElementById("myonoffswitch").checked = false;
		/** set icon to disconnected icon to make sure that the on off switch 
		 ** will always sync with the icon at least when click on it
		 ** 2/14/2016
		 ** @ayoub
		 **/
		 
		chrome.browserAction.setIcon({
        path: {
          "19": "../assets/icons/icon-disconnected-19.png",
          "38": "../assets/icons/icon-disconnected-38.png"
        }
      });
	//	 bgPage.CakeTubeSDK.connectionService.disconnect();
		 
	 }else {
		
		 document.getElementById("myonoffswitch").checked = true;
		 
		/** set icon to connected icon to make sure that the on off switch 
		 ** will always sync with the icon at least when click on it
		 ** 2/14/2016
		 ** @ayoub
		 **/
		chrome.browserAction.setIcon({
        path: {
          "19": "../assets/icons/icon-connected-19.png",
          "38": "../assets/icons/icon-connected-38.png"
        }
      });
		
		 
	 }
	 
 var link = document.getElementById('ttt');
    
    link.addEventListener('click', function(e) {
		  
	 checkifchld();
	 e.preventDefault();
	 
    });
},false);

 function checkifchld() {
	 
	 if(document.getElementById("myonoffswitch").checked) {
		 document.getElementById("myonoffswitch").checked = false;
		 bgPage.disconnect();
		 document.getElementById("loading").style.display = 'none';
	 }else {
		 document.getElementById("myonoffswitch").checked = true;
		 bgPage.connect(); 
		  //bgPage.getRandomProxy(); 
		 document.getElementById("loading").style.display = 'block';
	 }
	 
 }
 /** Hide loading icon when task is done **/
 chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	
    if (message.done) {
	
        document.getElementById("loading").style.display = 'none';
		
		
    }
});