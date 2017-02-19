// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
var engines = {gm:'ts',w:'ts'}, cats = {};
window.addEventListener('click', function(event) {
  var node = event.target, msg = '', rules = [], hasLoc = false;
  if(/^(update|test)$/.test(node.id))
  {
    var lines = $$('rules').split(/[\n\r]+/);
    for(var i = 0; i < lines.length; i++)
    {
      if(!/\S/.test(lines[i])) continue;
      if(lines[i].match(/^\s*([\w:]+)\s*,\s*([>=<]*)\s*(\d+)*\s*,(.+?)(?:#:#(.+))?$/))
      {
        var s = RegExp.$1, op = RegExp.$2, len = RegExp.$3, re = RegExp.$4,
            com = RegExp.$5, scs = s.split(':');
          if(re.match(/^\s*\/([\S ]+)\/(\w?)\s*$/))
          {
            var rre = RegExp.$1, mod = RegExp.$2;
            try {
              reg = new RegExp(rre, mod);
            }
            catch(e) {
              msg = '"`^rgjs_invalid1"`^ ' + (i+1) + ' (' + lines[i] + ') "`^rgjs_invalid2"`^ (' + re + ')!\n"`^rgjs_invalid3"`^';
              break;
            }
          rules.push([s,op||(len?'=':''),len,rre,mod||'',com||'']);
          }
          else
          {
            msg = '"`^rgjs_invalid1"`^ ' + (i+1) + ' (' + lines[i] + ') "`^rgjs_format1"`^ (' + re + ') "`^rgjs_format2"`^';
            break;
          }
        for(var j = 0; j < scs.length; j++)
        {
          var sc = scs[j];
          if(!engines[sc] && !cats[sc])
        {
          msg = '"`^rgjs_invalid1"`^ ' + (i+1) + ' (' + lines[i] + ') "`^rgjs_engine1"`^ "' + sc + '" "`^rgjs_engine2"`^';
          break;
        }
        }
        if(msg) break;
      }
      else
      {
        msg = '"`^rgjs_invalid1"`^ ' + (i+1) + ' (' + lines[i] + ') "`^rgjs_lineformat"`^';
        break;
      }
    }
    if(node.id == 'test')
    {
      var txt = $$('txt');
      if(!/\S/.test(txt))
        msg = ""`^rgjs_entertext"`^";
      else
      {
        self.postMessage({action:'test', text:txt, rules:rules});
        return;
      }
    }
  }
  else if(node.className == 'lnk')
    msg = node.getAttribute('msg');
    
  if(msg)
    doAlert(msg.replace(/%0A/g, '\n')); //strangely needed here, didn't need to replace in add.js
  else if(node.id == 'update')
  {
    var msg = {action:'update', rules:rules};
    if(rules.length || doConfirm('"`^rgjs_reset"`^'))
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
  if(obj.action == 'result')
  {
    $('result').innerHTML = '<b>"`^rgjs_result"`^:</b> ' + obj.msg.replace(/\n+/g, '<br>');
    return;
  }
  var lines = [];
  engines = obj.engines;
  cats = obj.cats;
  for(var i in obj.rules)
  {
    var r = obj.rules[i];
    lines.push(r[0] + ',' + r[1] + r[2] + ',/' + r[3] + '/' + r[4] + '#:#'+ r[5] );
  }
  $('rules').value = lines.join('\n');
});
