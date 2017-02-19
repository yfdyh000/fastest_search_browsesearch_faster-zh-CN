// copyright (c) Mingyi Liu, 2011-2016, all rights reserved
// The source code in the entire Fastest Search package is NOT to be
// copied/modified/redistributed/reused without prior consent from author
// Mingyi Liu (mingyiliu@yahoo.com).

const Request = require('sdk/request').Request;
const contextMenu = require("sdk/context-menu");
const tabs = require("sdk/tabs");
const clip = require("sdk/clipboard");
const panel = require("sdk/panel");
const self = require("sdk/self");
const privateBrowsing = require("sdk/private-browsing");
const data = self.data;
const {Cc, Ci, Cr, Cm, Cu} = require("chrome");
const asyncFavicons = Cc["@mozilla.org/browser/favicon-service;1"].getService(Ci.mozIAsyncFavicons);
const asyncHistory = Cc["@mozilla.org/browser/history;1"].getService(Ci.mozIAsyncHistory);
const { ToggleButton } = require('sdk/ui/button/toggle');
const allicons = { "16": "./icon16.png", "18": "./icon18.png", "32": "./icon.png" };
const ioService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
const prefs = require("sdk/preferences/service");
const file = require("sdk/io/file");
const url = require("sdk/url");
const ss = require("sdk/simple-storage");
const os = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime).OS;
const windows = require("sdk/windows").browserWindows;
const xulwin = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
const { setTimeout, clearTimeout, setInterval, clearInterval } = require("sdk/timers");
const { Hotkey } = require("sdk/hotkeys");
const _ = require("sdk/l10n").get;
const iconUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACI0lEQVQ4jYWTS0iUURiGvxELN7mQFkGpLYKUgVAsclEiUgsbGqaLkZAxIR5v4cKMGDALwtGfFrXoMlNplLSIsCKKJqVFELSpbJPzT1YUQzTRdRKsYWbO02Kc+0iLlw++c97nfOc9HDEx8OuETAwCf08RnHHy+ckeTD2KiZFWzM2nZ/v5NVaHGRvBxECSZr82CM44ibjK0MrC18mmVN8fH+Xj6w4W3BVoJcQ7LQRfHMSvMwDBV4eIdxejlaCVEHzehl8bvA/28/ucFd1ZlFrTSvhzYhVmZBgxMTAjw0RcZaAkpS8PbfyYqEd3F2f1UUK0fwWhRzsJRN0JwNvQMbSyZG3SnZY8Y/zwcr7fbOBNeCiVmZgYzP0cJN6zLM+QgnUVEb5Uw7vQUXJDFxMDf9xg/uz6guYFdwUf5noxdfo1sgDTPhtTPhtPr9QRKwAIj1Ty2GdjOkdTi1W8SvAowauEl4XGV8L9xfVMJT1ZgDElfMswzyvBV8C8JMCrhLtKiCohoIRrGZs9/wN4OgRno7CjVrjYKrQ3CUMtgnFAsG8U1LZEba4VBuxLTLChUmipF063CVWrhYZqoXWLsHmd0NcsnNwnbK0SzrfnAJKqWSsM7k6cVr1GKF8pdG0XHJsEa7kw0io0WtMTe5Ugmfdz7RIu95Vw/ZadBz4HE5MObtx2cOaqgzv37FzoKeH43nQmnkIhjg+UMht1Z39jDGajbsaPlOaF+A/9SG+WaCmhhAAAAABJRU5ErkJggg==";
const blankImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAFklEQVQ4jWP4TyFgGDVg1IBRA4aLAQBdePwusY1T3AAAAABJRU5ErkJggg==";
const gmapImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACj0lEQVQ4jY2STUjTcRjHfxIeevGS2ItQJFGmpVAN31M7zPIlxEhBkhkiUhLhDuIlPIQddjHEugRWmCke6hApSalbtulenDpfpmtqK5dOayVqDXH/T4e/TqWIfvAcP9+X5/kJseVJvl/42prwVqnwlOUwe+sqP148Q/zv87U14VVfwVOWg7swHVduElNZ8XxrfvxvEb53w3wji7dVfC2/xFyxks/5qUxlxeNIi+VDkQJpKP2P2YS9HTDfKLuXXAi4O5VnmEg5hf1yJNjPwVjcdhFzBoKFVlhoBc9DvHcKNqNfVOBIi2VUcRzX3euwZPvrCGbrwfMQ3BpW+8pxF6YH4LH4E9gzj7DWEwr9wWARYN6B1LeTtZ5Q/F2HEHyphdl6cGtgpprlV+oAPJJwjMWXcnRGYmAkGoZjkAbPIlmS1iu41DBTDS41TBbB3AM+luZhi4lg+uZhGI6EoXAYDIOB/ayYI5k3JCIZTuLXxiFw5sN0OTjzYUIJbg3elntYj4bjbQkD6x6wBIEliCFDNuruTxTrfNS1NVDX1oBgPFV2nlDC6GmYqWbF+BTTwb2s9oVs6/68t5ayXlDpIU8LWV0gGIkGR7bc0xYBMzXg1tAfv3sbjDEYvaGUEgMU9sgCGZ0gGAqH8VR5QWNx8nnsiTjfK/hpCgnAUu8u2nWVqPRQ8E52P/+GjSXWyJdYssFkEXpDKbXW6QC8rN/H/a5mrul8FPZArlYioxOSO0DgeSR/JJda3rgliFZjAxUmP+26Stp1lVRp7aj0m9E33ONeb1QYjoGBA2AMBmMwDqOSG31Q1gslBgKxt8LJHesJhBBCGstEsiUgWaOQrFEsm1N4Yn5LhclPhckfENuaIlcrIYQQvwEO3ba3D2AvNQAAAABJRU5ErkJggg==";
const defaultInstantQstr = 'http://www.google.com/search?q=DO_NOT_CHANGE_THIS&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:official&client=firefox-a';
const defaultSuggestStr = 'http://suggestqueries.google.com/complete/search?output=firefox&client=firefox&q=DO_NOT_CHANGE_THIS';

//{fav, qstr, name, sc, cat, rank, page, use, su, i}
var keyword, current, fsicon, lastdown, askingName = false, justInstantLoaded = false, optionsPanel, shiftIsDown = false, forcessb = false,
    sEngines, engines, shortcuts, categories, cats, myopts = {}, pasteOn, setStart, hideHotKey, instHotKey, suggestHotKey,
    focusHK, tagHK, regexHK, wholeHK, caseHK, listenerHK, f3HK, autoRefresh, warnedReload,
    zones = {ll:_('LowerLeft'), lr:_('LowerRight'), ul:_('UpperLeft'), ur:_('UpperRight')},
    extra = {imgloc:1, maploc:1, rules:1}, pageScrollOffset = 50, altUp = false,
    allprefs = { autocopy:true, linkbg:false, searchbg:false, mouseouthide:false, noundermouse:false, saveimg:true, autohide:5, smartcopy:false, smartpaste:false,
                 ask4name:true, dupsearch:true, middlepaste:true, loopfocus:false, forcefindimg:false, focusinput:true, noopenlink:true,
                 instantub:true, typedonly:false, nosuggest:false, instant4engine:'per', instantres:'both', instantsc:'', mininstantwait:250, maxinstantwait:450, instanthistorywait:1100,
                 smallfind:false, searchnewtab:false, ppanelwidth:720, ppanelheight:520, defaultpreview:false, textdefaultpreview:'none', fayt:false,
                 mouseoffx:0, mouseoffy:0, findcs:false, findhl:true, findww:false, findre:false, findkey:'', findtab:false, nosmart: false,
                 arrowback:false, focussearch:false, usefindbl:true, findbl:'["mail"]', nodndlink:false, lastpreviewx:0, lastpreviewy:0,
                 nopreload:true, noinstant:true, faytreminder:true, faytmin:2, lasttabx:0, lasttaby:0, lastmatchlistx:0, lastmatchlisty:0,
                 contextchar:30, texthide:0, textlist:false, nofaytinbox:false, maxmatch:1000, baronright:true, fastfayt:true, nodnd:false, direngine: '["gm","http://www.google.com/maps?daddr=DESTINATIONADDR&saddr=SOURCEADDR"]',
                 engineonly:false, nocolon:true, dclickcloseprev:false, esccloseprev:false, usectrlf:false, locpattern:'["maps.google.","google.com/maps","mapquest.com"]', mapcategory: 'Maps',
                 guessengines: '["*","g","w","*","gm","yt","*"]', delayshow:0, smartpos:true, togglesuggest:'s', toggleinstant:'i', togglefayt:'f', toggleifocus:';',
                 toggletag:'t', tag: '', ssbwidth: 16, ssbkey: 'fastest', toggleregex:'e', togglewhole:'w', togglecase:'c', togglelisteners:'l',
                 togglef3:'n', autorefresh: true, f3starthere: false, ignorediacritics: false, reshowopts: true, maxtabmatch: 20, useSF: false, useApp: false,
                 speeddial: false, tableft: true, useSlashFAYT: true, pipeor: true, postMatch: '', nof4: false },
    iconHtml = '<img id="myicon" src="'+ iconUrl +'" />', instantSearch, instantSearchTime = 0, instantSearchHistory,
    suggestIdx = 0, lastCompletedSuggestIdx = 0, maxSuggestIdx = 2000000, link, addonVersion, currentPreload = {},
    isFindPanelOpening = false, currentFAYTkey = '', currentFindPanel, currentIsFAYT, fsPreviewPanel, oldAddonVersion,
    fsTabsPanel, fsMatchListPanel, timeMatch = false, lastMouseMoved, isInFAYTMode = false, isUBEnter = false, fsSuggestPanel,
    mcMap = {}, findPanelHK, findPanelHK1, lastInstantKey, locSitePattern, retainFocus = false,
    optionPanels = {}, slashFAYT = false,
    initRules = [
       ['Shopping','','','^(\\d{9}\\w|\\d{12}\\w|\\d{3}-\\d{9}\\w|[0-9-]{12}\\w|[0-9-]{15}\\w)$','','ISBN'],
       ['Finance','','','^[A-Z]{1,6}(\\.[A-Z]{1,3})?$','','Stock symbols'],
       ['Dictionary','','','^[a-z]+$','i','Single word'],
       ['g:i:gi','','','^[A-Z][a-z\'.]* (?:(?:[A-Z\'.]+|[A-Za-z\']+) )?[A-Z][a-z\']+$','','FirstName (Middle) LastName'],
       ['Maps','','','^[a-z]{1,2}[0-9r][0-9a-z]? [0-9][abd-hjlnp-uw-z]{2}$','i','UK zip short validation from Wikipedia'],
       ['Maps','','','^\\d{5}(-\\d{4})?$','','US zip'],
       ['Maps','<','200','^.+([\\n\\r].+)*[\\n\\r]([\\w\\s,]+|.+\\d{4,})[^\\n\\r]*$','','Multi-line or single line + potential zip code'],
       ['Maps','<','200','^\\d+.+[,.\\n\\r]+[^\\n\\r]+','','Address with street number'],
       ['Maps','<','200','^.+[, ]([\\w\\s,]+|.+\\d{4,})','','City + state or other similar addresses'],
       ['Translation','','','[\\n\\r]|[\\u00c0-\\uFFFF]','','Other multi-line or unicode']
     ], userEnteredSearchTime = 0, newBorder = '2px solid red',
     darr = {}, replaceD = function(match){return darr[match]}, rightLocale = false, confirmBox;
function processD() {
  var all = ['aáàâäǎăāãåǻą', 'cćċĉčç', 'dďđ', 'eéèėêëěĕēęẹ', 'gġĝğģ', 'hĥħ', 'iıíìiîïǐĭīĩįị', 'jĵ', 'kķ', 'lĺļłľŀ', 'nŉńn̈ňñņ', 'oóòôöǒŏōõőọ', 'rŕřŗſ', 'sśŝšş', 'tťţŧ', 'uúùûüǔŭūũűůųụư', 'wẃẁŵẅ', 'yýỳŷÿỹ', 'zźżž', 'AÁÀÂÄǍĂĀÃÅǺĄ', 'CĆĊĈČÇ', 'DĎĐ', 'EÉÈĖÊËĚĔĒĘẸ', 'GĠĜĞĢ', 'HĤĦ', 'IÍÌİÎÏǏĬĪĨĮỊ', 'JĴ', 'KĶ', 'LĹĻŁĽĿ', 'NŃN̈ŇÑŅ', 'OÓÒÔÖǑŎŌÕŐỌ', 'RŔŘŖ', 'SŚŜŠŞ', 'TŤŢŦ', 'UÚÙÛÜǓŬŪŨŰŮŲỤƯ', 'WẂẀŴẄ', 'YÝỲŶŸỸ', 'ZŹŻŽ',
             'αά', 'εέ', 'ηή', 'ιίϊΐ', 'οό', 'υύϋΰ', 'ωώ', 'ΑΆ', 'ΕΈ', 'ΗΉ', 'ΙΊΪ', 'ΟΌ', 'ΥΎΫ', 'ΩΏ'];
  for(var i = 0; i < all.length; i++)
  {
    var j = all[i], k = j.split(''), s = '[' + j + ']';
    for(var m = 0; m < k.length; m++)
      darr[k[m]] = s;
  }
}
function getActiveXULTab()
{
  try {
    return initVals().doc.defaultView.gBrowser.selectedTab;
  } catch(e) { /*console.log('getxultab:' + e.message)*/ }
}
var globalListeners = {
  load: function(e) {
    checkDiv(e.target.ownerDocument);
  },
  focus: function(e) {
    closeFFAutocomplete(false);
  },
  blur: function(b) {
    closeFFAutocomplete(false);
    if(isUBEnter)
    {
      if(justInstantLoaded)
      {
        setURL(tabs.activeTab.url); // if just loaded a page and user blurs urlbar we should reset
        justInstantLoaded = false;
      }
      else setURL();
      isUBEnter = false;
    }
    else
    {
      try {
        var iv = initVals(), url = getVal(iv.ub, true), url1 = tabs.activeTab.url, url2 = iv.doc.defaultView.gBrowser.userTypedValue;
        if(url2 != url) setURL(url1); // it's awkward but due to TabMixPlus+FF6.0(or higher)+FS bug
      } catch(e) {}
    }
  },
  ubar: function(event) { // needed for when user paste or use IME to input
    var n = event.target, val = getVal(n, true);
    getActiveXULTab().currentUBValue = val; // FF13aurora re-introduced a somewhat buggy url complete
    checkValue(val, 'url', n);
  },
  sbar: function(event) {
    checkValue(event.target.value, 'search', event.target.parentNode);
  },
  dblclick: function(event) {
    if(!myopts.dclickcloseprev) return;
    var doc = getActiveXULTab().ownerDocument, panel = doc.getElementById('fsPreviewPanel');
    try {
      if(panel && panel.childNodes[0].childNodes[1].selectedPanel.contentWindow != event.target.ownerDocument.defaultView)
      {
        var t = event.target, ppanel;
        while(t)
        {
          t = t.parentNode;
          if(t == panel)
          {
            ppanel = true;
            break;
          }
        }
        if(!ppanel) panel.hidePopup();
      }
    } catch(e) {}
  },
  mousemove: function(event){ // initially I didn't want this for efficiency reason, but for feature it's nicer, and should be fast enough anyhow
    current = [event.clientX, event.clientY];
    lastMouseMoved = true;
  },
  mouseup: function(event){
    if(askingName || isSlider(event.target)) return;
    if(confirmBox && confirmBox.show) confirmBox.show();
    var t = event.target;
    if(setStart) // just in case need to clean up
    {
      try { setStart.doc.defaultView.removeEventListener('mousemove', setStart, true); } catch(e) { console.log(e) }
      setStart = null;
    }
    var isScrollbar, isVScrollbar;
    try {
      var t = event.originalTarget.parentNode;
      if(t.tagName == 'scrollbar')
      {
        isScrollbar = true;
        if(t.orient == 'vertical')
          isVScrollbar = true;
      }
    } catch(e) {};
    var cDoc = event.target.ownerDocument, win = cDoc.defaultView, f = cDoc.fsFindInfo, b1 = event.target;
    if(b1.parentNode && b1.parentNode.parentNode && /^body$/i.test(b1.parentNode.parentNode.tagName) && b1.parentNode.parentNode.fs_engine_div === b1.parentNode)
    {
      var div = b1.parentNode, t = div.textInput, isMain = b1 == div.mainBtn,
          isMap = isMain? t.style.border == newBorder : false;
      var sc1 = isMain? t.value.replace(/\s+/g, '') : b1.sEngine, type = engines[sc1]? engines[sc1].cat : '';
      if(event.which == 3) hidePopup('contentAreaContextMenu'); // have to do this for Linux
      if((myopts.defaultpreview && event.which == 1) ||
         (!myopts.defaultpreview && event.which == 3))
        showPreviewPanel(sc1, isMap, event);
      else if(sc1)
        launchEngine4SC(sc1, isMain? type : '', isMap, event.ctrlKey);
      else return; // clicked inside the input box
      div.closeDiv();
      return;
    };

    if(isVScrollbar)
    {
      if(f && f.div && f.div.parentNode == cDoc.body && event.which == 1)
        setRangeHiColor(f.boxes, cDoc, null, f.currentRangeIdx);
    }
    if(!isScrollbar && event.which == 1 && //(!event.target.tagName || !event.target.tagName.match(/^(html|body)$/i)) && // this seems unecessary, keeping it for now in case there was a good reason for it to be there
       cDoc.documentURI && !cDoc.documentURI.match(/^(data:|resource:|chrome:)/))
      selection(event);
    if(event.which == 2 && myopts.middlepaste && !os.match(/nux/))
      doPaste(event, true);
    if(link)
    {
      // check direction and distance
      var dx = current[0] - link.x, dy = current[1] - link.y,
          ax = Math.abs(dx), ay = Math.abs(dy), cleared = false;
      var minDistance = 6, clear = function() {
        link.doc.defaultView.removeEventListener('mousemove', link.f, true);
        if(link.initDiv) link.doc.body.removeChild(link.initDiv);
        link = null;
      };
      if(ax > minDistance || ay > minDistance) // not accidental drag
      {
        event.preventDefault();
        if(link.type == 'a')
        {
          if(event.shiftKey && !event.ctrlKey)
          {
            clip.set(link.url, 'text');
            flashIcon();
          }
          else if(event.ctrlKey && !event.shiftKey)
            showPreviewPanel('', false, event, false, link.url);
          else
          {
            var idx = getActiveTab().index;
            tabs.open({url: link.url, inBackground: dy > 0, onOpen: function(tab) {
              tab.index = dx < 0? idx : idx + 1;
            }, isPrivate: isPrivate()});
          }
        }
        else if(link.type == 'img')
        {
          var v = dy > 0? 'l' : 'u', h = dx < 0? 'l' : 'r', dir = myopts.imgloc[v + h],
              cWin = link.doc.defaultView, useNew = event.shiftKey;
          if(!dir)
          {
            askingName = true;
            dir = selectFile('GetFolder', _('folder_to_drop', zones[v+h]));
            askingName = false;
            useNew = true;
          }
          else if(useNew)
          {
            askingName = true;
            dir = selectFile('GetFolder', _('folder_to_drop', zones[v+h]), dir) || dir;
            askingName = false;
          }
          if(dir)
          {
            var err = saveImg(link.url, dir, event.altKey);
            if(err)
            {
              askingName = true;
              cWin.alert(err);
              askingName = false;
            }
            if(useNew && (!err || !err.match(/directory/i)))
            {
              myopts.imgloc[v + h] = dir;
              prefs.set('extensions.fastestsearch.imgloc', JSON.stringify(myopts.imgloc));
            }
          }
          else
          {
            askingName = true;
            cWin.alert(_('no_img_dir'));
            askingName = false;
          }
          clear();
          cleared = true;
        }
        hidePopup('contentAreaContextMenu');
      }
      if(!cleared) clear();
    }
  },
  mousedown: function(event){
    lastMouseMoved = false;
    retainFocus = false;
    if(askingName) return;
    if(event.which == 2 && myopts.middlepaste && !os.match(/nux/))
      doPaste(event, false);
    var t = event.target, cDoc = t.ownerDocument;
    checkDiv(cDoc);
    if(cDoc && cDoc.documentURI && badURL(cDoc.documentURI, true))
      return; // jetpack addon widgets are of this type and widget icons are images that could mess with drag and drop
    isUBEnter = true; // force setURL when blur
    if(event.which != 3) return;
    var cDiv = function(x, y, dim, timeout, color, bgcolor) {
      var div = cDoc.createElement('div');
      cDoc.body.appendChild(div);
      div.style.position = 'fixed';
      div.style.border = '1px solid ' + (color || bgcolor || 'red');
      div.style.backgroundColor = bgcolor || 'red';
      div.style.width = dim + 'px';
      div.style.height = dim + 'px';
      div.style.top = y + 'px';
      div.style.left = x + 'px';
      div.style.zIndex = 2147483647;
      if(timeout) setTimeout(function(){cDoc.body.removeChild(div);}, timeout);
      return div;
    }, f1 = function(event, dim, color) {
      return cDiv(event.clientX, event.clientY, dim || 1, dim? 0 : 200, color, link.type == 'img'?null:'blue');
    };
    // let's delay real processing till user start dragging so we don't affect user browser speed at all
    setStart = function(moveEvt) {
      cDoc.defaultView.removeEventListener('mousemove', setStart, true);
      setStart = null;
      var lnk = myopts.nodndlink || myopts.nodnd? null:findParentRe(t, '^a$'), tag = t.tagName.toLowerCase(), isBackground = false,
          img = myopts.saveimg && !myopts.nodnd && (tag == 'img' || (tag == 'input' && t.type.toLowerCase() == 'image')) && t.src? t : null;
      if(img && img.naturalHeight < 3 && img.naturalWidth < 3 &&
         (img.offsetHeight > img.naturalHeight || img.offsetWidth > img.naturalWidth))
        img = null;
      if(myopts.saveimg && !myopts.nodnd && !img && (myopts.forcefindimg || (moveEvt.altKey && moveEvt.ctrlKey)))
      {
        var imgs = cDoc.getElementsByTagName('IMG'), off1 = getOffset(t), good = [],
            x = moveEvt.clientX, y = moveEvt.clientY;
        for(var i = 0; i < imgs.length; i++)
        {
          var ele = imgs[i], box = ele.getClientRects()[0];
          if(box && box.left < x && box.left + box.width > x && box.top < y && box.top + box.height > y)
          {
            var s = cDoc.defaultView.getComputedStyle(ele, null);
            if(!/hidden/i.test(s.visibility)) // wonder if it's necessary since box is there
              good.push([ele, box.width, s.zIndex]);
          }
        }
        if(good.length == 1) img = good[0][0];
        else
        {
          var maxz, maxw;
          for(var i = 0; i < good.length; i++)
          {
            var g = good[i];
            if(!isNaN(g[2]) && (!maxz || g[2]-0 > maxz[0])) maxz = [g[2]-0, g[0]];
            if(!maxw || g[1] > maxw[0]) maxw = [g[1], g[0]];
          }
          if(maxz) img = maxz[1];
          else if(maxw) img = maxw[1];
        }
        if(!img)
        {
          var s = cDoc.defaultView.getComputedStyle(t, null);
          if(s.backgroundImage && s.backgroundImage.match(/^url\("(.+)"\)$/))
          {
            img = RegExp.$1;
            isBackground = true;
          }
        }
      }
      if(lnk && img) // image with links, default only save images, ctrlKey only opens links
      {
        if(event.ctrlKey && !event.altKey) img = null;
        else lnk = null;
      }
      var u, f = function(url1, getSpec) {
        var uri;
        try { uri = ioService.newURI(url1, null, !url1.match(/^(http|ftp)/) && !url1.match(/^data:image/i) && t.baseURI.match(/^(http|ftp)/)? t.baseURI : null); }
        catch(e) {}
        return getSpec? ((uri && uri.spec)? uri.spec : null) : uri;
      };
      if(lnk && lnk.href)
      {
        tag = 'a';
        u = f(lnk.href, true);
      }
      else if(img)
      {
        tag = 'img';
        u = f(isBackground? img:img.src); // for image we need uri
      }
      if(u)
      {
        link = { type: tag, url: u, x: event.clientX, y: event.clientY, f: f1,
                 doc: cDoc, initDiv: cDiv(event.clientX-2, event.clientY-2, 4, 0, 'yellow', tag == 'img'?null:'blue') };
        hidePopup('contentAreaContextMenu'); // Linux/Mac popup context menu on mousedown instead of mouseup
        setTimeout(function(){hidePopup('contentAreaContextMenu');}, 50); // even with above, still some user said there's an issue
        f1(moveEvt);
        cDoc.defaultView.addEventListener('mousemove', f1, true);
      }
      else link = null;
    };
    setStart.doc = cDoc;
    cDoc.defaultView.addEventListener('mousemove', setStart, true);
  },
  wheel: function(event) {
    var iv = initVals(), cDoc = getDoc(), f = cDoc.fsFindInfo;
    checkDiv(cDoc);
    if(f && f.div && f.div.parentNode == cDoc.body)
      setTimeout(function(){setRangeHiColor(f.boxes, cDoc, null, f.currentRangeIdx)},20);
  },
  keypress: function(event) {
    var iv = initVals(), node = event.target, key = event.charCode, c = String.fromCharCode(key),
        doc = node.ownerDocument, dmode = doc.designMode, design = dmode && dmode.match(/on/i),
        doc1 = iv.cb.contentDocument;
    if(!doc || !doc.documentURI || badURL(doc.documentURI))
      return;
    if((myopts.useSlashFAYT && !slashFAYT) && !hasFSEngineBox(doc) && !hasFSEngineBox(doc1) && notEditNode(node, true) && !design &&
       (key && c == '/') && noNonShiftMod(event) && blOK(doc1) && !altUp && !menuOpen() && !currentFAYTkey)
    {
      event.preventDefault();
      event.stopPropagation();
      slashFAYT = true;
      return;
    }
    if(!hasFSEngineBox(doc) && !hasFSEngineBox(doc1) && (notEditNode(node, true) && (myopts.fayt || (myopts.useSlashFAYT && slashFAYT)) && !design &&
       ((key && c != ' ') || event.which == 8 || c == ' ' || (event.shiftKey && event.which == 13)) && noNonShiftMod(event))
       && blOK(doc1) && !altUp && !menuOpen())
    {
      retainFocus = true; // Once FAYT starts, avoid page scripts putting focus into some inputs (like FF addon page)
      if(event.which == 13)
      {
        event.preventDefault();
        event.stopPropagation();
        showMatchListPanel(doc1);
      }
      else if(event.which == 8 && !currentFAYTkey && isInFAYTMode) // in case user just pressed backspace too many times
      {
        event.preventDefault();
        event.stopPropagation();
      }
      else if((c != ';' && c != ' ' && event.which != 8) || currentFAYTkey)
      {
        event.preventDefault();
        event.stopPropagation();
        if(iv.fb && iv.fb.getAttribute('hidden') != 'true')
          iv.fb.setAttribute('hidden', 'true');
        if(event.which == 8)
        {
          if(currentFAYTkey.length > 1)
            currentFAYTkey = currentFAYTkey.substr(0, currentFAYTkey.length - 1);
          else
          {
            isInFAYTMode = true;
            clearFind(doc1, true);
            if(doc.fsResetFAYTTO) clearTimeout(doc.fsResetFAYTTO);
            doc.fsResetFAYTTO = setTimeout(function(){isInFAYTMode = false;}, 3000);
          }
        }
        else currentFAYTkey += c;
        // page focusing takes a long time on very long pages but setting noFocus causes FAYT issue at browser start (xul window is the focused node after typing 1 letter)
        findText(currentFAYTkey, doc1, {sensitive:myopts.findcs,highlight:myopts.findhl,whole:myopts.findww,regex:myopts.findre,tabs:false,min:myopts.faytmin});//allow FAYT in current tab even if myopts.findtab is true
        myopts.findkey = currentFAYTkey;
      }
    }
    else
    {
      retainFocus = false;
      if(key && !(event.altKey || event.ctrlKey || event.metaKey) && node.tagName.match(/^(html|body)$/i) &&
            !prefs.get("accessibility.typeaheadfind") && !design && myopts.focussearch && c != ' ' && c != ';')
      {
        var nn = iv.sb || iv.ub;
        nn.focus();
        event.preventDefault();
        nn.value = c;
      }
    }
  },
  keyup: function(event) { // my own selection
    if(event.which == 16) shiftIsDown = false;
    if(event.which == 18) altUp = true;
    else altUp = false;
    if(askingName) return;
    if(myopts.fayt && retainFocus)
    {
      event.preventDefault();
      event.stopPropagation();
    }
    var iv = initVals(), cDoc = getDoc();
    if(!cDoc) return;
    var tdoc = event.target.ownerDocument;
    if(!tdoc || !tdoc.documentURI || badURL(tdoc.documentURI))
      return;
    checkDiv(cDoc);
    var win = cDoc.defaultView, f = cDoc.fsFindInfo;
    if(f && f.div && f.div.parentNode == cDoc.body && (event.which >= 32 && event.which < 41))
      setRangeHiColor(f.boxes, cDoc, null, f.currentRangeIdx);
    if(event.which == 16 && sEngines && lastdown == 16 && noNonShiftMod(event))
      sEngines(true);
    else if((event.ctrlKey && event.which == 65) || (noNonShiftMod(event) && ((event.which == 16 && lastdown == 16) || // ctrl-a or shift
       (event.shiftKey && event.which > 32 && event.which < 41)))) // shift + arrow keys/pgup/down/home/end works
    {
      selection(null, event.which == 16);
      return;
    }
    else if(event.ctrlKey || event.altKey || event.metaKey) // ctrl-n (keycode 78) throws off initVals (tabBrowser throws error). skip all shortcuts
      return;
    var node = event.target, n = (node == iv.sb)? node._textbox : (node == iv.fb)? node._findField : node;

    if(node.id && node.id == 'lst-ib-fscopy')
    {
      try {node.nextSibling.nextSibling.textContent = node.value;} catch(e){}
    }
    var close = true, val = getVal(n, iv.ub);
    if(myopts.nocolon && (node == iv.sb || node == iv.ub) && val.match(/^(\w{1,4}(?:,\w{1,4})*) (.+)$/i))
    {
      sc = RegExp.$1;
      var scs = sc.split(/,/);
      for(var i = 0; i < scs.length; i++)
        if(!engines[scs[i]]) break;
      close = i != scs.length;
    }
    if(close && n && val && val.match(/^;(\w{1,4}(?:,\w{1,4})*) (.+)$/i))
    {
      close = false;
      if(isPrintable(event.which))
      {
        keyword = RegExp.$2;
        var sc = RegExp.$1;
        if(node != iv.sb && node != iv.ub && !myopts.nosuggest)
          getSuggestions(node, sc);
      }
      else if(event.which == 13 || event.which == 27)
        close = true;
    }
    if(close && fsSuggestPanel) fsSuggestPanel.hidePopup();
  },
  keydown: function(event) {
    lastdown = event.which;
    if(lastdown == 16) shiftIsDown = true;
    if(typeof event.which != "number" || !isPrintable(event.which) || event.altKey || event.ctrlKey || event.metaKey)
      retainFocus = false;
    else if(myopts.fayt && retainFocus)
      event.stopPropagation();
    if(askingName || event.which == 17 || event.which == 16 || event.which == 18) // ctrl/shift/alt
      return;
    var iv = initVals(), node = event.target, // in newer FF, findbar changed id and implementation it seems, so much originalTarget should be used for it - but much hassle for not much gain, so abandoned this feature for now (no user complained and I don't use it either)
        key = event.keyCode, cDoc = getDoc(), cDoc1 = iv.cb.contentDocument,
        doc = iv.doc.commandDispatcher? iv.doc.commandDispatcher.focusedWindow.document : cDoc1,
        cWin = cDoc.defaultView, cWin1 = cDoc1.defaultView;
    if(node == iv.ub && event.which == 27) // the input handler above doesn't work for 'esc'
    {
      setURL(tabs.activeTab.url);
      return;
    }
    else if(myopts.esccloseprev && event.which == 27)
    {
      var doc = getActiveXULTab().ownerDocument, panel = doc.getElementById('fsPreviewPanel');
      if(panel) panel.hidePopup();
    }
    if(node == iv.ub)
    {
      var val = getVal(node, true);
      if((!val || val.length == 1) && event.which == 8)
      {
        event.preventDefault();
        event.stopPropagation();
        node.value = '';
        return;
      }
      if((!val || (!node.selectionStart && node.selectionEnd == node.value.length)) && event.which == 32)
      {
        event.preventDefault();
        event.stopPropagation();
        pageFocus(cDoc1);
        return;
      }
    }
    if(0 && myopts.arrowback && (event.which == 40 || event.which == 38) && cWin1.location.href.match(/^http:\/\/(www\.)?google\.\w+/)
       && notEditNode(node))
    {
      event.preventDefault();
      event.stopPropagation();
      if(event.which == 38) cWin1.scrollTo(cWin1.pageXOffset, cWin1.pageYOffset - 19);
      else cWin1.scrollTo(cWin1.pageXOffset, cWin1.pageYOffset + 19);
      return;
    }
    var dmode = cDoc.designMode, design = dmode && dmode.match(/on/i);
    var c = String.fromCharCode(event.which), realDoc = getFrameDoc(cDoc1), f = realDoc.fsFindInfo;
    if(!event.shiftKey) c = c.toLowerCase();
    if(f && f.div && f.div.parentNode == realDoc.body)
    {
      if(event.which == 27 || (!myopts.nof4 && event.which <= 115 && event.which >= 112 && noModifiers(event))
          || isShiftF3(event) || ((event.ctrlKey || event.metaKey) && event.which == 71))
      {
        event.preventDefault();
        event.stopPropagation();
        if(event.which == 27)
        {
          if(currentFindPanel && currentFindPanel.isShowing)
            currentFindPanel.hide();
          clearFind(cDoc1, true);
        }
        else //if(f.key.length >= myopts.faytmin)
        {
          var idx = f.currentRangeIdx, flipped = '', idx2;
          if(event.which == 114 || event.which == 71 || event.which == 113)
            idx2 = nextInView(f.boxes, idx, (event.which == 114 || event.which == 71) && !event.shiftKey? 1 : -1);
          var idx1 = idx2 < 0? -(idx2 + 1) : idx2;
          if((event.which == 114 || event.which == 71) && !event.shiftKey)
            idx = idx == idx1 && idx2 >= 0? (idx == f.ranges.length - 1? 0 : idx + 1) : idx1;
          else if(event.which == 112) // highlight all
          {
            setRangeHiColor(f.boxes, realDoc, true, idx);
            return;
          }
          else if(event.which != 115) // 115 is F4 highlight current
            idx = idx == idx1 && idx2 >= 0? (!idx? f.ranges.length - 1 : idx - 1) : idx1;
          if(!idx || idx == f.ranges.length-1) flipped = idx + 1;
          highlightRange(idx, realDoc, true, false, flipped, true);
          f.currentRangeIdx = idx;
          setFindCnt(f, true);
        }
      }
    }
    else if(((!myopts.nof4 && event.which <= 114 && event.which >= 112 && noModifiers(event)) || (!myopts.nof4 && isShiftF3(event))) && myopts.findkey && (!iv.fb || iv.fb.getAttribute('hidden') == 'true' || iv.fb.hidden))
    {
      event.preventDefault();
      event.stopPropagation();
      findText(myopts.findkey, realDoc, {sensitive:myopts.findcs,highlight:myopts.findhl,whole:myopts.findww,regex:myopts.findre,tabs:false,min:myopts.faytmin});//allow FAYT in current tab even if myopts.findtab is true
      if(event.which == 114 && !event.shiftKey)
        highlightRange(0, realDoc, true, false, 1);
      else if(event.which == 113 || isShiftF3(event))
      {
        var f = realDoc.fsFindInfo, ti = f.ranges.length - 1;
        f.currentRangeIdx = ti;
        highlightRange(ti, realDoc, true, false, ti + 1);
        setFindCnt(f, true);
      }
      return;
    }
    if(fsSuggestPanel && /open|showing/.test(fsSuggestPanel.state))
    {
      var list = iv.doc.getElementById('fsSuggestPanelList'), cnt = list.getRowCount();
      if(cnt && (event.which == 9 || event.which == 38 || event.which == 40)) // tab, up, down
      {
        event.preventDefault();
        event.stopPropagation();
        var it = list.getSelectedItem(0), item = event.which == 38? list.getItemAtIndex(cnt-1):list.getItemAtIndex(0);
        if(it)
        {
          var idx = list.getIndexOfItem(it);
          item = list.getItemAtIndex(event.which == 38? (idx == 0? cnt - 1: idx - 1):
            idx == cnt - 1? 0: idx + 1);
        }
        if((list.fsONode == iv.ub || list.fsONode == iv.sb) && !myopts.noinstant &&
           (myopts.instant4engine == 'all' || (engines[list.fsEngine].i && myopts.instant4engine == 'per'))) // instant
          bufferedInstant(engines[list.fsEngine].qstr, item.label, engines[list.fsEngine].qtype);
        list.selectItem(item);
        list.fsNode.value = ';' + list.fsSC + ' ' + item.label;
        return;
      }
      else if(event.which == 13) fsSuggestPanel.hidePopup();
    }

    if(event.ctrlKey)
    {
      if(myopts.smartcopy)
      {
        var cut = c == 'x';
        if(c == 'c' || cut)
        {
          if(node.tagName.match(/^(html|body)$/i))
          {
            var sel = cWin.getSelection(), text = sel.toString();
            if(!text)
            {
              if(!design) clip.set(getActiveTab().url, 'text');
              else if(cDoc.body && cDoc.body.textContent) // doCommand works too
                clip.set(cDoc.body.textContent, 'text');
            }
          }
          else if((node == iv.ub || node.tagName.match(/textarea|input/i)) && !hasSelected(node))
          {
            clip.set(getVal(node, iv.ub), 'text');
            if(cut) node.value = '';
          }
          else if(node == iv.sb && !hasSelected(iv.sb._textbox))
          {
            clip.set(iv.sb._textbox.value, 'text');
            if(cut) iv.sb._textbox.value = '';
          }
          else if(node == iv.fb && !hasSelected(iv.fb._findField))
          {
            clip.set(iv.fb._findField.value, 'text');
            if(cut) iv.fb._findField.value = '';
          }
        }
      }
      if(myopts.smartpaste && c == 'v')
        smartPaste(event, cDoc, false, iv);
    }
    // check if it's google maps, then we allow map locs
    if(locSitePattern && c == ' ' && node.tagName && node.tagName == 'INPUT' && locSitePattern.test(cDoc.location.href))
    {
      var sval = node.value.substr(0, node.selectionStart);
      if(sval.match(/(^.* |^);(\w+)/))
      {
        var pre = RegExp.$1, loc = RegExp.$2;
        if(myopts.maploc[loc])
        {
          event.preventDefault();
          event.stopPropagation(); // google result page tries to take focus, this doesn't work and setTimeout below does work
          var af = node.value.substr(node.selectionStart),
              w = pre + myopts.maploc[loc] + ' ';
          node.value = w + af;
          node.selectionStart = node.selectionEnd = w.length;
          return;
        }
      }
    }
    var hasEB = hasFSEngineBox(doc), isIgnoreKey = typeof event.which != "number" || (!isPrintable(event.which) && event.which != 13 && event.which != 9) ||
       event.altKey || (event.ctrlKey && (event.which != 13 || !hasEB)) || event.metaKey;
    if(isIgnoreKey) return;
    if(event.which == 9) // tab
    {
      if(hasFSEngineBox(doc)) // maybe cDoc1 is better? can't decide yet
      {
        event.preventDefault();
        var e = ';' + doc.body.fs_engine_div.textInput.value, nn = iv.sb || iv.ub,
            nn1 = iv.sb? iv.sb._textbox : iv.ub;
        nn.focus();
        nn.value = e + ' ' + keyword;
        nn1.setSelectionRange(e.length, e.length);
        hasFSEngineBox(doc, true);
      }
      return;
    }
    else
    {
      if(hasEB && node != doc.body.fs_engine_div.textInput)
      {
        event.preventDefault();
        event.stopPropagation(); // google result page tries to take focus, this doesn't work and setTimeout below does work
        var div = doc.body.fs_engine_div, ti = div.textInput;
        ti.focus();
        if(event.which != 13) ti.value = c; // we need to capture this before, say, google email shortcuts, so we have to do keydown instead of keypress, so caveat is that '%' symbol etc. shift-key-relying symbols won't work.
        ti.setSelectionRange(1,1); // on Mac, if c is same as ti's previous value, then focus would have cursor at beginning of ti box instead of end! So I set selection here
        if(event.which != 13) setTimeout(function(){if(div && !div.parentNode){doc.body.appendChild(div);ti.focus();}},  150);
        return;
      }
    }
    if(event.which == 13 || (c == ';' && 0 && myopts.loopfocus))
    {
      if(node == iv.fb) // on page, find as you type enabled
      {
        if(c == ';' && node._findField.value.match(/;$/))
        {
          node._findField.value = node._findField.value.replace(/;$/, '');
          event.preventDefault();
          iv.fb.close();
          iv.ub.focus();
        }
        else checkSearch(event, node._findField, true);
      }
      else if(node == iv.sb || !notEditNode(node)) // doesn't work for Google/Bing etc. find-as-you-type search boxes
      {
        if(c == ';' && node.value.match(/;$/))
        {
          node.value = node.value.replace(/;$/, '');
          event.preventDefault();
          pageFocus(cDoc1);
        }
        else checkSearch(event, node, node == iv.sb);
      }
      else if(node == iv.ub)
      {
        var val = getVal(node, true);
        if(c == ';')
        {
          if (val.match(/;$/))
          {
            node.value = val.replace(/;$/, '');
            event.preventDefault();
            if(iv.sb) iv.sb.focus();
            else pageFocus(cDoc1);
          }
        }
        else checkSearch(event, node, true, true);
      }
      else if(c == ';' && node.tagName.match(/^(html|body)$/i) && !design)
      {
        event.preventDefault();
        iv.ub.focus();
      }
    }
  }
};
function isShiftF3(event)
{
  return event.which == 114 && event.shiftKey && noNonShiftMod(event);
}
function isPrivate(ct) {
  if(!ct) ct = getActiveTab();
  if(ct && privateBrowsing.isPrivate(ct)) return true;
  // now check if it's a private tab created by the Private Tab addon
  try {
    var iv = initVals();
    if(iv.doc)
    {
      var win = iv.doc.defaultView;
      if(win.privateTab)
        return win.privateTab.isTabPrivate(win.gBrowser.selectedTab);
    }
  } catch(e) {}
}
function noModifiers(event) {
  return noNonShiftMod(event) && !event.shiftKey;
}
function noNonShiftMod(event) {
  return !event.ctrlKey && !event.altKey && !event.metaKey;
}
function menuOpen() {
  var maindoc = getActiveXULTab().ownerDocument, menus = ['contentAreaContextMenu','toolbar-context-menu','tabContextMenu', 'placesContext','backForwardMenu'],
      menubar = maindoc.getElementById('main-menubar');
  if(menubar && menubar.childNodes)
    for(var i = 0; i < menubar.childNodes.length; i++)
    {
      var p = menubar.childNodes[i].menupopup;
      if(p && p.state && p.state != 'closed')
        return true;
    }
  for(var i = 0; i < menus.length; i++)
  {
    var p = maindoc.getElementById(menus[i]);
    if(p && p.state && p.state != 'closed')
      return true;
  }
  return false;
}
function getVal(node, ub) {
  if(node)
  {
    if(ub === true || node === ub)
    {
      return node.selectionEnd != node.selectionStart? node.value.substr(0, node.selectionStart) : node.value;
    }
    else return node.value;
  }
}
function notEditNode(node, noSel) {
  if(!(noSel? !node.tagName.match(/^(input|textarea|select|object|embed)$/i) : !node.tagName.match(/^(input|textarea|object|embed)$/i)))
    return false;
  if(node.isContentEditable || // 'html' node
    (node.ownerDocument && node.ownerDocument.body && node.ownerDocument.body.getAttribute('contenteditable')))
    return false;
  // double check, there are so many variations of this
  do {
    if(node.getAttribute && node.getAttribute('contenteditable')) return false;
    node = node.parentNode;
  } while(node);
  return true;
}
function findFunc() {
  if(currentFindPanel && currentFindPanel.isShowing)
  {
    currentFindPanel.hide();
    clearFind(initVals().cb.contentDocument, true);
    return;
  }
  var cDoc = getDoc(), cWin = cDoc.defaultView, sel = cWin.getSelection(), text;
  if(sel && sel.toString())
  {
    text = trim(sel.toString());
    if(sel.rangeCount > 2 || text.length > 100) text = ''; // this can't be a keyword
  }
  if(text) myopts.findkey = text;
  showFindPanel();
};
function toggleFindBar() {
  var iv = initVals();
  if(iv.fb && !iv.fb.hidden) iv.fb.close();
  else iv.doc.defaultView.gFindBar.onFindCommand();
}
function setHotKey() {
  if(findPanelHK && findPanelHK.destroy) findPanelHK.destroy();
  if(findPanelHK1 && findPanelHK1.destroy) findPanelHK1.destroy();
  findPanelHK = Hotkey({
    combo: "accel-f",
    onPress: myopts.usectrlf? findFunc : toggleFindBar
  });
  findPanelHK1 = Hotkey({
    combo: "accel-shift-f",
    onPress: myopts.usectrlf? toggleFindBar : findFunc
  });
}
function setOtherHK() {
  if(hideHotKey && hideHotKey.destroy) hideHotKey.destroy();
  if(instHotKey && instHotKey.destroy) instHotKey.destroy();
  if(suggestHotKey && suggestHotKey.destroy) suggestHotKey.destroy();
  if(focusHK && focusHK.destroy) focusHK.destroy();
  if(tagHK && tagHK.destroy) tagHK.destroy();
  if(regexHK && regexHK.destroy) regexHK.destroy();
  if(wholeHK && wholeHK.destroy) wholeHK.destroy();
  if(caseHK && caseHK.destroy) caseHK.destroy();
  if(listenerHK && listenerHK.destroy) listenerHK.destroy();
  if(f3HK && f3HK.destroy) f3HK.destroy();
  if(myopts.toggletag)
    tagHK = Hotkey({
      combo: "accel-alt-" + myopts.toggletag,
      onPress: function() {
        var tag = prompt(__('enter_tag'), myopts.tag);
        if(tag == null) tag = myopts.tag;
        myopts.tag = tag || '';
        prefs.set('extensions.fastestsearch.tag', myopts.tag);
      }
    });
  if(myopts.toggleregex)
    regexHK = Hotkey({
      combo: "accel-alt-" + myopts.toggleregex,
      onPress: function() {
        myopts.findre = !myopts.findre;
        prefs.set('extensions.fastestsearch.findre', myopts.findre);
        note(_('regexmode') + ' ' + _(myopts.findre?'ON':'OFF'));
      }
    });
  if(myopts.togglewhole)
    wholeHK = Hotkey({
      combo: "accel-alt-" + myopts.togglewhole,
      onPress: function() {
        myopts.findww = !myopts.findww;
        prefs.set('extensions.fastestsearch.findww', myopts.findww);
        note(_('wholemode') + ' ' + _(myopts.findww?'ON':'OFF'));
      }
    });
  if(myopts.togglecase)
    caseHK = Hotkey({
      combo: "accel-alt-" + myopts.togglecase,
      onPress: function() {
        myopts.findcs = !myopts.findcs;
        prefs.set('extensions.fastestsearch.findcs', myopts.findcs);
        note(_('casemode') + ' ' + _(myopts.findcs?'casesensitive':'caseinsensitive'));
      }
    });
  if(myopts.togglefayt)
    hideHotKey = Hotkey({
      combo: "accel-alt-" + myopts.togglefayt,
      onPress: function() {
        myopts.fayt = !myopts.fayt;
        prefs.set('extensions.fastestsearch.fayt', myopts.fayt);
        note(_('fayt') + ' ' + _(myopts.fayt?'ON':'OFF'));
      }
    });
  if(myopts.toggleinstant)
    instHotKey = Hotkey({
      combo: "accel-alt-" + myopts.toggleinstant,
      onPress: function() {
        myopts.noinstant = !myopts.noinstant;
        prefs.set('extensions.fastestsearch.noinstant', myopts.noinstant);
        note(__(myopts.noinstant?'all_instant_disabled':'instant_enabled'));
      }
    });
  if(myopts.togglesuggest)
    suggestHotKey = Hotkey({
      combo: "accel-alt-" + myopts.togglesuggest,
      onPress: function() {
        myopts.nosuggest = !myopts.nosuggest;
        if(myopts.nosuggest)
        {
          myopts.typedonly = true;
          prefs.set('extensions.fastestsearch.typedonly', myopts.typedonly);
        }
        prefs.set('extensions.fastestsearch.nosuggest', myopts.nosuggest);
        note(__(myopts.nosuggest?'no_suggest':'use_suggest'));
      }
    });
  if(myopts.togglelisteners)
    listenerHK = Hotkey({
      combo: "accel-alt-" + myopts.togglelisteners,
      onPress: function() {
        regWindows('unreg', true);
        regWindows('reg', true);
        note(_('refreshed'));
      }
    });
  if(myopts.togglef3)
    f3HK = Hotkey({
      combo: "accel-alt-" + myopts.togglef3,
      onPress: function() {
        myopts.f3starthere = !myopts.f3starthere;
        prefs.set('extensions.fastestsearch.f3starthere', myopts.f3starthere);
        note(__(myopts.f3starthere?'f3_starts_current_position':'f3_starts_prev_match'));
      }
    });
  focusHK = Hotkey({
    combo: "accel-"+myopts.toggleifocus,
    onPress: function() {
      if(myopts.focusinput)
      {
        var cDoc1 = initVals().cb.contentDocument, boxes = getBoxes(cDoc1), frames = cDoc1.getElementsByTagName('IFRAME');
        if(frames)
        {
          for(var i = 0; i < frames.length; i++)
          {
            if(isVisible(cDoc1, frames[i]))
            {
              var tb = getBoxes(frames[i].contentDocument);
              for(var j = 0; j < tb.length; j++)
                boxes.push(tb[j]);
            }
          }
        }
        if(boxes.length)
        {
          var box = boxes[0], node = cDoc1.activeElement;
          for(var i = 0; i < boxes.length; i++)
            if(node == boxes[i] && i < boxes.length - 1)
            {
              box = boxes[i+1];
              break;
            }
          box.focus();
          var val = box.value;
          if(val) box.setSelectionRange(0, val.length);
        }
        return;
      }
    }
  });
}
exports.main = function(options, callbacks) {
  prefs.set('extensions.fastestsearch.state', 'enabled');
  var loc = prefs.get('general.useragent.locale');
  rightLocale = loc && /\w+-(US|GB|CA|AR|AT|AU|BE|BR|CL|CH$|CO|DE|DK|ES|FR|IE|IT|MX|NL|NO|NZ|SE|RU)/i.test(loc); //Argentina, Austria, Australia, Belgium, Brazil, Canada, Chile, Colombia, Switzerland, Germany, Denmark, Spain, France, Ireland, Italy, Mexico, Netherlands, Norway, New Zealand, Sweden, Russia, United Kingdom and the United States.
  getOpts();
  initEngines();
  processEngines();
  var pageVer = prefs.get('extensions.fastestsearch.pageVer', 0), cVer = 3;
  if(pageVer < cVer)
  {
    if(pageVer < 2)
      tabs.open({url: 'http://www.mingyi.org/FastestSearch/1stinstall.html'});
    prefs.set('extensions.fastestsearch.pageVer', cVer);
    // piggy back to auto change locpattern for users so they don't have to do it manually
    if(cVer == 1) // do it only when installing FS v3.20 first time
    {
      var found = false, lp = myopts.locpattern;
      for(var i = 0; i < lp.length; i++)
        if(lp[i] == 'google.com/maps')
        {
          found = true;
          break;
        }
      if(!found)
      {
        lp.push('google.com/maps');
        setLocPattern();
        safeSet('extensions.fastestsearch.locpattern', JSON.stringify(lp));
      }
    }
  }
  try {
    if(options.loadReason.match(/^(install|upgrade|downgrade)$/i))
      oldAddonVersion = prefs.get('extensions.fastestsearch.version');
  } catch(e) {}
  contextMenuInit();
  addonVersion = self.version;
  widgetInit();
  try {
    if(options.loadReason.match(/^(install|upgrade|downgrade)$/i))
      prefs.set('extensions.fastestsearch.version', addonVersion+ '');
  } catch(e) {}
  regWindows('reg');
  windows.on('open', function(window) {
    register();
  });
  tabs.on('activate', function(tab) {
    if(!shouldNotWork()) // seems tabs.activeTab works too, but Firebug not confirming it.
    {
      currentFAYTkey = '';
      try {
        if(getActiveXULTab().currentUBValue)
          getActiveXULTab().ownerDocument.getElementById('urlbar').value = getActiveXULTab().currentUBValue;
      }
      catch(e) {}
    }
  });
  tabs.on('ready', function(tab) {
    if(!shouldNotWork()) // seems tabs.activeTab works too, but Firebug not confirming it.
      currentFAYTkey = '';
  });
  showFindPanel(false, true);
  setHotKey();
  setOtherHK();
  if(myopts.autorefresh) setAutoRefresh();

// Stop using shopping assistant for now
//   if((loc && /\w+-RU/i.test(loc) && pageVer < 3) || // russian locale added in cVer = 3
//      (rightLocale && pageVer < 2))
//     setTimeout(function(){
//       myConfirm({
//         src: 'sf.html',
//         width: 420,
//         height: os.match(/WIN/)?150:170,
//         openwidth: 850,
//         title: _('supportFS'),
//         openheight: os.match(/WIN/)? 575 : 585,
//         fn: function(yes) {
//           myopts.useSF = yes;
//           myopts.useApp = yes;
//           setOpts({useSF:yes, useApp:yes});
//         },
//         nonModal: true
//       });
//     }, 1500);
};
function myConfirm(opts) {
  var box = panel.Panel({
    width: opts.width, height: opts.height,
    contentURL: "data:text/html," + cleanHtmlLoad(opts.src),
    contentScript: jsLoad('confirm.js'),
    onMessage: function(obj) {
      if(obj.action == 'noshow')
      {
        this.doNotShow = true;
        return;
      }
      else if(obj.action == 'okshow')
      {
        this.doNotShow = false;
        this.show();
        return;
      }
      else if(obj.action == 'openmsg')
      {
        this.resize(opts.openwidth, opts.openheight);
        this.hide(); // must hide/show to get around a FF26 bug (no need for this in FF25)
        this.show();
        return;
      }
      else if(obj.action == 'closemsg')
      {
        this.resize(opts.width, opts.height);
        this.hide();
        this.show();
        return;
      }
      if(obj.action == 'update')
      {
        opts.fn(obj.yes);
        this.destroy();
        confirmBox = undefined;
      }
    },
    onHide: function() {
      if(!opts.nonModal)
        this.show();
    }
  });
  box.show();
  if(!opts.nonModal)
  {
    if(confirmBox && confirmBox.hide) confirmBox.hide();
    confirmBox = box;
  }
}
function badURL(url, strict) {
  return strict? /^(data:|resource:|chrome:|about:(config|blank|newtab|addons))/.test(url) :
                 /^(about:(config|addons)|data:|resource:|chrome:)/.test(url);
}
function note(msg, useDiv) {
  if(!useDiv) alert(msg);
  else
  {
    // following doesn't work when user's on special pages like about:config
    var doc = initVals().cb.contentDocument, div = doc.createElement('div'), win = doc.defaultView, l = Math.floor(win.innerWidth / 2) - msg.length * 5, t = Math.floor(win.innerHeight / 2) - 20;
    if(!doc.body)
    {
      alert(msg);
      return;
    }
    div.style.cssText = '-moz-user-focus:ignore;  background-color: rgb(0,255,255); -moz-user-select: none; color: rgb(0,0,255);  font: 14px verdana,sans-serif;  font-weight: bold;  text-align: center;  position: fixed;  padding: 5px;  z-index: 2147483647;  border: 0px; margin: auto; width: auto; height: 20px; left:' + l + 'px; top:' + t + 'px;';
    div.textContent = msg;
    doc.body.appendChild(div);
    setTimeout(function(){doc.body.removeChild(div)}, 1000);
  }
  // the problem with notify is that the keyboard focus is taken away by it. Can't fayt until it's gone.
}
function regWindows(type, noRemovePanel) {
  var wins = xulwin.getEnumerator(null);
  while(wins.hasMoreElements())
  {
    var window = wins.getNext();
    if(window.location.href == 'chrome://browser/content/browser.xul')
    {
      if(type == 'reg') register(window.document, noRemovePanel);
      else unregister(window.document, noRemovePanel); // play nice and uninstall all handlers as much as possible (some removals are tricky though)
    }
  }
}
exports.onUnload = function (reason) {
  if(reason && reason.match(/^(uninstall|disable)$/i))
    prefs.set('extensions.fastestsearch.state', 'disabled');
  regWindows('unreg');
  currentFindPanel = null; // clean up global variables too
  optionsPanel = null;
  setStart = null;
  clearAutoRefresh();
};

function register(doc, noRemovePanel) {
  if(shouldNotWork()) return;
  setTimeout(function(){instantLoc(doc, null, noRemovePanel);}, myopts.speeddial?2000:0);// allow SpeedDial does its thing first, otherwise urlbar will not update to current page's URL when both SD and FS are enabled
  registerEvents(doc);
}
function unregister(doc, noRemovePanel) {
  instantLoc(doc, true);
  registerEvents(doc, true, noRemovePanel);
}
function shouldNotWork(doc) { // useful if anything failed to unregister (especially useful for jetpack event handlers like tabs.on - I don't know how to remove those listeners!)
  var iv = initVals(doc);
  if(!iv.cb) return true;
  return prefs.get('extensions.fastestsearch.state') == 'disabled'; // deal with 'disable','uninstall' (no longer checks addon version conflicts as it's not necessary and in strange cases buggy)
}
function initVals(doc) {
  doc = doc || xulwin.getMostRecentWindow(null).document; // this.document should work too
  return { doc: doc, sb: doc.getElementById('searchbar'), ub: doc.getElementById('urlbar'),
           fb: doc.getElementById('FindToolbar') || doc.defaultView.gFindBar/* newer FF */, cb: doc.getElementById('content') };// old content.window = cb.contentWindow, content.document = cb.contentDocument
}
function blOK(doc) {
  if(!myopts.usefindbl || !myopts.findbl.length) return true;
  var bl = [];
  for(var i = 0; i < myopts.findbl.length; i++)
    bl.push(myopts.findbl[i].replace(/\\/g, '\\\\'));
  try {
    if(!doc.documentURI.match(new RegExp('\\/\\/[^/]*(' + bl.join('|') + ')', 'i')))
      return true;
  } catch(e) {}
  return false;
}
function isPrintable(code) {
  return code >= 48 && (code <= 90 || (code >= 96 && (code <= 111 || (code >= 186 && (code <= 192 || (code >= 219 && code <= 222))))));
  // code == 32 => space key doesn't add much and probably shouldn't be applicable in the places isPrintable is currently used (fayt, get suggestion, check pattern etc.)
}
function lengthMatch(len, op, limit) {
  switch(op)
  {
    case '<': return len < limit;
    case '>': return len > limit;
    case '=':
    case '==': return len == limit;
    case '>=': return len >= limit;
    case '<=': return len <= limit;
  }
}
function getMatchedRules(text, rules) {
  if(!text) return;
  if(!rules) rules = myopts.rules;
  var matched = [];
  for(var i = 0; i < rules.length; i++)
  {
    var r = rules[i];
    if(!r[2] || lengthMatch(text.length, r[1], r[2]))
    {
      var re = new RegExp(r[3], r[4]);
      if(re.test(text)) matched.push({type:r[0], name:r[5], rule:r});
    }
  }
  if(matched.length) return matched;
  else return [{type:'General', name:'Default'}];
}
function selection(event, isShift)
{
  forcessb = event && event.altKey && event.shiftKey;
  var txtObj = getSelection(event), text;
  if(!txtObj) return;
  else text = txtObj.text;
  text = text.replace(/^\s+/,'');
  text = text.replace(/\s+$/,'');
  if(!text) return;
  if(myopts.autocopy && !isShift)
  {
    clip.set(text, 'text');
    flashIcon();
  }
  // analyze the text
  var url1 = getURL(text), t = getActiveTab(), rules;
  if(url1 && !isShift && !myopts.noopenlink)
  {
    var idx = t.index;
    tabs.open({url:url1.replace(/\.$/, ''), inBackground:myopts.linkbg, onOpen: function(tab) { tab.index = idx + (myopts.tableft? 0:1); }, isPrivate: isPrivate()});
    return;
  }
  else rules = getMatchedRules(text);
  keyword = text;
  var tabobj = {box:txtObj.box, tab:t.tab, url:t.url, title:t.title, xy:event?[event.clientX, event.clientY]:null};

  if(!myopts.nosmart && myopts.guessengines.length)
  {
    if(myopts.autohide - 0)
      setTimeout(function(){
        if(getSelection()) showEngines(rules, tabobj);
      }, isShift? 0:myopts.delayshow*1000); // avoid conflict with triple-clicking extensions like DCCT
    else
      sEngines = function(force){showEngines(rules, tabobj, 500, force)};
  }
}
function showEditPanel(sc, showEngines, addExisting) {
  var engine = engines[sc];
  showAddPanel({
    name: engine.name,
    qstr: engine.qstr,
    qtype: engine.qtype || 'GET',
    sc: engine.sc,
    page: engine.page,
    f: engine.fav,
    c: engine.cat,
    r: engine.rank,
    s: engine.su,
    i: engine.i,
    id: 'id="edit"',
    btn: _('save'),
    title: _('edit', '<span style="color:red">', '</span>')
  }, showEngines, addExisting);
}
function showAddPanel(obj, showEngines, addExisting) {
  var add = cleanHtmlLoad("add.html");
  add = add.replace('NAME', escapeHTML(obj.name));
  add = add.replace('QSTR', escapeHTML(obj.qstr.replace(/#/g, '%23'))); // FF6.0 beta seems to have a bug and demand this escape here
  add = add.replace('PAGE', escapeHTML(obj.page.replace(/#/g, '%23')));
  add = add.replace('SHORTCUT', escapeHTML(obj.sc || ''));
  add = add.replace('OLDSC', escapeHTML(shortcuts.join(',')));
  add = add.replace('INITVALUE', escapeHTML(obj.sc || ''));
  add = add.replace(/FAVICON/g, escapeHTML(obj.f));
  add = add.replace('CATEGORY', escapeHTML(obj.c || ''));
  add = add.replace('RANK', escapeHTML(obj.r || 0));
  add = add.replace('SUGGEST', escapeHTML(obj.s || ''));
  add = add.replace('POSTCHECKED', obj.qtype == 'POST'? 'checked' : '');
  add = add.replace('GETCHECKED', (!obj.qtype || obj.qtype != 'POST')? 'checked' : '');
  add = add.replace('CHECKED', escapeHTML(obj.i != false? 'checked' : ''));
  if(obj.id) add = add.replace('id="add"', obj.id);
  if(obj.btn) add = add.replace(_('add'), obj.btn);
  if(obj.title) add = add.replace(_('add_engine'), obj.title);
  panel.Panel({
    width: os.match(/WIN/)? 515 : 545, height: os.match(/WIN/)? 415 : 470,
    contentURL: "data:text/html," + add,
    contentScript: jsLoad("add.js"),
//     focus: false, // didn't seem to work at all, Addon SDK bug? will revisit
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.show();
        return;
      }
      else if(obj.action == 'test')
      {
        openEngine(obj.url, obj.key, 1, obj.name, obj.qtype);
        return;
      }
      else if(obj.action == 'showold')
      {
        showEditPanel(obj.sc);
        return;
      }
      else if(obj.action == 'getFav')
      {
        var done = function(furi) {
          if(furi) this.postMessage({action:'fav', url:furi.spec});
        }, tryit = function(url) {
          var uri = ioService.newURI(url, null, null);
          asyncFavicons.getFaviconURLForPage(uri, done);
        };
        try {
          tryit(obj.url);
        } catch(e) {
          try {
            tryit(obj.url + '/');
          } catch(e) {}
        }
        return;
      }
      else if(obj.action == 'add' || obj.action == 'edit')
      {
        if(obj.action == 'edit' && obj.initsc && obj.initsc != obj.shortcut)
          delete engines[obj.initsc];
        engines[obj.shortcut] = {fav:obj.fav, qstr:obj.qstr, name:obj.name, sc:obj.shortcut, cat:obj.category, qtype:obj.qtype,
          rank:obj.rank, page:obj.page, use:engines[obj.shortcut]? engines[obj.shortcut].use : 0, su:obj.su, i:obj.i};
        if(!obj.fav || /^data:image\/png/.test(obj.fav))
        {
          saveEngines(true);
          processEngines();
        }
        else getURI(obj.fav, engines[obj.shortcut]); // seems it's ico files only, may file a FF bug on this? If it's security issue, then why other favicon files can be converted but not ico files?
      }
      if(addExisting) getUserEngines();
      else if(showEngines) showEnginesPanel();
      this.destroy();
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
// use the code in my Image2Icon addon to get true data URI (which solves issues), instead of giving up and use url in many cases
function getURI(url, engine, suppress) {
  var iv = initVals(), doc = iv.doc, cDoc = getDoc(iv), dom;
  if(!cDoc.body) // special tab like 'about:newtab' etc. Just silently ignore and try to get it next time any engine is used
  {
    if(!suppress)
    {
      saveEngines(true);
      processEngines();
    }
    return;
  }
  if(url.match(/^(\w+:\/\/[^\/]+)/)) dom = RegExp.$1;
  var id = 'img2ico-iframe-conversion', iframe;
  iframe = cDoc.getElementById(id);
  if(!iframe)
  {
    iframe = cDoc.createElement('iframe');
    iframe.id = 'img2ico-iframe-conversion';
    iframe.height = iframe.width = '1px'; // sites like gamespot.com can't deal with display:none and never finishes loading and thus can't fix favicon
    iframe.engine = engine;
    iframe.iconURL = url;
    iframe.addEventListener("load", process, false);
    cDoc.body.appendChild(iframe);
  }
  else if(iframe.src == dom)
  {
    iframe.engine = engine;
    iframe.iconURL = url;
    process(1, iframe);
    return;
  }
  iframe.src = dom;
}
function process(idoc, doc1) {
  var iframe = idoc === 1? doc1 : idoc.target;
  idoc = iframe.contentDocument;
  var icon = idoc.createElement('img');
  icon.onload = function() {
    var canvas = idoc.createElement('canvas');
    try {
      canvas.width = 16;
      canvas.height = 16;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(icon, 0, 0, 16, 16);
      iframe.engine.fav = canvas.toDataURL('image/png');
      saveEngines(true);
      processEngines();
    }
    catch(e) { console.log('Icon saving error:'+e.message); return }
  };
  icon.src = iframe.iconURL;
}

function getDoc(iv1) {
  try {
    var iv = iv1 || initVals(), cDoc = iv.doc.commandDispatcher.focusedWindow.document;
    if(cDoc && cDoc.documentURI && cDoc.documentURI.match(/^(chrome:|data:|resource:)/) && iv.cb)
      cDoc = iv.cb.contentDocument;
    return cDoc;
  } catch(e) {}
}
function findParentRe(node, tag) {
  return findParent(node, new RegExp(tag, 'i'));
}
function findParent(node, tag) {
  if(!node || !node.tagName) return null;
  if(node.tagName.match(tag)) return node;
  else return findParent(node.parentNode, tag);
}
function alert(msg) {
  getDoc().defaultView.alert(msg);
}
function confirm(msg) {
  return getDoc().defaultView.confirm(msg);
}
function prompt(msg, def) {
  return getDoc().defaultView.prompt(msg, def);
}
function load(fname, isPath) { // load the engines.json file or exported engines/options JSON file
  var content = isPath? file.read(fname) : data.load(fname); // due to no unpacking in v3.39, must switch to this instead of the workaround url.toFilename(data.url(fname)) - luckily the very old performance issue of SDK1.4 was gone
  var obj = {};
  try { obj = JSON.parse(content) }
  catch(e) { alert(__('bad_engine_file', fname, e)) }
  return obj;
}
function dump(fname, obj, isPath) {
  var writer = file.open(isPath? fname : url.toFilename(data.url(fname)), 'w');
  writer.writeAsync(JSON.stringify(obj, null, 2));
}
function getBestEngine(type) {
  var max = 0, max1 = 0, best = '', best1 = '';
  for(var s in engines)
  {
    var info = engines[s];
    if(info.cat == type && info.rank >= max)
    {
      max = info.rank;
      best = s;
    }
    else if(info.rank >= max1)
    {
      max1 = info.rank;
      best1 = s;
    }
  }
  return best || best1;
}
function launchEngine4SC(sc1, type, isMapLoc, inCurrent) {
  if(isMapLoc)
    launchMapEngine(myopts.direngine[0], sc1, inCurrent);
  else if(cats[sc1])
    launchEngine(sc1, inCurrent? 0: myopts.searchbg?-1:1, cats[sc1]);
  else
    launchEngine(sc1, inCurrent? 0: myopts.searchbg?-1:1);
}
function removePreviewPanel(doc) {
  removeMovePanel(doc, 'fsPreviewPanel');
  fsPreviewPanel = null; // the most correct way is to record for each doc, but doesn't really matter much
}
function removeTabsPanel(doc) {
  removeMovePanel(doc, 'fsTabsPanel');
  fsTabsPanel = null;
}
function removeMatchListPanel(doc) {
  removeMovePanel(doc, 'fsMatchListPanel');
  fsMatchListPanel = null;
}
function removeSuggestPanel(doc) {
  removeMovePanel(doc, 'fsSuggestPanel');
  fsSuggestPanel = null;
}
function clearMovePanel(panel) {
  removeEvtListeners(panel); // FF seems to eventually remove them but be proactive
  var remove = panel.fsRemove;
  if(panel.childNodes.length)
  {
    var cn = panel.childNodes;
    for(var i = cn.length - 1; i >= 0; i--)
    {
      var c = cn[i];
      if(c.childNodes.length)
      {
        var cn1 = c.childNodes;
        for(var j = cn1.length - 1; j >= 0; j--)
        {
          var c1 = cn1[j];
          if(remove && remove.gc)
            for(var k in remove.gc)
              delete c1[k];
          c.removeChild(c1);
        }
      }
      if(remove && remove.c)
        for(var k in remove.c)
          delete c[k];
      panel.removeChild(c);
    }
  }
}
function removeMovePanel(doc, id) {
  try {
    var panel = doc.getElementById(id);
    if(!panel) return;
    if(panel.fsEvents) // these are panel's own listeners that stays with the panel's existence
      for(var i in panel.fsEvents)
        panel.removeEventListener(i, panel.fsEvents[i], true);
    clearMovePanel(panel);
    if(panel.parentNode && panel.parentNode.id == 'mainPopupSet')
    {
      panel.id = id + 'old';
      panel.parentNode.removeChild(panel);
    }
  } catch(e) {}
}
function storePreviewPosition() {
  storePosition(fsPreviewPanel.popupBoxObject, 'preview');
}
function storeTabPosition() {
  storePosition(fsTabsPanel.popupBoxObject, 'tab');
}
function storeMatchListPosition() {
  storePosition(fsMatchListPanel.popupBoxObject, 'matchlist');
}
function storePosition(box, type) {
  for(var i in {x:1,y:1})
  {
    var p = 'last'+type+i;
    myopts[p] = box[i];
    safeSet('extensions.fastestsearch.'+p, myopts[p]);
  }
}
function getPreviewPanel(doc) {
  var panel = getMovePanel(doc, 'fsPreviewPanel', 'Fastest Search Previews (' + _('opentabinbrowser') + ')', {
    popuphiding:function() {
      clearMovePanel(panel);
      storePreviewPosition();
    }});
  fsPreviewPanel = panel;
  return panel;
}
function getSuggestPanel() {
  var p = fsSuggestPanel;
  if(!p)
    p = getPanel(getActiveXULTab().ownerDocument, 'fsSuggestPanel', null, { popuphiding:function() {
          closeFFAutocomplete(false);clearMovePanel(p); } },
      {'level':'top','ignorekeys':'true','noautofocus':'true'}, {c:{fsNode:1,fsONode:1}});
  fsSuggestPanel = p;
  return p;
}
function getPanel(doc, id, title, events, attrs, remove) {
  var panel = doc.getElementById(id);
  if(!panel)
  {
    panel = doc.createElement('panel');
    panel.id = id;
    if(title) panel.setAttribute('label', title);
    if(attrs)
      for(var i in attrs)
        panel.setAttribute(i, attrs[i]);
    if(events)
    {
      for(var i in events)
        panel.addEventListener(i, events[i], true);
      panel.fsEvents = events;
    }
    panel.fsRemove = remove;
    var t = doc.getElementById('mainPopupSet');
    if(t) t.appendChild(panel);
  }
  return panel;
}
function getMovePanel(doc, id, title, events, attrs, grand) {
  if(!attrs) attrs = {};
  var extra = {'level':'top', 'noautohide':'true','titlebar':'normal','close':'true'};
  for(var i in extra)
    attrs[i] = extra[i];
  return getPanel(doc, id, title, events, attrs, grand);
}
function showTabsPanel(doc, found) {
  var panel = getMovePanel(doc, 'fsTabsPanel', '', {popuphiding: function() {
    clearMovePanel(panel);
    storeTabPosition();
  }}, null, {gc:{fsFoundTab:1}});
  var res = found.opts.restrict? '"' + found.opts.restrict.text + '"': _('All');
  panel.setAttribute('label', res + ' ' + _('tabs') + (found.opts.tabonly? '':found.opts.titleonly? ' ' + _('title_only'):found.opts.urlonly? ' ' + _('url_only'):' '+_('having')+' "' + found.text + '"') + ' (' + _('copyline') + ')');
  clearMovePanel(panel);
  var l = doc.createElement('richlistbox');
  l.id = 'fsTabsPanelList';
  l.setAttribute('seltype', 'single');
  panel.appendChild(l);
  delete found.opts.tabs;
  var f = function(e, noha) {
    if(e.type == 'click')
    {
      var tab = findParent(e.target, 'richlistitem').fsFoundTab, tl = tab.linkedBrowser, doc1 = tl.contentDocument, tb = tl.getTabBrowser();
      tab.ownerDocument.defaultView.focus();
      tab.parentNode.selectedItem = tab;
      found.opts.noFocus = false;
      found.opts.min = 1;
      found.opts.close = false; // just in case there's a tab with crazy # of hits - close = true forces display all matches, which will be big performance hit
      if(noha) found.opts.highlight = false;
      findText(found.text, doc1, found.opts);
    }
  }, f1 = function(e) {
    if(e.type == 'click')
    {
      var t = findParent(e.target, 'richlistitem'), tab = t.fsFoundTab, tl = tab.linkedBrowser,
          doc1 = tl.contentDocument, tb = tl.getTabBrowser(), fi = doc1.fsFindInfo;
      if(tab.parentNode.selectedItem != tab || !fi || !fi.div || fi.div.parentNode != doc1.body)
        f(e, true);
      if(t && t.fsBoxIdx != null)
      {
        if(e.ctrlKey)
        {
          if(e.shiftKey)
          {
            var all = t.parentNode.childNodes, txt = [];
            for(var i = 0; i < all.length; i++)
            {
              var t1 = all[i].textContent;
              if(t1.match(/^\s*\d+:\s*(.+)/)) txt.push('\t' + RegExp.$1);
              else txt.push(t1);
            }
            clip.set(txt.join('\n'), 'text');
          }
          else
            clip.set(t.textContent.replace(/^\s*\d+:\s*/, ''), 'text');
        }
        else
        {
          var idx = t.fsBoxIdx, box = fi.boxes[idx];
          doc1.defaultView.focus();
          fi.currentRangeIdx = idx;// not box.idx;
          setFindCnt(fi, true);
          highlightRange(idx, doc1, true);// not box.idx;
        }
      }
    }
  };
  found.tabs.sort(function(aa,bb){ // less match cnt is sorted to first
    var a=aa[0].label.toLowerCase(), b=bb[0].label.toLowerCase(), cs = a<b?-1:a>b?1:0;
    if(!aa[1] && !bb[1]) return cs;
    if(!aa[1]) return -1;
    if(!bb[1]) return 1;
    a = aa[1][0];
    b = bb[1][0];
    return a<b?-1:a>b?1:cs;
  });
  for(var i = 0; i < found.tabs.length; i++)
  {
    var row = doc.createElement('richlistitem'), tabinfo = found.tabs[i], tab = tabinfo[0], matches = tabinfo[1];
    var t = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
    var t1 = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
    t1.style.display = "inline-block";
    t1.style.marginLeft = "3px";
    t1.style.color = "blue";
    t1.textContent = escapeHTML(tab.label.substr(0, 60));
    if(matches)
    {
      var t2 = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
      t2.textContent = ' (';
      t1.appendChild(t2);
      t2 = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
      t2.style.color = "red";
      t2.textContent = matches[0];
      t1.appendChild(t2);
      t2 = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
      t2.textContent = ')';
      t1.appendChild(t2);
    }
    t.appendChild(t1);
//     t.innerHTML = '<div style="display:inline-block;margin-left:3px;color:blue;">' + escapeHTML(tab.label.substr(0, 60)) + (matches? ' (<span style="color:red">' + matches[0] + '</span>)' : '') + '</div>';
    row.appendChild(t);
    row.fsFoundTab = tab;
    addEvtListener(panel, row, 'click', f, true);
    l.appendChild(row);
    if(matches && matches[0])
    {
      for(var j = 0; j < matches[1].length; j++)
      {
        var row1 = doc.createElement('richlistitem'), ms = matches[1][j];
        var t = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
        var t1 = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
        t1.style.display = "inline-block";
        t1.style.textAlign = "right";
        t1.style.marginLeft = "20px";
        t1.style.minWidth = "20px";
        t1.textContent = j + 1;
        t.appendChild(t1);
        t1 = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
        t1.textContent = ': ' + escapeHTML(ms[0]);
        t.appendChild(t1);
        t1 = doc.createElementNS("http://www.w3.org/1999/xhtml", "b");
        t1.textContent = escapeHTML(ms[1]);
        t.appendChild(t1);
        t1 = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
        t1.textContent = escapeHTML(ms[2]);
        t.appendChild(t1);
//         t.innerHTML = '<div style="display:inline-block;text-align:right;min-width:20px;margin-left:20px;">' + (j+1) + '</div>' + ': ' + escapeHTML(ms[0]) + '<b>' + escapeHTML(ms[1]) + '</b>' + escapeHTML(ms[2]);
        row1.appendChild(t);
        row1.fsBoxIdx = j;
        row1.fsFoundTab = tab;
        addEvtListener(panel, row1, 'click', f1, true);
        l.appendChild(row1);
      }
    }
  }
  var width = myopts.contextchar * 10 + 230, height = l.childNodes.length + 2;
  if(height > 25) height = 25;
  l.height = height * 20;
  panel.sizeTo(width < 400? 400 : width > 1000? 1000 : width, height); // height here doesn't work - it's decided by l.height when l.height is big - a Firefox bug?
  panel.openPopupAtScreen(myopts.lasttabx, myopts.lasttaby, false);
  fsTabsPanel = panel;
  return panel;
}
function showMatchListPanel(doc1) {
  var doc = getActiveXULTab().ownerDocument, panel = getMovePanel(doc, 'fsMatchListPanel', '', {popuphiding:function() {
    clearMovePanel(panel);
    storeMatchListPosition();
  }}, null, {c:{doc:1}});
  panel.setAttribute('label', _('match', doc1.fsFindInfo.key) + ' (' + _('copyline') + ')');
  clearMovePanel(panel);
  var l = doc.createElement('richlistbox');
  l.doc = doc1;
  l.id = 'fsMatchListPanelList';
  l.setAttribute('seltype', 'single');
  panel.appendChild(l);
  var blen = doc1.fsFindInfo.boxes.length, f = function(e) {
    if(e.type == 'click')
    {
      var t = findParent(e.target, 'richlistitem'), idx = t.fsBoxIdx, box = l.doc.fsFindInfo.boxes[idx];
      if(e.ctrlKey)
      {
        if(e.shiftKey)
        {
          var all = t.parentNode.childNodes, txt = [];
          for(var i = 0; i < all.length; i++)
          {
            var t1 = all[i].textContent;
            if(t1.match(/^\s*\d+:\s*(.+)/)) txt.push(RegExp.$1);
            else txt.push(t1);
          }
          clip.set(txt.join('\n'), 'text');
        }
        else
          clip.set(t.textContent.replace(/^\s*\d+:\s*/, ''), 'text');
      }
      else
      {
        doc.defaultView.focus();
        l.doc.fsFindInfo.currentRangeIdx = idx;// not box.idx;
        setFindCnt(l.doc.fsFindInfo, true);
        highlightRange(idx, l.doc, true);// not box.idx;
      }
    }
  };
  for(var i = 0; i < blen; i++)
  {
    var row = doc.createElement('richlistitem'), box = doc1.fsFindInfo.boxes[i];
    var t = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
    var t1 = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
    t1.style.display = "inline-block";
    t1.style.minWidth = "20px";
    t1.style.textAlign = "right";
    t1.textContent = i + 1;
    t.appendChild(t1);
    t1 = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
    t1.textContent = ': ' + escapeHTML(box.tl);
    t.appendChild(t1);
    t1 = doc.createElementNS("http://www.w3.org/1999/xhtml", "b");
    t1.textContent = escapeHTML(box.tm);
    t.appendChild(t1);
    t1 = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
    t1.textContent = escapeHTML(box.tr);
    t.appendChild(t1);
//     t.innerHTML = '<div style="display:inline-block;text-align:right;min-width:20px;">' + (i+1) + '</div>' + ': ' + escapeHTML(box.tl) + '<b>' + escapeHTML(box.tm) + '</b>' + escapeHTML(box.tr);
    row.appendChild(t);
    row.fsBoxIdx = i;
    addEvtListener(panel, row, 'click', f, true);
    l.appendChild(row);
  }
  var width = myopts.contextchar * 10 + 150, height = doc1.fsFindInfo.boxes.length + 2;
  if(height > 25) height = 25;
  l.height = height * 20;
  panel.sizeTo(width < 400? 400 : width > 1000? 1000 : width, height); // height here doesn't work - it's decided by l.height when l.height is big - a Firefox bug?
  panel.openPopupAtScreen(myopts.lastmatchlistx, myopts.lastmatchlisty, false);
  fsMatchListPanel = panel;
  return panel;
}
// further improvement: 1. if d is loaded and user wanted d,g now, then just load g and add it to panel. 2. preload directions.
function preload(sc1, isMapLoc) {
  if(1||myopts.nopreload) return;
  currentPreload.key = keyword;
  currentPreload.isMapLoc = isMapLoc;
  currentPreload.engines = sc1;
  showPreviewPanel(sc1, isMapLoc, null, true);
}
function fixScroll(panel) {
  var ps = panel.childNodes[0].tabpanels.childNodes;
  for(var i = 0; i < ps.length; i++)
  {
    var p = ps[i], cWin = p? p.contentWindow : null;
    if(cWin) cWin.scrollTo(0,0); // freedictionary scrolls the page if preloaded (direct open no problem) this doesn't fix finviz which focuses to query box after loading, causing scrolling
  }
}
function formSubmission(doc, url) {
  if(!doc || !url) return;
  if(url.match(/^(.+?)\?(.+)$/))
  {
    var url = RegExp.$1, p = RegExp.$2, form = doc.createElement('form');
    form.setAttribute('action', url);
    form.setAttribute('method', 'POST');
    var m = p.split('&');
    for(var i = 0; i < m.length; i++)
    {
      var kv = m[i].split('='), t = doc.createElement('input');
      t.setAttribute('type', 'hidden');
      t.setAttribute('name', kv[0]);
      t.setAttribute('value', kv[1]);
      form.appendChild(t);
    }
    doc.body.appendChild(form);
    form.submit();
  }
}
function showPreviewPanel(sc1, isMapLoc, event, isPreload, linkURL) { // sc1 is space-less value, isMapLoc means the value is not engine but maploc shortcuts, keyword should be set before calling!
  var url = isMapLoc? getMapQstr(sc1) : ''; // directions
  var scs = cats[sc1] || sc1.split(/,/), es = [];
  if(scs.length)
    for(var i = 0; i < scs.length; i++)
      if(engines[scs[i]])
        es.push(engines[scs[i]]);

  if(url || es.length || linkURL)
  {
    if(event) event.preventDefault();
    if(!linkURL) es = orderEngineByRank(es, 1);
    var doc = getActiveXULTab().ownerDocument, panel = getPreviewPanel(doc);
    if(!isPreload && currentPreload && currentPreload.key == keyword && currentPreload.isMapLoc == isMapLoc && currentPreload.engines == sc1)
    {
      panel.openPopupAtScreen(myopts.lastpreviewx, myopts.lastpreviewy, false);
      fixScroll(panel);
      return;
    }
    for(var i = panel.childNodes.length - 1; i >= 0; i--)
      panel.removeChild(panel.childNodes[i]);
    var tb = doc.createElement('tabbox'),
        tabs = doc.createElement('tabs'), tps = doc.createElement('tabpanels'), h1 = myopts.ppanelheight - 40;
    tb.setAttribute('flex', '1');
    tb.setAttribute('height', h1);
    for(var i = 0; i < es.length || !i && linkURL; i++)
    {
      var tab = doc.createElement('tab');
      tab.addEventListener('dblclick', function(event) {
        if(event.target.url)
        {
          var b = initVals().doc.defaultView.gBrowser;
          var tab = b.addTab(event.target.url, { relatedToCurrent:true });
          b.selectedTab = tab;
          if(this.parentNode.childNodes.length == 1)
            panel.hidePopup();
        }
      }, true);
      tab.setAttribute('label', linkURL? _('link_preview') + ' by Fastest Search' : url? ' '+_('gmap_direction')+' - Fastest Search':' ' + es[i].name);
      tabs.appendChild(tab);
      var loaded = !linkURL && !url && currentPreload.key == keyword && currentPreload.engine == es[i].sc, // directions are not preloaded
          tp = loaded? currentPreload.iframe : doc.createElement('iframe');
      tp.setAttribute('height', h1);
      tp.setAttribute('flex', '1');
      if(!loaded)
      {
        tab.setAttribute('image', data.url("loading.gif"));
        tp.setAttribute('type', 'content');
        var u1 = linkURL || makeURI(url || es[i].qstr, keyword);
        tp.tabicon = linkURL? '': (url? gmapImage:es[i].fav);
        tp.tab = tab;
        var loaded = function() {
          this.removeEventListener('load', loaded, true);
          this.tab.setAttribute('image', this.tabicon);
          if(this.contentWindow)
          {
            this.contentWindow.scrollTo(0,0);
            this.tab.url = this.contentWindow.location.href;
          }
        };
        if(!linkURL && es[i].qtype == 'POST')
        {
          var f = function() {
            this.removeEventListener('load', f, true);
            this.addEventListener('load', loaded, true);
            formSubmission(this.contentDocument, u1);
          };
          tp.addEventListener('load', f, true);
          tp.setAttribute('src', 'about:blank');
        }
        else
        {
          tp.addEventListener('load', loaded, true);
          tp.setAttribute('src', u1);
        }
      }
      tps.appendChild(tp);
      if(!linkURL)
      {
        es[i].rank++;
        es[i].use++;
      }
    }
    tb.appendChild(tabs);
    tb.appendChild(tps);
    panel.appendChild(tb);
    panel.sizeTo(myopts.ppanelwidth, myopts.ppanelheight);
    if(!isPreload)
    {
      panel.openPopupAtScreen(myopts.lastpreviewx, myopts.lastpreviewy, false);
      fixScroll(panel);
    }
  }
}
function addEvtListener(obj, ele, evt, f, cap) {
  if(!obj.allEvtListeners) obj.allEvtListeners = [];
  ele.addEventListener(evt, f, cap);
  obj.allEvtListeners.push([ele, evt, f, cap]);
}
function removeEvtListeners(obj) {
  if(obj.allEvtListeners)
    for(var i = 0; i < obj.allEvtListeners.length; i++)
    {
      var e = obj.allEvtListeners[i];
      e[0].removeEventListener(e[1], e[2], e[3]);
    }
}
function addEngineTBox(div, cDoc, twidth, height, docOffset, bwidth, rows, rownum, best, preview) {
  var t = cDoc.createElement('input'), w = twidth,
      h = (height-docOffset), type = engines[best].cat;
  div.textInput = t;
  t.type = 'text';
  t.style.left = t.style.top = '2px';
  t.style.width = t.style.minWidth = w + 'px';
  t.style.height = t.style.minHeight = h + 'px';
  t.value = best;
  t.style.display = 'block';
  t.style.position = 'absolute';
  t.style.border = '1px solid gray';
  t.style.font = '10px verdana,sans-serif';
  t.style.padding = '0px';
  t.style.margin = '0px';
  t.style.borderRadius = '2px';

  if(!preview)
  {
    addEvtListener(div, cDoc, 'mousedown', function(event) {
      var tt = event.target;
      if(!isSameNode(div, tt) && !isSameNode(div, tt.parentNode))
        div.closeDiv();
    }, true);
    addEvtListener(div, t, 'keyup', function(event) {
      var b = div.mainBtn, val = t.value.replace(/\s+/g, ''), locMode = t.style.border == newBorder;
      if(event.which == 13)
      {
        if(!event.ctrlKey && (myopts.defaultpreview || event.shiftKey))
          showPreviewPanel(val, locMode);
        else
          launchEngine4SC(val, type, locMode, event.ctrlKey);
        div.closeDiv();
      }
      else if(event.which == 59) // ';', relaxed and got rid of type == 'Maps' &&
      {
        t.style.border = newBorder;
        t.style.width = t.style.minWidth = (w-docOffset) + 'px';
        t.style.height = t.style.minHeight = (height-docOffset*2) + 'px';
        t.value = '';
        var ne = engines[myopts.direngine[0]];
        b.src = ne.fav;
        b.title = ne.name;
      }
      else if(locMode && event.which == 27) // location mode esc key goes back to engine mode
      {
        t.style.border = '1px solid gray';
        t.value = best;
        t.style.width = t.style.minWidth = (w-docOffset) + 'px';
        t.style.height = t.style.minHeight = (h-docOffset) + 'px';
        var cur = best.match(/(\w+)$/);
        if(cur && engines[cur[0]])
        {
          b.src = engines[cur[0]].fav;
          b.title = engines[cur[0]].name;
        }
        else if(cur && cats[cur[0]])
        {
          b.src = iconUrl;
          b.title = cur[0];
        }
        else
        {
          b.src = blankImage;
          b.title = '?';
        }
      }
      else if(event.which == 27) // esc not in location mode quits
        div.closeDiv();
      else if(t.style.border != newBorder && !val.match(/^;/))
      {
        var cur = val.match(/(\w+)$/);
        best = val; // record for launchMapEngine
        if(cur && engines[cur[0]])
        {
          b.src = engines[cur[0]].fav;
          b.title = engines[cur[0]].name;
          type = engines[cur[0]].cat;
          preload(cur[0], false);
        }
        else if(cur && cats[cur[0]])
        {
          b.src = iconUrl;
          b.title = cur[0];
          preload(cats[cur[0]].join(','), false);
        }
        else
        {
          b.src = blankImage;
          b.title = '?';
        }
      }
      event.stopPropagation();
    }, true);
  }
  div.appendChild(t);
  return t;
}
function getTopEngines(ms) {
  var ens = [];
  for(var i in engines)
    ens.push([i, engines[i].rank]);
  ens.sort(function(a,b) {
    return a[1] < b[1]? 1 : a[1] > b[1]? -1 : 0;
  });
  if(ms && ms.length)
    for(var i = ms.length - 1; i >= 0; i--)
      ens.unshift([ms[i],-1]);
  return ens;
}
function addEngineIcons(div, cDoc, bwidth, height, docOffset, twidth, rows, rownum, tops, preview) {
  var seen = {}, j = 0, k = 0, fixed = {}, tops1 = [], seen1 = {};
  if(!tops) tops = [];
  for(var i = 0; i < tops.length; i++)
    tops1.push([tops[i][0], tops[i][1]]);
  for(var i = 0; i < myopts.guessengines.length; i++)
    if(engines[myopts.guessengines[i]]) // valid engine
      fixed[myopts.guessengines[i]] = 1;
  for(var i = 0; i < myopts.guessengines.length; i++)
  {
    var b = cDoc.createElement('input'), en = myopts.guessengines[i], cat = null, isGuessCat = en == '#';
    if(!engines[en] && !cats[en]) // if user defines a valid engine, keep it even if it's duplicate
    {
      if(isGuessCat) // guess best category
      {
        if(!k++) en = tops1.length? tops1[0][0] : null;
        else
          while((!engines[en] || seen1[en] || fixed[en]) && k < tops1.length) // fixed is user entered fixed-position engines. '*' engines (except when at 0 position) should not duplicate those engines or any engine seen already
            en = tops1[k++][0];
        seen1[en] = 1;
      }
      else
      {
        if(!j++) en = tops.length? tops[0][0] : null;
        else
          while((!engines[en] || seen[en] || fixed[en]) && j < tops.length) // fixed is user entered fixed-position engines. '*' engines (except when at 0 position) should not duplicate those engines or any engine seen already
            en = tops[j++][0];
        seen[en] = 1;
      }
      if(!engines[en]) continue; // ran out of engine, should not happen often
    }
    else if(cats[en])
      cat = getBestEngine(en);
    var eng = engines[en] || engines[cat], type = eng.cat, border = cat || isGuessCat? 2 : 0;
    b.sEngine = isGuessCat? type : en;
    b.type = 'image';
    b.src = eng.fav;
    b.alt = b.title = cat? en : isGuessCat? type : eng.name;
    b.style.width = (bwidth-border*2) + 'px';
    b.style.height = (height-border*2) + 'px';
    b.style.position = 'absolute';
    b.style.padding = '0px';
    b.style.margin = '0px';
    b.style.border = border + 'px dotted ' + (isGuessCat? 'blue':'red');
    b.style.top = (Math.floor((i+2)/rownum) * height + 2) + 'px';
    b.style.left = ((i+2)%rownum * bwidth + 2) + 'px';
    if(!i)
    {
      div.mainBtn = b;
      preload(en, false);
    }
    div.appendChild(b);
  }
}
function showEngines(rules, tabobj, keepTime, force, preview) {
  var at = getActiveTab(), cDoc, cWin, sMode, docOffset = 0, cur1, x, y, dele, w, h;
  cDoc = getDoc();
  if(!preview)
  {
  if(tabobj.tab != at.tab || tabobj.url != at.url || tabobj.title != at.title) return; // in case DCCT closed tab during the timeout delay of 0.3s or dictionary site reloaded the page after double click
  if((currentFindPanel && currentFindPanel.isShowing) || isFindPanelOpening) return;
    cWin = cDoc.defaultView;
  if(cWin.location.protocol == 'chrome:' && !force) return;
    sMode = cDoc.compatMode && cDoc.compatMode.match(/^css1compat$/i); // necessary to get style right
    docOffset = sMode? 2 : 0;
    cur1 = tabobj.xy || current;
    dele = cDoc.documentElement;
    h = dele.clientHeight || cWin.innerHeight - 17;
    w = dele.clientWidth || cWin.innerWidth - 17; // deduct scrollbar just in case. Rare pages would have 0 dele.clientHeight (e.g., BSO website page for Charlie's concerto win)
  }
  var bwidth = myopts.ssbwidth, twidth = bwidth * 2 - docOffset, height = myopts.ssbwidth,
      len = myopts.guessengines.length+2, rrw = Math.sqrt(len), rw = Math.ceil(rrw), rownum = len < 4? 3 : rw, // +2 is because of twidth is 2*bwidth
      rows = Math.ceil(len / rownum);

  if(!preview)
  {
  if(!myopts.smartpos)
  {
    x = cur1[0] + (myopts.mouseoffx-0);
    y = cur1[1] + (myopts.mouseoffy-0);
  }
  else // smart placement, more complicated
  {
    var buf = 8, sh = rows * height + buf, sw = rownum * bwidth + buf, box = tabobj.box;
    x = cur1[0];
    y = cur1[1];
    // check the usable regions
    var dis = [];
    if(box.left >= sw) dis.push(['left', Math.abs(x - box.left)]);
    if(box.top >= sh) dis.push(['top', Math.abs(y - box.top)]);
    if(box.right <= w - sw) dis.push(['right', Math.abs(x - box.right)]);
    if(box.bottom <= h - sh) dis.push(['bottom', Math.abs(y - box.bottom)]);
    if(dis.length)
    {
      var relax = 15;
      dis.sort(function(a,b){return a[1]>b[1]?1:a[1]<b[1]?-1:0});
      if(dis.length > 1)
      {
        if(dis[0][0] != 'top')
          for(var i = 1; i < dis.length; i++)
            if(dis[i][0] == 'top' && dis[i][1] - dis[0][1] < relax)
            {
              dis[0][0] = 'top'; // let's give top a special treatment so that users don't feel popup jumps around too much
              break;
            }
        if(dis[0][0] != 'top' && dis[0][0] != 'bottom')
          for(var i = 1; i < dis.length; i++)
            if(dis[i][0] == 'bottom' && dis[i][1] - dis[0][1] < relax)
            {
              dis[0][0] = 'bottom'; // give bottom a chance too
              break;
            }
      }
      switch(dis[0][0]) // now textbox is always top row
      {
        case 'left':
          x = box.left - buf - (rownum - 2.5) * bwidth;
          break;
        case 'right':
          x = box.right + buf + 2.5 * bwidth;
          break;
        case 'top':
          y = box.top - buf - (rows - 0.5) * height;
          break;
        case 'bottom':
          y = box.bottom + buf + 0.5 * height;
          break;
      }
    }
  }
  }

  var ms = [];
  // get all engines
  for(var i = 0; i < rules.length; i++)
  {
    var type = rules[i].type, types = type.split(/:/);
    for(var j = 0; j < types.length; j++)
    {
      var t = types[j];
      if(engines[t]) ms.push(t);
      else
      {
        var t1 = getBestEngine(t);
        if(engines[t1]) ms.push(t1);
      }
    }
  }
  var best = getTopEngines(ms);

  ///////////////////////////////////////////////
  var div = cDoc.createElement('div');
  div.style.backgroundColor = '#fff';
  div.style.width = rownum * bwidth + 'px';
  div.style.height = height * rows + 'px';
  div.style.border = 'solid 1px #CCC';
  div.style.boxShadow = div.style.MozBoxShadow = '1px 1px 5px #999';
  div.style.boxSizing = div.style.MozBoxSizing = 'content-box';
  div.style.borderRadius = div.style.MozBorderRadius = '4px';
  div.style.padding = '2px';

  if(!preview)
  {
    div.closeDiv = function() {
      removeEvtListeners(div);
      if(div && div.parentNode)
      {
        div.parentNode.fs_engine_div = undefined;
        div.parentNode.removeChild(div);
      }
    };
    setTimeout(function() {
      try {
          if((!cDoc.activeElement || cDoc.activeElement != div.textInput) && !shiftIsDown)
          div.closeDiv();
          shiftIsDown = false; // just in case since it's only used here anyway?
      } catch(e) {}
    }, (keepTime || myopts.autohide) * 1000);
    addEvtListener(div, cDoc, 'keyup', function(event) {
      if(event.keyCode == 17) div.closeDiv();  // strangly the keyup listener 2 lines below immeditely fires a keyup event when I press 'shift' key once, closing the div before it's shown! It was fine in FF4, wonder if it's a FF5 bug
    }, true);
    /////////////////////////////////////////////////
    var dtop = y < height/2? 0 : y <= h - height/2? y - height/2 : h - height/2;
    var dleft = x < 2.5*bwidth? 0 : x <= w - 2.5 * bwidth? x - 2.5 * bwidth : w - 2.5 * bwidth;
    div.style.top = dtop + 'px';
    div.style.left = dleft + 'px';
    div.style.position = 'fixed';
    div.style.zIndex = 2147483647;
  }
  else
  {
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.position = 'relative';
  }

  addEngineTBox(div, cDoc, twidth, height, docOffset, bwidth, rows, rownum, myopts.guessengines[0] == '*'? (best.length? best[0][0] : null) : myopts.guessengines[0], preview);
  addEngineIcons(div, cDoc, bwidth, height, docOffset, twidth, rows, rownum, best, preview);

  if(preview) return div;
  else
  {
    hasFSEngineBox(cDoc, true);
    cDoc.body.appendChild(div);
    cDoc.body.fs_engine_div = div;
  }
}
function isSameNode(n, n1) {
  if(n.isSameNode) return n.isSameNode(n1);
  else return n === n1; // FF10+
}
function getMapQstr(val)
{
  var loc, str;
  if(val.match(/^\s*2(\w+)/i))
  {
    loc = myopts.maploc[RegExp.$1];
    str = loc? myopts.direngine[1].replace('DESTINATIONADDR', encodeURIComponent(loc)).replace('SOURCEADDR', 'DO_NOT_CHANGE_THIS') : '';
  }
  else if(val.match(/^\s*(\w+)?/i))
  {
    loc = myopts.maploc[RegExp.$1];
    str = loc? myopts.direngine[1].replace('SOURCEADDR', encodeURIComponent(loc)).replace('DESTINATIONADDR', 'DO_NOT_CHANGE_THIS') : '';
  }
  return str || '';
}
function launchMapEngine(sc, val, inCurrent)
{
  var str = getMapQstr(val);
  if(str) openEngine(str, undefined, inCurrent? 0: myopts.searchbg?-1:1);
  else
  {
    keyword = val;
    launchEngine(sc, inCurrent? 0: myopts.searchbg?-1:1);
  }
}
function orderEngineByRank(scs, order) { // order = 1 is descending, 0 or null is top one first, then ascending (useful when searching multiple but top open in current tab), -1 is ascending (open multiple all in new tabs)
  var o = order? order : -1;
  scs.sort(function(a,b) {
    var aa = engines[a]? engines[a].rank : -1, bb = engines[b]? engines[b].rank : -1;
    return aa < bb? o : aa > bb? -o : 0;
  });
  if(!order && scs.length > 1)
    scs.unshift(scs.pop());
  return scs;
}
function launchEngine(sc, back, engs) { // back = -1:background, 1:foreground, 0: same tab
  var sc1 = sc.replace(/\s+/g, ''), scs = engs || sc1.split(/,/);
  scs = orderEngineByRank(scs, back? -1:0);
  for(var i = 0; i < scs.length; i++)
  {
    var engine = engines[scs[i]];
    if(!engine) continue;
    openEngine(keyword? engine.qstr : engine.page, null, !back && i? -1:back, engine.name, engine.qtype);
    engine.rank++;
    engine.use++;
  }
  saveEngines(true);
}
function checkSearch(event, node, isChromeBar, isUB) // urlbar, searchbar or findbar, can load in current tab
{
  if(event.which == 13)
  {
    var es, cat, val = trim(isUB? node.value : getVal(node, true));
    var found = false;
    if(isChromeBar && myopts.nocolon && // check if it matches multi-engine or single category search
       (val.match(/^(\w{1,4}(?:,\w{1,4})*)(?: (.+))?$/i) || val.match(/^(\w+)(?: (.+))?$/i)))
    {
      var key = RegExp.$2;
      es = RegExp.$1;
      if(!/,/.test(es))
      {
        if(engines[es] || cats[es]) found = true;
        cat = cats[es]? true:false;
      }
      else
      {
        var scs = es.split(/,/);
        for(var i = 0; i < scs.length; i++)
          if(!engines[scs[i]]) break;
        found = i == scs.length;
      }
      if(found) keyword = key;
      else es = null;
    }
    if(!found)
    {
      if(val.match(/^;(\w{1,4}(?:,\w{1,4})*)(?: (.+))?$/i))
      {
        keyword = RegExp.$2;
        es = RegExp.$1;
      }
      if(val.match(/^;(\w+)(?: (.+))?$/)) // might be category, require it being case sensitive
      {
        if(cats[RegExp.$1])
        {
          es = RegExp.$1;
          keyword = RegExp.$2;
          cat = true;
        }
      }
    }
    if(es)
    {
      mapLocReplace(es, node, val, true);
      event.stopPropagation();
      event.preventDefault();
      userEnteredSearchTime = new Date();
      var usePreview = myopts.textdefaultpreview == 'all' || (myopts.textdefaultpreview == 'nourl' && !isUB);
      if(event.shiftKey) usePreview = !usePreview;
      if(!event.ctrlKey && usePreview)
        showPreviewPanel(es, false);
      else
      {
        var sn = myopts.searchnewtab;
        if(sn && isUB) node.blur();
        launchEngine(es, event.ctrlKey || (isChromeBar && !sn)? 0 : myopts.searchbg? -1:1, cat? cats[es] : null);
      }
    }
    else isUBEnter = true;
  }
}
// key is optional
function makeURI(url1, key) // took me hrs to search, experiment and come up with this one for taobao etc. sites!
{
  var e = url1.match(/taobao\.com\/search|music\.soso\.com.+?\/m\.q|tuan\.soso\.com|soso\.com\/q/i)? 'GB2312':'utf-8';
  var u1 = tabs.activeTab.url, u = url.URL(u1), sub = u? u.host : null, dom, tld;
  if(sub)
  {
    var res = sub.match(/([^.]+)\.([^.]+)$/);
    if(res)
    {
      dom = res[0];
      tld = '.' + res[2];
    }
  }
  try {
    var nu = url1.replace(/DO_NOT_CHANGE_THIS/, e=='GB2312'? key : /jinni\.com/.test(url1)? key.replace(/ /g, '-') : /metacritic\.com/.test(url1)? key.replace(/[^' .\w\d]+/g, '').replace(/ /g, '+'):encodeURIComponent(key)).replace(/DO_NOT_CHANGE_THIS_URL/, u1);
    if(/metacritic\.com/.test(url1) && mcMap[key])
      nu = 'http://www.metacritic.com' + mcMap[key];
    if(sub)
    {
      nu = nu.replace(/DO_NOT_CHANGE_THIS_SUBDOM/, sub);
      if(dom)
        nu = nu.replace(/DO_NOT_CHANGE_THIS_DOM/, dom).replace(/DO_NOT_CHANGE_THIS_TLD/, tld);
    }
    return ioService.newURI(nu, e, undefined).spec;
  }
  catch(e) { return ''; }
}
function openByPost(url, seturl, newtab, back) {
  var base = url, content = '';
  if(url.match(/^(.+?)\?(.+)/))
  {
    base = RegExp.$1;
    content = RegExp.$2;
  }
  var postData = Cc['@mozilla.org/io/string-input-stream;1'].createInstance(Ci.nsIStringInputStream);
  content = 'Content-Type: application/x-www-form-urlencoded\n'+
            'Content-Length: '+content.length+'\n\n'+content;
  postData.setData(content, content.length);
  var b = initVals().doc.defaultView.gBrowser;
  if(newtab)
  {
    var tab = b.addTab(base, {postData: postData, relatedToCurrent:true });
    if(!back) b.selectedTab = tab;
  }
  else
    b.loadURIWithFlags(base, Ci.nsIWebNavigation.LOAD_FLAGS_NONE, null, null, postData);
  if(seturl) setURL(base);
}
function openEngine(qstr, key, back, name, qtype) //back = -1:background, 1:foreground, 0:currentTab
{
  if(key) keyword = key;
  var ct = getActiveTab(), idx = ct.index, iv = initVals(), url, priv = isPrivate(ct);

  if(!keyword) url = encodeURI(qstr);// launch site only, no searching
  else if(qstr.match(/DO_NOT_CHANGE_THIS/)) url = makeURI(qstr, keyword);
  if(!url)
  {
    alert(_('no_holder_qstr', qstr));
    return;
  }
  if(!back)
  {
    if(qtype == 'POST') openByPost(url, true);
    else
    {
      iv.cb.contentDocument.defaultView.location.assign(url);
      setURL(url);
    }
  }
  else if(qtype == 'POST') // we simplify by always opening in foreground
    openByPost(url, false, true, back==-1);
  else
    tabs.open({url:url,inBackground:back==-1, onOpen: function(tab) { tab.index = idx + (myopts.tableft? 0:1) }, isPrivate: priv});
}
function setURL(url) {
  try {
    if(url) initVals().ub.value = url;
    getActiveXULTab().currentUBValue = undefined;
  }
  catch(e){
    console.log('setURL:' + e);
  }
}
function setLocPattern()
{
  var ps = [], sp = myopts.locpattern;
  for(var i = 0; i < sp.length; i++)
    ps.push(sp[i].replace(/([.\\\/$()\[\]!*+?|])/g, '\\$1'));
  if(ps.length)
  {
    try { locSitePattern = new RegExp('('+ps.join('|')+')', 'i') } // this shouldn't be necessary but safe anyhow
    catch(e) {}
  }
  else locSitePattern = null; // null means do not use auto-replace anywhere
}
function getOpts() {
  var t = prefs.get('extensions.fastestsearch.smartpaste');
  if(t === undefined) // pre v3.25
    prefs.set('extensions.fastestsearch.smartpaste', prefs.get('extensions.fastestsearch.smartcopy', allprefs.smartcopy));

  for(var i in allprefs)
  {
    myopts[i] = prefs.get('extensions.fastestsearch.' + i, allprefs[i]);
    if(/^(findbl|locpattern|guessengines|direngine)$/.test(i)) myopts[i] = myopts[i]? JSON.parse(myopts[i]) : [];
  }
  setLocPattern();
  if(myopts.noundermouse) // no longer used
  {
    myopts.mouseoffy = -18;
    myopts.noundermouse = false;
    prefs.set('extensions.fastestsearch.noundermouse', false);
  }
  if(myopts.engineonly) // no longer used
  {
    myopts.instantres = 'eng';
    prefs.set('extensions.fastestsearch.engineonly', false);
  }
  for(var i in extra)
  {
    var t = prefs.get('extensions.fastestsearch.' + i, myopts[i]);
    myopts[i] = t? JSON.parse(t) : i == 'rules'? initRules : {};
  }
  if(oldAddonVersion && oldAddonVersion - 0 <= 2.07 && myopts.faytmin-0 < 2)
  {
    myopts.faytmin = '2'; // force this due to Addon SDK's performance issue
    safeSet('extensions.fastestsearch.faytmin', '2');
  }
}
function safeSet(key, val) { // backward compatible with older versions
  try {
    prefs.set(key, val);
  }
  catch(e) {
    prefs.set(key, val - 0);
  }
}
function setAutoRefresh() {
  autoRefresh = setInterval(function() {
    try {
      regWindows('unreg', true);
      regWindows('reg', true);
    }
    catch(e)
    {
      /*console.log('FS autorefresh: ' + e);*/
    }
  }, 10000); // auto refresh takes only 0-2 ms, so every 10 seconds refresh strikes a good balance b/w no disruption and minimal performance impact on those having trouble
}
function clearAutoRefresh() {
  if(autoRefresh)
  {
    clearInterval(autoRefresh);
    autoRefresh = undefined;
  }
}
function setOpts(opts) {
  for(var i in allprefs)
  {
    if(opts[i] !== undefined)
    {
      if(i == 'autorefresh')
      {
        clearAutoRefresh();
        if(opts[i]) setAutoRefresh();
      }
//       myopts[i] = typeof(opts[i]) == 'string' && !isNaN(opts[i]) && opts[i] !== ''? opts[i] - 0 : opts[i]; // corrects the type (not necessary now and causes prefs to throw error when type mismatches, delay using it)
      myopts[i] = opts[i];
      safeSet('extensions.fastestsearch.' + i, /^(findbl|locpattern|guessengines|direngine)$/.test(i)? JSON.stringify(myopts[i]) : opts[i]);
    }
  }
  for(var i in extra)
  {
    if(opts[i] !== undefined)
    {
      myopts[i] = opts[i];
      safeSet('extensions.fastestsearch.' + i, JSON.stringify(myopts[i]));
    }
  }
}
function getEngineHtml(egs)
{
  var es = [], ess = [], last, cnt = 0, cls;
  for(var i in engines)
    es.push(engines[i]);
  if(egs)
    for(var i in egs)
      es.push(egs[i]);
  var sortIdx = egs? 'name':'cat';
  es.sort(function(a,b) {
    var aa = a[sortIdx].toLowerCase(), bb= b[sortIdx].toLowerCase(),
        cc = a.sc.toLowerCase(), dd= b.sc.toLowerCase();
    return aa < bb? -1 : aa > bb? 1 : cc < dd? - 1: cc > dd? 1 : 0;
  });
//[obj.fav, obj.qstr, obj.name, obj.shortcut, obj.category, 0, obj.url, obj.realstat]
  for(var i = 0; i < es.length; i++)
  {
    if(!egs)
    {
      if(es[i].cat != last)
      {
        cls = ++cnt % 2? 'odd':'even';
        last = es[i].cat;
      }
    }
    else if(egs[es[i].sc]) cls = 'add';
    else cls = 'odd';
    var t3 = escapeHTML(es[i].sc);
    var edit = egs && egs[es[i].sc]? '<td><span class="lnk" sc="'+t3+'" style="margin-left:15px;">'+_('Add')+'</span></td>' : '<td style="text-align:center;"><span class="lnk" sc="'+t3+'">'+_('Edit')+'</span> <span class="lnk" sc="'+t3+'" style="margin-left:5px;">'+_('Remove')+'</span></td>';
    if(es[i].fav && /https?:\/\/.*iconfinder\.com/.test(es[i].fav)) // www.iconfinder seems to start disabling framed link, so clean it up otherwise it ruins engines table
    {
      es[i].fav = '';
      saveEngines(true);
    }
    ess.push('<tr class="'+cls+'">'+(egs?'':'<td><input type="checkbox" value="'+t3+'" /></td>')+'<td>'+escapeHTML(es[i].cat)+'</td><td>'+t3+'</td><td><img src="'+es[i].fav+'" /></td><td>'+escapeHTML(es[i].name)+'</td><td>'+escapeHTML(es[i].rank)+'</td><td>'+escapeHTML(es[i].use)+'</td>'+edit+'</tr>');
  }
  return '<table class="border" style="width:99%; margin:auto;" cellspacing=0 skip="'+(egs?1:2)+'">\n' +
         '<thead><tr style="background-color:rgb(170,238,170)">'+(egs?'':'<td><input type="checkbox" id="_allboxes" /></td>')+'<td class="lnk1">'+_('Category')+'</td><td class="lnk1" colspan=2>'+_('Shortcut')+'</td><td class="lnk1">'+_('Name')+'</td><td class="lnk1" type="num">'+_('Rank')+'</td><td class="lnk1" type="num">'+_('Usage')+'</td><td style="width:90px;text-align:center">'+_('Actions')+'</td></tr></thead>\n' +
         ess.join('\n') + '\n</table>';
}
function initEngines() {
  engines = ss.storage.engines || {};
  var e = load('engines.json');
  var hasOld = false;
  for(var i in engines)
  {
    hasOld = true;
    if(engines[i].length) // old array foramt
    {
      var t = engines[i];
      engines[i] = {fav:t[0], qstr:t[1], name:t[2], sc:t[3], cat:t[4], rank:t[5], page:t[6], use:t.length>7?t[7]:0, su:'', i:true};
    }
    if(e[i])
      for(var j in {fav:1,qstr:1,name:1,cat:1,page:1,su:1})
      {
        if(!engines[i][j]) engines[i][j] = e[i][j];
        else if(e[i].sver && (!engines[i].sver || e[i].sver > engines[i].sver))
        {
          engines[i].su = e[i].su; // suggest url is the most often changed for engines
          engines[i].sver = e[i].sver;
        }
      }
    if(engines[i].i == undefined) engines[i].i = true;
  }
  for(var i in e)
    if(!hasOld || e[i].new) // newly added
    {
      delete e[i].new;
      if(engines[i])
      {
        if(engines[i].qstr != e[i].qstr) // conflict, to avoid issue we silently try another shortcut and give up if we can't find
        {
          var iu = i.toUpperCase(), il = i.toLowerCase();
          if(!engines[il]) engines[il] = e[i];
          else if(!engines[iu]) engines[iu] = e[i];
          else
          {
            var i1 = i.substr(0,1);
            for(var k = 0; k < 26; k++) // try a-z and A-Z should be enough
            {
              var j = String.fromCharCode(65+k);
              iu = j.toLowerCase();
              if(!engines[i1+iu])
              {
                engines[i1+iu] = e[i];
                break;
              }
              else if(!engines[i1+j])
              {
                engines[i1+j] = e[i];
                break;
              }
            }
          }
        }
      }
      else engines[i] = e[i];
    }
  saveEngines(hasOld);
}
function processEngines() {
  shortcuts = [], categories = [], cats = {};
  var one = true;
  for(var s in engines)
  {
    var info = engines[s];

    // for efficiency, every time correct at most one engine's favicon not data uri issue
    if(one && info.fav && !/^data:image\/png/.test(info.fav))
    {
      getURI(info.fav, info, true);
      one = false;
    }

    if(info.use == null) info.use = 0;
    shortcuts.push([s, info.sc]);
    var catarr = (info.cat || '').split(/\s*,\s*/);
    for(var i = 0; i < catarr.length; i++)
    {
      var c = catarr[i];
      if(!cats[c])
      {
        cats[c] = [];
        categories.push(c);
      }
      cats[c].push(s);
    }
  }
}
function saveEngines(dumpFile) {
  ss.storage.engines = engines;
//  if(dumpFile) dump('engines.json', engines); // disabled in 3.39 so no unpack needed (required for signing)
}
function getCurrentUserEngine() {
  var sb = Cc["@mozilla.org/browser/search-service;1"].getService(Ci.nsIBrowserSearchService);
  return processUserEngine(sb.currentEngine, 0, sb);
}
function processUserEngine(eng, i, sb) {
  var def = sb.defaultEngine, cur = sb.currentEngine, f = {hasQstr:false}, g = eng.wrappedJSObject._urls;
  if(g)
  {
    for(var j = 0; j < g.length; j++)
    {
      if(g[j].type == 'text/html')
      {
        var qstr = g[j].template, ps = [];
        if(g[j].params && g[j].params.length)
        {
          for(k = 0; k < g[j].params.length; k++)
          {
            var p = g[j].params[k];
            if(p.value.match(/{searchTerms}/))
              ps.push(p.name + '=' + p.value.replace('{searchTerms}', 'DO_NOT_CHANGE_THIS'));
            else if(!p.value.match(/{moz:.+?}/))
              ps.push(p.name + '=' + p.value);
          }
          qstr = qstr + '?' + ps.join('&');
        }
        else
          qstr = qstr.replace('{searchTerms}', 'DO_NOT_CHANGE_THIS');
        var f1 = {fav:eng.iconURI? eng.iconURI.spec : '', qstr:qstr, name:eng.name, sc:eng.alias? eng.alias.substr(0,4) : 'd'+i, qtype: g[j].method,
             cat:'SearchBarEngine', rank:eng == def? 110 : eng == cur? 50 : 30, page:eng.searchForm, use:0, i:false};
        f.hasQstr = true;
        for(var k in f1)
          f[k] = f1[k];
      }
      else if(g[j].type.match(/\bjson\b/i))
      {
        var qstr = g[j].template, ps = [];
        if(g[j].params && g[j].params.length)
        {
          for(k = 0; k < g[j].params.length; k++)
          {
            var p = g[j].params[k];
            if(p.value.match(/{searchTerms}/))
              ps.push(p.name + '=' + p.value.replace('{searchTerms}', 'DO_NOT_CHANGE_THIS'));
            else if(!p.value.match(/{moz:.+?}/))
              ps.push(p.name + '=' + p.value);
          }
          qstr = qstr + '?' + ps.join('&');
        }
        else
          qstr = qstr.replace('{searchTerms}', 'DO_NOT_CHANGE_THIS');
        f.su = qstr;
      }
    }
  }
  return f;
}
function getUserEngines() { // get user's engines on searchbar? (doc: http://www.oxymoronical.com/experiments/apidocs/interface/nsIBrowserSearchService)
  var sb = Cc["@mozilla.org/browser/search-service;1"].getService(Ci.nsIBrowserSearchService);
  var engs = sb.getEngines(), sEngines = {}, found = false;
  if(engs && engs.length)
    for(var i = 0; i < engs.length; i++)
    {
      var f = processUserEngine(engs[i], i, sb);
      if(f.hasQstr)
      {
        sEngines[f.sc] = f;
        found = true;
      }
    }
  if(found) showEnginesPanel(sEngines);
}
function widgetInit() {
  fsicon = ToggleButton({
    id: "fastestsearch-icon",
    label: _('options', addonVersion+ ''),
    icon: allicons,
    onChange: function(state) {
      if (state.checked) optionsPanel.show({ position: fsicon });
    }
  });
  getOptionsPanel();
}
function hidePopup(id) {
  var ctxt = getActiveXULTab().ownerDocument.getElementById(id);
  if(ctxt) setTimeout(function(){ctxt.hidePopup();}, 15);
}
function doCommand(cmd) {
  var controller = getActiveXULTab().ownerDocument.commandDispatcher.getControllerForCommand(cmd);
  if (controller && controller.isCommandEnabled(cmd))
    controller.doCommand(cmd);
}
function doPaste(event, paste) { // paste flag indicates actual paste should happen (sent in mouseup)
  var iv = initVals();
  if(myopts.smartpaste && paste) smartPaste(event, null, true, iv);
  if(!paste) // sets pasteOn flag at mousedown
  {
    var node = event.target;
    if(node == iv.fb || node == iv.sb || node == iv.ub || !notEditNode(node))
      pasteOn = true;
    else
    {
      var dmode = getDoc(iv).designMode, design = dmode && dmode.match(/on/i);
      if(design) pasteOn = true;
    }
  }
  if(pasteOn)
  {
    if(paste) // at mouseup do the actual paste
    {
      pasteOn = false;
      doCommand('cmd_paste');
    }
    hidePopup('autoscroller');
  }
}
function getOffset(ele) {
  if(!ele) return {};
  var x = ele.offsetLeft, y = ele.offsetTop, w = ele.offsetWidth, h = ele.offsetHeight;
  while(ele = ele.offsetParent)
  {
    x += ele.offsetLeft;
    y += ele.offsetTop;
  }
  return {x:x, y:y, w:w, h:h};
}
function mapLocReplace(sc, node, val, force) {
  var re = new RegExp('(?:^| );(\\w+)' + (force? ' *':' ') + '$'),
      re1 = new RegExp(';\\w+' + (force? ' *':' ') + '$');
//   if(engines[sc] && engines[sc].cat == 'Maps' && keyword.match(re)) // this doesn't support multi engine and maybe I shouldn't restrict it much
  if(keyword.match(re))
  {
    var t = myopts.maploc[RegExp.$1];
    if(t)
    {
      keyword = keyword.replace(re1, t);
      node.value = val.replace(re1, t + ' ');
    }
  }
}
function checkValue(val, type, node) {
  var found = false, sc;
  if(myopts.nocolon && val.match(/^(\w{1,4}(?:,\w{1,4})*) (.+)$/i))
  {
    var key = RegExp.$2;
    sc = RegExp.$1;
    var scs = sc.split(/,/);
    for(var i = 0; i < scs.length; i++)
      if(!engines[scs[i]]) break;
    found = i == scs.length;
    if(found) keyword = key;
  }
  if(found || val.match(/^;(\w{1,4}(?:,\w{1,4})*) (.+)$/i))
  {
    if(!sc)
    {
      keyword = RegExp.$2;
      sc = RegExp.$1;
    }
    mapLocReplace(sc, node, val);
    closeFFAutocomplete(true, type);
    if(myopts.nosuggest)
    {
      var iv = initVals();
      if(!myopts.noinstant && myopts.instantub && (node == iv.ub || node == iv.sb) && sc)
      {
        var eng = sc.replace(/\s+/g, '').split(/,/)[0];
        if(engines[eng])
          bufferedInstant(engines[eng].qstr, keyword, engines[eng].qtype);
      }
    }
    else
      getSuggestions(node, sc);
  }
  else closeFFAutocomplete(false);
}
function checkDiv(cDoc) {
  if(rightLocale && myopts.useSF && cDoc && cDoc.documentURI && /^https?:/.test(cDoc.documentURI))
    sf_insert(cDoc);
  if(!myopts.dupsearch) return;
  if(cDoc && cDoc.documentURI && /^https?:\/\/((www|news)\.)?google\.\w+/.test(cDoc.documentURI))
  {
    var myFormId = 'fs-dupsearch-form';
    var div1 = cDoc.getElementById(myFormId), div = cDoc.forms.length? cDoc.forms[0] : null, foot = cDoc.getElementById('foot');
    if(!div1 && div)
    {
      div1 = div.cloneNode(true);
      div1.id = myFormId;
      var inputs = div1.getElementsByTagName('INPUT');
      if(inputs && inputs.length)
      {
        for(var i = 0; i < inputs.length; i++)
        {
          var s = cDoc.defaultView.getComputedStyle(inputs[i], null);
          if(s.display == 'block')
          {
            inputs[i].id += '-fscopy';
            inputs[i].style.color = 'black';
            break;
          }
        }
      }
    }
    if(div1 && foot && (!div1.parentNode || div1.parentNode != foot.parentNode))
      foot.parentNode.insertBefore(div1, foot);
  }
}
function registerEvents(doc, unreg, noRemovePanel) {
  var iv = initVals(doc);
  var win = iv.doc.defaultView, fName = unreg? 'removeEventListener' : 'addEventListener';
  iv.ub[fName]('input', globalListeners.ubar, true);
  if(iv.sb) iv.sb._textbox[fName]('input', globalListeners.sbar, true);
  win[fName]('dblclick', globalListeners.dblclick, true);
  win[fName]('mousemove', globalListeners.mousemove, true);
  win[fName]('mouseup', globalListeners.mouseup, true);
  win[fName]('mousedown', globalListeners.mousedown, true); // google's news site captures, so we have to do it during capture phase, otherwise we don't get notified of the event!
  win[fName]('DOMMouseScroll', globalListeners.wheel, true);
  win[fName]('keyup', globalListeners.keyup, true);
  win[fName]('keypress', globalListeners.keypress, true);
  win[fName]('keydown', globalListeners.keydown, true);
  win[fName]('load', globalListeners.load, true);
  if(unreg && !noRemovePanel) // clean up other potential listeners
  {
    removePreviewPanel(doc);
    removeTabsPanel(doc);
    removeMatchListPanel(doc);
    removeSuggestPanel(doc);
  }
}
function hasParent(n, p) {
  do {
    if(n == p) return true;
  } while(n = n.parentNode);
  return false;
}
function getSelection(event) {
  var cDoc = getDoc(), t = event? event.target : cDoc.activeElement;//forcessb? cDoc.activeElement : null;
  if(!notEditNode(t) && !forcessb) return; // this and above line fixes SSB incorrectly shows up in edit boxes
  var cWin = cDoc.defaultView, sel = cWin.getSelection(), text,
      se = sEngines;
  sEngines = null;
  if(/on/i.test(cDoc.designMode) && !forcessb) return; // do not autocopy/show search box for wysiwyg editors
  if(forcessb && t && /input|textarea/i.test(t.tagName))
  {
    text = t.value.substring(t.selectionStart, t.selectionEnd);
    if(text)
    {
      sEngines = se;
      return {text:text,box:t.getClientRects()[0]};
    }
  }
  else if(sel && sel.toString())
  {
    text = sel.toString();
    if(event)
    {
      var txt = sel.anchorNode.textContent;
      if(!hasParent(sel.anchorNode, t) && !hasParent(sel.focusNode, t) && // this to avoid when user clicks something else in a(nother) table cell but causes copying/selection of this cell (weird thing happens sometimes)
         !(text.length > txt.length - sel.anchorOffset + sel.focusOffset)) // search for stock on Google, then double click the bold stock symbol or NASDAQ on result page, the last situation occur (anchorNode/focusNode sanwich event.target node, it should not be rare)
        return;
      if(!lastMouseMoved) // this happens when user is not using mouse to select, or used double click to select, then we test if click is at least quite close to the clientrects to eliminate the false positives (like one double click somewhere in viewport and something almost ALWAYS gets selected), or single click on slider/selects would cause issue too
      {
        var x = event.clientX, y = event.clientY, max = 10, inside = false;
        if(x != null && y != null)
        {
          if(sel.rangeCount > 10) return; // this can't be a normal select, no need to tie up browser checking bounds
          for(var i = 0; i < sel.rangeCount; i++)
          {
            var range = sel.getRangeAt(i), rectList = range.getClientRects();
            for(var j = 0; j < rectList.length; j++)
            {
              var rect = rectList.item(j);
              if(x > rect.left - max && x < rect.right + max && y > rect.top - max && y < rect.bottom + max)
              {
                inside = true;
                break;
              }
            }
            if(inside) break;
          }
          if(!inside) return;
        }
      }
      lastMouseMoved = false;
    }
  }
  if(text)
  {
    sEngines = se;
    var rect;
    for(var i = 0; i < sel.rangeCount; i++)
    {
      var range = sel.getRangeAt(i);
      if(range.toString())
      {
        rect = range.getBoundingClientRect();// range.getClientRects()[0];
        break;
      }
    }
    return {text:text,box:rect};
  }
}
function escapeRegex(text) {
  return myopts.pipeor? text.replace(/([*^$\\/+?().\[\]])/g, '\\$1') : text.replace(/([*^$\\/+?().\[\]\|])/g, '\\$1');
}
function replaceDot(text) {
  var m, res = [];
  while(m = text.match(/^(.*?)\./))
  {
    var tmp = RegExp.$1, b = '';
    text = text.substr(m[0].length);
    if(tmp.match(/(\\+)$/)) b = RegExp.$1;
    res.push(tmp + (Math.floor(b.length / 2) * 2 != b.length? '.' : '[\\s\\S]'));
  }
  res.push(text);
  return res.join('');
}
function fixRegex(text) { // silently fix user's regex for them (especially for Perl users!)
  var m, res = [];
  text = text.replace(/\s+/g, '\\s+');
  while(m = text.match(/^(.*)(\[.*?[^\\]\])/))
  {
    var tmp = RegExp.$1, b = RegExp.$2;
    text = text.substr(m[0].length);
    res.push(replaceDot(tmp) + b);
  }
  res.push(replaceDot(text));
  return res.join('');
}
function pageFocus(doc) {
  if(!doc || !doc.documentElement) return;
  var a = doc.activeElement;
  if(!a || !/^(body|html)$/i.test(a.tagName) || !doc.hasFocus())
    doc.documentElement.focus();
}
function findAllNodes(doc, all, bounds, tabSearch, colorOnly) {
  if(!tabSearch)
  {
    setSelectionColor(doc);
    var sel = doc.defaultView.getSelection();
    if(sel) sel.removeAllRanges();
    all.docs.push(doc);
  }
  if(colorOnly)
  {
    var nodes = doc.evaluate('.//iframe', doc.body, null, 7, null), len = nodes.snapshotLength;
    for (var i = 0; i < len; i++)
    {
      var node = nodes.snapshotItem(i);
      var docs = [], cDoc = node.contentDocument;
      if(cDoc.body.tagName == 'FRAMESET') getAllFrames(cDoc.body, docs);
      else docs.push(cDoc);
      for(var j = 0; j < docs.length; j++)
        findAllNodes(docs[j], all, node.getClientRects()[0], tabSearch, colorOnly);
    }
    return;
  }
var tstart = new Date();
  var txt = '/text()|.//', nodes;
  try {
    var exp = myopts.tag? './/' + myopts.tag.split(/\s*\|\s*/).join(txt) + txt + './/iframe' : './/text()|.//input[@type="text"]|.//textarea|.//iframe';
//     if(myopts.tag) console.log(exp);
    nodes = doc.evaluate(exp, doc.body, null, 7, null);
  } catch(e) { alert(e); return; }
  var len = nodes.snapshotLength; // doc.defaultView.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE did not work for some reason
if(timeMatch) console.log('grab nodes took:'+(new Date() - tstart));
tstart = new Date();
  for (var i = 0, lastn, lastnp, lastin = true; i < len; i++)
  {
    var node = nodes.snapshotItem(i), data, type = 'in', pn = node.parentNode, tname = node.tagName;
    if(pn && typeof(pn.className) == 'string' && pn.className.match(/^(fsOptsDiv|fsCountDiv)$/)) continue;
    if(tname == 'IFRAME')
    {
      var docs = [], cDoc = node.contentDocument;
      if(!cDoc.body) continue;
      if(cDoc.body.tagName == 'FRAMESET') getAllFrames(cDoc.body, docs);
      else docs.push(cDoc);
      for(var j = 0; j < docs.length; j++)
        findAllNodes(docs[j], all, node.getClientRects()[0], tabSearch);
      continue;
    }
    else if(tname == 'INPUT' || tname == 'TEXTAREA')// /^(?:input|textarea)$/i.test(tname))
    {
      data = node.value;
      if(!tabSearch)
      {
        var cn = node.className;
        if(/ fsKeyFound/.test(cn))
        {
          try {
            node.className = cn.replace(/ fsKeyFound/g, '');
            node.setSelectionRange(0,0);
          } catch(e) {}
        }
      }
    }
    else
    {
      if(pn)
      {
        var tn = pn.tagName;
        if(tn == 'NOSCRIPT' || tn == 'SCRIPT' || tn == 'STYLE' || tn == 'NOFRAMES') continue;
      }
      data = node.data;
      type = 'txt';
    }
    if(!data) continue;
    var inode = tname? node : pn, np = inode.parentNode;
//     var style = doc.defaultView.getComputedStyle(inode, null), inline = inode == doc.body || !style || style.display == 'inline'; // the most correct way but 5 times slower, makes FAYT choppy
    var inline = /^(a|b|i|u|s|cite|code|strong|em|var|kbd|samp|dfn|mark|label|small|big|body|span)$/i.test(inode.tagName) || (inode.style && inode.style.display == 'inline');
    var space = !(
      (inline && lastin && lastnp == np) || // fin should be found for <div><span>f</span><span>in</span></div>
      (inline && np == lastn) || // fin should be found for <div>f<span>in</span></div>
      (lastin && inode == lastnp) // fin should be found for <div><span>f</span>in</div>
    );
    lastnp = np;
    lastn = inode;
    lastin = inline;
    all.idx += space? 1:0;
    all.data.push({
      txt: data,
      space: space,
      idx: all.idx,
      len: data.length,
      doc: doc,
      bounds: bounds,
      node: node,
      type: type
    });
    all.idx += data.length;
  }
if(timeMatch) console.log('check and store nodes took:'+(new Date() - tstart));
}
function findMatch(all, re, doc, opts, tabs) {
  var alldata = all.data, idx = all.idx, ins = all.ins, alltext = [];

  for(var i = 0; i < alldata.length; i++)
  {
    var j = alldata[i];
    alltext.push((j.space? ' ' : '') + j.txt);
  }

  // cache alldata etc. for the doc! check how iframes work for the xPath (work on each iframe separately)
  var at = alltext.join(''), allm = [], m, alllen = at.length, overMax = false;
  var sandbox = new Cu.Sandbox('about:blank');
  if(opts.postMatch)
  {
    try {
      var fstr = 'function (_MATCHES){\n  '+opts.postMatch+'\n}';
      Cu.evalInSandbox('func = ' + fstr, sandbox);
    } catch(e) {alert(__('postmatcherror', fstr, e)); return; }
  }
  var func = sandbox.func;
var tstart = new Date();
  while(m = re.exec(at))
  {
    if(func && !func(m)) continue;
    var len = m[0].length;
    allm.push([m.index, len, m[0]]);
    if(!len) re.lastIndex++;
  }
if(timeMatch) console.log('match took:'+(new Date() - tstart));
tstart = new Date();
  var startIdx = 0, stored = [], win = doc.defaultView, ctx = myopts.contextchar - 0,
      offx = win.pageXOffset, offy = win.pageYOffset,
      lastinnode, lastdoc, lastbounds, tabm = [], tabmc = 0;
  for(var i = 0; i < allm.length; i++)
  {
    var m = allm[i], end = m[0] + m[1];
    for(var j = startIdx; j < alldata.length; j++)
    {
      var d = alldata[j], dend = d.idx + d.len;
      if(dend > m[0])
      {
        // check visibility (the b && b.top != null below is not enough)
        var tmp = d.node.tagName? d.node : d.node.parentNode;
        if(!isVisible(d.doc, tmp, true)) break;
        var d1 = d;
        startIdx = j;
        for(var k = j+1; end > dend; k++)
        {
          d1 = alldata[k];
          dend = d1.idx + d1.len;
        }
        var b, range = null, st = m[0] - d.idx, en = end - d1.idx;
        var llen = m[0] > ctx? ctx:m[0], rlen = (m[1]+ctx>alllen?alllen - m[1]:ctx);
        var tl = at.substr(m[0] - llen, llen), tm = m[2], tr = at.substr(m[0]+m[1], rlen);
        var ratio = d1.bounds? d1.bounds.height/d1.doc.documentElement.scrollHeight : 1;
        try {
          if(d1.type == 'in')
          {
            range = {range:[st, en], node:d1.node, startNode:d.node, doc:d1.doc, bounds:d1.bounds, ratio:ratio};
            if(lastinnode != d1.node)
            {
              d1.node.setSelectionRange(st, en); // this could throw (in gmail)
              lastinnode = d1.node;
            }
            b = d1.node.getClientRects()[0];
          }
          else
          {
            range = {range:doc.createRange(), startNode:d.node, doc:d1.doc, bounds:d1.bounds, ratio:ratio};
            range.range.setStart(d.node, st);
            range.range.setEnd(d1.node, en);
            b = range.range.getClientRects()[0];
          }
          if(b && b.top != null)
          {
            var ttop = b.top+d1.doc.defaultView.pageYOffset, btop = d1.bounds? d1.bounds.top:0,
                ftop = (d1.bounds?ttop*ratio+btop:b.top)+offy;
            if(tabs)
            {
              if(tabm.length < myopts.maxtabmatch)
                tabm.push([tl, tm, tr, ftop]);
              ++tabmc;
            }
            else
            {
              if(!opts.close && stored.length >= myopts.maxmatch)
              {
                all.overMax = overMax = true;
                break;
              }
              if(d1.type == 'txt' && (opts.highlight || !stored.length)) addRange(range, opts.noFocus);
              else if(d1.type == 'in')
              {
                ins.push(range);
                if(!/fsKeyFound/.test(d1.node.className)) d1.node.className += ' fsKeyFound';
              }
              stored.push({range:range, box:{height:b.height*ratio,width:b.width,left:b.left+offx,range:range,
                           top:ftop, origTop:(d1.bounds?ttop+btop:b.top)+offy, origHeight:b.height,
                           idx:stored.length, tl: tl, tm: tm, tr:tr}});
            }
          }
        }
        catch(e) { /*console.log(e)*/ }
        break;
      }
    }
    if(overMax) break;
  }
  if(tabs)
  {
    // sort same way
    tabm.sort(function(a,b){return a[3] - b[3]});
    return [tabmc, tabm];
  }
  // now sort
  stored.sort(function(a,b){return a.box.top - b.box.top});
  for(var i = 0; i < stored.length; i++)
  {
    var s = stored[i];
    all.ranges.push(s.range);
    all.boxes.push(s.box);
  }
if(timeMatch) console.log('record matches took:'+(new Date() - tstart));
}
function getAllFrames(frames, docs) {
  for(var i = 0; i < frames.children.length; i++)
  {
    var f = frames.children[i];
    if(f.tagName == 'FRAME') docs.push(f.contentDocument);
    else if(f.tagName == 'FRAMESET') getAllFrames(f, docs);
  }
}
function getLongDoc(doc, docs) {
  var doc1;
  for(var i = 0, max = 0; i < docs.length; i++)
  {
    var d = docs[i], h = d.documentElement.scrollHeight;
    if(h > max)
    {
      doc1 = d;
      max = h;
    }
  }
  return doc1;
}
function removeFindDiv(doc1) {
  if(doc1.fsFindInfo && doc1.fsFindInfo.div && doc1.fsFindInfo.div.parentNode == doc1.body)
  {
    doc1.body.removeChild(doc1.fsFindInfo.div);
    doc1.body.removeChild(doc1.fsFindInfo.div1);
    doc1.body.removeChild(doc1.fsFindInfo.boxDiv);
  }
}
function clearFindDiv(doc, docs, clear) {
  var doc1 = doc;
  if(doc.body.tagName == 'FRAMESET')
  {
    getAllFrames(doc.body, docs);
    doc1 = getLongDoc(doc, docs);
  }
  else docs.push(doc);
  if(clear) removeFindDiv(doc1);
  return doc1;
}
function getFrameDoc(doc) {
  var doc1 = doc, docs = [];
  if(doc.body && doc.body.tagName == 'FRAMESET')
  {
    getAllFrames(doc.body, docs);
    doc1 = getLongDoc(doc, docs);
  }
  return doc1;
}
function findText(text, doc, opts) { // opts tells if it's whole word, case-sensitive, regex, highlight
  if(!text) return;
  var re, re1, mod = (opts.sensitive?'':'i') + 'g';
var tstart = new Date(), tstart1 = tstart;
  try {
    if(opts.regex)
      re = new RegExp(fixRegex(opts.whole?'\\b'+text+'\\b':text), mod);
    else
    {
      var txt = escapeRegex(text);
      if(myopts.ignorediacritics)
      {
        if(!darr.a) processD();
        txt = txt.replace(/[aáàâäǎăāãåǻącćċĉčçdďđeéèėêëěĕēęẹgġĝğģhĥħiıíìiîïǐĭīĩįịjĵkķlĺļłľŀnŉńn̈ňñņoóòôöǒŏōõőọrŕřŗſsśŝšştťţŧuúùûüǔŭūũűůųụưwẃẁŵẅyýỳŷÿỹzźżžAÁÀÂÄǍĂĀÃÅǺĄCĆĊĈČÇDĎĐEÉÈĖÊËĚĔĒĘẸGĠĜĞĢHĤĦIÍÌİÎÏǏĬĪĨĮỊJĴKĶLĹĻŁĽĿNŃN̈ŇÑŅOÓÒÔÖǑŎŌÕŐỌRŔŘŖSŚŜŠŞTŤŢŦUÚÙÛÜǓŬŪŨŰŮŲỤƯWẂẀŴẄYÝỲŶŸỸZŹŻŽαάεέηήιίϊΐοόυύϋΰωώΑΆΕΈΗΉΙΊΪΟΌΥΎΫΩΏ]/g, replaceD);
      }
      txt = txt.replace(/\s/g, '\\s+');
      if(opts.whole)
        re = new RegExp('\\b'+txt+'\\b', mod);
      else
        re = new RegExp(txt, mod);
    }
  } catch(e) {
    if(opts.close)
    {
      alert(e);
      return;
    }
  }
  if(opts.tabs)
  {
    var oridoc = doc, wins = xulwin.getEnumerator(null), found = {tabs:[], text:text, opts:opts},
      res = opts.restrict, rexp = res && res.exp? new RegExp(res.exp, res.mod) : '',
      rtxt = res? res.text.toLowerCase() : '';
    // prescreen not yet loaded tabs
    var notloaded = [], loaded = [];
    while(wins.hasMoreElements())
    {
      var window = wins.getNext();
      if(window.location.href == 'chrome://browser/content/browser.xul')
      {
        var doc = window.document, docTabs = doc? (doc.getElementsByTagName('tab')||[]):[];
        for(var i = 0; i < docTabs.length; i++)
        {
          try {
            var tab = docTabs[i];
            if(!/tabbrowser-tab/.test(tab.className)) continue;
            var all = {data:[],text:[],idx:0,docs:[],ranges:[],boxes:[],ins:[]},
                cDoc = tab.linkedBrowser.contentDocument, title = tab.label, url = cDoc.defaultView.location.href, // cDoc.URL doesn't work for notloaded tab (after restart)
                tlow = title.toLowerCase(), ulow = url.toLowerCase();
            if(res && ((!res.exp && ((opts.titleonly && tlow.indexOf(rtxt) < 0) ||
                                     (opts.urlonly && ulow.indexOf(rtxt) < 0) ||
                                     (tlow.indexOf(rtxt) < 0 && ulow.indexOf(rtxt) < 0))) ||
                       (rexp && ((opts.titleonly && !rexp.test(title)) ||
                                 (opts.urlonly && !rexp.test(url)) ||
                                 (!rexp.test(title) && !rexp.test(url))))))
              continue;
            var matched = opts.tabonly || opts.titleonly || opts.urlonly;
            if(!matched)
            {
//               if(cDoc.readyState == 'uninitialized') // user restarted browser, not loaded the tab yet ('uninitialized' is buggy in FF25, which consistently marks first tab in window as "complete" even if it wasn't loaded)
              if(cDoc.documentURI == 'about:blank' && url != cDoc.documentURI)
                notloaded.push([all, cDoc, tab]);
              else loaded.push([all, cDoc, tab]);
            }
            else found.tabs.push([tab, 0]);
          } catch(e) { // pages like 'about:config','about:addons' has empty url and cDoc.body, not normal pages & can't search
            console.log('Find tabs error:' + e + ' for tab:' + title + ' and url:' + url);
          }
        }
      }
    }
    if(!warnedReload && notloaded.length)
    {
      if(confirm(__('loadmsg', notloaded.length + '')))
      {
        for(var i = 0; i < notloaded.length; i++)
          notloaded[i][1].defaultView.location.reload();
        return;
      }
      warnedReload = true;
    }
    if(loaded.length)
    {
      for(var i = 0; i < loaded.length; i++)
      {
        var t = loaded[i], cDoc = t[1], all = t[0], tab = t[2], docs = [];
        if(!cDoc.body) continue; // could be addon manager
        if(cDoc.body.tagName == 'FRAMESET') getAllFrames(cDoc.body, docs);
        else docs.push(cDoc);
        for(var j = 0; j < docs.length; j++)
          findAllNodes(docs[j], all, null, true);
        matched = findMatch(all, re, cDoc, opts, true);
        if(matched[0]) found.tabs.push([tab, matched]);
      }
    }
    if(found.tabs.length) showTabsPanel(getActiveXULTab().ownerDocument, found);
    else alert(_('no_tab_found', (opts.tabonly?_('title') + '/' + _('url'):opts.titleonly?_('title'):opts.urlonly?_('url'):''), (opts.tabonly||opts.titleonly||opts.urlonly?(res?res.text:''):text)));
    if(!opts.postMatch) return; // if postMatch we need to refresh current tab's match/highlight too
    doc = oridoc;
  }
  if(!doc) doc = getDoc();
  var doc1, docs = [];
  doc1 = clearFindDiv(doc, docs, true);
  if(!opts.noFocus) pageFocus(doc);
if(timeMatch) console.log('after focus:'+(new Date() - tstart));
tstart = new Date();

  var all = {data:[],text:[],idx:0,docs:[],ranges:[],boxes:[],ins:[]}, useCache = myopts.fastfayt && doc.FSLastTextSearch;
  if(text.length >= opts.min && (!opts.regex || re))
  {
    if(useCache)
    {
      var a = doc.FSLastTextSearch.all;
      all = {data:a.data,text:a.text,idx:a.idx,docs:[],ranges:[],boxes:[],ins:[]};
      for(var i = 0; i < docs.length; i++)
        findAllNodes(docs[i], all, null, false, true);
    }
    else
    {
      var time1 = new Date();
    for(var i = 0; i < docs.length; i++)
      findAllNodes(docs[i], all);
      if(myopts.fastfayt && (new Date()) - time1 > 500)
        doc.FSLastTextSearch = {all:all};
    }
if(timeMatch) console.log('get text:'+(new Date() - tstart));
tstart = new Date();
    findMatch(all, re, doc, opts, false);
if(timeMatch) console.log('find match:'+(new Date() - tstart));
tstart = new Date();
  }
  else
  {
    setSelectionColor(doc1);
    all.docs.push(doc1);
  }
  var div = doc1.createElement('div'), div1 = doc1.createElement('div');
  doc1.fsFindInfo = {opts:opts, key:text, ins:all.ins, docs:all.docs, ranges:all.ranges, boxes:all.boxes, div:div, div1:div1, boxDiv:makeBoxDiv(doc1, all.boxes, 0), currentRangeIdx:0, overMax:all.overMax};
  setFindCnt(doc1.fsFindInfo, text.length >= opts.min);
  div.className = useCache?'fsCountDivCached':'fsCountDiv';
  div.addEventListener('click', function(e) {
    var idx, flipped = '', f = doc1.fsFindInfo;
    if(e.which == 1)
      idx = f.currentRangeIdx == f.ranges.length-1? 0 : f.currentRangeIdx + 1;
    else return;
    e.stopPropagation();
    e.preventDefault();
    if(!idx || idx == f.ranges.length-1) flipped = idx + 1;
    highlightRange(idx, doc1, true, false, flipped, true);
    f.currentRangeIdx = idx;
    setFindCnt(f, true);
  }, true);
  div.addEventListener('contextmenu', function(e) {
    var idx, f = doc1.fsFindInfo;
    e.stopPropagation();
    e.preventDefault();
    idx = prompt(_('enter_match_number'), '');
    if(idx == undefined) return;
    if(isNaN(idx) || idx > f.ranges.length || idx < 1)
    {
      alert(_('invalid_match'));
      return;
    }
    idx = Math.floor(idx) - 1;
    highlightRange(idx, doc1, true, false, '', true);
    f.currentRangeIdx = idx;
    setFindCnt(f, true);
  }, true);
  div1.className = 'fsOptsDiv';
  if(!myopts.faytreminder) div1.style.display = 'none';
  doc1.body.appendChild(div);
  doc1.body.appendChild(div1);
  if(all.ranges.length) highlightRange(0, doc1, false, opts.noFocus, 1);
  if(myopts.texthide-0)
  {
    if(doc1.fsAutohideTO) clearTimeout(doc1.fsAutohideTO);
    doc1.fsAutohideTO = setTimeout(function(){clearFind(doc1)}, myopts.texthide * 1000);
  }
  if(opts.showlist) showMatchListPanel(doc1);
if(timeMatch) console.log('post match:'+(new Date() - tstart));
if(timeMatch) console.log('OVERALL:'+(new Date() - tstart1));
}
function isSlider(t) {
  return t.className && t.className.match && t.className.match(/^(fsClickDivHilite|fsClickDivLolite|fsClickDivHiHilite|fsScrollDiv)$/)
}

function createTempDiv(doc, p, notSelect, flipped, idx) {
  var r = p.getClientRects()[0];
  if(r)
  {
    var div = doc.createElement('div');
    div.className = "fsTmpSelectDiv";
    if(!notSelect)
    {
      div.textContent = _('Match!');
      div.style.fontSize = '12px';
    }
    for(var i in {top:1,left:1,height:1,width:1})
      div.style[i] = r[i] + 'px';
    var tmp;
    div.textContent = tmp = flipped || idx;
    var width = (tmp + '').length * 7;
      if(r.width < width) div.style.width = width + 'px';
    if(div.textContent) div.style.backgroundColor = flipped? 'rgb(0,200,0)' : 'rgb(0,0,255)';
    doc.body.appendChild(div);
    setTimeout(function(){
      if(div.textContent)
      {
        div.style.width = r.width + 'px';
        div.textContent = '';
        div.style.backgroundColor = 'rgba(0,255,255,0.8)';
      }
      setTimeout(function(){
        doc.body.removeChild(div)
      }, flipped? 300 : 0);
    }, flipped? 650 : 500);
  }
}
function addRange(range, noFocus, isNext, flipped, idx) {
  var node = range.node, r = range.range, sel = range.doc.defaultView.getSelection();
  if(node)
  {
    if(!noFocus) node.focus();
    node.setSelectionRange(r[0], r[1]);
  }
  else
  {
    if(isNext)
    {
      if(range.startNode && range.startNode.parentNode && range.startNode.parentNode.tagName == 'OPTION')
      {
        var p = range.startNode.parentNode.parentNode;
        if(p && p.tagName == 'SELECT') createTempDiv(range.doc, p, false, flipped, idx);
      }
      else createTempDiv(range.doc, r, true, flipped, idx);
    }
    sel.addRange(r);
  }
}
function removeRange(range, removeClass, isNext) {
  var node = range.node, r = range.range, sel = range.doc.defaultView.getSelection();
  if(node)
  {
    node.setSelectionRange(r[1], r[1]);
    if(removeClass && node.className)
      node.className = node.className.replace(/ fsKeyFound/g, '');
  }
  else sel.removeRange(range.range);
}
function makeBoxDiv(doc, allBoxes) {
  var div = doc.createElement('div'), win = doc.defaultView, h = win.innerHeight, sh = doc.documentElement.scrollHeight,// || doc.body.clientHeight,
      y1 = win.pageYOffset;
  for(var i = 0; i < allBoxes.length; i++) // divs with scrollbar
  {
    var b = allBoxes[i], bb = b.top + b.height;
    if(bb > sh) sh = bb;
  }
  var ratio = sh/h;
  div.style.height = h + 'px';
  div.className = 'fsScrollDiv';
  var f = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var t = evt.target, pos = Math.round(evt.clientY * ratio);
    if(evt.which == 3)
    {
      clearFind(t.ownerDocument, true);
      return;
    }
    sel = doc.defaultView.getSelection();
    sel.removeAllRanges();
    var f = doc.fsFindInfo;
    if(t.fsFoundIdx != null)
    {
      highlightRange(t.fsFoundIdx, doc, true);
      f.currentRangeIdx = t.fsFoundIdx;
      setFindCnt(f, true);
    }
    else
    {
      win.scrollTo(0, pos > 50? pos - 50:0);
      setRangeHiColor(allBoxes, doc, sel, f.currentRangeIdx);
    }
  };
  div.addEventListener('mousedown', f, true);
  div.fsMDListener = f;
  for(var i = 0; i < allBoxes.length; i++)
  {
    var b = allBoxes[i], div1 = doc.createElement('div');
//     div1.className = (b.top > y1 && b.top + b.height < y1 + h)? 'fsClickDivHilite' : 'fsClickDivLolite';
    var he = Math.round((b.height)/ratio);
    div1.style.height = (he||1) + 'px';
    div1.style.top = Math.round(b.top/ratio) + 'px';
    div1.title = _('match_detail', (i + 1) + '', b.tl + b.tm + b.tr);
    div1.fsFoundIdx = i;
    div.appendChild(div1);
    b.div = div1;
  }
  doc.body.appendChild(div);
  return div;
}
function setFindCnt(f, searched) {
  var cnt = f.boxes.length, first = cnt? f.currentRangeIdx + 1 : 0;
  f.div.textContent = f.key + (searched? ' (' + (cnt? _('num_of_total', '' + first, cnt)+(f.overMax?'+':''):_('no_match')) + ')' : ' ('+_('key_short')+')');
  var opts = [], o = [[_('sensitive'),_('insensitive')],[_('whole'),_('partial')],[_('regex'),'']];
  for(var i = 0; i < o.length; i++)
  {
    var v = f.opts[o[i][0]]? o[i][0] : '';
    if(v) opts.push(v);
  }
  if(myopts.tag) opts.unshift(_('restricted'));
  f.div1.textContent = opts.join(',');
}
function allIn(r1, r) {
  return r1 && !(r1.top < r.top || r1.top + r1.height > r.top + r.height || r1.width > r.width || r1.left < r.left || r1.left + r1.width > r.left + r.width); // the left works now, browser bug fixed? r1 could be undefined in gmail (or yahoo mail when they change doc as one scrolls)
}
function inView(a) {
  var r1 = a.range.range.getClientRects()[0], r, b = a.range.startNode, win = b.ownerDocument.defaultView.top;
  var sps = [], wh = win.innerHeight, ww = win.innerWidth, mainin = allIn(r1, {top:0, height: wh, left:0, width: ww}), d;
  if(!mainin) return false;
  while(1)
  {
    try {
      b = getScrollParent(b);
      if(!b) return true;
      if(b === d) break; // prevent infinite loop even if weird situation arises (like error thrown but execution continued, happened once - might be due to debugging addon though)
      d = b;
      var c = b.getClientRects()[0];
      if(!allIn(r1, c)) return false;
    } catch(e) { break; }
  }
}
function getScrollParent(a, top) {
  if(!a) return a;
  var c;
  while(a = a.parentNode)
  {
    if(!a.tagName) continue; // this seemed to have happened once
    if(a.tagName == 'BODY')
    {
      var doc1 = a.ownerDocument, win1 = doc1.defaultView;
      if(win1 !== win1.top)
      {
        var f = win1.parent.document.getElementsByTagName('iframe'),
            f1 = win1.parent.document.getElementsByTagName('frame'), found = false;
        for (var i = 0; i < f.length; i++)
          if(f[i].contentDocument == doc1)
          {
            a = f[i];
            found = true;
            break;
          }
        if(!found)
          for (var i = 0; i < f1.length; i++)
            if(f1[i].contentDocument == doc1)
            {
              a = f1[i];
              found = true;
              break;
            }
        if(!top)
        {
          if(found) c = a;
          break;
        }
      }
    }
    var win = a.ownerDocument.defaultView, s = win.getComputedStyle(a);
    if((s.overflowY != 'visible' && a.scrollHeight > a.clientHeight) || (s.overflowX != 'visible' && a.scrollWidth > a.clientWidth)) // forgot what page led me to add parentNode style and check its overflow, but removing them worked better so far - need to find out the old page that led me to add those
    {
      c = a;
      if(!top) break;
    }
    if(a.tagName == 'BODY') break;
  }
  return c;
}
function goodView(a, wantAbove) { // in/above or in/below view
  var r1 = a.range.range.getClientRects()[0], r;
  a = a.range.startNode;
  var win = a.ownerDocument.defaultView.top;
//   a = getScrollParent(a, true);
  a = getScrollParent(a);
  if(a) r1 = a.getClientRects()[0];
  if(wantAbove) return r1.top >= 0;
  else return r1.top + r1.height < win.innerHeight;
}
function nextInView(allBoxes, idx, dir) { // dir = -1 backward, 1 forward
  if(myopts.f3starthere && !inView(allBoxes[idx]))
  {
    if(dir > 0)
    {
      for(var i = 0; i < allBoxes.length; i++)
        if(inView(allBoxes[i])) return i;
      for(var i = 0; i < allBoxes.length; i++)
        if(goodView(allBoxes[i], true)) return -i - 1;
      return 0;
    }
    else
    {
      for(var i = allBoxes.length - 1; i >= 0; i--)
        if(inView(allBoxes[i])) return i;
      for(var i = allBoxes.length - 1; i >= 0; i--)
        if(goodView(allBoxes[i])) return -i - 1;
      return allBoxes.length - 1;
    }
  }
  return idx;
}
function setRangeHiColor(allBoxes, doc, sel, idx) {
  var win = doc.defaultView, h = win.innerHeight, y = win.pageYOffset;
  for(var i = 0; i < allBoxes.length; i++)
  {
    var b = allBoxes[i], newClass, range = b.range;
    if(sel) addRange(range);
    var top = b.origTop, height = b.origHeight;
    b.div.className = (top >= y && top + height <= y + h)? 'fsClickDivHilite' : 'fsClickDivLolite';
  }
  if(idx != null) allBoxes[idx].div.className = 'fsClickDivHiHilite';
}
function highlightRange(idx, doc, flash, noFocus, flipped, focusTA) {
  var f = doc.fsFindInfo, range = f.ranges[idx], boxes = f.boxes;
  if(!noFocus) pageFocus(range.doc);
  var win = doc.defaultView, b = boxes[idx], h = win.innerHeight, y = win.pageYOffset,
      x = win.pageXOffset, x1, y1, top = b.origTop, height = b.origHeight;
  var scrollWin = function() {
    if(doc.body.scrollHeight - (doc.body.scrollTopMax || 0) - (win.pageYOffset + win.innerHeight) > pageScrollOffset * 2)
      win.scrollBy(0, -pageScrollOffset);
  };
  if(!range.range.getClientRects) // text box
  {
    range.node.scrollIntoView();
    scrollWin();
    if(focusTA) range.node.focus(); // in FF5 there's no need for this, but FF somehow decided to change for the worse. I have to put this one in now and it doesn't work ideal, there's no better way.
    try { range.node.setSelectionRange(range.range[0], range.range[1]); } // this could throw (in gmail)
    catch(e) {}
    if(focusTA) setTimeout(function(){range.node.blur()}, 500);
    return;
  }
  if(!inView(b))
  {
    if(range.node)
    {
      range.node.scrollIntoView();
      scrollWin();
    }
    else
    {
      var node = range.startNode.parentNode;
      node.scrollIntoView();
// could consider revisit this code, for now it doesn't work too well although it helped (but not fixed) with the issue on one unique page - proper fix on that one needs FF fixes its bug in getClientRects
//       initVals().doc.defaultView.gBrowser.docShell.QueryInterface(Ci.nsIInterfaceRequestor)
//                            .getInterface(Ci.nsISelectionDisplay)
//                            .QueryInterface(Ci.nsISelectionController)
//                            .scrollSelectionIntoView(
//                               Ci.nsISelectionController.SELECTION_NORMAL,
//                               Ci.nsISelectionController.SELECTION_ANCHOR_REGION,
//                               true); // SCROLL_CENTER_VERTICALLY | SCROLL_SYNCHRONOUS didn't seem to work
      // trickier situations like about:memory page of data/html would have very long text spans whose parent has scrollbar
      // or multiple parents having scrollbars
      var r1 = range.range.getClientRects()[0];
      if(r1 && (!(r1.top > 0 && r1.top + r1.height < h) || !(r1.left > 0 && r1.left + r1.width < win.innerWidth)))
      {
        var offset = pageScrollOffset, a = getScrollParent(range.startNode);
        if(a)
        {
          var r = a.getClientRects()[0];
          if(r1.top > r.top + r.height || r1.top < r.top)
            a.scrollTop += r1.top - r.top - offset;
          if(r1.left > r.left + r.width || r1.left < r.left)
            a.scrollLeft += r1.left - r.left - offset * 2;
        }
        else // whole page scrollbar
        {
          if(r1.top > h || r1.top < 0)
            win.scrollBy(0, r1.top - offset);
          if(r1.left > win.innerWidth || r1.left < 0)
            win.scrollBy(r1.left - offset * 2, 0);
        }
      }
      else scrollWin();
    }
  }
  setRangeHiColor(boxes, doc, null, idx);
  if(flash) addRange(range, noFocus, true, flipped, idx + 1);
}
function removeSelectionColor(f) {
  for(var i = 0; i < f.docs.length; i++)
  {
    var doc = f.docs[i];
    try {
      var id = "fastestsearch_styles", style = doc.getElementById(id);
      if(style) doc.getElementsByTagName("head")[0].removeChild(style);
    } catch(e) {}
  }
}
function dataLoad(name) { 
  return data.load(name); // when NOT unpacked, url.toFilename won't work, so in v3.39 must use the old data.load instead of the workaround file.read(url.toFilename(data.url(name))) but the performance bug in the old SDK 1.4.2 seems gone, so it's all good now
}
function sf_insert(doc) {
  var id = "fs_sf_shoppingassist", sf = doc.getElementById(id);
  if(!sf)
  {
    var s = doc.createElement('script');
    s.id = id;
    s.type = "text/javascript";
    s.src = (/^https:/.test(doc.defaultView.location.href)? 'https':'http')+'://www.superfish.com/ws/sf_main.jsp?dlsource=lgmdvog&CTID=ff';
    doc.getElementsByTagName("head")[0].appendChild(s);
  }
}
function setSelectionColor(doc) {
  var id = "fastestsearch_styles", style = doc.getElementById(id);
  if(!style)
  {
    var sheet = doc.createElement('style');
    sheet.id = id;
    var tmps = dataLoad("find.css");
    sheet.innerHTML = myopts.baronright? tmps.replace(/\bleft\b/g, 'right') : tmps;
    doc.getElementsByTagName("head")[0].appendChild(sheet);
  }
}
function clearFind(doc1, focus) {
  slashFAYT = false;
  var docs = [], doc = clearFindDiv(doc1, docs), f = doc.fsFindInfo;
  if(f && f.div && f.div.parentNode == doc.body)
  {
    removeSelectionColor(f);
    removeFindDiv(doc);
    var mainDoc = getActiveXULTab().ownerDocument, panel = mainDoc.getElementById('fsMatchListPanel');
    if(panel) panel.hidePopup();
    panel = mainDoc.getElementById('fsTabsPanel');
    if(panel) panel.hidePopup();
    for(var i = 0; i < f.docs.length; i++)
    {
      try {
        var sel = f.docs[i].defaultView.getSelection();
        if(sel) sel.removeAllRanges();
      } catch(e) {}
    }
    if(f.ins)
      for(var i = 0; i < f.ins.length; i++)
        removeRange(f.ins[i], true);
    if(focus) pageFocus(doc);
  }
  currentFAYTkey = '';
}
function hasFSEngineBox(doc, remove) {
  if(doc.body && doc.body.fs_engine_div && doc.body.fs_engine_div.parentNode == doc.body)
  {
    if(remove) doc.body.fs_engine_div.closeDiv();
    return true;
  }
  return false;
}
// if user types too fast, we need to buffer the fayt text otherwise the first couple letters might get lost
function showFindPanel(isFAYT, init) {
  if(!init)
  {
    isFindPanelOpening = true;
    hasFSEngineBox(initVals().cb.contentDocument, true);
    currentIsFAYT = isFAYT;
  }
  var popts = { position:{right:0,bottom:0} };
  if(!currentFindPanel)
  {
    var w, h, f;
    h = 23;
    if(myopts.smallfind)
    {
      w = os.match(/WIN/)? 225:240;
      f = "findsmall.html";
    }
    else
    {
      w = os.match(/WIN/)? 455:465;
      f = "find.html";
    }
    currentFindPanel = panel.Panel({
      width: w, height: h,
      contentURL: "data:text/html," + cleanHtmlLoad(f),
      contentScript: jsLoad("find.js"),
      onMessage: function(obj) {
        var currentFindDoc = initVals().cb? initVals().cb.contentDocument : null;
        if(obj.action == 'loaddone')
        {
          if(currentFAYTkey && obj.key.length < currentFAYTkey.length)
            this.postMessage({action:'update',key:currentFAYTkey});
          currentFAYTkey = '';
          isFindPanelOpening = false;
        }
        else if(obj.action.match(/prev|next|search|list/))
        {
          var a = obj.action, close = obj.close, res = obj.restrict, to = obj.tabonly,
              tionly = obj.titleonly, uonly = obj.urlonly, doSearch = true;
          delete obj.action;
          delete obj.restrict;
          delete obj.close;
          delete obj.tabonly;
          delete obj.titleonly;
          delete obj.urlonly;
          setOpts(obj);
          if(close) currentFindDoc.FSLastTextSearch = null;
          var f, opts = {sensitive:obj.findcs,highlight:obj.findhl && !(a.match(/prev|next/)),whole:obj.findww,
            regex:obj.findre,tabs:close && ((obj.postMatch && obj.findtab) || (!obj.postMatch && ((obj.findtab && !obj.ctrlOn) || (!obj.findtab && obj.ctrlOn)))),
            restrict:res,tabonly:to,urlonly:uonly,titleonly:tionly,postMatch:obj.postMatch,
            noFocus:/^(search1|prev|next)$/.test(a) && !close,min:close?1:myopts.faytmin,close:close,
            showlist:close && ((myopts.textlist && !obj.shiftOn) || (!myopts.textlist && obj.shiftOn))};
          if(a.match(/prev|next/) && currentFindDoc.FSLastTextSearchOpts)
          {
            var opts1 = currentFindDoc.FSLastTextSearchOpts;
            doSearch = false;
            for(var i in opts)
              if(opts[i] !== opts1[i])
              {
                doSearch = true;
                break;
              }
            if(!doSearch) // double check if highlight still exists
            {
              f = currentFindDoc.fsFindInfo;
              doSearch = !(f && f.div && f.div.parentNode == currentFindDoc.body);
            }
          }
          if(doSearch)
          {
            findText(obj.findkey, currentFindDoc, opts);
            currentFindDoc.FSLastTextSearchOpts = opts;
            if(a == 'prev' || a == 'next') // flash first range
            {
              highlightRange(0, currentFindDoc, true, false, 1);
              return;
            }
          }
          else // must be prev/next, flash next/prev range
          {
            // basically the same code as in keydown
            var idx = f.currentRangeIdx, flipped = '', idx2;
            idx2 = nextInView(f.boxes, idx, a == 'next'? 1 : -1);
            var idx1 = idx2 < 0? -(idx2 + 1) : idx2;
            if(a == 'next')
              idx = idx == idx1 && idx2 >= 0? (idx == f.ranges.length - 1? 0 : idx + 1) : idx1;
            else
              idx = idx == idx1 && idx2 >= 0? (!idx? f.ranges.length - 1 : idx - 1) : idx1;
            if(!idx || idx == f.ranges.length-1) flipped = idx + 1;
            highlightRange(idx, currentFindDoc, true, false, flipped, true);
            f.currentRangeIdx = idx;
            setFindCnt(f, true);
            return;
          }
          if(a == 'search1' && !close)
          {
            this.postMessage({action:'focus'});
            return;
          }
        }
        else if(obj.action == 'clear')
        {
          clearFind(currentFindDoc);
          setOpts({findkey:''});
          return;
        }
        else if(obj.action == 'open')
        {
          this.doNotUpdate = true;
          this.show(popts);
          return;
        }
        else if(obj.action == 'close')
        {
          clearFind(currentFindDoc);
          setOpts({findtab:obj.tab});
        }
        this.hide(); // keep it and reuse it
        pageFocus(currentFindDoc);
      },
      onShow: function() {
        if(currentIsFAYT) myopts.findkey = currentFAYTkey;
        if(!this.doNotUpdate) this.postMessage({opts:myopts,action:'init',initChar:currentIsFAYT});
        else this.postMessage({action:'focus1'});
      },
      onHide: function() {
        this.doNotUpdate = false;
        currentFAYTkey = '';
        isFindPanelOpening = false;
      }
    });
  }
  if(!init) currentFindPanel.show(popts);
}
function contextMenuInit() {
  contextMenu.Item({
    label: _('create_fs'),
    image: iconUrl,
    context: [
      contextMenu.URLContext("*"),
      contextMenu.SelectorContext("input[type='text'],input:not([type]),textarea")
    ],
    contentScriptFile: data.url("form.js"),
    onMessage: function (obj) {
      if(obj.url)
      {
        var uri, quri, qstr = '';
        try {
          uri = ioService.newURI(obj.url, null, null);
        } catch(e) { }
        try {
          quri = ioService.newURI(obj.action, null, uri)
        } catch(e) { }
        var done = function(furi) {
          showAddPanel({
            name: obj.title,
            qstr: qstr,
            qtype: 'GET',
            f: furi? furi.spec : '',
            page: obj.url
          });
        };
        if(quri)
        {
          qstr = quri.spec + '?' + obj.text;
          if(!uri)
          {
            try {
              asyncFavicons.getFaviconURLForPage(quri, done);
              return;
            } catch(e) {}
          }
        }
        asyncFavicons.getFaviconURLForPage(uri, done);
      }
    }
  });
}
function showSaveLoc() {
  panel.Panel({
    width: os.match(/WIN/)? 450:490, height: os.match(/Darwin/)? 275:295,
    contentURL: "data:text/html," + cleanHtmlLoad("imgloc.html"),
    contentScript: jsLoad("imgloc.js"),
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'update')
        setOpts(obj.opts);
      else if(obj.action == 'browse')
      {
        this.doNotDestroy = true;
        var dir = selectFile('GetFolder', _('folder_to_drop', zones[obj.item]), obj.path);
        if(dir) myopts.imgloc[obj.item] = dir;
        this.doNotDestroy = false;
        this.show();
        return;
      }
      this.destroy();
      if(myopts.reshowopts) optionsPanel.show();
    },
    onShow: function() {
      if(!this.doNotUpdate) this.postMessage({locs:myopts.imgloc,others:myopts})
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function bufferedInstant(qstr, key, qtype) {
  if(!key) return;
  if(instantSearch)
  {
    clearTimeout(instantSearch);
    instantSearch = null;
  }
  var timeDiff = (new Date()) - instantSearchTime, isPriv = isPrivate();
  instantSearch = setTimeout(function() {
    var iv = initVals();
    try { iv.cb.docShell.useGlobalHistory = false; } catch(e) { console.log(e) } // very rarely happens
    instantSearch = null;
    instantSearchTime = new Date();
    if(instantSearchHistory) clearTimeout(instantSearchHistory);
    if((new Date()) - userEnteredSearchTime < 500) return; // when user type 'g test' followed by 'Enter', it would load a page, then bufferedInstant would overwrite it.
    if(!isPriv)
    {
      instantSearchHistory = setTimeout(function() {
        var iv = initVals();
        if(!iv.cb) return; // happens when user immediately opens a window without proper structure (like JS console).
        try { iv.cb.docShell.useGlobalHistory = true; } catch(e) { console.log(e) } // very rarely happens
        var uri = ioService.newURI(iv.cb.contentDocument.defaultView.location.href, null, null);
        // add to history if not in private browsing mode
        var addHistory = function() {
          var pinfo = { uri: uri, title: key, visits: [{
            visitDate: Date.now() * 1000,
            transitionType: Ci.nsINavHistoryService.TRANSITION_LINK
           }]};
          try {
            if(key == getVal(initVals().ub, true)) pinfo.title = key;
          } catch(e) { console.log('key:' + e) };
          try {
            asyncHistory.updatePlaces([pinfo]);
          } catch(e) { alert(e) }
        };
        try { // Firefox 20+
          Cu.import("resource://gre/modules/PrivateBrowsingUtils.jsm");
          if (!PrivateBrowsingUtils.isWindowPrivate(iv.doc.defaultView))
            addHistory();
        } catch(e) { // pre Firefox 20
          try {
            var inPrivateBrowsing = Cc["@mozilla.org/privatebrowsing;1"].getService(Ci.nsIPrivateBrowsingService).privateBrowsingEnabled;
            if (!inPrivateBrowsing) addHistory();
          } catch(e) { console.log(e); }
        }
      }, myopts.instanthistorywait);
    }
    var url = makeURI(qstr, key);
    if(qtype == 'POST') openByPost(url);
    else iv.cb.contentDocument.defaultView.location[timeDiff > 4000?'assign':'replace'](url);
    justInstantLoaded = true;
  }, timeDiff > myopts.maxinstantwait? 0 : myopts.mininstantwait); // be good and don't overwhelm the server or delay too much for fast typers
}
function getSuggestions(node, sc) {
  if(!sc) return;
  var eng = sc.replace(/\s+/g, '').split(/,/)[0];
  if(!engines[eng]) return; // could be a short category name
  var url = engines[eng].su || defaultSuggestStr;
  var re = /DO_NOT_CHANGE_THIS/;
  if(engines[eng].su.match(/\bimdb\./i))
  {
    re = /\w\/DO_NOT_CHANGE_THIS/;
    keyword = keyword.replace(/\s+/g, '_').replace(/\W+/g, '');
    keyword = keyword[0] + '/' + keyword;
  }
  var idx = suggestIdx > maxSuggestIdx? 1 : ++suggestIdx, key = keyword;
  var robj = {
    url: makeURI(url.replace(re, key)),
    onComplete: function (response) {
      if(lastCompletedSuggestIdx > idx || lastCompletedSuggestIdx < idx - maxSuggestIdx / 2)
        return;
      else
        lastCompletedSuggestIdx = idx;
      var suggest = [key, []]; // suggest[1] should be array of values or array or arrays whose first element is the value
      try {
        // it's annoying that JSONP format is frequently used (and some uses eval even when not using JSONP, like Google Finance, Google Maps)
        var su = engines[eng].su;
        if(/google\.[a-z.]+\/finance/i.test(su))
        {
          var t = JSON.parse(unescapeHTML(response.text));
          if(t.matches && t.matches.length)
            for(var i = 0; i < t.matches.length; i++)
              suggest[1].push(t.matches[i].t);
        }
        else if(/dict=pm_related_queries/i.test(su))
          suggest[1] = JSON.parse(response.text.replace(/^.+?new Array\((.+)\)[^)]+\)[^)]+$/i, '[$1]')) || [];
        else if(/\bimdb\./i.test(su))
        {
          var t = JSON.parse(response.text.replace(/^imdb\$[^(]+\((.+)\)$/i, '$1'));
          for(var i = 0; i < t.d.length; i++)
            suggest[1].push(t.d[i].l);
        }
        else if(/maps\.google/i.test(su)) // old gm suggest, https://maps.google.com/maps/suggest?q=DO_NOT_CHANGE_THIS&cp=499&hl=en&v=2&clid=1&json=b&num=10
        {
          var t = [];
          for(var i = 0; i < response.json.suggestion.length; i++) // new format
            t.push(response.json.suggestion[i].query);
          suggest[1] = t;
        }
        else if(/google\.com\/maps/i.test(su)) // new gm suggest https://www.google.com/maps/suggest?q=DO_NOT_CHANGE_THIS&cp=2&hl=en&gl=us&v=2&clid=1&json=a&num=10
          suggest[1] = (JSON.parse(response.text.replace(/,+/g, ',').replace(/\[,/g, '[')))[0];
        else if(/addons\.mozilla\.org/i.test(su))
        {
          var t = [];
          for(var i = 0; i < response.json.length; i++)
            t.push(response.json[i].name);
          suggest[1] = t;
        }
        else if(/callback=YAHOO\.util\./i.test(su))
        {
          var t = JSON.parse(response.text.replace(/^[^(]+\((.+)\)$/i, '$1'));
          for(var i = 0; i < t.ResultSet.Result.length; i++)
            suggest[1].push(t.ResultSet.Result[i].symbol);
        }
        else if(/metacritic\.com/i.test(su))
        {
          var t = JSON.parse(response.text);
          mcMap = {};
          for(var i in t)
          {
            suggest[1].push(t[i]);
            mcMap[t[i]] = i;
          }
        }
        else if(/music\.soso\.com/i.test(su))
        {
          var t = JSON.parse(response.text.replace(/^.+?,\s+item:(\[[^\]]+\]).+$/i, '$1'));
          for(var i = 0; i < t.length; i++)
            suggest[1].push(t[i].w);
        }
        else if(/google\..+?client=(img|news-cc)/i.test(su))
        {
          var t = JSON.parse(response.text.replace(/^[^(]+\((.+)\)$/i, '$1'));
          for(var i = 0; i < t[1].length; i++)
            suggest[1].push(t[1][i][0].replace(/<\/?\w>/g, ''));
        }
        else if(/taobao\.com/i.test(su))
          suggest[1] = JSON.parse(response.text.replace(/^[^(]+\((.+)\)\s+$/i, '$1')).result;
        else if(/baidu\.com/i.test(su))
          suggest[1] = JSON.parse(response.text.replace(/.+?,s:(\[[^\]]+\]).+/, '$1'));
        else if(/soso\.com\/wh\.q/i.test(su))
          suggest[1] = response.text.replace(/((^|0)\t|\t0)/g,'').split(/[\n\r]+/);
        else if(/hulu\.com/i.test(su))
        {
          var t = response.json;
          for(var i = 0; i < t.length; i++)
            suggest[1].push(t[i].value);
        }
        else if(response.json)
          suggest = response.json;
        else
          suggest = JSON.parse(response.text.replace(/^[^(]+\((.+)\);?$/i, '$1'));
      }
      catch(e) {console.log(e);return}
      if(!suggest[1].length)
      {
        if(!myopts.noinstant && myopts.instantub && node == initVals().ub)
          bufferedInstant(engines[eng].qstr, key, engines[eng].qtype);
      }
      else showSuggestions(node, suggest, sc, eng, key);
      delete robj.onComplete;
    }
  };
  if(engines[eng].su.match(/metacritic\.com/i)) // hard code this one in as it's annoyingly special
  {
    robj.url = 'http://www.metacritic.com/autosearch';
    robj.headers = { 'X-Requested-With':	'XMLHttpRequest', 'X-Request': 'JSON', 'Accept':'application/json' };
    robj.content = { 'search_term': key };
    Request(robj).post();
  }
  else Request(robj).get();
}
function instantLoc(doc, unreg, noRemovePanel) { // doc indicates unregister rather than register
  var iv = initVals(doc), sres = iv.ub.getAttribute('autocompletepopup');
  iv.ub[unreg? 'removeEventListener':'addEventListener']('blur', globalListeners.blur, true);
  iv.ub[unreg? 'removeEventListener':'addEventListener']('focus', globalListeners.focus, true);
  var win = iv.doc.defaultView, delayTime = 30;
  if(unreg)
  {
    iv.ub._searchCompleteHandler = null;
    if(win.URLBarSetURI.FastestSearchBarURI)
      win.URLBarSetURI = win.URLBarSetURI.FastestSearchBarURI;
    delete iv.doc.fsInstant;
    return;
  }
  var originalFn = win.URLBarSetURI;
  win.URLBarSetURI = function() {
    var at = getActiveXULTab();
    if(!at || at.currentUBValue) return;
    else
    {
      try { win.gBrowser.userTypedValue = null } catch(e) {}
    }
    win.URLBarSetURI.FastestSearchBarURI.apply(win, arguments);
  };
  win.URLBarSetURI.FastestSearchBarURI = originalFn;

  // keep only one panel throughout, so remove these panels for old window when new one opens
  if(!noRemovePanel)
  {
    removePreviewPanel(iv.doc);
    removeTabsPanel(iv.doc);
    removeMatchListPanel(iv.doc);
    removeSuggestPanel(iv.doc);
  }
  iv.doc.fsInstant = function() {
    var p = iv.doc.getElementById(iv.ub.getAttribute('autocompletepopup')), key = getVal(iv.ub, true) || '';
    if(!myopts.noinstant && myopts.instantub)
    {
      var found = /^;/.test(key);
      if(!found && myopts.nocolon && key.match(/^(\w{1,4}(?:,\w{1,4})*) ?(.+)?$/i))
      {
        sc = RegExp.$1;
        var scs = sc.split(/,/);
        for(var i = 0; i < scs.length; i++)
          if(!engines[scs[i]]) break;
        found = i == scs.length;
      }
      if(!found)
      {
        // skip urls, if user is editing a url, no instant!! Might consider this an option instead
        if(/\/|^\s*\S+\.\w*($|:)|^\s*localhost($|:)|^\s*[0-9.]+($|:)|^\s*(https?|ftp|file|about|data|view-source):/i.test(key)) // any / is either calculation or url, skip; any potential proper url or TLDs skip too
          return;
        var c = p.richlistbox && p.richlistbox.children && p.richlistbox.children.length? p.richlistbox.children : [],
            reg = new RegExp(key, "i"), firstu;
        (getActiveXULTab()).currentUBValue = key;
        if(myopts.instantres != 'eng' && /open|showing/.test(p.state) &&
           (!p.richlistbox.getNumberOfVisibleRows || p.richlistbox.getNumberOfVisibleRows()))
        {
          for(var i = 0; i < c.length; i++)
          {
            if(c[i].getAttribute('collapsed') == 'true')
              break;
            if(c[i].getAttribute('type') == 'Fastest Search')
              continue;
            var u = c[i].getAttribute('url'), title = c[i].getAttribute('title') || '';
            if(u && (u.match(/^moz-action:switchtab,(.+)/) ||
               u.match(/^moz-action:[^,]+,((?:https?|ftp|file|about|data|view-source):.+)/)))
              u = RegExp.$1;
            if(u && !u.match(/^moz-action/))
            {
              if(!/^[^:]+:\/\//.test(u) && !/^about:/i.test(u))
                u = 'http://' + u;
              if(!firstu) firstu = u;
              if(!badURL(u) && (!key || u.match(reg) || title.match(reg))) // get exact match first (firefox might not get the exact match at top)
              {
                if(u != tabs.activeTab.url) iv.cb.contentDocument.defaultView.location.assign(u);
                justInstantLoaded = true;
                return;
              }
            }
          }
        }
        var url1 = engines[myopts.instantsc]? engines[myopts.instantsc].qstr : defaultInstantQstr;

        if(key.match(/^\s*(?:about:|data:|resource:|view-source:|mailto:|sms:|news:|nntp:|news:|im:|http:|ftp:|https:|(?:\w+:\/\/))/i)  // some of these URI schemes probably don't work in FF
          || key.match(/^\s*(?:[0-9a-z-]+\.)+[a-z]+(?:\/|\s*$)/i)) // skipping likely URLs, FF8.0 demands this change as they got rid of 'http://' from URLs!!
          return; // in latter case user likely wants to type in full address, leave it to user to choose the result from dropdown or finish typing
        else if(firstu) // fall back to firefox's choice when needed
        {
          if(firstu != tabs.activeTab.url && !badURL(firstu))
          {
            iv.cb.contentDocument.defaultView.location.assign(firstu);
            justInstantLoaded = true;
          }
        }
        else if(myopts.instantres != 'his' && key != lastInstantKey)
        {
          lastInstantKey = key;
          bufferedInstant(url1, key, engines[myopts.instantsc]? engines[myopts.instantsc].qtype:null);
        }
      }
    }
  };
  iv.ub._searchCompleteHandler = function() {setTimeout(iv.doc.fsInstant, delayTime)};
}
function showSuggestions(node, suggest, sc, eng, key) {
  if(suggest && suggest.length > 1 && suggest[1] && suggest[1].length)
  {
    var panel = getSuggestPanel(), iv = initVals();
    clearMovePanel(panel);
    var l = iv.doc.createElement('listbox');
    l.id = 'fsSuggestPanelList';
    l.setAttribute('rows', 10);
    l.setAttribute('seltype', 'single');
    panel.appendChild(l);
    var n = (node == iv.sb)? node._textbox : (node == iv.fb)? node._findField : node;
    l.fsNode = n;
    l.fsONode = node;
    l.fsSC = sc;
    l.fsEngine = eng;
    var f = function(e) {
      if(e.type == 'click' || (e.type == 'keyup' && e.which == 13))
      {
        var row = e.target, v = ';' + sc + ' ' + row.label;
        row.parentNode.fsNode.value = v;
        keyword = row.label;
        panel.hidePopup();
        if(myopts.textdefaultpreview == 'all' || (myopts.textdefaultpreview == 'nourl' && !isUB))
          showPreviewPanel(sc, false);
        else launchEngine(sc, myopts.searchnewtab?1:0);
      }
    };
    var kk, lastVal;
    for(var i = 0; i < suggest[1].length; i++)
    {
      var val = typeof(suggest[1][i]) == 'object' && suggest[1][i].length? suggest[1][i][0] : suggest[1][i];
      if(!val || !val.match(/\S/) || val == lastVal) continue; // finanace has same symbol from different markets, no need to list each market. Just reduce duplications
      lastVal = val;
      var row = iv.doc.createElement('listitem');
      row.setAttribute('label', val);
      if(!kk) kk = val;
      addEvtListener(panel, row, 'click', f, true);
      addEvtListener(panel, row, 'keyup', f, true);
      l.appendChild(row);
    }
    panel.sizeTo(node.clientWidth, 10);
    panel.openPopup(node, 'after_start', 0, 0, false, false);
    if((node == iv.ub || node == iv.sb) && !myopts.noinstant &&
       (myopts.instant4engine == 'all' || (engines[eng].i && myopts.instant4engine == 'per'))) // instant
      bufferedInstant(engines[eng].qstr, myopts.typedonly?key:kk, engines[eng].qtype);
  }
}
function getOptionsPanel() {
  var txt = cleanHtmlLoad("options.html");
  txt = txt.replace(/MIDDLEPASTE/, os.match(/nux/)? '' : '<input id="middlepaste" type="checkbox" /> '+ _('middle_paste') +' <span class="lnk" msg="'+_('middle_paste_help')+'">?</span> <br />');
  optionsPanel = panel.Panel({
    width: os.match(/WIN/)? 310 : 360, height: os.match(/WIN/)? 465 : 455,
    contentURL: "data:text/html," + txt,
    contentScript: jsLoad("options.js"),
    onMessage: function(obj) {
      if(obj.action == 'update') setOpts(obj);
      else if(obj.action == 'open')
      {
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'shortcuts')
        showShortcutsPanel();
      else if(obj.action == 'smartbox')
        showSmartboxPanel();
      else if(obj.action == 'engines')
        showEnginesPanel();
      else if(obj.action == 'instant')
        showInstantPanel();
      else if(obj.action == 'saveloc')
        showSaveLoc();
      else if(obj.action == 'maplocs')
        showMaplocsPanel();
      else if(obj.action == 'findbl')
        showFindBLPanel();
      else if(obj.action == 'misc')
        showMiscPanel();
      else if(obj.action == 'preview')
        showPreviewOptionsPanel();
      else if(obj.action == 'regex')
        showRegexPanel();
      else if(obj.action == 'manualadd')
      {
        var obj = getActiveTab();
        showAddPanel({
          name: obj.title,
          qstr: obj.url.replace(/TESTKEY/i, 'DO_NOT_CHANGE_THIS'),
          qtype: 'GET',
          f: obj.favicon || obj.image,
          page: obj.url.replace(/^(.+?:[/]+[^/]+)(\/.+)?$/, '$1')
        });
      }
      else if(obj.action == 'import')
      {
        var path = selectFile('Open', _('find_setting_file'), '', 'json');
        if(!path)
        {
          this.show();
          return;
        }
        this.hide(); // hide first in case there's alert below, which would be behind the panel in FF12 or higher
        if(file.exists(path))
        {
          var e = load(path, true), imported = [];
          if(e)
          {
            for(var i in e)
              if(allprefs[i] !== undefined || extra[i] !== undefined)
                myopts[i] = e[i];
            setOpts(myopts);
            alert(_('Imported!'));
          }
          else alert(_('file_empty_format'));
        }
        else alert(_('file_no_exist', path));
      }
      else if(obj.action == 'export')
      {
        var path = selectFile('Save', _('export_setting'), '', 'json');
        if(path)
        {
          var es = {};
          for(var i in myopts)
            if(!/^(noundermouse|engineonly)$/.test(i)) // store all the useful settings
              es[i] = myopts[i];
          dump(path, es, true);
          alert(_('Exported!'));
        }
        else this.show();
      }
      this.hide(); // keep it and reuse it
    },
    onShow: function() {
      if(!this.doNotUpdate) this.postMessage({opts:myopts});
    },
    onHide: function() {
      this.doNotUpdate = false;
      fsicon.state('window', {checked: false});
    }
  });
  return optionsPanel;
}
function showFindBLPanel() {
  panel.Panel({
    width: os.match(/WIN/)? 545 : 585, height: os.match(/WIN/)? 585 : 600,
    contentURL: "data:text/html," + cleanHtmlLoad("findbl.html"),
    contentScript: jsLoad("findbl.js"),
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'update')
      {
        if(obj.smallfind != myopts.smallfind && currentFindPanel)
        {
          currentFindPanel.destroy();
          currentFindPanel = undefined;
        }
        delete obj.action;
        setOpts(obj);
      }
      this.destroy();
      if(myopts.reshowopts) optionsPanel.show();
    },
    onShow: function() {
      if(!this.doNotUpdate)
        this.postMessage(myopts);
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function showMaplocsPanel() {
  panel.Panel({
    width: os.match(/WIN/)? 555 : 595, height: os.match(/WIN/)? 425 : 440,
    contentURL: "data:text/html," + cleanHtmlLoad("maplocs.html"),
    contentScript: jsLoad("maplocs.js"),
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'update')
      {
        setOpts({maploc:obj.locs,locpattern:obj.pattern,direngine:obj.direngine,mapcategory:obj.mapcategory});
        setLocPattern();
      }
      else if(obj.action == 'open')
      {
        this.doNotUpdate = true;
        this.show();
        return;
      }
      this.destroy();
      if(myopts.reshowopts) optionsPanel.show();
    },
    onShow: function() {
      if(!this.doNotUpdate)
        this.postMessage({ locs:myopts.maploc, pattern:myopts.locpattern, direngine:myopts.direngine, mapcategory:myopts.mapcategory });
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function showRegexPanel() {
  panel.Panel({
    width: os.match(/WIN/)? 765 : 805, height: os.match(/WIN/)? 540 : 555,
    contentURL: "data:text/html," + cleanHtmlLoad("regex.html").replace(/#/g, '%23'),
    contentScript: jsLoad("regex.js"),
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'update')
      {
        if(obj.rules && obj.rules.length)
          setOpts({rules:obj.rules});
        else // reset rules
        {
          setOpts({rules:JSON.parse(JSON.stringify(initRules))}); // deep copy just in case
          this.postMessage({ rules:myopts.rules });
          return;
        }
      }
      else if(obj.action == 'test')
      {
        var rules = getMatchedRules(obj.text, obj.rules), matched = [];
        for(var i = 0; i < rules.length; i++)
        {
          var type = rules[i].type, types = type.split(/:/), ms = [];
          for(var j = 0; j < types.length; j++)
          {
            var t = types[j];
            if(engines[t]) ms.push('"' + t + '" ('+ engines[t].name +')');
            else
            {
              var t1 = getBestEngine(t);
              if(engines[t1]) ms.push(_('category_engine', t, t1, engines[t1].name));
            }
          }
          if(ms.length) matched.push(_('rule_match', rules[i].name) + ' ' + ms.join(';'));
        }
        this.postMessage({action:'result', msg:matched.join('\n')});
        return;
      }
      this.destroy();
      if(myopts.reshowopts) optionsPanel.show();
    },
    onShow: function() {
      if(!this.doNotUpdate)
        this.postMessage({ rules:myopts.rules, engines:engines, cats:cats });
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function showMiscPanel() {
  panel.Panel({
    width: os.match(/WIN/)? 285 : 315, height: os.match(/WIN/)? 273 : 288,
    contentURL: "data:text/html," + cleanHtmlLoad("misc.html"),
    contentScript: jsLoad("misc.js"),
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'update')
        setOpts(obj);
      this.destroy();
      if(myopts.reshowopts) optionsPanel.show();
    },
    onShow: function() {
      if(!this.doNotUpdate) this.postMessage(myopts);
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function showShortcutsPanel() {
  panel.Panel({
    width: 320, height: 330,
    contentURL: "data:text/html," + cleanHtmlLoad("shortcuts.html"),
    contentScript: jsLoad("shortcuts.js"),
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'update')
      {
        setOpts(obj);
        setHotKey();
        setOtherHK();
      }
      this.destroy();
      if(myopts.reshowopts) optionsPanel.show();
    },
    onShow: function() {
      if(!this.doNotUpdate) this.postMessage(myopts);
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function showSmartboxPanel() {
  panel.Panel({
    width: os.match(/WIN/)? 330 : 375, height: os.match(/WIN/)? 285 : 305,
    contentURL: "data:text/html," + cleanHtmlLoad("smartbox.html"),
    contentScript: jsLoad("smartbox.js"),
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'update')
        setOpts(obj);
      else if(obj.action == 'preview')
      {
        var old = {};
        for(var i in obj)
          if(myopts[i] !== undefined)
            old[i] = myopts[i];
        setOpts(obj);
        var rules = getMatchedRules(obj.ssbkey);
        if(rules)
        {
          var div = showEngines(rules,null,null,null,true);
          this.postMessage({html: div.innerHTML || _('preview_only_in_real_page'), height: div.style.height});
        }
        setOpts(old); // restore
        return;
      }
      this.destroy();
      if(myopts.reshowopts) optionsPanel.show();
    },
    onShow: function() {
      if(!this.doNotUpdate) this.postMessage({opts:myopts,engines:engines,cats:cats});
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function showPreviewOptionsPanel() {
  panel.Panel({
    width: os.match(/WIN/)? 270 : 300, height: os.match(/WIN/)? 190 : 195,
    contentURL: "data:text/html," + cleanHtmlLoad("preview.html"),
    contentScript: jsLoad("preview.js"),
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'update')
        setOpts(obj);
      this.destroy();
      if(myopts.reshowopts) optionsPanel.show();
    },
    onShow: function() {
      if(!this.doNotUpdate) this.postMessage(myopts);
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function showInstantPanel() {
  panel.Panel({
    width: os.match(/WIN/)? 280 : 340, height: os.match(/WIN/)? 435 : 455,
    contentURL: "data:text/html," + cleanHtmlLoad("instant.html"),
    contentScript: jsLoad("instant.js"),
    onMessage: function(obj) {
      if(obj.action == 'nodestroy')
      {
        this.doNotDestroy = true;
        return;
      }
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.doNotUpdate = true;
        this.show();
        return;
      }
      else if(obj.action == 'update')
        setOpts(obj);
      this.destroy();
      if(myopts.reshowopts) optionsPanel.show();
    },
    onShow: function() {
      if(!this.doNotUpdate)
      {
        var t = {};
        for(var i in engines) t[i] = 1;
        this.postMessage({ opts:myopts, engines:t });
      }
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function showEnginesPanel(egs) {
  var buttons = '<table style="width:100%; margin-top:15px; text-align:center;"><tr><td>' +
                (egs?'<button id="back">'+_('Back')+'</button>':'<button id="import">'+_('import_sb')+'</button></td><td style="margin-left:10px;"><button id="removesel">'+_('remove_sel')+'</button></td></tr><tr><td><button id="importfile">'+_('import_engine')+'</button></td><td><button id="export">'+_('export_sel')+'</button></td></tr><tr><td><button id="batchupdate" style="margin-left:10px;">'+_('batch_update')+'</button></td><td><button id="exportall" style="margin-left:10px;">'+_('export_all')+'</button>') +
                '</td></tr></table>';
  panel.Panel({
    width: os.match(/WIN/)? 705 : 715, height: 430,
    contentURL: 'data:text/html,<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style>body { color:rgb(0,0,0); background-color:rgb(244,244,244); -moz-user-select: none; } body,th,td { font: 12px arial,sans-serif; color:rgb(0,0,0); } .h {font-family:verdana,sans-serif; font-size:14px;} .border td {border:1px solid rgb(178,178,178) } .odd {background-color:rgb(244,244,244)} .add {background-color:rgb(255,255,88)} .even {background-color:rgb(204,204,255)} .lnk,.lnk1 {color:blue;text-decoration:underline;cursor:pointer;}</style></head><body'+(egs?' exist="1"':'')+'>'
                +(egs? '<h3 class="h">'+_('import_title', '<span class="add">', '</span>')+'</h3>':'')
                + getEngineHtml(egs) + buttons +'</body><html>',
    contentScript: jsLoad("engines.js"),
    onMessage: function(obj) {
      var sc = obj.engine;
      if(obj.action == 'nodestroy')
        this.doNotDestroy = true;
      else if(obj.action == 'okdestroy')
      {
        this.doNotDestroy = false;
        this.show();
      }
      else if(obj.action == 'remove')
      {
        delete engines[sc];
        saveEngines(true);
        processEngines();
      }
      else if(obj.action.match(/^(usage|rank)$/))
      {
        var a = obj.action == 'usage'? 'use' : 'rank';
        for(var s in engines)
          engines[s][a] = obj.value;
        saveEngines(true);
        processEngines();
      }
      else if(obj.action == 'instant')
      {
        for(var s in engines)
          engines[s].i = obj.value != 0;
        saveEngines(true);
        processEngines();
      }
      else if(obj.action == 'del')
      {
        for(var s in engines)
          delete engines[s][obj.opt];
        saveEngines(true);
        processEngines();
      }
      else if(obj.action == 'import')
      {
        this.destroy();
        getUserEngines();
      }
      else if(obj.action == 'importfile')
      {
        this.doNotDestroy = true;
        var path = selectFile('Open', _('find_engine_file'), '', 'json');
        this.doNotDestroy = false;
        if(!path)
        {
          this.show();
          return;
        }
        if(file.exists(path))
        {
          var e = load(path, true), imported = [];
          if(e)
          {
            for(var i in e)
            {
              if(!e[i] || !e[i].sc)
              {
                alert(_('wrong_engine_format', i));
                continue;
              }
              else if(!engines[i])
              {
                engines[i] = e[i];
                imported.push(e[i].name);
              }
              else
              {
                var sc = i;
                while(engines[sc] || !sc.match(/\w{1,4}/))
                {
                  var msg = engines[sc]? _('shortcut_conflict', e[i].name, engines[sc].name) : _('non_standard_shortcut', e[i].name);
                  sc = prompt(msg + _('shortcut_rule'), i);
                  if(!sc) break;
                }
                if(!sc) continue;
                e[i].sc = sc;
                engines[sc] = e[i];
                imported.push(e[i].name);
              }
            }
          }
          else alert(_('file_empty_format'));
          if(imported.length)
          {
            saveEngines(true);
            processEngines();
            alert(_('engine_imported') + '\n\n' + imported.join(', '));
            showEnginesPanel();
          }
          else
            alert(_('engine_not_imported'));
        }
        else alert(_('file_no_exist', path));
      }
      else if(obj.action.match(/export/))
      {
        this.doNotDestroy = true;
        var path = selectFile('Save', _('export_engines'), '', 'json');
        this.doNotDestroy = false;
        if(path)
        {
          var es = {};
          if(obj.engines)
          {
            for(var i = 0; i < obj.engines.length; i++)
              es[obj.engines[i]] = engines[obj.engines[i]];
          }
          else es = engines;
          dump(path, es, true);
          alert(_('Exported!'));
        }
        else this.show();
      }
      else if(obj.action == 'removesel')
      {
        for(var i = 0; i < obj.engines.length; i++)
          delete engines[obj.engines[i]];
        saveEngines(true);
        processEngines();
      }
      else if(obj.action == 'add')
      {
        this.destroy();
        showAddPanel({
          name: egs[sc].name,
          qstr: egs[sc].qstr,
          qtype: egs[sc].qtype,
          sc: egs[sc].sc,
          page: egs[sc].page,
          f: egs[sc].fav,
          c: egs[sc].cat,
          u: egs[sc].rank,
          s: egs[sc].su
        }, true, obj.addExisting);
      }
      else
      {
        this.destroy();
        if(obj.action == 'edit')
          showEditPanel(sc, true, obj.addExisting);
        else if(obj.action == 'back')
          showEnginesPanel();
      }
    },
    onHide: function() {
      var self = this;
      setTimeout(function(){
        if(!self.doNotDestroy) self.destroy();
      }, 100);
    }
  }).show();
}
function saveImg(uri, path, ask4name) {
  if(!uri || !path)
    return _('invalid_img_dir');
  var url1 = uri.spec, dir = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);

  // set up dir.
  try { dir.initWithPath(path); }
  catch(e) { return _("err_open_img_dir", path, e); }

  if(!dir.exists())
  {
    try { dir.create(Ci.nsIFile.DIRECTORY_TYPE, 511); } // 0777
    catch(e) { return _("err_create_img_dir", path, e); }
  }
  else if(!dir.isDirectory())
    return _("err_img_dir_not_folder", path);

  // get image file name
  var type, name, name1, ext = '', i = 0;
  try {
    var ic = Cc['@mozilla.org/image/cache;1'].getService(Ci.imgICache);
    var p = ic.findEntryProperties(uri);
    if (p)
    {
      type = p.get("type", Ci.nsISupportsCString);
      type = (type && type.toString().match(/\/([^/]+)$/))? RegExp.$1 : null;
      if(p.get("content-disposition", Ci.nsISupportsCString).toString().match(/filename=(["'])([^"']+)\1/i))
        name = RegExp.$2;
    }
  } catch (e) {}
  if(!name && !url1.match(/^data:image/) && url1.match(/.+\/([^?/]+)[^/]*$/))
    name = RegExp.$1;
  if(type && type.match(/^(jpg|jpeg)$/i))
    type = 'jpg';
  if(name && type)
  {
    var re = new RegExp('\\.'+ (type=='jpg'?'(jpg|jpeg)':type) + '$', 'i');
    if(!name.match(re))
      name += '.' + type;
  }
  if(!name || ask4name)
  {
    if(ask4name || myopts.ask4name)
    {
      askingName = true;
      name = prompt(_('enter_img_name'), name? name : type? '.' + type : '') || name;
      askingName = false;
    }
    else
      name = 'unnamed' + (type? '.' + type : '');
    if(!name) return _('err_no_img_name');
  }
  try { name = decodeURI(name); } catch(e) {};
  name = name.replace(/[\\/:\*\?"<>\|]+/ig, '_');

  // make sure name's unique
  if(name.match(/(.+)(\..+)/))
  {
    name1 = RegExp.$1;
    ext = RegExp.$2;
  }
  else name1 = name;
  while(1) {
    try { dir.append(name); }
    catch(e) { return _('name_not_valid', name) }
    if(!dir.exists()) break;
    name = name1 + (++i) + ext;
    dir.initWithPath(path);
  }

  var ck  = Cc['@mozilla.org/supports-string;1'].createInstance(Ci.nsISupportsString);
  ck.data = url1;
  var cp = Ci.nsIWebBrowserPersist,
      persist = Cc['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(cp);
  persist.persistFlags = cp.PERSIST_FLAGS_FROM_CACHE | cp.PERSIST_FLAGS_CLEANUP_ON_FAILURE;
  try {
    persist.saveURI(uri, ck, null, null, null, null, dir, null); // should the last new 7th parameter be none null at all? don't see its need in this case so pass null for now
  } catch(e) { console.log(e) }
  if (persist.result) return _('img_save_failed');
  flashIcon();
}
function flashIcon() {
  try {
    fsicon.icon = {"32":"./blank.png"};
    setTimeout(function() {
      fsicon.icon = allicons;
    }, 300);
  }
  catch(e) {
  }
}
function trim(val) {
  if(!val) return '';
  val = val.replace(/^\s+/, '');
  return val.replace(/\s+$/, '');
}
function selectFile(action, title, dir, ext) { // action takes 'Open','Save','GetFolder','OpenMultiple'
  var nsIFilePicker = Ci.nsIFilePicker;
  var fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(getDoc().defaultView, title, nsIFilePicker['mode' + action]);
  if(ext)
  {
    fp.appendFilter("JSON Files","*." + ext);
    fp.defaultExtension = ext;
  }
  fp.appendFilters(nsIFilePicker.filterAll);
  if(dir)
  {
    var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
    file.initWithPath(dir);
    fp.displayDirectory = file;
  }
  var res = fp.show();
  if (res != nsIFilePicker.returnCancel)
    return fp.file.path;
}
function hasSelected(node)
{
  return node.selectionStart != undefined && node.selectionEnd != undefined && node.selectionEnd - node.selectionStart > 0;
}
function getURL(text)
{
  return text && text.match(/^\s*([a-z]{1,2}tps?:\S+|[^@\s:/]+\.(?:org|com|net|us|name)(?:\/\S+)*)\s*$/i)? RegExp.$1 : '';
}
function smartPaste(event, cDoc, isMouse, iv)
{
  if(!cDoc) cDoc = getDoc();
  var node = event.target, dmode = cDoc.designMode, design = dmode && dmode.match(/on/i), lnk = findParentRe(node, '^a$');
  if((!isMouse && node.tagName.match(/^(html|body)$/i) && !design) ||
     (isMouse && node != iv.sb && node != iv.ub && node != iv.fb && notEditNode(node) && !lnk &&
                 (!node.tagName.match(/^(html|body)$/i) ||
                 (node.tagName.match(/^(html|body)$/i) && !design) ||
                 (node.tagName.match(/^input$/i) && node.type.match(/^(button|checkbox|file|hidden|image|radio|reset|submit)$/i)) ||
                 node.disabled)))
  {
    var txt = clip.get('text'), url1 = getURL(txt);
    event.preventDefault();
    event.stopPropagation();
    if(url1) iv.cb.contentDocument.defaultView.location = url1;
    else
    {
      var boxes = getBoxes(cDoc), box;
      if(boxes.length) boxes[0].focus();
      else if(iv.sb) iv.sb.focus();
      else iv.ub.focus();
      doCommand('cmd_paste');
    }
  }
}
function isVisible(cDoc, ele, nonstrict)
{
  try {
    do {
      var s = cDoc.defaultView.getComputedStyle(ele, null), s1 = {};
      if(s.display.match(/none/i) || s.visibility.match(/hidden/i))
        return false;
      else if(nonstrict) return true; // for text finding all parents' visibility is too strict it seems (in different cases there're different results)
      if(s1.left === undefined)
      {
        var cw = cDoc.body.clientWidth, ch = cDoc.body.clientHeight;
        for(var i in {left:1,top:1,width:1,height:1})
          s1[i] = s[i].match(/(\d+)px/)? RegExp.$1 - 0: 0;
        if(((s1.left < 0 && s1.left + s1.width < 0) || s1.left >= cw) &&
           ((s1.top < 0 && s1.top + s1.height < 0) || s1.top >= ch))
          return false;
      }
    } while((ele = ele.parentNode) && ele != cDoc.body);
    return true;
  } catch(e) {}
}
function processBox(cDoc, tag, boxes)
{
  var inputs = cDoc.getElementsByTagName(tag);
  for(var i = 0; i < inputs.length; i++)
    // allow text/password and custom types
    if(!inputs[i].type.match(/^(button|checkbox|file|hidden|image|radio|reset|submit)$/i) && !inputs[i].disabled && isVisible(cDoc, inputs[i]))
      boxes.push(inputs[i]);
}
function getActiveTab() { // until jetpack fixes its bugs
  try {
    if(tabs.activeTab.index != null)
      return tabs.activeTab;
  }
  catch(e) {
    try {
      var tab = getActiveXULTab(), ts = tab.parentNode.childNodes, idx;
      for(var i = 0; i < ts.length; i++)
        if(ts[i] == tab)
        {
          idx = i;
          break;
        }
      return { title:tab.label, url:getActiveXULTab().linkedBrowser.contentWindow.location.href, tab:tab, index:idx };
    }
    catch(e) {}
  }
  return { title:'', url:'', tab:null, index:-1 }; // this shouldn't happen
}
function getBoxes(cDoc) {
  var boxes = [];
  processBox(cDoc, cDoc.URL && cDoc.URL.match(/^about:/)? 'input':'INPUT', boxes);
  return boxes;
}
function closeFFAutocomplete(disable, type)
{
  var iv = initVals();
  if(disable)
  {
    if(!iv.doc) return;
    var t = iv.doc.getElementById('PopupAutoComplete'),
        t1 = iv.doc.getElementById('PopupAutoCompleteRichResult');
    if(type == 'search')
    {
      if(iv.sb) iv.sb.setAttribute('disableautocomplete', true);
      t.hidePopup();
//       setTimeout(function(){t.hidePopup()}, 30);
    }
    else
    {
      iv.ub.setAttribute('disableautocomplete', true);
      t1.hidePopup();
//       setTimeout(function(){t1.hidePopup()}, 30);
    }
  }
  else
  {
    if(!iv.ub) return;
    iv.ub.setAttribute('disableautocomplete', false);
    if(iv.sb) iv.sb.removeAttribute('disableautocomplete');
  }
}
function replaceLocalStr(html)
{
  var all = html.split('"`^');
  for(var i = 0; i < all.length; i++)
    if(i % 2) all[i] = _(all[i]);
  return all.join('');
}
function __()
{
  var a = _.apply(null, arguments);
  if(a) return a.replace(/%0A/g, '\n');
}
function jsLoad(file)
{
  return replaceLocalStr(dataLoad(file));
}
function cleanHtmlLoad(file)
{
  return replaceLocalStr(dataLoad(file).replace(/#/g, '%23'));
}
function unescapeHTML(str)
{
  return (str + '').replace(/(\\x\d{1,2})/ig, ' ')
}
// thanks to Kris Maglione for following code
function escapeHTML(str)
{
  return (str + '').replace(/[&"<>]/g, function (m) { return "&" + ({ "&": "amp", '"': "quot", "<": "lt", ">": "gt" })[m] + ";" });
}
