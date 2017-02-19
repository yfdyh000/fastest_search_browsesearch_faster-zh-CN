// copyright (c) Mingyi Liu, 2011, all rights reserved
// The source code in the entire Fastest Search package is not to be
// used/reused/modified/redistributed without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).
self.on('click', function(node, data) {
  var form = node.form;
  if(form)
  {
    var input = [], q = [], e = form.elements, sub = 0;
    for(var i = 0; i < e.length; i++)
    {
      var item = e[i];
      if(item.name)
      {
        if(item == node)
          q.push(node.name + '=DO_NOT_CHANGE_THIS'); // some utf-8 queries got escaped by google if q= is put at end of query
        else
        {
          if(item.type.match(/select/i))
          {
            for(var j = 0; j < item.options.length; j++)
              if(item.options[j].selected)
                q.push(item.name + '=' + item.options[j].value);
          }
          else if((item.type.match(/checkbox|radio/i) && item.checked) ||
             (item.type.match(/submit|image/i) && !sub++) ||
             item.type.match(/text|password|file|hidden|textarea/i))
            q.push(item.name + '=' + item.value);
        }
      }
    }
    // get favicon
    var doc = node.ownerDocument;
    self.postMessage({text:q.join('&'), url:location.href, action:form.action,
      title: doc.defaultView.document.title });
  }
});
self.on('context', function(node, data) {
  return !!node.form;
});
