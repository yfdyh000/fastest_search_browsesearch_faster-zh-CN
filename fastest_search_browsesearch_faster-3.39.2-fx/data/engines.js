// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
window.addEventListener('click', function(event) {
  var node = event.target, sc = node.getAttribute('sc'), ex = document.body.getAttribute('exist');
  if(node.id == '_allboxes')
  {
    var table = node.parentNode.parentNode.parentNode.parentNode, tb = table.tBodies[0], rows = tb.rows;
    for(var i = 0; i < rows.length; i++)
      rows[i].cells[0].children[0].checked = node.checked;
    return;
  }
  if(node.className == 'lnk')
  {
    if(node.innerHTML == '"`^Edit"`^')
      self.postMessage({action:'edit',engine:sc,addExisting:ex});
    else if(node.innerHTML == '"`^Add"`^')
      self.postMessage({action:'add',engine:sc,addExisting:ex});
    else if(node.innerHTML == '"`^Remove"`^')
    {
      if(doConfirm('"`^ejs_remove"`^'))
      {
        var tr = node.parentNode.parentNode, table = tr.parentNode.parentNode;
        table.deleteRow(tr.rowIndex);
        self.postMessage({action:'remove',engine:sc});
      }
    }
  }
  else if(node.className == 'lnk1')
  {
    var dir = node.getAttribute('dir') || 1, type = node.getAttribute('type'),
        table = node.parentNode.parentNode.parentNode, tb = table.tBodies[0], rows = tb.rows,
        idx = node.cellIndex > table.getAttribute('skip')-0? node.cellIndex + 1 : node.cellIndex,
        vals = [], newrows = [];
    for(var i = 0; i < rows.length; i++)
    {
      vals.push([rows[i].cells[idx].innerHTML, i]);
      newrows.push(rows[i]);
    }
    if(type == 'num')
      vals.sort(function(aa,bb){var a = aa[0]-0, b = bb[0]-0; return (a < b? 1:a > b? -1:0) * dir});
    else
      vals.sort(function(aa,bb){var a = aa[0]? aa[0].toLowerCase() : '', b = bb[0]? bb[0].toLowerCase() : ''; return (a < b? -1:a > b? 1:0) * dir});
    for(var i = 0; i < vals.length; i++)
      tb.appendChild(newrows[vals[i][1]]);
    node.setAttribute('dir', dir * -1);
  }
  else if(node.id == 'export' || node.id == 'removesel')
  {
    var check = document.getElementsByTagName('input'), engines = [], table, rows = [];
    for(var i = 0; i < check.length; i++)
      if(check[i].type.match(/checkbox/i) && check[i].checked)
      {
        engines.push(check[i].value);
        if(node.id == 'removesel')
        {
          var tr = check[i].parentNode.parentNode;
          if(!table) table = tr.parentNode.parentNode;
          rows.push(tr.rowIndex);
        }
      }
    if(!engines.length)
    {
      doAlert('"`^ejs_noselect"`^');
      return;
    }
    if(node.id == 'removesel')
    {
      if(!doConfirm('"`^ejs_removesel"`^')) return;
      rows.sort(function(a,b){return b-a});
      for(var i = 0; i < rows.length; i++)
        table.deleteRow(rows[i]);
    }
    self.postMessage({action:node.id, engines:engines});
  }
  else if(node.id)
  {
    if(node.id.match(/batchupdate/))
    {
      var answer = doPrompt('"`^ejs_batch"`^','');
      if(answer)
      {
        if(answer.match(/^\s*(usage|rank|instant)\s*=\s*(\d+)\s*$/i))
        {
          var action = RegExp.$1.toLowerCase(), val = RegExp.$2;
          if(action == 'usage') resetStats(6, val);
          else if(action == 'rank') resetStats(5, val);
          self.postMessage({action:action, value:val});
        }
        else if(answer.match(/^\s*(del)\s*=\s*(\w+)\s*$/i))
          self.postMessage({action:RegExp.$1, opt:RegExp.$2});
        else
          doAlert('"`^ejs_format"`^');
      }
    }
    else self.postMessage({action:node.id});
  }
}, false);
function resetStats(idx, val) {
  var rows = document.getElementsByTagName('table')[0].tBodies[0].rows;
  for(var i = 0; i < rows.length; i++)
    rows[i].cells[idx].textContent = val;
}
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
function doPrompt(msg, def) {
  self.postMessage({action:'nodestroy'});// needed for linux
  var answer = prompt(msg.replace(/%0A/g, '\n'), def);
  self.postMessage({action:'okdestroy'});
  return answer;
}
