var detect=navigator.userAgent.toLowerCase();var isSafari=(detect.indexOf('safari')!=-1?true:false);var isOpera=(detect.indexOf('opera')!=-1?true:false);var max_depth=4;if(!ccsrv){var ccsrv="cc.naver.com"}var module="cc";if(!nsc){var nsc="decide.me"}var g_nClksImg=[];function clickcr(obj,area,cid,rank,evt,opt){var p1,p2,p1_id,p2_id,ptarr;var pt="";var theEvent=window.event?window.event:evt;var sx=sy=px=py=-1;var dBody,dElement,ifrId;var mode,clink;var o,x,y,w;var temp;if(!opt)opt=0;try{w=xWindowSize(window);ifrId=checkIframe(obj);if(ifrId){var ifrOffset=findPos(document.getElementById(ifrId));if(theEvent.clientX&&theEvent.clientX!="undefined"){dBody=document.body;if(dBody.clientLeft&&dBody.clientTop){ifrSx=theEvent.clientX-dBody.clientLeft;ifrSy=theEvent.clientY-dBody.clientTop}else{ifrSx=theEvent.clientX;ifrSy=theEvent.clientY}}px=ifrOffset[0]+ifrSx;py=ifrOffset[1]+ifrSy;if(document.body&&(document.body.scrollTop||document.body.scrollLeft)){dBody=document.body;sx=px-dBody.scrollLeft;sy=py-dBody.scrollTop}else if(document.documentElement&&(document.documentElement.scrollTop||document.documentElement.scrollLeft)){dElement=document.documentElement;sx=px-dElement.scrollLeft;sy=py-dElement.scrollTop}else{sx=px;sy=py}}else{if(theEvent.clientX&&theEvent.clientX!="undefined"){dBody=document.body;if(dBody.clientLeft&&dBody.clientTop){sx=theEvent.clientX-dBody.clientLeft;sy=theEvent.clientY-dBody.clientTop}else{sx=theEvent.clientX;sy=theEvent.clientY}}if(document.body&&(document.body.scrollTop||document.body.scrollLeft)){px=document.body.scrollLeft+(sx<0?0:sx);py=document.body.scrollTop+(sy<0?0:sy)}else if(document.documentElement&&(document.documentElement.scrollTop||document.documentElement.scrollLeft)){dElement=document.documentElement;if(dElement.scrollLeft!="undefined")px=dElement.scrollLeft+(sx<0?0:sx);if(dElement.scrollTop!="undefined")py=dElement.scrollTop+(sy<0?0:sy)}else{px=(sx<0?0:sx);py=(sy<0?0:sy)}if(theEvent.pageX){px=theEvent.pageX}if(theEvent.pageY){py=theEvent.pageY}}}catch(e){}if(area!=""){ptarr=area.split(".");pt=ptarr[0]+"."+ptarr[1]}else{x=obj.parentNode;y=x.parentNode;p2=getparent(obj);if(p2==null){return false}p1=getparent(p2);if(p1==null){return false}pt=p1.id+"."+p2.id}if(opt==1){mode=0}else if(obj.href){if((obj.target&&obj.target!="_self"&&obj.target!="_top"&&obj.target!="_parent")||(obj.href.toLowerCase().indexOf("javascript:")!=-1)||obj.getAttribute("href",2).charAt(0)=='#'||(obj.href.indexOf("#")!=-1&&(obj.href.substr(0,obj.href.indexOf("#"))==document.URL))||obj.nodeName.toLowerCase()=="img"){mode=0}else{mode=1}}else{mode=0}if(obj.href&&obj.nodeName.toLowerCase()!="img"){if(obj.href.indexOf("https://"+ccsrv)==0){clink=obj.href}else{clink="https://"+ccsrv+"/"+module+"?a="+pt+"&r="+rank+"&i="+cid+"&nsc="+nsc+"&w="+w+"&px="+px+"&py="+py+"&sx="+sx+"&sy="+sy+"&m="+mode+"&u="+encodeURIComponent(obj.href)}}else{clink="https://"+ccsrv+"/"+module+"?a="+pt+"&r="+rank+"&i="+cid+"&nsc="+nsc+"&w="+w+"&px="+px+"&py="+py+"&sx="+sx+"&sy="+sy+"&m="+mode+"&u="+encodeURIComponent("about:blank")}if(mode==1){temp=obj.innerHTML;obj.href=clink;if(obj.innerHTML!=temp){obj.innerHTML=temp}}else if(document.images){var timestr=new Date().getTime();clink+="&time="+timestr;if(isSafari&&!obj.href){var b=c=new Date();while((b.getTime()-c.getTime())<100)b=new Date();var o=new Image();g_nClksImg.push(o);o.src=clink}else{var o=new Image();g_nClksImg.push(o);o.src=clink}}return true}function getparent(obj){var p=obj.parentNode;var depth=0;while(1){if(p.id!=null&&p.id!=""){return p}else{depth++;p=p.parentNode}if(depth>=max_depth){return null}}}function xWindowSize(win){if(!win)win=window;var winWidth=0;if(win.innerWidth){winWidth=win.innerWidth;if(typeof(win.innerWidth)=='number'){var scrollbarWidth=getScrollBarWidth();winWidth=win.innerWidth-scrollbarWidth}}else if(document.documentElement&&document.documentElement.clientWidth){winWidth=document.documentElement.clientWidth}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){winWidth=document.body.clientWidth}return winWidth}function getScrollBarWidth(){var inner=document.createElement('p');inner.style.width='200px';inner.style.height='200px';var outer=document.createElement('div');outer.style.position='absolute';outer.style.top='0px';outer.style.left='0px';outer.style.visibility='hidden';outer.style.width='200px';outer.style.height='150px';outer.style.overflow='hidden';outer.appendChild(inner);document.body.appendChild(outer);var w1=inner.offsetWidth;outer.style.overflow='scroll';var w2=inner.offsetWidth;if(w1==w2)w2=outer.clientWidth;document.body.removeChild(outer);return(w1-w2)}function findPos(obj){var curleft=curtop=0;if(obj.offsetParent){do{curleft+=obj.offsetLeft;curtop+=obj.offsetTop}while(obj=obj.offsetParent)}else if(obj.x||obj.y){if(obj.x)curleft+=obj.x;if(obj.y)curtop+=obj.y}return[curleft,curtop]}function checkIframe(obj){var oriURL=document.URL;var p=obj.parentNode;var docObj;var ifrId;while(1){if(p.nodeName.toLowerCase()=="#document"){if(p.parentWindow){docObj=p.parentWindow}else{docObj=p.defaultView}try{if(docObj.frameElement!=null&&docObj.frameElement!="undefined"){if(docObj.frameElement.nodeName.toLowerCase()=="iframe"){ifrId=docObj.frameElement.id;if(!ifrId)return false;return ifrId}else{return false}}else{return false}}catch(e){return false}}else{p=p.parentNode;if(p==null||p=="undefined")return false}}}