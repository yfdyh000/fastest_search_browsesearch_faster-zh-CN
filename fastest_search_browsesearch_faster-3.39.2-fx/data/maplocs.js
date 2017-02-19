// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
var validEngines = {};
window.addEventListener('click', function(event) {
  var node = event.target, msg = '', locs = {}, hasLoc = false, pattern = [], direngine = [];
  if(node.id == 'update')
  {
    var lines = $$('locs').split(/[\n\r]+/);
    for(var i = 0; i < lines.length; i++)
    {
      if(lines[i].match(/^\s*(\w+),\s*(\S.*\S)\s*$/))
      {
        locs[RegExp.$1] = RegExp.$2;
        hasLoc = true;
      }
      else if(lines[i].match(/\S/))
      {
        msg = '"`^rgjs_invalid1"`^ ' + (i+1) + ' (' + lines[i] + ') "`^mljs_format"`^';
        break;
      }
    }
    lines = $$('sites').split(/[\n\r]+/);
    for(var i = 0; i < lines.length; i++)
      if(lines[i].match(/^\s*(.*\S)\s*$/))
        pattern.push(RegExp.$1);
    var val = $$('direngine').replace(/\s+/g, '');
    if(val.match(/^(\w+),(https?:.+(?:SOURCEADDR.+DESTINATIONADDR|DESTINATIONADDR.+SOURCEADDR).*)$/))
      direngine = [RegExp.$1, RegExp.$2];
    else if(/\S/.test(val))
      msg = '"`^rgjs_invalid2"`^ ' + (i+1) + ' (' + lines[i] + ') "`^mljs_format"`^';
  }
  else if(node.className == 'lnk')
    msg = node.getAttribute('msg');
  if(msg)
    doAlert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
  else if(node.id == 'update')
  {
    var msg = {action:'update', locs:locs, pattern:pattern, mapcategory: $$('mapcategory'), direngine: direngine};
    if(hasLoc || doConfirm('"`^mljs_reset"`^'))
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
  var lines = [];
  for(var i in obj.locs)
    lines.push(i + ',' + obj.locs[i]);
  $('locs').value = lines.join('\n');
  $('sites').value = obj.pattern.join('\n');
  $('mapcategory').value = obj.mapcategory;
  $('direngine').value = obj.direngine.join(',');
});
