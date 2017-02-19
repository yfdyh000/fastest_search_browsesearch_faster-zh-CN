// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
var validEngines = {};
window.addEventListener('click', function(event) {
  var node = event.target, msg = '', bl = [];
  if(node.id == 'update')
  {
    for(var i in {instant:1,suggest:1,fayt:1,tag:1,regex:1,whole:1,'case':1, listeners:1,f3:1})
    {
      if(!$$('toggle'+i).match(/^[a-z]?$/i))
      {
        msg = i+' "`^scjs_oneaz"`^';
        break;
      }
    }
    if(!$$('toggleifocus').match(/^\S$/))
      msg = '"`^scjs_onechar"`^';
  }
  else if(node.className == 'lnk')
    msg = node.getAttribute('msg');
  if(msg)
    doAlert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
  else if(node.id == 'update')
  {
    var msg = {action:'update'};
    for(var i in {nof4:1,usectrlf:1})
      msg[i] = $(i).checked;
    for(var i in {instant:1,suggest:1,fayt:1,ifocus:1,tag:1,regex:1,whole:1,'case':1,listeners:1,f3:1})
      msg['toggle'+i] = $$('toggle'+i).toLowerCase();
    self.postMessage(msg);
  }
  else if(node.id == 'close')
    self.postMessage({action:node.id});
}, false);
function doAlert(msg) {
  self.postMessage({action:'nodestroy'}); // needed for linux
  alert(msg.replace(/%0A/g, '\n'));
  self.postMessage({action:'okdestroy'});
}
function $(id) {
  return document.getElementById(id);
}
function $$(id) {
  return document.getElementById(id).value;
}
self.on('message', function(obj) {
  for(var i in obj)
  {
    var j = $(i);
    if(j)
    {
      if(i.match(/^(usectrlf|nof4)$/)) j.checked = obj[i];
      else j.value = obj[i];
    }
  }
});
