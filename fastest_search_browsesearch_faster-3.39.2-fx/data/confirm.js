// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
window.addEventListener('click', function(event) {
  var node = event.target, msg;
  if(node.className == 'lnk')
  {
    var extra = node.getAttribute('extra');
    if(extra)
    {
      var open = extra == 'open', omsg = extra + 'msg', next = open? 'close':'open';
      node.textContent = node.getAttribute(next + 'msg');
      $('openclose').style.display = open? 'block':'none';
      node.setAttribute('extra', next);
      self.postMessage({action:omsg});
      var lo = node.getAttribute('loadobj');
      if(lo && $(lo) && !$(lo).src) $(lo).src = node.getAttribute('loadsrc');
      return;
    }
    msg = node.getAttribute('msg');
  }
  if(msg)
    doAlert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
  else if(/^(yes|no)$/.test(node.id))
  {
    var msg = {action:'update', yes: node.id == 'yes'};
    self.postMessage(msg);
  }
}, false);
function $(id) {
  return document.getElementById(id);
}
function doAlert(msg) {
  self.postMessage({action:'noshow'}); // needed for linux
  alert(msg.replace(/%0A/g, '\n'));
  self.postMessage({action:'okshow'});
}
self.on('message', function(opts) {
  for(var i in opts)
  {
    var j = $(i);
    if(j)
    {
      if(i == 'title') j.textContent = opts[i];
      else j.checked = opts[i];
    }
  }
});