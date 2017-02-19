// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
window.addEventListener('click', function(event) {
  var node = event.target;
  if(node.id == 'update')
  {
    var msg = {action:'update',opts:{imgloc:{}}}, last = '';
    for(var i in {saveimg:1,forcefindimg:1,ask4name:1})
      msg.opts[i] = $(i).checked;
    for(var i in {ul:1,ur:1,ll:1,lr:1})
    {
      var val = $$(i) || last;
      if(val.match(/[\*\?"<>\|]/)) // sanity check
      {
        doAlert('"`^iljs_path"`^ *?"<>|');
        return;
      }
      msg.opts.imgloc[i] = val;
      last = val;
    }
    self.postMessage(msg);
  }
  else if(node.id.match(/^b([ul][lr])$/))
  {
    var tmp = RegExp.$1;
    self.postMessage({action:'browse',item:tmp,path:$$(tmp)});
  }
  else if(node.id == 'close')
    self.postMessage({action:'close'});
  else if(node.className == 'lnk')
  {
    msg = node.getAttribute('msg');
    if(msg)
      doAlert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
  }
}, false);
function doAlert(msg) {
  self.postMessage({action:'nodestroy'}); // needed for linux
  alert(msg.replace(/%0A/g, '\n'));
  self.postMessage({action:'okdestroy'});
}
function $$(id) {
  return document.getElementById(id).value;
}
function $(id) {
  return document.getElementById(id);
}
self.on('message', function(opts) {
  for(var i in opts.locs)
  {
    var j = $(i);
    if(j) j.value = opts.locs[i];
  }
  for(var i in opts.others)
  {
    var j = $(i);
    if(j) j.checked = opts.others[i];
  }
});
