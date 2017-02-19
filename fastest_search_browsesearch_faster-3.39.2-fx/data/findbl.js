// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
var validEngines = {};
window.addEventListener('click', function(event) {
  var node = event.target, msg = '', bl = [];
  if(node.id == 'update')
  {
    var lines = $$('bl').split(/\s+/);
    for(var i = 0; i < lines.length; i++)
    {
      if(lines[i].match(/\S/))
      {
        var exp = lines[i];
        try {
          var r = new RegExp(exp.replace(/\\/g, '\\\\'), 'i');
          bl.push(exp);
        } catch(e) {
          msg = '"' + exp + '" "`^fbjs_invalid"`^';
          break;
        }
      }
    }
    if($$('faytmin').match(/\D|^\s*$/))
      msg = '"`^fbjs_pnum"`^';
    var cc = $$('contextchar');
    if(cc.match(/[^0-9-]|^\s*$/) || (cc > 70))
      msg = '"`^fbjs_context"`^';
    var th = $$('texthide');
    if(th.match(/\D|^\s*$/) || (th-0 && th < 5))
      msg = '"`^fbjs_bar"`^';
    if($$('maxmatch').match(/[^0-9-]|^\s*$/) || $$('maxtabmatch').match(/[^0-9-]|^\s*$/))
      msg = '"`^fbjs_mnum"`^';
    else if($$('maxmatch') - $$('maxtabmatch') < 0)
      msg = '"`^fbjs_numdiff"`^';
  }
  else if(node.className == 'lnk')
    msg = node.getAttribute('msg');
  if(msg)
    doAlert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
  else if(node.id == 'update')
  {
    var msg = {action:'update', findbl:bl };
    for(var i in {usefindbl:1,fayt:1,faytreminder:1,textlist:1,nofaytinbox:1,baronright:1,ignorediacritics:1,fastfayt:1,smallfind:1,f3starthere:1,useSlashFAYT:1,pipeor:1})
      msg[i] = $(i).checked;
    for(var i in {faytmin:1,contextchar:1,texthide:1,maxmatch:1,maxtabmatch:1})
      msg[i] = $$(i);
    if(bl.length || doConfirm('"`^fbjs_reset"`^'))
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
function doConfirm(msg) {
  self.postMessage({action:'nodestroy'});// needed for linux
  var answer = confirm(msg.replace(/%0A/g, '\n'));
  self.postMessage({action:'okdestroy'});
  return answer;
}
function $(id) {
  return document.getElementById(id);
}
function $$(id) {
  return document.getElementById(id).value;
}
self.on('message', function(obj) {
  $('bl').value = obj.findbl.join('\n');
  for(var i in obj)
  {
    var j = $(i);
    if(j)
    {
      if(i.match(/faytmin|contextchar|texthide|maxmatch|maxtabmatch/)) j.value = obj[i];
      else if(i.match(/^(usefindbl|fayt|faytreminder|textlist|nofaytinbox|baronright|ignorediacritics|fastfayt|smallfind|f3starthere|useSlashFAYT|pipeor)$/)) j.checked = obj[i];
    }
  }
});
