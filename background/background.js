var fff = true;
var dis = false;
var isFailed = false;
var randomIp_ip ="";
var randomIp_port ="";

/*** -/|\-- ***/
var decrypted = '';
var proxyList = [];
var proxyUsername;
var proxyPassword;
var retrivedData;
var numberofProxes;
chrome.browserAction.setBadgeText({'text':'Wait'});

var xhttp = new XMLHttpRequest();
var xhttpSecond = new XMLHttpRequest();
getFileAndDecrypt();

function getFileAndDecrypt(){
	//xhttp.onreadystatechange = function() {
	//	if (this.readyState == 4 && this.status == 200) {
	//	   decrypted = CryptoJS.AES.decrypt(this.response, "XMLPP123!@#")
	//										.toString(CryptoJS.enc.Latin1);
										
		/** Reading the file **/
			//ONLINE: xhttpSecond.open("GET",'https://dl.dropbox.com/s/i47kxk8643flc0i/new-proxy-files.xml?dl=0' , true);
			xhttpSecond.open("GET",'https://dl.dropbox.com/s/i47kxk8643flc0i/new-proxy-files.xml?dl=0' , true);
			
			xhttpSecond.send();
	//	}else{
	//		console.log(this.statusText);
	//	}
	//};

	//xhttp.open("GET",'https://dl.dropbox.com/s/wlar8ot5m4axrrx/proxies-masking.xml?dl=0' , true);

	//xhttp.send();

	xhttpSecond.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			
			retrivedData = this.responseXML;
			proxyUsername = retrivedData.getElementsByTagName("up")[0].innerHTML;
			proxyUsername = reverserU(proxyUsername);
			
			proxyPassword = retrivedData.getElementsByTagName("pu")[0].innerHTML;
			proxyPassword = reverserU(proxyPassword);
			
			numberofProxes = retrivedData.getElementsByTagName("proxy").length;
			for (var i=0;i < retrivedData.getElementsByTagName("proxy").length; i++){
				var singleObj = {}
				//singleObj['ip'] = retrivedData.getElementsByTagName("ip")[i].innerHTML;
				//singleObj['port'] = retrivedData.getElementsByTagName("port")[i].innerHTML;
				
				var pp = retrivedData.getElementsByTagName("port")[i].innerHTML;
				singleObj['port'] = abCd(pp);
				var ff = retrivedData.getElementsByTagName("ip")[i].innerHTML;
				var rr = ff.split('.');
				var nn = rr[2];
				nn = nn + '.' + rr[3];
				nn = nn + '.' + rr[0];
				nn = nn + '.' + rr[1];
				singleObj['ip'] = nn;
				proxyList.push(singleObj);
				
			}
			getRandomProxy();
			
		}
	};
}

function getRandomProxy(){
		var randomNum = Math.floor(Math.random()* numberofProxes);
	    randomIp_port = proxyList[randomNum].port;
		randomIp_ip = proxyList[randomNum].ip;
		
		if(!localStorage["first_run"]) {
			setTimeout(doconnectfirst,200);
			localStorage["first_run"] = "done";
			localStorage["first_run"] = "";
		}else{
			doconnectfirst();
		}
}

/*** --_--- ***/



function doconnectfirst(){
	connect();
}


function connect(){
	 	chrome.browserAction.setIcon({
				path: {
				  "19": "../assets/icons/icon-connected-19.png",
				  "38": "../assets/icons/icon-connected-38.png"
				}
			  });
			  chrome.browserAction.setBadgeText({'text':''});
			  chrome.runtime.sendMessage({done: true});
			  dis = false; 
}

function disconnect(){
	
      chrome.proxy.settings.set({
        value: {
          mode: 'direct'
        },
        scope: 'regular'
      }, function () {
		
		chrome.browserAction.setIcon({
        path: {
          "19": "../assets/icons/icon-disconnected-19.png",
          "38": "../assets/icons/icon-disconnected-38.png"
        }
      });
		dis = true;
	  });
}

chrome.webNavigation.onBeforeNavigate.addListener(function(evt){
      chrome.tabs.get(evt.tabId, function(tab){ 
	  
	  var hh = tab.url.indexOf("alaraby.co.uk") > -1
	  
      var host = "";
	   chrome.proxy.settings.get({ }, function (e) {
         host = e.levelOfControl;
        });
	   if(hh && !dis) {
		if(fff && (host != "controllable_by_this_extension")) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
				});
				fff = false;
		}
		  var config = {
          mode: 'fixed_servers',
          rules: {
            proxyForHttp: {
            scheme: 'http',
            host: randomIp_ip,
            port: parseInt(randomIp_port),

            },
            proxyForHttps: {
            scheme: 'http',
            host: randomIp_ip,
            port: parseInt(randomIp_port),

            },
            bypassList: ['foobar.com']
          }
        };

        chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () {
          //resolve(null);
        });
	   }else {
	       fff = true;	   
		   chrome.proxy.settings.clear({scope: "regular"}, function () {});
	   }
      }); 
    }, { urls: ['<all_urls>'] }, ['asyncBlocking']);

	
	
	  chrome.webRequest.onAuthRequired.addListener(function (details, callback) {
        console.log('Call `chrome.webRequest.onAuthRequired`.', details);
        var currentRequestId = details.requestId;

        var host = details.challenger.host;
        if (host != randomIp_ip) {
          callback();
          return;
        }
       
        callback({
          authCredentials: { username: proxyUsername, password: proxyPassword }
		  
        });
      }, { urls: ['<all_urls>'] }, ['asyncBlocking']);
	
	function setProxy(){
		 var config = {
          mode: 'fixed_servers',
          rules: {
            proxyForHttp: {
            scheme: 'http',
            host: randomIp_ip,
            port: parseInt(randomIp_port),

            },
            proxyForHttps: {
            scheme: 'http',
            host: randomIp_ip,
            port: parseInt(randomIp_port),

            },
            bypassList: ['foobar.com']
          }
        };

        chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () {
          //resolve(null);
        });
	}	
	
	//catch proxy failure and send mail to support
	chrome.proxy.onProxyError.addListener(function (details) {
		     if (details.error == 'net::ERR_PROXY_CONNECTION_FAILED') { //|| 'net::ERR_TUNNEL_CONNECTION_FAILED'
				console.log(details.error);
                console.error(details.error);
				//try to get another proxy
				getRandomProxy();				
				setTimeout(function(){
					setProxy();
					chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
						chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
				});}
				,100);
			if(!isFailed){
			//send email to support uncomment following 2 lines in monitor version 
				//var newURL = "http://46.151.213.40/sendemail.php";
				//hrome.tabs.create({ url: newURL });
				isFailed = true;
            }
		
          }else if(details.error == 'net::ERR_TUNNEL_CONNECTION_FAILED'){
			  console.log(details.error);
				getFileAndDecrypt();
		  }
	 });
	 
	 
	 function abCd(str) {
    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
}


	function reverserU(ww){
		var returnedWor = "";
		var hh = ww.split('');


		for (i = 0;i < hh.length; i++){
			var newChar = hh[i];
			var nh = String.fromCharCode(parseInt(newChar.charCodeAt(0))+7);
			returnedWor = returnedWor + nh;
		}
		
		return(returnedWor);
	}