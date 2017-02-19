/* copyright (c) Mingyi Liu, 2011, all rights reserved
 The source code in the entire Fastest Search package is not to be
 used/reused/modified/redistributed without prior consent from author
 Mingyi Liu (mingyiliu@yahoo.com).*/
var nofaytinbox, postMatch;
window.addEventListener('keyup', function(event) {
  var node = event.target;
  if(event.which == 13)
  {
    cancel(event);
    process('search1', true, event.shiftKey, event.altKey, event.ctrlKey);
  }
  else if(node.id == 'key' && (event.which == 8 || (event.which >= 48 && event.which <= 111)) &&
     !event.ctrlKey && !event.altKey && !event.metaKey)
  {
    if($$('key') && !nofaytinbox) process('search1', false);
    else self.postMessage({action:'clear'});
  }
}, false);
window.addEventListener('load', function(event) {
  self.postMessage({action:'loaddone', key:$$('key')});
}, true);
window.addEventListener('click', function(event) {
  var node = event.target;
  if(node.id.match(/prev|next|search/))
  {
    cancel(event);
    process(node.id, true, event.shiftKey, event.altKey, event.ctrlKey);
  }
  else if(node.id.match(/^(ww|cs|re)$/) && !nofaytinbox && $$('key'))
    process('search1', false);
  else if(node.id == 'cancel')
    self.postMessage({action:'close',tab:$('tab').checked});
  else if(node.className == 'lnk')
  {
    msg = node.getAttribute('msg');
    if(msg)
    {
      alert(msg.replace(/%0A/g, '\n'));
      self.postMessage({action:'open'});
    }
  }
}, false);
function cancel(event) {
  event.stopPropagation();
  event.preventDefault();
}
function process(id, close, shiftOn, altOn, ctrlOn) {
  if(!$$('key'))
    self.postMessage({action:'close'});
  else
  {
    var msg = {action:id,close:close,shiftOn:shiftOn,ctrlOn:ctrlOn};
    for(var i in {cs:1,ww:1,re:1,hl:1,tab:1})
      msg['find'+i] = $(i).checked;
    for(var i in {key:1})
      msg['find'+i] = $$(i);
    if(close)
    {
      var t;
      if(ctrlOn && altOn)
      {
        var mg = '"`^fjs_prompt_exp"`^';
        t = prompt(mg.replace(/%0A/g, '\n'), postMatch);
        if(t == null)
        {
          self.postMessage({action:'open'});
          return;
        }
        if(t) msg.postMatch = t;
      }
      else if(($('tab').checked && !ctrlOn) || (!$('tab').checked && ctrlOn))
      {
        if(altOn)
        {
          var mg = '"`^fjs_prompt"`^';
          t = prompt(mg.replace(/%0A/g, '\n'), '"`^fjs_no_res"`^');
          if(t == null)
          {
            self.postMessage({action:'open'});
            return;
          }
        }
        if(t && t != '"`^fjs_no_res"`^')
        {
          if(t.match(/^TAB:(.+)$/))
          {
            msg.tabonly = true;
            t = RegExp.$1;
          }
          else if(t.match(/^TITLE:(.+)$/))
          {
            msg.titleonly = true;
            t = RegExp.$1;
          }
          else if(t.match(/^URL:(.+)$/))
          {
            msg.urlonly = true;
            t = RegExp.$1;
          }
          msg.restrict = t.match(/^\s*\/(.+?)\/(\w*)\s*$/)?
                         { exp:RegExp.$1, mod:RegExp.$2, text:t } : { text:t };
        }
      }
    }
    self.postMessage(msg);
  }
}
function $$(id) {
  return document.getElementById(id).value;
}
function $(id) {
  return document.getElementById(id);
}
self.on('message', function(opts) {
  if(/^focus\d?/.test(opts.action))
  {
    $('key').focus();
    if(opts.action == 'focus1')
    {
      var len = $$('key').length;
      $('key').setSelectionRange(len, len);
    }
    return;
  }
  if(opts.action == 'update')
  {
    $('key').value = opts.key;
    $('key').focus();
    return;
  }
  for(var i in opts.opts)
  {
    if(i.match(/^find(\w+)$/))
    {
      var id = RegExp.$1, j = $(id);
      if(j)
      {
        if(id.match(/cs|ww|re|hl|tab/)) j.checked = opts.opts[i];
        else j.value = opts.opts[i];
      }
    }
    else if(i == 'nofaytinbox')
      nofaytinbox = opts.opts.nofaytinbox;
    else if(i == 'postMatch')
      postMatch = opts.opts.postMatch;
  }
  if(opts.action == 'init')
  {
    $('key').focus();
    if(!opts.initChar)
    {
      $('key').setSelectionRange(0, $$('key').length);
    }
  }
  if(opts.opts.findkey && !nofaytinbox)
  {
    process('search1', false);
  }
});
