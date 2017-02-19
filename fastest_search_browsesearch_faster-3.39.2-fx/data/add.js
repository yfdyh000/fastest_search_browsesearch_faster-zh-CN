// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
var canvas, ctx;
window.addEventListener('load', function() {
  $('page').addEventListener('change', function() {
    self.postMessage({action:'getFav', url:$$('page')});
  }, false);
}, false);
window.addEventListener('click', function(event) {
  var node = event.target;
  if(node.id == 'add' || node.id == 'edit')
  {
    var sc = $$('shortcut'), good = true, oldsc = $$('oldsc').split(','),
        initsc = $('shortcut').getAttribute('init'),
        category = $$('category');

    // check validity of entry
    if(!category.match(/^[\w, ]+$/))
      return doAlert('"`^ajs_cat"`^');
    if(sc.match(/\W/))
      return doAlert('"`^ajs_sc"`^');

    // make sure shortcuts do not conflict
    for(var i = 0; i < oldsc.length; i++)
    {
      if((node.id == 'add' && oldsc[i] == sc) ||
         (node.id == 'edit' && oldsc[i] == sc && sc != initsc))
        return doAlert('"`^ajs_conflict"`^');
    }
    if(good)
    {
      var fav = $('fav'), name = $$('name'), qstr = $$('qstr'), page = $$('page'), qtype = $('querytype-post').checked? 'POST':'GET',
          shortcut = $$('shortcut'), tmp = [name, qstr, category, shortcut, page];
      for(var i = 0; i < tmp.length; i++)
      {
        if(tmp[i].match(/^\s*$/))
          return doAlert('"`^ajs_required"`^');
      }
      self.postMessage({action: node.id, fav: fav && fav.src? toURI() : '', name: name,
        qstr: qstr, category: category, shortcut: shortcut, page: page, qtype: qtype,
        initsc: node.id == 'edit'? initsc : null, rank: $$('rank')-0,
        su:$$('suggest'), i:$('instant')? $('instant').checked:false});
    }
  }
  else if(node.id == 'cancel')
    self.postMessage({action:'close'});
  else if(node.id == 'testsub')
    doTest();
  else if(node.className == 'lnk')
  {
    msg = node.getAttribute('msg');
    if(msg) doAlert(msg);
    else self.postMessage({action:node.getAttribute('action')});
  }
}, false);
function doAlert(msg) {
  self.postMessage({action:'nodestroy'}); // needed for linux
  alert(msg.replace(/%0A/g, '\n'));
  self.postMessage({action:'okdestroy'});
}
function doTest() {
  self.postMessage({action:'test', url:$$('qstr'), key:$$('testq'), name:$$('name'), qtype:$('querytype-post').checked? 'POST':'GET'});
}
window.addEventListener('keyup', function(event) {
  var node = event.target;
  if(event.which == 13)
  {
    if(node.id == 'testq') doTest();
  }
}, false);
function $$(id) {
  return document.getElementById(id).value;
}
function $(id) {
  return document.getElementById(id);
}
function toURI() {
  try
  {
    if(!canvas)
    {
      canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      ctx = canvas.getContext('2d');
    }
    ctx.drawImage($('fav'), 0, 0, 16, 16);
    return canvas.toDataURL('image/png');
  }
  catch(e) { console.log(e.message); return $('fav').src }
}
self.on('message', function(obj) {
  if(obj.action == 'fav')
    $('fav').src = obj.url;
});
