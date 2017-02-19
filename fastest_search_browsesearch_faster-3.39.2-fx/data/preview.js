// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
window.addEventListener('click', function(event) {
  var node = event.target, msg;
  if(node.className == 'lnk')
    msg = node.getAttribute('msg');
  if(msg)
    doAlert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
  else if(node.id == 'update')
  {
    var msg = {action:'update'};
    for(var i in {defaultpreview:1,esccloseprev:1,dclickcloseprev:1})
      msg[i] = $(i).checked;
    for(var i in {ppanelwidth:1,ppanelheight:1})
      msg[i] = $(i).value;
    for(var i in {all:1, none:1, nourl:1})
      if($('textdefaultpreview-' + i).checked)
      {
        msg.textdefaultpreview = i;
        break;
      }
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
self.on('message', function(opts) {
  for(var i in opts)
  {
    var j = $(i);
    if(i == 'textdefaultpreview') $(i + '-' + opts[i]).checked = true;
    if(j)
    {
      if(i.match(/ppanel/)) j.value = opts[i];
      else j.checked = opts[i];
    }

  }
});
