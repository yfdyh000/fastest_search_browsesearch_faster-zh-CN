// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
var starttime, endtime;
window.addEventListener('keypress', function(e) {
  if(e.target.id == 'speedtest')
  {
    var c = String.fromCharCode(e.which);
    if(c && c.match(/[a-zI']/))
    {
      if(!starttime) starttime = new Date();
      endtime = new Date();
    }
  }
}, false);
function fillVals() {
  var t = $('speedtest'), txt = t.value.replace(/^\s+/,'').replace(/\s+$/,'');
  if(txt.length > 18) // no need to be too strict
  {
    var s = (endtime - starttime) / (1000 * txt.length);
    var tmp = Math.round(s * 150) / 100;
    $('mininstantwait').value = tmp < 0.15? 0.15 : tmp > 1? 1: tmp;
    tmp = Math.round(s * 250) / 100;
    $('maxinstantwait').value = tmp < 0.4? 0.4 : tmp > 2.5? 2.5: tmp;
    tmp = Math.round(s / 0.15 *  110) / 100;
    $('instanthistorywait').value = tmp < 0.8? 0.8 : tmp > 3? 3 : tmp;
  }
  starttime = endtime = null;
}
var validEngines = {};
window.addEventListener('click', function(event) {
  var node = event.target, msg = '';
  if(node.id == 'fillvals')
  {
    fillVals();
    return;
  }
  if(node.id == 'update')
  {
    var o = {instanthistorywait:[0.8,3,'"`^ijs_history"`^'], mininstantwait:[0.15,1,'"`^ijs_min"`^'], maxinstantwait:[0.3,2.5,'"`^ijs_max"`^']};
    for(var i in o)
    {
      var v = $(i).value - 0;
      if(!(v >= o[i][0] && v <= o[i][1]))
        msg += o[i][2] + ' "`^ijs_pnum"`^ ' + o[i][0] + '-' + o[i][1] + '!';
    }
    var sc = $$('instantsc');
    if(sc && !validEngines[sc])
      msg += '"`^ijs_scvalid"`^';
  }
  else if(node.className == 'lnk')
    msg = node.getAttribute('msg');
  if(msg)
    doAlert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
  else if(node.id == 'update')
  {
    var msg = {action:'update'};
    for(var i in {instantub:1, typedonly:1, nocolon:1})
      msg[i] = $(i).checked;
    for(var i in {instanthistorywait:1, mininstantwait:1, maxinstantwait:1})
      msg[i] = Math.round($$(i) * 1000) + '';
    msg.instantsc = $$('instantsc');
    for(var i in {all:1, none:1, per:1})
      if($('instant4engine-' + i).checked)
      {
        msg.instant4engine = i;
        break;
      }
    for(var i in {his:1, eng:1, both:1})
      if($('instantres-' + i).checked)
      {
        msg.instantres = i;
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
function $$(id) {
  return document.getElementById(id).value;
}
self.on('message', function(obj) {
  validEngines = obj.engines, opts = obj.opts;
  for(var i in opts)
  {
    var j = $(i);
    if(/instant4engine|instantres/.test(i)) $(i + '-' + opts[i]).checked = true;
    else if(j)
    {
      if(/instant\w*wait/.test(i)) j.value = (opts[i] / 1000);
      else if(i == 'instantsc') j.value = opts[i];
      else j.checked = opts[i];
    }
  }
});
