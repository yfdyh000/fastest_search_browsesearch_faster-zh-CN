// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
var engines = {gm:'ts',w:'ts'}, cats = {Finance:1};
window.addEventListener('keyup', function(event) {
  process(event.target);
}, false);
function process(node) {
  var obj = {};
  if(!/guessengines|ssbkey|ssbwidth/.test(node.id)) return;
  assemble(obj);
  if(obj.error) $('ssbprev').textContent = obj.error;
  else
  {
    obj.action = 'preview';
    self.postMessage(obj);
  }
}
function assemble(obj) {
  var tval = $$('guessengines'), msg, ens = [];
    if(tval)
    {
      var lines = tval.replace(/\s+/g, '').split(/,/);
      for(var i = 0; i < lines.length; i++)
      {
        var en = lines[i];
      if(en == '*' || en == '#' || engines[en] || cats[en]) ens.push(en);
        else msg = '"' + en + ' "`^sbjs_inval_sc"`^';
        if(msg) break;
      }
    }
  for(var i in {autohide:1,delayshow:1,ssbwidth:1})
    if(/[^0-9.]|^\s*$/.test($$(i)))
    {
      msg = i+' "`^scjs_oneaz"`^';
      break;
    }
  if(!msg)
    for(var i in {mouseoffx:1,mouseoffy:1})
      if(/[^0-9-]|^\s*$/.test($$(i)))
      {
        msg = i+' "`^sbjs_int"`^';
        break;
      }
  if(msg) return {error:msg};
  obj.action = 'update';
  obj.guessengines = ens;
  for(var i in {smartpos:1})
    obj[i] = $(i).checked;
  for(var i in {autohide:1,mouseoffx:1,mouseoffy:1,delayshow:1,ssbwidth:1,ssbkey:1})
    obj[i] = $(i).value;
}
window.addEventListener('click', function(event) {
  var node = event.target, msg, obj = {};
  if(node.id == 'update')
  {
    assemble(obj);
    msg = obj.error || '';
  }
  else if(node.className == 'lnk')
    msg = node.getAttribute('msg');
  if(msg)
    doAlert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
  else if(node.id == 'update')
    self.postMessage(obj);
  else if(node.id.match(/^close$/))
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
  if(obj.html)
  {
    var prev = $('ssbprev');
    prev.style.height = obj.height;
    prev.innerHTML = obj.html;
    return;
  }
  var opts = obj.opts;
  engines = obj.engines;
  cats = obj.cats;
  for(var i in opts)
  {
    var j = $(i);
    if(i == 'guessengines')
      j.value = opts[i].join(',');
    else if(j)
    {
      if(i.match(/autohide|mouseoff|delayshow|ssbwidth|ssbkey/)) j.value = opts[i];
      else j.checked = opts[i];
    }
  }
  process($('ssbkey'));
});
