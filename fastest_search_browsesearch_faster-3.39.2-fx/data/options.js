// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
window.addEventListener('click', function(event) {
  var node = event.target, msg, ens = [];
  if(node.className == 'lnk')
    msg = node.getAttribute('msg');
  if(msg)
  {
    alert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
    self.postMessage({ action:'open' });
  }
  else if(node.id == 'update')
  {
    var msg = {action:'update'};
    for(var i in {autocopy:1,nosmart:1,noinstant:1,nosuggest:1,nodnd:1,autorefresh:1,reshowopts:1,useSF:1})
      msg[i] = $(i).checked;
    msg.middlepaste = $('middlepaste')? $('middlepaste').checked : true;
    self.postMessage(msg);
  }
  else if(node.id.match(/^(saveloc|close|engines|instant|maplocs|manualadd|export|import|misc|findbl|preview|regex|shortcuts|smartbox)$/))
    self.postMessage({action:node.id});
}, false);
function $(id) {
  return document.getElementById(id);
}
self.on('message', function(obj) {
  var opts = obj.opts;
  for(var i in opts)
  {
    var j = $(i);
    if(j) j.checked = opts[i];
  }
});
