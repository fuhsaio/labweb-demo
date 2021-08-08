// 滾動監控 js

'use strict';

var loadpostion = false; 
var section = document.querySelectorAll("section");
var sections = {};
var i = 0;

function getpostion(){
  console.log("load");
  Array.prototype.forEach.call(section, function(e) {
    if(e.id.length>0){
      sections[e.id] = e.offsetTop;
    }
  });
  loadpostion = true;
}

function SpyScroll () {
    
    window.onscroll = function() {
      if(!loadpostion){
        getpostion()
      }
      var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
      
      for (i in sections) {
        if (sections[i] -80 <= scrollPosition) {
          try{
            document.querySelector('.navbar-nav .active').setAttribute('class', ' ');
            document.querySelector('.navbar-nav a[href*=' + i + ']').parentNode.setAttribute('class', 'active');
          }catch{
            console.log("s");
          }
          
        }
      }
    };
};

SpyScroll();