/**
 * Jindo2 Framework
 * @version 1.4.2
 */
/**
 * @fileOverview	$�� $Class�� ������ ����
 */

// Core object
if (typeof window != "undefined" && typeof window.nhn == "undefined") {
	window.nhn = new Object;
}

if (typeof window != "undefined") {
	window.jindo = {};
}else {
	jindo = {};
}

/**
 * $Jindo ��ü�� ��ȯ�Ѵ�. $Jindo ��ü�� �����ӿ��� ���� ������ ��ƿ��Ƽ �Լ��� �����Ѵ�.
 * @constructor
 * @class $Jindo ��ü�� �����ӿ��� ���� ������ ��ƿ��Ƽ �Լ��� �����Ѵ�.
 * @description [Lite]
 */
jindo.$Jindo = function() {
	var cl=arguments.callee;
	var cc=cl._cached;
	
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl();
	if (!cc) cl._cached = this;
	
	// information
	this.version = "$$version$$";
}

/** 
 * @function
 * $ �Լ��� ������ �� ���� ������ �Ѵ�. 
 * <ul><li/>ID�� ����Ͽ� DOM ������Ʈ�� �����´�. �μ��� �� �� �̻� �����ϸ� ������ DOM ������Ʈ�� �迭�� �����Ѵ�. 
 * <li>���� "<tagName>" �� ���� ������ ���ڿ��� �Է��ϸ� tagName�� ������ ��ü�� �����Ѵ�.</li></ul>
 * @param {String...} sID ã�� DOM ������Ʈ�� ID. ID�� �ϳ� �̻� ������ �� �ִ�. 
 * @return {Element|Array} DOM ������Ʈ�� �����Ѵ�. ���� ID�� �ش��ϴ� DOM ������Ʈ�� ���ٸ� null�� �����Ѵ�.
 * @description [Lite]
 * @example
// ID�� �̿��Ͽ� ��ü ��ȯ
var div1 = $("div1");

// �������� ��ü�� ��ȯ
var divs = $("div1","div2"); // [$("div1"),$("div2")] �� ���� ����� ��ȯ

// ��ü ����
var div = $("<DIV>");
var div = $("<DIV id='div1'><SPAN>hello</SPAN></DIV>");
 */
jindo.$ = function(sID/*, id1, id2*/) {
	var ret = new Array;
	var el  = null;
	var reg = /^<([a-z]+|h[1-5])>$/i;
	var reg2 = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
	
	for(var i=0; i < arguments.length; i++) {
		el = arguments[i];
		if (typeof el == "string") {
			el = el.replace(/^\s+|\s+$/g, "");
			if (reg.test(el)) {
				el = document.createElement(RegExp.$1);
			} else if (reg2.test(el)) {
				var p = { thead:'table', tbody:'table', tr:'tbody', td:'tr', dt:'dl', dd:'dl', li:'ul', legend:'fieldset' };
				var tag = RegExp.$1.toLowerCase();
				
				var parents = [];

 				for (var j = 0; tag = p[tag]; j++) {
 				
 					var o = document.createElement(tag);
 					if (j) o.appendChild(parents[j - 1]);
 					
 					parents.push(o);
 					
 				}
 				
 				if (!parents[0]) parents[0] = document.createElement('div');
 				
 				var first = parents[0];
				jindo.$Element(first).html(el);
				
				for (el = first.firstChild; el; el = el.nextSibling){
					if (el.nodeType == 1) ret[ret.length] = el;		
				}
								
				
			} else {
				el = document.getElementById(el);
			}
		}
		if (el) ret[ret.length] = el;
	}
	
	return ret.length>1?ret:(ret[0] || null);
}

/**
 * Ŭ���� Ÿ���� �����Ѵ�. 
 * @extends core
 * @class $Class�� Jindo���� ��ü ���� ���α׷���(OOP)�� �����ϴ� ��ü�̴�. #Class�� �����ڴ� $init ���� �����Ѵ�. ��� �ν��Ͻ��� ���� �Ӽ��� �����Ѵ�. �� �ν��Ͻ��� �������� �Ӽ����� �������� �ش� �Ӽ��� $init���� �ʱ�ȭ�Ѵ�. �ڼ��� ���� ���� �ڵ带 �����Ѵ�.
 * @param {Object} oDef Ŭ������ �����ϴ� ��ü. �޼���, ������Ƽ�� �����ڸ� �����Ѵ�. 	$staic Ű����� �ν��Ͻ��� ���� ���� �ʾƵ� ����� �޼ҵ��� �����̴�.
 * @return {$Class} Ŭ���� ��ü
 * @description [Lite]
 * @example
var CClass = $Class({
    prop : null,
    $init : function() {
         this.prop = $Ajax();
         ...
    },
	$static : {
		static_method : function(){ return 1;}
	}
});


var c1 = new CClass();
var c2 = new CClass();
// c1�� c2�� ���� �ٸ� $Ajax ��ü�� ���� ������.

CClass.static_method(); -> 1

 */
jindo.$Class = function(oDef) {
	function typeClass() {
		var t = this;
		var a = [];
						
		var superFunc = function(m, superClass, func) {
			
			if(m!='constructor' && func.toString().indexOf("$super")>-1 ){		
				var funcArg = func.toString().replace(/function\s*\(([^\)]*)[\w\W]*/g,"$1").split(",");
				// var funcStr = func.toString().replace(/function\s*\(.*\)\s*\{/,"").replace(/this\.\$super/g,"this.$super.$super");
				var funcStr = func.toString().replace(/function[^{]*{/,"").replace(/(\w|\.?)(this\.\$super|this)/g,function(m,m2,m3){
                           if(!m2){
								return m3+".$super"
                           }
                           return m;
                });
				funcStr = funcStr.substr(0,funcStr.length-1);
				func = superClass[m] = new Function(funcArg,funcStr);
			}
			
			return function() {
				var f = this.$this[m];
				var t = this.$this;
				var r = (t[m] = func).apply(t, arguments);
				t[m] = f;
	
				return r;
			};
		}
		
		while(typeof t._$superClass != "undefined") {
			t.$super = new Object;
			t.$super.$this = this;
					
			for(var x in t._$superClass.prototype) {
				if (typeof this[x] == "undefined" && x !="$init") this[x] = t._$superClass.prototype[x];
				if (x!='constructor' && x!='_$superClass' && typeof t._$superClass.prototype[x] == "function") {
					t.$super[x] = superFunc(x, t._$superClass, t._$superClass.prototype[x]);
				} else {
					t.$super[x] = t._$superClass.prototype[x];
				}
			}			
			
			if (typeof t.$super.$init == "function") a[a.length] = t;
			t = t.$super;
		}
				
		for(var i=a.length-1; i > -1; i--) a[i].$super.$init.apply(a[i].$super, arguments);

		if (typeof this.$init == "function") this.$init.apply(this,arguments);
	}
	
	if (typeof oDef.$static != "undefined") {
		var i=0, x;
		for(x in oDef) x=="$static"||i++;
		for(x in oDef.$static) typeClass[x] = oDef.$static[x];

		if (!i) return oDef.$static;
		delete oDef.$static;
	}

	typeClass.prototype = oDef;
	typeClass.prototype.constructor = typeClass;
	typeClass.extend = jindo.$Class.extend;

	return typeClass;
 }

/**
 * Ŭ������ ����Ѵ�.
 * ���� Ŭ������ this.$super.method �� ���� Ŭ������ �޼��忡 ������ �� ������, this.$super.$super.method �� ���� �� �ܰ� �̻��� ���� Ŭ������ ������ �� ����.
 * @function
 * @param {$Class} superClass ���� Ŭ���� ��ü
 * @return {$Class} Ȯ��� Ŭ����
 * @description [Lite]
 * @example
var ClassExt = $Class(classDefinition);
ClassExt.extend(superClass);	
// ClassExt�� SuperClass�� ��ӹ޴´�. 

 */
jindo.$Class.extend = function(superClass) { 
 	/**
	* �θ� Ŭ������ �޼��忡 ������ �� ����Ѵ�.   
	* @memberOf $Class
	* @name $super 
	* @remark $super�� ����Ͽ� �θ� Ŭ������ �޼��忡 ������ �� �θ� Ŭ������ �ż��尡 �ڽ� Ŭ������ ������ �̸��� �Ӽ��� ����ϸ� �ڽ� Ŭ������ �Ӽ��� ����Ѵ�. 
	* @example
var Parent = $Class ({
	a: 100,
	b: 200,
	c: 300,
	sum2: function () {
		var init = this.sum();
		return init;
	},
	sum: function () {
		return this.a + this.b
	}
});

var Child = $Class ({
	a: 10,
	b: 20,
	sum2 : function () {
		var init = this.sum();
		return init;
	},
	sum: function () {
		return this.b;
	}
}).extend (Parent);

var oChild = new Child();
var oParent = new Parent();
	
oChild.sum();           // 20
oChild.sum2();          // 20
oChild.$super.sum();    // 30 -> �θ� Ŭ������ 100�� 200��� �ڽ� Ŭ������ 10�� 20�� ���Ѵ�. 
oChild.$super.sum2();   // 20 -> �θ� Ŭ������ sum()��� �ڽ� Ŭ������ sum()�� ȣ���Ѵ�. 
	*/
	this.prototype._$superClass = superClass;

	// inherit static methods of parent
	for(var x in superClass) {
		if (x == "prototype") continue;
		this[x] = superClass[x];
	}

	return this;
};
/////
/**

 * @fileOverview CSS �����͸� ����� ������Ʈ ���� ����

 * @name cssquery.js

 * @author Hooriza

 */



/**

 * CSS �����͸� ����Ͽ� ��ü�� Ž���Ѵ�.

 *

 * @function CSS �����͸� ����Ͽ� ��ü�� Ž���Ѵ�.

 * @param {String} CSS������

 * @param {Element} Ž�� ����� �Ǵ� ���, ����� ���� ��忡���� Ž���Ѵ�.  

 * @return {Array} ���ǿ� �ش��ϴ� ����� �迭�� ��ȯ�Ѵ�.

 * @description [Lite] 

 * @example

 // �������� IMG �±׸� ã�´�.

 var imgs = $$('IMG');

 

 // div ��� �������� IMG �±׸� ã�´�.

 var imgsInDiv = $$('IMG', $('div'));

 

 // �������� IMG �±� �� ���� ù ��Ҹ� ã�´�.

 var firstImg = $$.getSingle('IMG');

 */

jindo.$$ = jindo.cssquery = (function() {

	

	var sVersion = '2.3';

	

	var debugOption = { repeat : 1 };

	

	// ���� ó���� ���� ��帶�� ����Ű �� ����

	var UID = 1;

	

	var cost = 0;

	var validUID = {};

	

	var bSupportByClassName = jindo.$('<DIV>').getElementsByClassName ? true : false;

	var safeHTML = false;

	

	var getUID4HTML = function(oEl) {

		

		var nUID = safeHTML ? (oEl._cssquery_UID && oEl._cssquery_UID[0]) : oEl._cssquery_UID;

		if (nUID && validUID[nUID] == oEl) return nUID;

		

		nUID = UID++;

		oEl._cssquery_UID = safeHTML ? [ nUID ] : nUID;

		

		validUID[nUID] = oEl;

		

		return nUID;



	};

	

	var getUID4XML = function(oEl) {

		

		var oAttr = oEl.getAttribute('_cssquery_UID');

		var nUID = safeHTML ? (oAttr && oAttr[0]) : oAttr;

		

		if (!nUID) {

			nUID = UID++;

			oEl.setAttribute('_cssquery_UID', safeHTML ? [ nUID ] : nUID);

		}

		

		return nUID;

		

	};

	

	var getUID = getUID4HTML;

	

	var uniqid = function(sPrefix) {

		return (sPrefix || '') + new Date().getTime() + parseInt(Math.random() * 100000000);

	};

	

	function getElementsByClass(searchClass,node,tag) {

        var classElements = new Array();

        if ( node == null )

                node = document;

        if ( tag == null )

                tag = '*';

        var els = node.getElementsByTagName(tag);

        var elsLen = els.length;

        var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");

        for (i = 0, j = 0; i < elsLen; i++) {

                if ( pattern.test(els[i].className) ) {

                        classElements[j] = els[i];

                        j++;

                }

        }

        return classElements;

	}



	var getChilds_dontShrink = function(oEl, sTagName, sClassName) {

		if (bSupportByClassName && sClassName) {

			if(oEl.getElementsByClassName)

				return oEl.getElementsByClassName(sClassName);

			if(oEl.querySelectorAll)

				return oEl.querySelectorAll(sClassName);

			return getElementsByClass(sClassName, oEl, sTagName);

		}else if (sTagName == '*') {

			return oEl.all || oEl.getElementsByTagName(sTagName);

		}

		return oEl.getElementsByTagName(sTagName);

	};



	var clearKeys = function() {

		 backupKeys._keys = {};

	};

	

	var oDocument_dontShrink = document;

	

	var bXMLDocument = false;

	

	// ����ǥ, [] �� �Ľ̿� ������ �� �� �ִ� �κ� replace ���ѳ���

	var backupKeys = function(sQuery) {

		

		var oKeys = backupKeys._keys;

		

		// ���� ����ǥ �Ⱦ��

		sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function(sAll) {

			var uid = uniqid('QUOT');

			oKeys[uid] = sAll;

			return uid;

		});

		

		// ū ����ǥ �Ⱦ��

		sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function(sAll) {

			var uid = uniqid('QUOT');

			oKeys[uid] = sAll;

			return uid;

		});

		

		// [ ] ���� �Ⱦ��

		sQuery = sQuery.replace(/\[(.*?)\]/g, function(sAll, sBody) {

			if (sBody.indexOf('ATTR') == 0) return sAll;

			var uid = '[' + uniqid('ATTR') + ']';

			oKeys[uid] = sAll;

			return uid;

		});

	

		// ( ) ���� �Ⱦ��

		var bChanged;

		

		do {

			

			bChanged = false;

		

			sQuery = sQuery.replace(/\(((\\\)|[^)|^(])*)\)/g, function(sAll, sBody) {

				if (sBody.indexOf('BRCE') == 0) return sAll;

				var uid = '_' + uniqid('BRCE');

				oKeys[uid] = sAll;

				bChanged = true;

				return uid;

			});

		

		} while(bChanged);

	

		return sQuery;

		

	};

	

	// replace ���ѳ��� �κ� �����ϱ�

	var restoreKeys = function(sQuery, bOnlyAttrBrace) {

		

		var oKeys = backupKeys._keys;

	

		var bChanged;

		var rRegex = bOnlyAttrBrace ? /(\[ATTR[0-9]+\])/g : /(QUOT[0-9]+|\[ATTR[0-9]+\])/g;

		

		do {

			

			bChanged = false;

	

			sQuery = sQuery.replace(rRegex, function(sKey) {

				

				if (oKeys[sKey]) {

					bChanged = true;

					return oKeys[sKey];

				}

				

				return sKey;

	

			});

		

		} while(bChanged);

		

		// ( ) �� �Ѳ�Ǯ�� ���ܳ���

		sQuery = sQuery.replace(/_BRCE[0-9]+/g, function(sKey) {

			return oKeys[sKey] ? oKeys[sKey] : sKey;

		});

		

		return sQuery;

		

	};

	

	// replace ���ѳ��� ���ڿ����� Quot �� �����ϰ� ����

	var restoreString = function(sKey) {

		

		var oKeys = backupKeys._keys;

		var sOrg = oKeys[sKey];

		

		if (!sOrg) return sKey;

		return eval(sOrg);

		

	};

	

	var wrapQuot = function(sStr) {

		return '"' + sStr.replace(/"/g, '\\"') + '"';

	};

	

	var getStyleKey = function(sKey) {



		if (/^@/.test(sKey)) return sKey.substr(1);

		return null;

		

	};

	

	var getCSS = function(oEl, sKey) {

		

		if (oEl.currentStyle) {

			

			if (sKey == "float") sKey = "styleFloat";

			return oEl.currentStyle[sKey] || oEl.style[sKey];

			

		} else if (window.getComputedStyle) {

			

			return oDocument_dontShrink.defaultView.getComputedStyle(oEl, null).getPropertyValue(sKey.replace(/([A-Z])/g,"-$1").toLowerCase()) || oEl.style[sKey];

			

		}



		if (sKey == "float" && /MSIE/.test(window.navigator.userAgent)) sKey = "styleFloat";

		return oEl.style[sKey];

		

	};



	var oCamels = {

		'accesskey' : 'accessKey',

		'cellspacing' : 'cellSpacing',

		'cellpadding' : 'cellPadding',

		'class' : 'className',

		'colspan' : 'colSpan',

		'for' : 'htmlFor',

		'maxlength' : 'maxLength',

		'readonly' : 'readOnly',

		'rowspan' : 'rowSpan',

		'tabindex' : 'tabIndex',

		'valign' : 'vAlign'

	};



	var getDefineCode = function(sKey) {

		

		var sVal;

		var sStyleKey;



		if (bXMLDocument) {

			

			sVal = 'oEl.getAttribute("' + sKey + '",2)';

		

		} else {

		

			if (sStyleKey = getStyleKey(sKey)) {

				

				sKey = '$$' + sStyleKey;

				sVal = 'getCSS(oEl, "' + sStyleKey + '")';

				

			} else {

				

				switch (sKey) {

				case 'checked':

					sVal = 'oEl.checked + ""';

					break;

					

				case 'disabled':

					sVal = 'oEl.disabled + ""';

					break;

					

				case 'enabled':

					sVal = '!oEl.disabled + ""';

					break;

					

				case 'readonly':

					sVal = 'oEl.readOnly + ""';

					break;

					

				case 'selected':

					sVal = 'oEl.selected + ""';

					break;

					

				default:

					if (oCamels[sKey]) {

						sVal = 'oEl.' + oCamels[sKey];

					} else {

						sVal = 'oEl.getAttribute("' + sKey + '",2)';

					} 

				}

				

			}

			

		}

			

		return '_' + sKey + ' = ' + sVal;

	};

	

	var getReturnCode = function(oExpr) {

		

		var sStyleKey = getStyleKey(oExpr.key);

		

		var sVar = '_' + (sStyleKey ? '$$' + sStyleKey : oExpr.key);

		var sVal = oExpr.val ? wrapQuot(oExpr.val) : '';

		

		switch (oExpr.op) {

		case '~=':

			return '(' + sVar + ' && (" " + ' + sVar + ' + " ").indexOf(" " + ' + sVal + ' + " ") > -1)';

		case '^=':

			return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') == 0)';

		case '$=':

			return '(' + sVar + ' && ' + sVar + '.substr(' + sVar + '.length - ' + oExpr.val.length + ') == ' + sVal + ')';

		case '*=':

			return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') > -1)';

		case '!=':

			return '(' + sVar + ' != ' + sVal + ')';

		case '=':

			return '(' + sVar + ' == ' + sVal + ')';

		}

	

		return '(' + sVar + ')';

		

	};

	

	var getNodeIndex = function(oEl) {

		

		var nUID = getUID(oEl);

		var nIndex = oNodeIndexes[nUID] || 0;

		

		// ��� �ε����� ���� �� ������

		if (nIndex == 0) {



			for (var oSib = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oSib; oSib = oSib.nextSibling) {

				

				if (oSib.nodeType != 1) continue;

				nIndex++;

				

				setNodeIndex(oSib, nIndex);

				

			}

						

			nIndex = oNodeIndexes[nUID];

			

		}

				

		return nIndex;

				

	};

	

	// ���° �ڽ����� �����ϴ� �κ�

	var oNodeIndexes = {};



	var setNodeIndex = function(oEl, nIndex) {

		var nUID = getUID(oEl);

		oNodeIndexes[nUID] = nIndex;

	};

	

	var unsetNodeIndexes = function() {

		setTimeout(function() { oNodeIndexes = {}; }, 0);

	};

	

	// ���� Ŭ����

	var oPseudoes_dontShrink = {

	

		'contains' : function(oEl, sOption) {

			return (oEl.innerText || oEl.textContent || '').indexOf(sOption) > -1;

		},

		

		'last-child' : function(oEl, sOption) {

			for (oEl = oEl.nextSibling; oEl; oEl = oEl.nextSibling){

				if (oEl.nodeType == 1)

					return false;

			}

				

			

			return true;

		},

		

		'first-child' : function(oEl, sOption) {

			for (oEl = oEl.previousSibling; oEl; oEl = oEl.previousSibling){

				if (oEl.nodeType == 1)

					return false;

			}

				

					

			return true;

		},

		

		'only-child' : function(oEl, sOption) {

			var nChild = 0;

			

			for (var oChild = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oChild; oChild = oChild.nextSibling) {

				if (oChild.nodeType == 1) nChild++;

				if (nChild > 1) return false;

			}

			

			return nChild ? true : false;

		},



		'empty' : function(oEl, _) {

			return oEl.firstChild ? false : true;

		},

		

		'nth-child' : function(oEl, nMul, nAdd) {

			var nIndex = getNodeIndex(oEl);

			return nIndex % nMul == nAdd;

		},

		

		'nth-last-child' : function(oEl, nMul, nAdd) {

			var oLast = (oEl.parentNode || oEl._IE5_parentNode).lastChild;

			for (; oLast; oLast = oLast.previousSibling){

				if (oLast.nodeType == 1) break;

			}

				

				

			var nTotal = getNodeIndex(oLast);

			var nIndex = getNodeIndex(oEl);

			

			var nLastIndex = nTotal - nIndex + 1;

			return nLastIndex % nMul == nAdd;

		}

		

	};

	

	// ���� part �� body ���� expression �̾Ƴ�

	var getExpression = function(sBody) {



		var oRet = { defines : '', returns : 'true' };

		

		var sBody = restoreKeys(sBody, true);

	

		var aExprs = [];

		var aDefineCode = [], aReturnCode = [];

		var sId, sTagName;

		

		// ����Ŭ���� ���� ����

		var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function(_1, sType, _2, sOption) {

			

			switch (sType) {

			case 'not':

				var oInner = getExpression(sOption); // ��ȣ �ȿ� �ִ°� ����Ľ��ϱ�

				

				var sFuncDefines = oInner.defines;

				var sFuncReturns = oInner.returnsID + oInner.returnsTAG + oInner.returns;

				

				aReturnCode.push('!(function() { ' + sFuncDefines + ' return ' + sFuncReturns + ' })()');

				break;

				

			case 'nth-child':

			case 'nth-last-child':

				sOption =  restoreString(sOption);

				

				if (sOption == 'even'){

					sOption = '2n';

				}else if (sOption == 'odd') {

					sOption = '2n+1';

				}



				var nMul, nAdd;

				

				if (/([0-9]*)n([+-][0-9]+)*/.test(sOption)) {

					nMul = parseInt(RegExp.$1) || 1;

					nAdd = parseInt(RegExp.$2) || 0;

				} else {

					nMul = Infinity;

					nAdd = parseInt(sOption);

				}

				

				aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + nMul + ', ' + nAdd + ')');

				break;

				

			case 'first-of-type':

			case 'last-of-type':

				sType = (sType == 'first-of-type' ? 'nth-of-type' : 'nth-last-of-type');

				sOption = 1;

				

			case 'nth-of-type':

			case 'nth-last-of-type':

				sOption =  restoreString(sOption);

				

				if (sOption == 'even') {

					sOption = '2n';

				}else if (sOption == 'odd'){

					sOption = '2n+1';

				}



				var nMul, nAdd;

				

				if (/([0-9]*)n([+-][0-9]+)*/.test(sOption)) {

					nMul = parseInt(RegExp.$1) || 1;

					nAdd = parseInt(RegExp.$2) || 0;

				} else {

					nMul = Infinity;

					nAdd = parseInt(sOption);

				}

				

				oRet.nth = [ nMul, nAdd, sType ];

				break;

				

			default:

				sOption = sOption ? restoreString(sOption) : '';

				aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + wrapQuot(sOption) + ')');

				break;

			}

			

			return '';

			

		});

		

		// [key=value] ���� ���� ����

		var sBody = sBody.replace(/\[(@?[\w-]+)(([!^~$*]?=)([^\]]*))?\]/g, function(_1, sKey, _2, sOp, sVal) {

			

			sKey = restoreString(sKey);

			sVal = restoreString(sVal);

			

			if (sKey == 'checked' || sKey == 'disabled' || sKey == 'enabled' || sKey == 'readonly' || sKey == 'selected') {

				

				if (!sVal) {

					sOp = '=';

					sVal = 'true';

				}

				

			}

			

			aExprs.push({ key : sKey, op : sOp, val : sVal });

			return '';

	

		});

		

		var sClassName = null;

	

		// Ŭ���� ���� ����

		var sBody = sBody.replace(/\.([\w-]+)/g, function(_, sClass) { 

			aExprs.push({ key : 'class', op : '~=', val : sClass });

			if (!sClassName) sClassName = sClass;

			return '';

		});

		

		// id ���� ����

		var sBody = sBody.replace(/#([\w-]+)/g, function(_, sIdValue) {

			if (bXMLDocument) {

				aExprs.push({ key : 'id', op : '=', val : sIdValue });

			}else{

				sId = sIdValue;

			}

			return '';

		});

		

		sTagName = sBody == '*' ? '' : sBody;

	

		// match �Լ� �ڵ� ����� ����

		var oVars = {};

		

		for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {

			

			var sKey = oExpr.key;

			

			if (!oVars[sKey]) aDefineCode.push(getDefineCode(sKey));

			aReturnCode.unshift(getReturnCode(oExpr)); // ����Ŭ���� ���� �˻簡 �� �ڷ� ������ unshift ���

			oVars[sKey] = true;

			

		}

		

		if (aDefineCode.length) oRet.defines = 'var ' + aDefineCode.join(',') + ';';

		if (aReturnCode.length) oRet.returns = aReturnCode.join('&&');

		

		oRet.quotID = sId ? wrapQuot(sId) : '';

		oRet.quotTAG = sTagName ? wrapQuot(bXMLDocument ? sTagName : sTagName.toUpperCase()) : '';

		

		if (bSupportByClassName) oRet.quotCLASS = sClassName ? wrapQuot(sClassName) : '';

		

		oRet.returnsID = sId ? 'oEl.id == ' + oRet.quotID + ' && ' : '';

		oRet.returnsTAG = sTagName && sTagName != '*' ? 'oEl.tagName == ' + oRet.quotTAG + ' && ' : '';

		

		return oRet;

		

	};

	

	// ������ ������ �������� �߶�

	var splitToParts = function(sQuery) {

		

		var aParts = [];

		var sRel = ' ';

		

		var sBody = sQuery.replace(/(.*?)\s*(!?[+>~ ]|!)\s*/g, function(_, sBody, sRelative) {

			

			if (sBody) aParts.push({ rel : sRel, body : sBody });

	

			sRel = sRelative.replace(/\s+$/g, '') || ' ';

			return '';

			

		});

	

		if (sBody) aParts.push({ rel : sRel, body : sBody });

		

		return aParts;

		

	};

	

	var isNth_dontShrink = function(oEl, sTagName, nMul, nAdd, sDirection) {

		

		var nIndex = 0;

		for (var oSib = oEl; oSib; oSib = oSib[sDirection]){

			if (oSib.nodeType == 1 && (!sTagName || sTagName == oSib.tagName))

					nIndex++;

		}

			



		return nIndex % nMul == nAdd;



	};

	

	// �߶� part �� �Լ��� ������ �ϱ�

	var compileParts = function(aParts) {

		

		var aPartExprs = [];

		

		// �߶� �κе� ���� �����

		for (var i = 0, oPart; oPart = aParts[i]; i++)

			aPartExprs.push(getExpression(oPart.body));

		

		//////////////////// BEGIN

		

		var sFunc = '';

		var sPushCode = 'aRet.push(oEl); if (oOptions.single) { bStop = true; }';



		for (var i = aParts.length - 1, oPart; oPart = aParts[i]; i--) {

			

			var oExpr = aPartExprs[i];

			var sPush = (debugOption.callback ? 'cost++;' : '') + oExpr.defines;

			

			// console.log(oExpr);



			var sReturn = 'if (bStop) {' + (i == 0 ? 'return aRet;' : 'return;') + '}';

			

			if (oExpr.returns == 'true') {

				sPush += (sFunc ? sFunc + '(oEl);' : sPushCode) + sReturn;

			}else{

				sPush += 'if (' + oExpr.returns + ') {' + (sFunc ? sFunc + '(oEl);' : sPushCode ) + sReturn + '}';

			}

			

			var sCheckTag = 'oEl.nodeType != 1';

			if (oExpr.quotTAG) sCheckTag = 'oEl.tagName != ' + oExpr.quotTAG;

			

			var sTmpFunc =

				'(function(oBase' +

					(i == 0 ? ', oOptions) { var bStop = false; var aRet = [];' : ') {');



			if (oExpr.nth) {

				sPush =

					'if (isNth_dontShrink(oEl, ' +

					(oExpr.quotTAG ? oExpr.quotTAG : 'false') + ',' +

					oExpr.nth[0] + ',' +

					oExpr.nth[1] + ',' +

					'"' + (oExpr.nth[2] == 'nth-of-type' ? 'previousSibling' : 'nextSibling') + '")) {' + sPush + '}';

			}

			

			switch (oPart.rel) {

			case ' ':

				if (oExpr.quotID) {

					

					sTmpFunc +=

						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +

						'var oCandi = oEl;' +

						'for (; oCandi; oCandi = (oCandi.parentNode || oCandi._IE5_parentNode)) {' +

							'if (oCandi == oBase) break;' +

						'}' +

						'if (!oCandi || ' + sCheckTag + ') return aRet;' +

						sPush;

					

				} else {

					

					sTmpFunc +=

						'var aCandi = getChilds_dontShrink(oBase, ' + (oExpr.quotTAG || '"*"') + ', ' + (oExpr.quotCLASS || 'null') + ');' +

						'for (var i = 0, oEl; oEl = aCandi[i]; i++) {' +

							(oExpr.quotCLASS ? 'if (' + sCheckTag + ') continue;' : '') +

							sPush +

						'}';

					

				}

			

				break;

				

			case '>':

				if (oExpr.quotID) {

	

					sTmpFunc +=

						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +

						'if ((oEl.parentNode || oEl._IE5_parentNode) != oBase || ' + sCheckTag + ') return aRet;' +

						sPush;

					

				} else {

	

					sTmpFunc +=

						'for (var oEl = oBase.firstChild; oEl; oEl = oEl.nextSibling) {' +

							'if (' + sCheckTag + ') { continue; }' +

							sPush +

						'}';

					

				}

				

				break;

				

			case '+':

				if (oExpr.quotID) {

	

					sTmpFunc +=

						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +

						'var oPrev;' +

						'for (oPrev = oEl.previousSibling; oPrev; oPrev = oPrev.previousSibling) { if (oPrev.nodeType == 1) break; }' +

						'if (!oPrev || oPrev != oBase || ' + sCheckTag + ') return aRet;' +

						sPush;

					

				} else {

	

					sTmpFunc +=

						'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) { if (oEl.nodeType == 1) break; }' +

						'if (!oEl || ' + sCheckTag + ') { return aRet; }' +

						sPush;

					

				}

				

				break;

			

			case '~':

	

				if (oExpr.quotID) {

	

					sTmpFunc +=

						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +

						'var oCandi = oEl;' +

						'for (; oCandi; oCandi = oCandi.previousSibling) { if (oCandi == oBase) break; }' +

						'if (!oCandi || ' + sCheckTag + ') return aRet;' +

						sPush;

					

				} else {

	

					sTmpFunc +=

						'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) {' +

							'if (' + sCheckTag + ') { continue; }' +

							'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' +

							sPush +

						'}';

	

				}

				

				break;

				

			case '!' :

			

				if (oExpr.quotID) {

					

					sTmpFunc +=

						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +

						'for (; oBase; oBase = (oBase.parentNode || oBase._IE5_parentNode)) { if (oBase == oEl) break; }' +

						'if (!oBase || ' + sCheckTag + ') return aRet;' +

						sPush;

						

				} else {

					

					sTmpFunc +=

						'for (var oEl = (oBase.parentNode || oBase._IE5_parentNode); oEl; oEl = (oEl.parentNode || oEl._IE5_parentNode)) {'+

							'if (' + sCheckTag + ') { continue; }' +

							sPush +

						'}';

					

				}

				

				break;

	

			case '!>' :

			

				if (oExpr.quotID) {

	

					sTmpFunc +=

						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +

						'var oRel = (oBase.parentNode || oBase._IE5_parentNode);' +

						'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' +

						sPush;

					

				} else {

	

					sTmpFunc +=

						'var oEl = (oBase.parentNode || oBase._IE5_parentNode);' +

						'if (!oEl || ' + sCheckTag + ') { return aRet; }' +

						sPush;

					

				}

				

				break;

				

			case '!+' :

				

				if (oExpr.quotID) {

	

					sTmpFunc +=

						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +

						'var oRel;' +

						'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { if (oRel.nodeType == 1) break; }' +

						'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' +

						sPush;

					

				} else {

	

					sTmpFunc +=

						'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) { if (oEl.nodeType == 1) break; }' +

						'if (!oEl || ' + sCheckTag + ') { return aRet; }' +

						sPush;

					

				}

				

				break;

	

			case '!~' :

				

				if (oExpr.quotID) {

					

					sTmpFunc +=

						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +

						'var oRel;' +

						'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { ' +

							'if (oRel.nodeType != 1) { continue; }' +

							'if (oRel == oEl) { break; }' +

						'}' +

						'if (!oRel || (' + sCheckTag + ')) return aRet;' +

						sPush;

					

				} else {

	

					sTmpFunc +=

						'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) {' +

							'if (' + sCheckTag + ') { continue; }' +

							'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' +

							sPush +

						'}';

					

				}

				

				break;

			}

	

			sTmpFunc +=

				(i == 0 ? 'return aRet;' : '') +

			'})';

			

			sFunc = sTmpFunc;

			

		}

		

		// alert(sFunc);

		//console.log(sFunc);

		eval('var fpCompiled = ' + sFunc + ';');

		//alert(fpCompiled);

		return fpCompiled;

		

	};

	

	// ������ match �Լ��� ��ȯ

	var parseQuery = function(sQuery) {

		

		var sCacheKey = sQuery;

		

		var fpSelf = arguments.callee;

		var fpFunction = fpSelf._cache[sCacheKey];

		

		if (!fpFunction) {

			

			sQuery = backupKeys(sQuery);

			

			var aParts = splitToParts(sQuery);

			

			fpFunction = fpSelf._cache[sCacheKey] = compileParts(aParts);

			fpFunction.depth = aParts.length;

			

		}

		

		return fpFunction;

		

	};

	

	parseQuery._cache = {};

	

	// test ������ match �Լ��� ��ȯ

	var parseTestQuery = function(sQuery) {

		

		var fpSelf = arguments.callee;

		

		var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);

		var aResult = [];

		

		var nLen = aSplitQuery.length;

		var aFunc = [];

		

		for (var i = 0; i < nLen; i++) {



			aFunc.push((function(sQuery) {

				

				var sCacheKey = sQuery;

				var fpFunction = fpSelf._cache[sCacheKey];

				

				if (!fpFunction) {

					

					sQuery = backupKeys(sQuery);

					var oExpr = getExpression(sQuery);

					

					eval('fpFunction = function(oEl) { ' + oExpr.defines + 'return (' + oExpr.returnsID + oExpr.returnsTAG + oExpr.returns + '); };');

					

				}

				

				return fpFunction;

				

			})(restoreKeys(aSplitQuery[i])));

			

		}

		

		return aFunc;

		

	};

	

	parseTestQuery._cache = {};

	

	var distinct = function(aList) {

	

		var aDistinct = [];

		var oDummy = {};

		

		for (var i = 0, oEl; oEl = aList[i]; i++) {

			

			var nUID = getUID(oEl);

			if (oDummy[nUID]) continue;

			

			aDistinct.push(oEl);

			oDummy[nUID] = true;

		}

	

		return aDistinct;

	

	};

	

	var markElement_dontShrink = function(oEl, nDepth) {

		

		var nUID = getUID(oEl);

		if (cssquery._marked[nDepth][nUID]) return false;

		

		cssquery._marked[nDepth][nUID] = true;

		return true;



	};

	

	var oResultCache = null;

	var bUseResultCache = false;

		

	/**

	 * CSS �����͸� ����Ͽ� ������Ʈ ����� ���´�

	 * @param {String} selector	CSS ������

	 * @param {Document | Element} el	Ž���� �����ϴ� ������ �Ǵ� ������Ʈ �Ǵ� ���� (������ ���� ������ document ��ü)

	 * @param {Object} ������Ʈ�� onTimeOffCache�� true�� �ϸ� �ش� ������ cache�� ������� �ʴ´�.

	 * @remark el �δ� XMLDocument �Ǵ� XMLElement �� ������ �� �ִ�.

	 * @return {Array} ���õ� ������Ʈ ����� �迭

	 */

	var cssquery = function(sQuery, oParent, oOptions) {

		

		if (typeof sQuery == 'object') {

			

			var oResult = {};

			

			for (var k in sQuery)

				oResult[k] = arguments.callee(sQuery[k], oParent, oOptions);

			

			return oResult;

		}

		

		cost = 0;

		

		var executeTime = new Date().getTime();

		var aRet;

		

		for (var r = 0, rp = debugOption.repeat; r < rp; r++) {

			

			aRet = (function(sQuery, oParent, oOptions) {

				

				if(oOptions){

					if(!oOptions.oneTimeOffCache){

						oOptions.oneTimeOffCache = false;

					}

				}else{

					oOptions = {oneTimeOffCache:false};

				}

				cssquery.safeHTML(oOptions.oneTimeOffCache);

				

				if (!oParent) oParent = document;

					

				// ownerDocument ����ֱ�

				oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;

				

				// ������ ������ IE5.5 ����

				if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 6) {

					

					try { oDocument_dontShrink.location; } catch(e) { oDocument_dontShrink = document; }

					

					oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName('html')[0];

					oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink;

				}

				

				// XMLDocument ���� üũ

				bXMLDocument = (typeof XMLDocument != 'undefined') ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);

				getUID = bXMLDocument ? getUID4XML : getUID4HTML;

		

				clearKeys();

				

				// ������ ��ǥ�� ������

				var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);

				var aResult = [];

				

				var nLen = aSplitQuery.length;

				

				for (var i = 0; i < nLen; i++)

					aSplitQuery[i] = restoreKeys(aSplitQuery[i]);

				

				// ��ǥ�� ������ ���� ����

				for (var i = 0; i < nLen; i++) {

					

					var sSingleQuery = aSplitQuery[i];

					var aSingleQueryResult = null;

					

					var sResultCacheKey = sSingleQuery + (oOptions.single ? '_single' : '');

		

					// ��� ĳ�� ����

					var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;

					if (aCache) {

						

						// ĳ�̵Ǿ� �ִ°� ������ parent �� �������� �˻����� aSingleQueryResult �� ����

						for (var j = 0, oCache; oCache = aCache[j]; j++) {

							if (oCache.parent == oParent) {

								aSingleQueryResult = oCache.result;

								break;

							}

						}

						

					}

					

					if (!aSingleQueryResult) {

						

						var fpFunction = parseQuery(sSingleQuery);

						// alert(fpFunction);

						

						cssquery._marked = [];

						for (var j = 0, nDepth = fpFunction.depth; j < nDepth; j++)

							cssquery._marked.push({});

						

						aSingleQueryResult = distinct(fpFunction(oParent, oOptions));

						

						// ��� ĳ���� ������̸� ĳ���� ����

						if (bUseResultCache&&!oOptions.oneTimeOffCache) {

							if (!(oResultCache[sResultCacheKey] instanceof Array)) oResultCache[sResultCacheKey] = [];

							oResultCache[sResultCacheKey].push({ parent : oParent, result : aSingleQueryResult });

						}

						

					}

					

					aResult = aResult.concat(aSingleQueryResult);

					

				}

				unsetNodeIndexes();

		

				return aResult;

				

			})(sQuery, oParent, oOptions);

			

		}

		

		executeTime = new Date().getTime() - executeTime;



		if (debugOption.callback) debugOption.callback(sQuery, cost, executeTime);

		

		return aRet;

		

	};



	/**

	 * Ư�� ������Ʈ�� �ش� CSS �����Ϳ� �����ϴ� ������Ʈ���� �Ǵ��Ѵ�

	 * @remark CSS �����Ϳ� �����ڴ� ����� �� ������ �����Ѵ�.

	 * @param {Element} element	�˻��ϰ��� �ϴ� ������Ʈ

	 * @param {String} selector	CSS ������

	 * @return {Boolean} ������ ���ǿ� �����ϸ� true, �������� ������ false

	 * @example



// oEl �� div �±� �Ǵ� p �±�, �Ǵ� align=center �� ������Ʈ����

if (cssquery.test(oEl, 'div, p, [align=center]')) alert('�ش� ���� ����');// oEl �� div �±� �Ǵ� p �±�, �Ǵ� align=center �� ������Ʈ����

if (cssquery.test(oEl, 'div, p, [align=center]')) alert('�ش� ���� ����');



	 */

	cssquery.test = function(oEl, sQuery) {



		clearKeys();

		

		var aFunc = parseTestQuery(sQuery);

		

		for (var i = 0, nLen = aFunc.length; i < nLen; i++){

			if (aFunc[i](oEl)) return true;

		}

			

			

		return false;

		

	};



	/**

	 * cssquery �� ��� ĳ���� ����� ������ �����ϰų� Ȯ���Ѵ�.

	 * @remark ��� ĳ���� ����ϸ� ������ �����͸� ������� ��� ���� Ž���� ���� �ʰ� ���� Ž�� ����� �״�� ��ȯ�ϱ� ������ ����ڰ� ���� ĳ���� �Ű澲�� �ʰ� ���ϰ� ������ �� �� �ִ� ������ ������ ����� �ŷڼ��� ���� DOM �� ��ȭ�� ���ٴ� ���� Ȯ���Ҷ��� ����ؾ� �Ѵ�.

	 * @param {Boolean} flag	����� �� ���� ���� (������ ��� ���θ� ��ȯ)

	 * @return {Boolean} ��� ĳ���� ����ϴ��� ����

	 */

	cssquery.useCache = function(bFlag) {

	

		if (typeof bFlag != 'undefined') {

			bUseResultCache = bFlag;

			cssquery.clearCache();

		}

		

		return bUseResultCache;

		

	};

	

	/**

	 * ��� ĳ���� ��� �߿� DOM �� ��ȭ�� ����� ���� ������ ĳ���� ��� ����ְ� ������ ����Ѵ�.

	 * @return {Void} ��ȯ�� ����

	 */

	cssquery.clearCache = function() {

		oResultCache = {};

	};

	

	/**

	 * CSS �����͸� ����Ͽ� DOM ���� ���ϴ� ������Ʈ�� �ϳ��� ����. ��ȯ�ϴ� ���� �迭�� �ƴ� ��ü �Ǵ� null �̴�.

	 * @remark ����� �ϳ��� ���� ������ ��� Ž�� �۾��� �ߴ��ϱ� ������ ����� �ϳ���� ������ ������ ���� �ӵ��� ����� ���� �� �ִ�.

	 * @param {String} selector	CSS ������

	 * @param {Document | Element} el	Ž���� �����ϴ� ������ �Ǵ� ������Ʈ �Ǵ� ���� (������ ���� ������ document ��ü)

	 * @param {Object} ������Ʈ�� onTimeOffCache�� true�� �ϸ� �ش� ������ cache�� ������� �ʴ´�.

	 * @return {Element} ���õ� ������Ʈ

	 */

	cssquery.getSingle = function(sQuery, oParent, oOptions) {



		return cssquery(sQuery, oParent, { single : true ,oneTimeOffCache:oOptions?(!!oOptions.oneTimeOffCache):false})[0] || null;

	};

	

	

	/**

	 * XPath ������ ����Ͽ� ������Ʈ�� ���´�.

	 * @remark �����ϴ� ������ ��ô ���������� Ư���� ��쿡���� ����ϴ� ���� �����Ѵ�.

	 * @param {String} xpath	XPath

	 * @param {Document | Element} el	Ž���� �����ϴ� ������ �Ǵ� ������Ʈ �Ǵ� ���� (������ ���� ������ document ��ü)

	 * @return {Array} ���õ� ������Ʈ ����� �迭

	 */

	cssquery.xpath = function(sXPath, oParent) {

		

		var sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function(_1, sTag, _2, sTh) {

			sTh = sTh || '1';

			return '>' + sTag + ':nth-of-type(' + sTh + ')';

		});

		

		return cssquery(sXPath, oParent);

		

	};

	

	/**

	 * cssquery �� ����� ���� ������ �����ϱ� ���� ����� �����ϴ� �Լ��̴�.

	 * @param {Function} callback	������ ���࿡ �ҿ�� ���� �ð��� �޾Ƶ��̴� �Լ� (false �� ��� debug �ɼ��� ��)

	 * @param {Number} repeat	�ϳ��� �����͸� �ݺ��Ͽ� �����ϵ��� �ؼ� ���������� ���� �ӵ��� ����

	 * @remark callback �Լ��� ���´� �Ʒ��� �����ϴ�.

	 * callback : function({String}query, {Number}cost, {Number}executeTime)

	 * <dl>

	 *	<dt>query</dt>

	 *	<dd>���࿡ ���� ������</dd>

	 *	<dt>cost</dt>

	 *	<dd>Ž���� ���� ��� (���� Ƚ��)</dd>

	 *	<dt>executeTime</dt>

	 *	<dd>Ž���� �ҿ�� �ð�</dd>

	 * </dl>

	 * @return {Void} ��ȯ�� ����

	 * @example



cssquery.debug(function(sQuery, nCost, nExecuteTime) {

	if (nCost > 5000) 

		console.warn('5000 �� �Ѵ� �����?! üũ�غ��� -> ' + sQuery + '/' + nCost);

	else if (nExecuteTime > 200)

		console.warn('0.2�ʰ� �Ѱ� ������?! üũ�غ��� -> ' + sQuery + '/' + nExecuteTime);

}, 20);



....



cssquery.debug(false);



	 */

	cssquery.debug = function(fpCallback, nRepeat) {

		

		debugOption.callback = fpCallback;

		debugOption.repeat = nRepeat || 1;

		

	};

	

	/**

	 * IE ���� innerHTML �� ���� _cssquery_UID ������ �ʵ��� �ϴ� �Լ��̴�.

	 * true �� �����ϸ� �׶����� Ž���ϴ� ��忡 ���ؼ��� innerHTML �� _cssquery_UID �� ������ �ʵ��� ������ Ž���ӵ��� �ټ� ������ �� �ִ�.

	 * @param {Boolean} flag	true �� �����ϸ� _cssquery_UID �� ������ ����

	 * @return {Boolean}	_cssquery_UID �� ������ �ʴ� �����̸� true ��ȯ

	 */

	cssquery.safeHTML = function(bFlag) {

		

		var bIE = /MSIE/.test(window.navigator.userAgent);

		

		if (arguments.length > 0)

			safeHTML = bFlag && bIE;

		

		return safeHTML || !bIE;

		

	};

	

	/**

	 * cssquery �� ���������� ��� �ִ� ���ڿ��̴�.

	 */

	cssquery.version = sVersion;

	

	/**

	 * IE���� validUID,cache�� ��������� �޸� ���� �߻��Ͽ� �����ϴ� ��� �߰�.

	 */

	cssquery.release = function() {

		if(/MSIE/.test(window.navigator.userAgent)){

			

			delete validUID;

			validUID = {};

			

			if(bUseResultCache){

				cssquery.clearCache();

			}

		}

	};

	/**

	 * cache�� ������ �Ǵ��� Ȯ���ϱ� ���� �ʿ��� �Լ�

	 * @ignore

	 */

	cssquery._getCacheInfo = function(){

		return {

			uidCache : validUID,

			eleCache : oResultCache 

		}

	}

	/**

	 * �׽�Ʈ�� ���� �ʿ��� �Լ�

	 * @ignore

	 */

	cssquery._resetUID = function(){

		UID = 0

	}



	return cssquery;

	

})();




/**
 * @fileOverview $Agent�� ������ �� �޼��带 ������ ����
 */

/**
 * Agent ��ü�� ��ȯ�Ѵ�. Agent ��ü�� �������� OS�� ���� ������ �� �� �ֵ��� �Ѵ�.
 * @class Agent ��ü�� �ü��, �������� ����� ����� �ý����� ������ �����´�. 
 * @constructor
 * @author Kim, Taegon  
 */
jindo.$Agent = function() {
	var cl = arguments.callee;
	var cc = cl._cached;
		
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl;	
	if (!cc) cl._cached = this;
	
	this._navigator = navigator;	
}

/**
 * navigator �޼���� �� �������� ���� ��ü�� �����Ѵ�. 
 * @return {Object} �� ������ ������ �����ϴ� ��ü. 
 * object�� ������ �̸��� ������ �Ӽ����� ������. ������ �̸��� ���� �ҹ��ڷ� ǥ���ϸ�, ������� �������� ��ġ�ϴ� ������ �̸��� true�� ������. 
 * @example
oAgent = $Agent().navigator(); // ����ڰ� ���̾����� 3�� ����Ѵٰ� �����Ѵ�. 
oAgent.camino  // false
oAgent.firefox  // true
oAgent.konqueror // false
oAgent.mozilla  //true
oAgent.netscape  // false
oAgent.omniweb  //false
oAgent.opera  //false
oAgent.webkit  /false
oAgent.safari  //false
oAgent.ie  //false
oAgent.chrome  //false
oAgent.icab  //false
oAgent.version  //3
oAgent.nativeVersion //-1 (1.4.2���� ��� ����, IE8���� ȣȯ ��� ���� nativeVersion�� 8�� ����.)
oAgent.getName() // firefox
*/
 
jindo.$Agent.prototype.navigator = function() {
	var info = new Object;
	var ver  = -1;
	var nativeVersion = -1;
	var u    = this._navigator.userAgent;
	var v    = this._navigator.vendor || "";
	
	function f(s,h){ return ((h||"").indexOf(s) > -1) };

	info.getName = function(){
		var name = "";
		for(x in info){
			if(typeof info[x] == "boolean" && info[x])
				name = x;			
		}
		return name;	
	}
		
	info.webkit		= f("WebKit",u);
	info.opera     = (typeof window.opera != "undefined") || f("Opera",u);
	info.ie        = !info.opera && f("MSIE",u);
	info.chrome    = info.webkit && f("Chrome",u);	
	info.safari    = info.webkit && !info.chrome && f("Apple",v);
	info.firefox   = f("Firefox",u);
	info.mozilla   = f("Gecko",u) && !info.safari && !info.chrome && !info.firefox;
	info.camino    = f("Camino",v);
	info.netscape  = f("Netscape",u);
	info.omniweb   = f("OmniWeb",u);
	info.icab      = f("iCab",v);
	info.konqueror = f("KDE",v);

	try {
		if (info.ie) {
			ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
			if (u.match(/(?:Trident)\/([0-9.]+)/)&&u.match(/(?:Trident)\/([0-9.]+)/)[1]==4){
				nativeVersion = 8;
			}
		} else if (info.firefox||info.opera||info.omniweb) {
			ver = u.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1];
		} else if (info.mozilla) {
			ver = u.match(/rv:([0-9.]+)/)[1];
		} else if (info.safari) {
			ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
			if (ver == 100) {
				ver = 1.1;
			} else {
				ver = [1.0,1.2,-1,1.3,2.0,3.0][Math.floor(ver/100)];
			}
		} else if (info.icab) {
			ver = u.match(/iCab[ \/]([0-9.]+)/)[1];
		} else if (info.chrome) {
			ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
		}

		info.version = parseFloat(ver);
		info.nativeVersion = parseFloat(nativeVersion);
		if (isNaN(info.version)) info.version = -1;
	} catch(e) {
		info.version = -1;
	}
	
	this.navigator = function() {
		return info;
	};
	
	return info;
};

/**
 * os �޼���� �ü���� ���� ���� ��ü�� �����Ѵ�.
 * @return {Object} �ü�� ���� ��ü. �ü���� ���� �̸��� �Ӽ����� ������, ����ڰ� ����ϴ� �ü���� ������ �̸��� �Ӽ��� true�� ������.
 * @example
oOS = $Agent().os();  // ������� �ü���� Windows XP��� �����Ѵ�.
oOS.linux  // false
oOS.mac  // false
oOS.vista  // false
oOS.win  // true
oOS.win2000  // false
oOS.winxp  // true
oOS.xpsp2  // false
oOS.win7  // false
oOS.getName() // winxp
 */
jindo.$Agent.prototype.os = function() {
	var info = new Object;
	var u    = this._navigator.userAgent;
	var p    = this._navigator.platform;
	var f    = function(s,h){ return (h.indexOf(s) > -1) };

	info.getName = function(){
		var name = "";
		for(x in info){
			
			if(typeof info[x] == "boolean" && info[x])
				name = x;			
		}
		return name;	
	}
	
	info.win     = f("Win",p)
	info.mac     = f("Mac",p);
	info.linux   = f("Linux",p);
	info.win2000 = info.win && (f("NT 5.0",u) || f("2000",u));
	info.winxp   = info.win && f("NT 5.1",u);
	info.xpsp2   = info.winxp && f("SV1",u);
	info.vista   = info.win && f("NT 6.0",u);
	info.win7  = info.win && f("NT 6.1",u);

	this.os = function() {
		return info;
	};

	return info;
};

/**
 * flash �޼���� �÷��ÿ� ���� ���� ��ü�� �����Ѵ�.
 * @return {Object} Flash ���� ��ü. object.installed�� �÷��� �÷��̾� ��ġ ���θ� boolean ������ ������ object.version�� �÷��� �÷��̾��� ������ ������. �÷��� ������ Ž������ ���ϸ� flash.version�� -1�� ���� ������.
 * @example
var oFlash = $Agent.flash();
oFlash.installed  // �÷��� �÷��̾ ��ġ�ߴٸ� true
oFlash.version  // �÷��� �÷��̾��� ����. 
 */
jindo.$Agent.prototype.flash = function() {
	var info = new Object;
	var p    = this._navigator.plugins;
	var m    = this._navigator.mimeTypes;
	var f    = null;

	info.installed = false;
	info.version   = -1;

	if (typeof p != "undefined" && p.length) {
		f = p["Shockwave Flash"];
		if (f) {
			info.installed = true;
			if (f.description) {
				info.version = parseFloat(f.description.match(/[0-9.]+/)[0]);
			}
		}

		if (p["Shockwave Flash 2.0"]) {
			info.installed = true;
			info.version   = 2;
		}
	} else if (typeof m != "undefined" && m.length) {
		f = m["application/x-shockwave-flash"];
		info.installed = (f && f.enabledPlugin);
	} else {
		for(var i=10; i > 1; i--) {
			try {
				f = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);

				info.installed = true;
				info.version   = i;
				break;
			} catch(e) {}
		}
	}

	this.flash = function() {
		return info;
	};
	// ����ȣȯ�� ���� �ϴ� ���ܵд�.
	this.info = this.flash;

	return info;
};

/**
 * silverlight �޼���� �ǹ�����Ʈ(SilverLight)�� ���� ���� ��ü�� �����Ѵ�.
 * @returns {Object} Silverlight ���� ��ü. object.installed�� �ǹ�����Ʈ �÷��̾� ��ġ ���θ� boolean ������ ������ object.version�� �ǹ�����Ʈ �÷��̾��� ������ ������. �÷��̾��� ������ Ž������ ���ϸ� object.version�� ���� -1�� �ȴ�.
 * @example 
var oSilver = $Agent.silverlight();
oSilver.installed  // SilverLight �÷��̾ ��ġ�ߴٸ� true
oSilver.version  // SilverLight �÷��̾��� ����. 
 */
jindo.$Agent.prototype.silverlight = function() {
	var info = new Object;
	var p    = this._navigator.plugins;
	var s    = null;

	info.installed = false;
	info.version   = -1;

	if (typeof p != "undefined" && p.length) {
		s = p["Silverlight Plug-In"];
		if (s) {
			info.installed = true;
			info.version = parseInt(s.description.split(".")[0]);
			if (s.description == "1.0.30226.2") info.version = 2;
		}
	} else {
		try {
			s = new ActiveXObject("AgControl.AgControl");
			info.installed = true;
			if(s.isVersionSupported("3.0")){
				info.version = 3;
			}else if (s.isVersionSupported("2.0")) {
				info.version = 2;
			} else if (s.isVersionSupported("1.0")) {
				info.version = 1;
			}
		} catch(e) {}
	}

	this.silverlight = function() {
		return info;
	};

	return info;
};

/**
 * @fileOverview $A�� ������ �� �޼��带 ������ ����
 * @name array.js
 */

/**
 * �迭, Ȥ�� �÷����� ���� �迭�� ��ȯ�ϰų� ���ο� $A ��ü�� �����Ѵ�.
 *
 * @extends core
 * @class	$A�� �迭�̳� �迭�� ����� �÷���(Collection)�� �迭�� ��ȯ�Ѵ�. 
 * @param 	{Array} array �迭 Ȥ�� �迭�� ����� �÷���. ���� array�� �����ϸ� �� �迭�� ���� ���ο� $A ��ü�� �����Ѵ�. 
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 */
jindo.$A = function(array) {
	var cl = arguments.callee;
	
	if (typeof array == "undefined") array = [];
	if (array instanceof cl) return array;
	if (!(this instanceof cl)) return new cl(array);
	
	this._array = []
	if (array.constructor != String) {
		this._array = [];
		for(var i=0; i < array.length; i++) {
			this._array[this._array.length] = array[i];
		}
	}
	
};

/**
 * toString �ż���� ���� �迭�� ���ڿ��� �����Ѵ�. �ڹٽ�ũ��Ʈ�� Array.toString�� ����Ѵ�.
 * @return {String} ���� �迭�� ��ȯ�� ���ڿ�.
 * @description [Lite]
 */
jindo.$A.prototype.toString = function() {
	return this._array.toString();
};


/**
 * get �ż���� �ش� �ε����� ���� �����Ѵ�.(1.4.2 ���� ����.)
 * @param {Number} [nIndex] �迭�� �ε���.
 * @return {Value} �ش� �ε����� ��.
 * @description [Lite]
 */
jindo.$A.prototype.get = function(nIndex){
	return this._array[nIndex];
};

/**
 * length �ż���� ���� �迭�� ũ�⸦ �����ϰų� ��ȯ�Ѵ�.
 * 
 * @return 	Number �迭�� ũ��
 * @param 	{Number} [nLen]	���� ������ �迭�� ũ��. nLen�� ������ �迭���� ũ�� oValue���� �ʱ�ȭ�� ���Ҹ� �������� �����δ�. nLen�� ���� �迭���� ������ nLen��° ������ ���Ҵ� �����Ѵ�.
 * @param 	{Value} [oValue]	���ο� ���Ҹ� �߰��� �� ����� �ʱⰪ
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
var birds = [];

$A(zoo).length();
// 4

$A(zoo).length(2);				
// zoo.$value = ["zebra", "giraffe"] 

$A(zoo).length(6, "(Empty)");	
//  zoo.$value = ["zebra", "giraffe", "bear", "monkey", "(Empty)", "(Empty)"]

$A(zoo).length(5, birds);
//  zoo.$value = ["zebra", "giraffe", "bear", "monkey", []]
 */
jindo.$A.prototype.length = function(nLen, oValue) {
	if (typeof nLen == "number") {
		var l = this._array.length;
		this._array.length = nLen;
		
		if (typeof oValue != "undefined") {
			for(var i=l; i < nLen; i++) {
				this._array[i] = oValue;
			}
		}

		return this;
	} else {
		return this._array.length;
	}
};

/**
 * has �޼���� �־��� ���Ұ� �迭�� �����ϴ��� �˻��Ѵ�.
 * @return {Boolean} �迭�� ������ �μ� ���� ������ ���Ҹ� �˻��ߴٸ� true��, �׷��� ������ false�� �����Ѵ�. 
 * @param {Value} oValue �˻��� ��
 * @see $A.indexOf
 * @description [Lite]
 * @example
var arr = $A([1,2,3]);

arr.has(3); // true
arr.has(4); // false
 */
jindo.$A.prototype.has = function(oValue) {
	return (this.indexOf(oValue) > -1);
};

/**
 * indexOf �޼���� ���� �迭�� ���Ҹ� �˻��ϰ�, ã�� ������ �ε����� �����Ѵ�.  
 * @param {Value} oValue �˻��� ��
 * @return {Number} ã�� ������ �ε���. ������ �ε����� 0���� �����Ѵ�. �μ��� ������ ���Ҹ� ã�� ���ϸ� -1 �� �����Ѵ�.
 * @description [Lite]
 * @example
var zoo = ["zebra", "giraffe", "bear"];

$A(zoo).indexOf("giraffe");
// return 1 
 * @see $A.has
 */
jindo.$A.prototype.indexOf = function(oValue) {
	if (typeof this._array.indexOf != 'undefined') return this._array.indexOf(oValue);

	for(var i=0; i < this._array.length; i++) {
		if (this._array[i] == oValue) return i;
	}
	return -1;
};

/**
 * $value �޼���� ���� �迭�� �����Ѵ�.
 * @return {Array} �迭.
 * @description [Lite]
 */
jindo.$A.prototype.$value = function() {
	return this._array;
};

/**
 * push �޼���� ���� �迭�� �ϳ� �̻��� ���Ҹ� �߰��Ѵ�. 
 * @param {oValue1, ..., oValueN} oValueN �߰��� N ���� �� 
 * @return {Number} �ϳ� �̻��� ���Ҹ� �߰��� ���� �迭�� ũ��.
 * @description [Lite]
 * @example
var arr = $A([1,2,3]);

arr.push(4); // arr => [1,2,3,4]
arr.push(5,6); // arr => [1,2,3,4,5,6]
 */
jindo.$A.prototype.push = function(oValue1/*, ...*/) {
	return this._array.push.apply(this._array, Array.prototype.slice.apply(arguments));
};

/**
 * pop �޼���� ���� �迭�� ������ ���Ҹ� �����Ѵ�.
 * @return {Value} ������ ����
 * @description [Lite]
 * @example
var arr = $A([1,2,3,4,5]);
var elem = arr.pop(); 

document.write(elem); // 5
document.write(arr); // [1,2,3,4]
 */
jindo.$A.prototype.pop = function() {
	return this._array.pop();
};

/**
 * shift �޼���� ���� �迭�� ��� ���Ҹ� �� ĭ�� ������ �̵��Ѵ�. ���� �迭�� ù ���Ҵ� �����ȴ�.
 * @return {Value} ������ ù ����.
 * @see $A#pop
 * @see $A#unshift
 * @description [Lite]
 * @example
var arr  = $A(['Melon','Grape','Apple','Kiwi']);
var elem = arr.shift();

document.write(elem); // Melon
document.write(arr);  // [Grape, Apple, Kiwi]
 */
jindo.$A.prototype.shift = function() {
	return this._array.shift();
};

/**
 * unshift �޼���� ���� �迭 �� �տ� �ϳ� �̻��� ���Ҹ� �����Ѵ�.
 * @param {oValue1, ..., oValueN} oValueN �߰��� �ϳ� �̻��� ��
 * @return {Number} ������Ʈ�� �߰��� ���� �迭 ��ü ũ��
 * @description [Lite]
 * @example
var arr = $A([4,5]);

arr.unshift('c');
document.write(arr); // [c, 4, 5]

arr.unshift('a', 'b');
document.write(arr); // [a, b, c, 4, 5]
 */
jindo.$A.prototype.unshift = function(oValue1/*, ...*/) {
	this._array.unshift.apply(this._array, Array.prototype.slice.apply(arguments));

	return this._array.length;
};

/**
 * forEach �޼���� ���� �迭�� ��� ���Ҹ� ��ȸ�ϸ鼭 �ݹ� �Լ��� �����Ѵ�. 
 * @param {Function}	fCallback	��ȸ ������ �ݹ� �Լ�. �ݹ� �Լ��� fCallback(value, index, array)�� ������ ������. 
 * @param {Object}	[oThis]	�ݹ� �Լ��� �޼����� �� �ݹ� �Լ��� this
 * @return {Object}	$A ��ü 
 * @import core.$A[Break, Continue]
 * @see $A#map
 * @description [Lite]
 * @example
$A(["zebra", "giraffe", "bear", "monkey"]).forEach(function(v,i,o) {
	document.writeln((i+1)+". " + v);
});
// ��� : (�� ���� �ּ�ǥ�� //�� ����)
// 1. zebra
// 2. giraffe
// 3. bear
// 4. monkey
 */
jindo.$A.prototype.forEach = function(fCallback, oThis) {
	var arr         = this._array;
	var errBreak    = this.constructor.Break;
	var errContinue = this.constructor.Continue;
	
	function f(v,i,a) {
		try {
			fCallback.call(oThis, v, i, a);
		} catch(e) {
			if (!(e instanceof errContinue)) throw e;
		}
	};

	if (typeof this._array.forEach == "function") {
		try {
			this._array.forEach(f);
		} catch(e) {
			if (!(e instanceof errBreak)) throw e;
		}
		return this;
	}

	for(var i=0; i < arr.length; i++) {
		try {
			f(arr[i], i, arr);
		} catch(e) {
			if (e instanceof errBreak) break;
			throw e;
			
		}
	}

	return this;
};

/**
 * slice �޼���� ���� �迭�� �Ϻθ� �����Ѵ�.
 * @param {Number} nStart �߶� �κ��� ���� �ε���
 * @param {Number} nEnd �߶� �κ��� �ٷ� �� �ε���
 * @returns {$A} ���� �迭�� �Ϻθ� ������ ���ο� $A ��ü. start�� end���� �۰ų� ���� ���, Ȥ�� start�� 0���� ���� ���� �� �迭�� ������ $A�� �����Ѵ�.
 * @description [Lite]
 * @example
var arr = $A([12, 5, 8, 130, 44]);
var newArr = arr.slice(1,3);

document.write(arr); // [12, 5, 8, 130, 44]
document.write(newArr); // [5, 8]
 */
jindo.$A.prototype.slice = function(nStart, nEnd) {
	var a = this._array.slice.call(this._array, nStart, nEnd);
	return jindo.$A(a);
};

/**
 * splice �޼���� ���� �迭�� �Ϻθ� �����Ѵ�.  
 * @param {Number} nIndex	������ ������ ���� �ε���
 * @param {Number} nHowMany	������ ������ ����. �� ���� �����ϸ� index ��° ���Һ��� ������ ���ұ��� �����Ѵ�. ??
 * @param {Value1, ...,ValueN} oValueN ������ �迭�� �߰��� �ϳ� �̻��� ��. ������ nIndex�� ������ ���� �ε������� ���� �����Ѵ�. ??
 * @returns {$A} ������ ���Ҹ� �����ϴ� ���ο� $A ��ü.
 * @description [Lite]
 * @example
var arr = $A(["angel", "clown", "mandarin", "surgeon"]);
var removed = arr.splice(2, 0, "drum");

document.write(arr); // [angel, clown, drum, mandarin, surgeon]
document.write(removed); // []

removed = arr.splice(3, 1);

document.write(arr); // [angel, clown, drum, surgeon]
document.write(removed); // [mandarin]

removed = a.splice(2, 1, "trumpet", "parrot");

document.write(arr); // [angel, clown, trumpet, parrot, surgeon]
document.write(removed); // [drum]
 */
jindo.$A.prototype.splice = function(nIndex, nHowMany/*, oValue1,...*/) {
	var a = this._array.splice.apply(this._array, Array.prototype.slice.apply(arguments));

	return jindo.$A(a);
};

/**
 * shuffle �޼���� ���� �迭�� ���Ҹ� �������� ���´�.
 * @returns {$A} ������ $A ��ü.
 * @description [Lite]
 * @example
var dice = $A([1,2,3,4,5,6]);

dice.shuffle();

document.write("You get the number " + dice[0]);
// ��� : 1���� 6������ ���� �� ������ ����
 */
jindo.$A.prototype.shuffle = function() {
	this._array.sort(function(a,b){ return Math.random()>Math.random()?1:-1 });
	
	return this;
};

/**
 * reverse �޼���� ���� �迭�� ���� ������ �Ųٷ� �����´�.
 * @returns {$A} ���� ������ ������ $A ��ü.
 * @description [Lite]
 * @example
var arr = $A([1, 2, 3, 4, 5]);

arr.reverse();
document.write(arr); // [5, 4, 3, 2, 1]
 */
jindo.$A.prototype.reverse = function() {
	this._array.reverse();

	return this;
};

/**
 * empty �޼���� �迭�� ��� ���Ҹ� �����ϰ�, �� �迭�� �����.
 * @returns {$A} �� �迭 $A ��ü
 * @description [Lite]
 * @example
var arr = $A([1, 2, 3]);

arr.empty();
document.write(arr); // []
 */
jindo.$A.prototype.empty = function() {
	return this.length(0);
};

/**
 * Break �޼���� each, filter, map �޼����� ��ȸ ������ �ߴ��Ѵ�.
 * @description [Lite]
 * @example
$A([1,2,3,4,5]).forEach(function(value,index,array) {
   // ���� 4���� ũ�� ����
  if (value > 4) $A.Break();
   ...
});
 */
jindo.$A.Break = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * Continue �޼���� each, filter, map �޼����� ��ȸ �������� ������ ������ �������� �ʰ� ���� ������ �ǳʶڴ�.
 * ���������δ� ������ exception�� �߻���Ű�� �����̹Ƿ�, try ~ catch �������� �� �޼ҵ带 �����ϸ� ���������� �������� ���� �� �ִ�.
 * 
 * @description [Lite]
 * @example
$A([1,2,3,4,5]).forEach(function(value,index,array) {
   // ���� ¦���� ó���� ���� ����
  if (value%2 == 0) $A.Continue();
   ...
});
 */
jindo.$A.Continue = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * @fileOverview $A�� Ȯ�� �޼��带 ������ ����
 * @name array.extend.js
 */

/**
 * map �޼���� ���� �迭�� ��� ���Ҹ� ��ȸ�ϸ鼭 �ݹ� �Լ��� �����Ѵ�.
 * @param {Function} fCallback	��ȸ ������ �ݹ� �Լ�. �ݹ� �Լ��� fCallback(value, index, array)�� ������ ������. 
 * @param {Object} [oThis]	�ݹ� �Լ��� �޼����� �� �ݹ� �Լ��� this		
 * @return {$A} �ݹ� �Լ� ���� ����� �ݿ��� $A ��ü
 * @see $A#forEach
 * @example
var animalList = $A(["zebra", "giraffe", "bear", "monkey"]).map(function(v,i,o) {
	return (i+1)+". " + v;
});
	
document.write (animalList.$value());
// ��� : [1. zebra, 2. giraffe, 3. bear, 4. moneky]
 */
jindo.$A.prototype.map = function(fCallback, oThis) {
	var arr         = this._array;
	var errBreak    = this.constructor.Break;
	var errContinue = this.constructor.Continue;
	
	function f(v,i,a) {
		try {
			return fCallback.call(oThis, v, i, a);
		} catch(e) {
			if (e instanceof errContinue){
				return v;
			} else{
				throw e;				
			}
		}
	};

	if (typeof this._array.map == "function") {
		try {
			this._array = this._array.map(f);
		} catch(e) {
			if(!(e instanceof errBreak)) throw e;
		}
		return this;
	}

	for(var i=0; i < this._array.length; i++) {
		try {
			arr[i] = f(arr[i], i, arr);
		} catch(e) {
			if (e instanceof errBreak) break;
			throw e;
		}
	}

	return this;
};

/**
 * filter �޼���� ���� �迭�� ��� ���Ҹ� ��ȸ�ϸ鼭 �ݹ� �Լ��� �����Ѵ�. �ݹ� �Լ��� �����ϴ� ���Ҵ� ���ο� $A ��ü�� ���� �迭�� �߰��ȴ�. 
 * @param {Function} fCallback	��ȸ ������ �ݹ� �Լ�. �ݹ� �Լ��� Boolean ���� �����ؾ� �Ѵ�.
 * @param {Object} oThis	�ݹ� �Լ��� �޼����� ��� �ݹ� �Լ��� this
 * @returns {$A}	�ݹ� �Լ��� �����ϴ� ���Ҹ� �����ϴ� $A ��ü.
 * @example
var arr = $A([1,2,3,4,5]);

// ���͸� �Լ�
function filterFunc(element, index, array) {
	if (element > 2) {
		return true;
	} else {
		return false;
	}
}

var newArr = arr.filter(filterFunc);

document.write(arr); // [1,2,3,4,5]
document.write(newArr); // [3,4,5]
 */
jindo.$A.prototype.filter = function(fCallback, oThis) {
	var ar = new Array;

	this.forEach(function(v,i,a) {
		if (fCallback.call(oThis, v, i, a) === true) {
			ar[ar.length] = v;
		}
	});

	return jindo.$A(ar);
};

/**
 * every �޼���� ���� �迭�� ��� ���Ұ� �ݹ� �Լ��� �����ϴ��� �˻��Ѵ�.
 * @param {Function} fCallback	��ȸ ������ �ݹ� �Լ�. �ݹ� �Լ��� �ݵ�� boolean ���� �����ؾ� �Ѵ�. 
 * @param {Object} oThis	�ݹ� �Լ��� �޼����� ��� �ݹ� �Լ��� this
 * @returns {Boolean} ���� �迭�� ��� ���Ұ� �ݹ� �Լ��� �����ϸ� true, �׷��� ������ false�� �����Ѵ�.
 * @example
function isBigEnough(element, index, array) {
		return (element >= 10);
	}

var try1 = $A([12, 5, 8, 130, 44]).every(isBigEnough);
// false

var try2 = $A([12, 54, 18, 130, 44]).every(isBigEnough);
// true
 */
jindo.$A.prototype.every = function(fCallback, oThis) {
	if (typeof this._array.every != "undefined") return this._array.every(fCallback, oThis);

	var result = true;
	this.forEach(function(v, i, a) {
		if (fCallback.call(oThis, v, i, a) === false) {
			result = false;
			jindo.$A.Break();
		}
	});
	return result;
};

/**
 * some �޼���� ���� �迭�� �ݹ� �Լ��� ������Ű�� ���Ұ� �ִ��� �˻��Ѵ�. 
 * @param {Function} fCallback	��ȸ ������ �ݹ� �Լ�. �ݹ� �Լ��� �ݵ�� Boolean ���� �����ؾ� �Ѵ�. 
 * @param {Object} oThis	�ݹ� �Լ��� �޼����� ��� �ݹ� �Լ��� this
 * @returns {Boolean} ���� �迭�� �ݹ� �Լ��� ������Ű�� ���Ұ� ������ true, �ݹ� �Լ��� ������Ű�� ���Ұ� �ϳ��� ���ٸ� false�� �����Ѵ�.
 * @example
function twoDigitNumber(element, index, array) {
	return (element >= 10 && element < 100);
}

var try1 = $A([12, 5, 8, 130, 44]).some(twoDigitNumber);
// true

var try2 = $A([1, 5, 8, 130, 4]).some(twoDigitNumber);
// false
 */
jindo.$A.prototype.some = function(fCallback, oThis) {
	if (typeof this._array.some != "undefined") return this._array.some(fCallback, oThis);

	var result = false;
	this.forEach(function(v, i, a) {
		if (fCallback.call(oThis, v, i, a) === true) {
			result = true;
			jindo.$A.Break();
		}
	});
	return result;
};

/**
 * refuse �޼���� Ư�� ���� ������ ���ο� $A ��ü�� �����Ѵ�.
 * @param {Value, ..., ValueN} oValueN ���� �迭���� ������ ��
 * @returns {$A} ���� �迭���� Ư�� ���� ������ ���ο� $A ��ü
 * @example
var arr = $A([12, 5, 8, 130, 44]);

var newArr1 = arr.refuse(12);

document.write(arr); // [12, 5, 8, 130, 44]
document.write(newArr1); // [5, 8, 130, 44]

var newArr2 = newArr1.refuse(8, 44, 130);

document.write(newArr1); // [5, 8, 130, 44]
document.write(newArr2); // [5]
 */
jindo.$A.prototype.refuse = function(oValue1/*, ...*/) {
	var a = jindo.$A(Array.prototype.slice.apply(arguments));
	return this.filter(function(v,i) { return !a.has(v) });
};

/**
 * unique �޼���� ���� �迭���� �ߺ��Ǵ� ���Ҹ� �����Ѵ�.
 * @returns {$A} �ߺ��Ǵ� ���Ҹ� ������ $A ��ü. 
 * @example
var arr = $A([10, 3, 76, 5, 4, 3]);

arr.unique();
document.write(arr); // [10, 3, 76, 5, 4]
 */
jindo.$A.prototype.unique = function() {
	var a = this._array, b = [], l = a.length;
	var i, j;

	// �ߺ��Ǵ� ���� ����
	for(i = 0; i < l; i++) {
		for(j = 0; j < b.length; j++) {
			if (a[i] == b[j]) break;
		}
		
		if (j >= b.length) b[j] = a[i];
	}
	
	this._array = b;
	
	return this;
};

/**
 * @fileOverview $Ajax�� ������ �� �޼��带 ������ ����
 * @name Ajax.js
 */

/**
 * $Ajax ��ü�� ���� �� �����Ѵ�.
 * @extends core
 * @class $Ajax�� ajax ��û�� ������ ó���Ѵ�.
 * @param {String}   url			  ������ URL. URL�� "http://" Ȥ�� "https://�� �����ϸ� �ڵ����� Cross-domain ajax�� ȣ���Ѵ�. Cross-domain ajax�� ���� �ڼ��� ������ http://wiki.nhncorp.com/display/lsuit/Jindo2+Cross-domain+Ajax �� �����Ѵ�.
 * @param {Object}   option		      HTTP ��û�� ����� �Ű�����.
 * @param {String}   option.type	  ��û Ÿ��. "xhr", "iframe", "jsonp", "flash" �߿� ������ �� �ִ�. ���� ȣȯ���� ���� "post" Ȥ�� "get"�� �����ϸ�, "post", "get"���� �����ϸ� type�� �ڵ������� "xhr"�� �ȴ�. �⺻���� "xhr"�̴�.
 * @param {String}   option.method	  HTTP ��û�� ����� ���. "post", "get", "put", "delete"�� �̿��Ѵ�. ��, Ư�� type���� ��û ����� �����Ǵ� ��찡 �ִ�. ���� ��� type�� jsonp���� �����ߴٸ� method�� ���������� get�� �ȴ�. �⺻���� "post"�̴�.(1.4.2���� put,delete ��� ����.)
 * @param {Number}   option.timeout   ��û�� �����ð� ���� ��û�� �Ϸ���� ������ ������Ų��. ������ ���̴�.
 * @param {Function} option.onload	  ��û�� �Ϸ�Ǹ� ������ �ݹ� �Լ�
 * @param {Function} option.onerror	  ��û�� �����ϸ� ������ �ݹ� �Լ�. �������� �ʾ��� ��쿡�� ������ �߻��ص� onload�� �����Ѵ�.
 * @param {Function} option.ontimeout Ÿ�Ӿƿ��� �Ǿ��� �� ������ �ݹ� �Լ�
 * @param {String} option.proxy		  Ajax�� �����ϴ� ���� ������ ������ �����ο� �����ϴ� proxy ������ ��ġ. Jindo�� �Բ� �����ϴ� ajax_local_callback.html�� ����Ѵ�. type�� iframe���� �����ߴٸ� �ݵ�� proxy�� �����ؾ� �Ѵ�.
 * @param {String} option.jsonp_charset	type�� jsonp�� �������� �� ��û�� ����� ���ڵ� ���. ������ ���ڼ��� �׻� UTF-8�̴�(0.4.2 ���� ����).
 * @param {String} option.callbackid	type�� jsonp�� �������� ��, callback�Լ� �̸��� ����� id�� ���� ����.(1.3.0 ���� ����).
 * @param {String} option.callbackname	type�� jsonp�� �������� ��, ������ �����ϴ� �Ķ���͸� �����Ҽ� �ִ�.�⺻���� _callback��,(1.3.8 ���� ����).
 * @param {Boolean} option.sendheader  ��û����� �������� ����. Flash ������� ȣ��� crossdomain.xml�� allow-header ���� ��� false����. ����Ʈ�� true(1.3.4���� ����) 
 * @param {Boolean} option.async  �񵿱� ȣ�� ����. XHR��Ŀ����� ��ȿ. ����Ʈ�� true(1.3.7���� ����) 
 * @param {Boolean} option.decode flash������ ���Ǹ� ��û�� ������ �ȿ� utf-8�ƴ� �ٸ� ���ڵ��� �Ǿ� ������ false ���.�⺻�� true(1.4.0���� ����)  
 * @param {Boolean} option.postBody request ��û�� �Ѿ�� �Ķ���͸� postBody�� ������� ����. XHR�� POST/PUT/DELETE ������ ��ȿ��. �⺻�� false(1.4.2���� ����.)
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 */
jindo.$Ajax = function (url, option) {
	var cl = arguments.callee;
	if (!(this instanceof cl)) return new cl(url, option);

	function _getXHR() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (ActiveXObject) {
			try { 
				return new ActiveXObject('MSXML2.XMLHTTP'); 
			}catch(e) { 
				return new ActiveXObject('Microsoft.XMLHTTP'); 
			}
			return null;
		}
	}

	var loc    = location.toString();
	var domain = '';
	try { domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1]; } catch(e) {}
	
	this._status = 0;
	this._url = url;
	this._options  = new Object;
	this._headers  = new Object;
	this._options = {
		type   :"xhr",
		method :"post",
		proxy  :"",
		timeout:0,
		onload :function(req){},
		onerror :null,
		ontimeout:function(req){},
		jsonp_charset : "utf-8",
		callbackid : "",
		callbackname : "",
		sendheader : true,
		async : true,
		decode :true,
		postBody :false
	};

	this.option(option);
	
	// �׽�Ʈ�� ���� �켱 ���밡���� ���� ��ü�� �����ϸ� ����
	if(jindo.$Ajax.CONFIG){
		this.option(jindo.$Ajax.CONFIG);
	}	

	var _opt = this._options;

	_opt.type   = _opt.type.toLowerCase();
	_opt.method = _opt.method.toLowerCase();

	if (typeof window.__jindo2_callback == "undefined") {
		window.__jindo2_callback = new Array();
	}

	switch (_opt.type) {
		case "put":
		case "delete":
		case "get":
		case "post":
			_opt.method = _opt.type;
			_opt.type   = "xhr";
		case "xhr":
			this._request = _getXHR();
			break;
		case "flash":
			if(!jindo.$Ajax.SWFRequest) throw Error('Require $Ajax.SWFRequest');
			this._request = new jindo.$Ajax.SWFRequest();
			this._request._decode = _opt.decode;
			break;
		case "jsonp":
			if(!jindo.$Ajax.JSONPRequest) throw Error('Require $Ajax.JSONPRequest');
			_opt.method = "get";
			this._request = new jindo.$Ajax.JSONPRequest();
			this._request.charset = _opt.jsonp_charset;
			this._request.callbackid = _opt.callbackid;
			this._request.callbackname = _opt.callbackname;
			break;
		case "iframe":
			if(!jindo.$Ajax.FrameRequest) throw Error('Require $Ajax.FrameRequest');
			this._request = new jindo.$Ajax.FrameRequest();
			this._request._proxy = _opt.proxy;
			break;
	}
};

/**
 * @ignore
 */
jindo.$Ajax.prototype._onload = (function(isIE) {
	if(isIE){
		return function(){
			var bSuccess = this._request.readyState == 4 && this._request.status == 200;
			var oResult;
			if (this._request.readyState == 4) {
				  try {
						if (this._request.status != 200 && typeof this._options.onerror == 'function'){
							if(!this._request.status == 0){
								this._options.onerror(jindo.$Ajax.Response(this._request));
							}
						}else{
							oResult = this._options.onload(jindo.$Ajax.Response(this._request));
						} 
				}finally{
					if(typeof this._oncompleted == 'function'){
						this._oncompleted(bSuccess, oResult);
					}
					this.abort();
					delete this._request.onreadystatechange;
					try { delete this._request.onload; } catch(e) { this._request.onload =undefined;} 
				}
			}
		}
	}else{
		return function(){
			var bSuccess = this._request.readyState == 4 && this._request.status == 200;
			var oResult;
			if (this._request.readyState == 4) {
				  try {
						if (this._request.status != 200 && typeof this._options.onerror == 'function'){
							this._options.onerror(jindo.$Ajax.Response(this._request));
						}else{
							oResult = this._options.onload(jindo.$Ajax.Response(this._request));
						} 
				}finally{
					this._status--;
					if(typeof this._oncompleted == 'function'){
						this._oncompleted(bSuccess, oResult);
					} 
				}
			}
		}
	}
})(/MSIE/.test(window.navigator.userAgent));

/**
 * request �޼���� ajax ��û�� �����Ѵ�. ajax ��û�� ����� �Ű������� �����ڿ��� �����ϰų� option �޼��忡�� ������ �� �ִ�.  ��û Ÿ���� 'flash'�̸� �� �޼ҵ带 �����ϱ� ���� body �±� ���ο��� $Ajax.SWFRequest.write() ���ɾ �ݵ�� �����ؾ� �Ѵ�.
 * @param {Object} oData ������ ������ ������.
 * @description [Lite]
 * @example
var ajax = $Ajax("http://www.remote.com", {
   onload : function(res) {
      // onload �ڵ鷯
   }
});

ajax.request( {key1:"value1", key2:"value2"} );
 */
jindo.$Ajax.prototype.request = function(oData) {
	this._status++;
	var t   = this;
	var req = this._request;
	var opt = this._options;
	var data, v,a = [], data = "";
	var _timer = null;
	var url = this._url;

	if( opt.postBody && opt.type.toUpperCase()=="XHR" && opt.method.toUpperCase()!="GET"){
		if(typeof oData == 'string'){
			data = oData;
		}else{
			data = $Json(oData).toString();	
		}	
	}else if (typeof oData == "undefined" || !oData) {
		data = null;
	} else {

		for(var k in oData) {
			v = oData[k];
			if (typeof v == "function") v = v();
			
			if (v instanceof Array || v instanceof jindo.$A) {
				jindo.$A(v).forEach(function(value,index,array) {
					a[a.length] = k+"="+encodeURIComponent(value);
				});
			} else {
				a[a.length] = k+"="+encodeURIComponent(v);
			}
		}
		data = a.join("&");
	}
	
	// XHR GET ��� ��û�� ��� URL�� �Ķ���� �߰�
	if(opt.type.toUpperCase()=="XHR" && opt.method.toUpperCase()=="GET"){
		if(url.indexOf('?')==-1){
			url += "?";
		} else {
			url += "&";			
		}
		url += data;
		data = null;
	}

	req.open(opt.method.toUpperCase(), url, opt.async);
	
	if (opt.sendheader) {
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		req.setRequestHeader("charset", "utf-8");
		for (var x in this._headers) {
			if (typeof this._headers[x] == "function") 
				continue;
			req.setRequestHeader(x, String(this._headers[x]));
		}
	}
	
	if(req.addEventListener){
		if(this._loadFunc){ req.removeEventListener("load", this._loadFunc, false); }
		this._loadFunc = function(rq){ clearTimeout(_timer); t._onload(rq) }
		req.addEventListener("load", this._loadFunc, false);
	}else{
		if (typeof req.onload != "undefined") {
			req.onload = function(rq){ clearTimeout(_timer); t._onload(rq) };
		} else {
			req.onreadystatechange = function(rq){  clearTimeout(_timer); t._onload(rq) };
		}
	}

	if (opt.timeout > 0) {
		_timer = setTimeout(function(){ 
				try{ req.abort(); }catch(e){}; 
				opt.ontimeout(req);	
				if(typeof this._oncompleted == 'function') this._oncompleted(false); 
		}, opt.timeout * 1000);
	}

	req.send(data);

	return this;
};

/**
 * isIdle �޼���� ajax ��ü�� ���� ��û ��� �������� ��ȯ�Ѵ�.    
 * @return ���� ������ ���� ��ȯ
 * @since 1.3.5
 * @description [Lite]
 * @example
 var ajax = $Ajax("http://www.remote.com",{
     onload : function(res){
         // onload �ڵ鷯
     }
});

if(ajax.isIdle) ajax.request(); 
 
 */
jindo.$Ajax.prototype.isIdle = function(){
	return this._status==0;
}

/**
 * abort �޼���� ������ ������ ajax ��û�� ����Ѵ�. abort �޼��带 ����ϸ� ��Ʈ��ũ ������ ������ ������̴� ��û�� ��ҵȴ�. ajax ��û�� ������ �ʹ� ���� �ɷ��� ����ϰ� ���� ��� abort �޼��带 ����� �� �ִ�.
 * @return ������ ����� $Ajax ��ü
 * @description [Lite]
 * @example
var ajax = $Ajax("http://www.remote.com", {
   onload : function(res) {
      // onload �ڵ鷯
   }
}).request( {key1:"value1", key2:"value2"} );

function stopRequest() {
    ajax.abort();
}
 */
jindo.$Ajax.prototype.abort = function() {
	try {
		this._request.abort();
	}finally{
		this._status--;
	}

	return this;
};

/**
 * option �޼���� ajax ��û���� ����� �Ű������� �������ų� �����Ѵ�.
 * �Ű������� �����Ϸ��� �Ű� ������ �̸��� ��, Ȥ�� �Ű������� �̸��� ���� ���ҷ� ������ �ϳ��� ��ü�� �μ��� ����Ѵ�.
 * ���� ���� ���� ���Ҹ� ���� ��ü�� ����ϸ� �� �� �̻��� �Ű������� �� ���� ������ �� �ִ�.
 * @param {string|object} name �Ű������� ������ ��ü, Ȥ�� ������ �� �Ű������� �̸�
 * @param {String}  [value] ���� ������ �Ű������� ��
 * @return {String|$Ajax}  �Ű����� ���� ������ ���� ���ڿ���, �Ű����� ���� ������ ���� $Ajax ��ü�� �����Ѵ�.
 * @description [Lite]
 * @example
var request_type = ajax.option("type");
// ajax�� type �Ű����� ���� �����Ѵ�.

ajax.option("method", "post");
// ajax�� method �Ű������� post�� �ʱ�ȭ�Ѵ�.

ajax.option( { timeout : 0, onload : handler_func } );
// ajax�� timeout, onload �Ű������� ���� 0�� handler_func�� �ʱ�ȭ�Ѵ�.
 */
jindo.$Ajax.prototype.option = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._options[name];
		this._options[name] = value;
		return this;
	}

	try { for(var x in name) this._options[x] = name[x] } catch(e) {};

	return this;
};

/**
 * header �޼���� ajax ��û���� ����� HTTP ��û ����� �������ų� �����Ѵ�.
 * ����� �����Ϸ��� ����� �̸��� ��, Ȥ�� ����� �̸��� ���� ���ҷ� ������ �ϳ��� ��ü�� �μ��� ����Ѵ�.
 * ���� ���� ���� ���Ҹ� ���� ��ü�� ����ϸ� �� �� �̻��� ����� �� ���� ������ �� �ִ�.
 * �Ű� ������ ���� ���������� �ܼ��� ������ �� �Ű������� �̸��� �����Ѵ�.
 * @param {String} name ������ ���ų� ������ ��� �̸�
 * @param {Value} [value] ���� ������ ��� ��
 * @return {String|$Ajax} ������ ����� Ȥ�� $Ajax ��ü
 * @description [Lite]
 * @example
var customheader = ajax.header("myHeader");
// HTTP ��û ������� myHeader�� ��

ajax.header( "myHeader", "someValue" );
// HTTP ��û ����� myHeader = someValue

ajax.header( { anotherHeader : "someValue2" } );
// HTTP ��û ����� anotherHeader = someValue2
 */
jindo.$Ajax.prototype.header = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._headers[name];
		this._headers[name] = value;
		return this;
	}

	try { for(var x in name) this._headers[x] = name[x] } catch(e) {};

	return this;
};

/**
 * Ajax ���� ��ü
 * @class
 * @constructor
 * @param {Object} req ��û ��ü
 * @description [Lite]
 */
jindo.$Ajax.Response  = function(req) {
	if (this === jindo.$Ajax) return new jindo.$Ajax.Response(req);
	this._response = req;
};

/**
 * ������ XML ��ü�� ��ȯ�Ѵ�.
 * @return {Object} ���� XML ��ü. XHR�� responseXML�� �����ϴ�.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.xml = function() {
	return this._response.responseXML;
};

/**
 * ������ ���ڿ��� ��ȯ�Ѵ�.
 * @return {String} ���� ���ڿ�. XHR�� responseText�� �����ϴ�.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.text = function() {
	return this._response.responseText;
};

/**
 * �����ڵ带 ��ȯ�Ѵ�.
 * @return {int} ���� �ڵ�. http�����ڵ�ǥ ����.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.status = function() {
	return this._response.status;
};

/**
 * readyState�� ��ȯ�Ѵ�.
 * @return {int}  readyState. 
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.readyState = function() {
	return this._response.readyState;
};

/**
 * ������ Json��ü�� ��ȯ�Ѵ�.
 * @return {Object} ���� JSON ��ü. ���� ���ڿ��� �ڵ����� JSON ��ü�� ��ȯ �� ��ȯ�Ѵ�. ��ȯ �������� ������ �߻��ϸ� �� ��ü�� ��ȯ�Ѵ�.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.json = function() {
	if (this._response.responseJSON) {
		return this._response.responseJSON;
	} else if (this._response.responseText) {
		try {
			return new Function("return "+this._response.responseText)();
		} catch(e) {
			return {};
		}
	}

	return {};
};

/**
 * ��������� �����´�. ���ڸ� �������� ������ ��� ����� ��ȯ�Ѵ�.
 * @param {String} name ������ ��������� �̸�
 * @return {String|Object} ���ڰ� ���� ���� �ش��ϴ� ��� ����, �׷��� ������ ��ü ����� ��ȯ�Ѵ�.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.header = function(name) {
	if (typeof name == "string") return this._response.getResponseHeader(name);
	return this._response.getAllResponseHeaders();
};

/**
 * @fileOverview $Ajax�� Ȯ�� �޼��带 ������ ����
 * @name Ajax.extend.js
 */

/**
 * @class
 */
jindo.$Ajax.RequestBase = jindo.$Class({
	_respHeaderString : "",
	callbackid:"",
	callbackname:"",
	responseXML  : null,
	responseJSON : null,
	responseText : "",
	status : 404,
	readyState : 0,
	$init  : function(){},
	onload : function(){},
	abort  : function(){},
	open   : function(){},
	send   : function(){},
	setRequestHeader  : function(sName, sValue) {
		this._headers[sName] = sValue;
	},
	getResponseHeader : function(sName) {
		return this._respHeaders[sName] || "";
	},
	getAllResponseHeaders : function() {
		return this._respHeaderString;
	},
	_getCallbackInfo : function() {
		var id = "";

		if(this.callbackid!="") {
			var idx = 0;
			do {
				id = "_" + this.callbackid + "_"+idx;
				idx++;
			} while (window.__jindo2_callback[id]);	
		}else{
			do {
				id = "_" + Math.floor(Math.random() * 10000);
			} while (window.__jindo2_callback[id]);
		}
		if(this.callbackname == ""){
			this.callbackname = "_callback";
		}
			   
		return {callbackname:this.callbackname,id:id,name:"window.__jindo2_callback."+id};
	}
});

/**
 * @class
 */
jindo.$Ajax.JSONPRequest = jindo.$Class({
	_headers : {},
	_respHeaders : {},
	charset : "utf-8",
	_script : null,
	_onerror : null,
	_callback : function(data) {
		
		if (this._onerror) {
			clearTimeout(this._onerror);
			this._onerror = null;
		}
			
		var self = this;

		this.responseJSON = data;
		this.onload(this);
		setTimeout(function(){ self.abort() }, 10);
	},
	abort : function() {
		if (this._script) {
			try { 
				this._script.parentNode.removeChild(this._script); 
			}catch(e){
				
			};
		}
	},
	open  : function(method, url) {
		this.responseJSON = null;

		this._url = url;
	},
	send  : function(data) {
		var t    = this;
		var info = this._getCallbackInfo();
		var head = document.getElementsByTagName("head")[0];

		this._script = jindo.$("<script>");
		this._script.type    = "text/javascript";
		this._script.charset = this.charset;

		if (head) {
			head.appendChild(this._script);
		} else if (document.body) {
			document.body.appendChild(this._script);
		}

		window.__jindo2_callback[info.id] = function(data){
			try {
				t.readyState = 4;
				t.status = 200;
				t._callback(data);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};
		
		var agent = jindo.$Agent(); 
		if (agent.navigator().ie || agent.navigator().opera) {
			this._script.onreadystatechange = function(){			
				if (this.readyState == 'loaded'){
					if (!t.responseJSON) {
						t.readyState = 4;
						t.status = 500;
						t._onerror = setTimeout(function(){t._callback(null);}, 200);
					}
					this.onreadystatechange = null;
				}
			};
		} else {
			this._script.onload = function(){
				if (!t.responseJSON) {
					t.readyState = 4;
					t.status = 500;
					t._onerror = setTimeout(function(){t._callback(null);}, 200);
				}
				this.onload = null;
				this.onerror = null;
			};
			this._script.onerror = function(){
				if (!t.responseJSON) {
					t.readyState = 4;
					t.status = 404;
					t._onerror = setTimeout(function(){t._callback(null);}, 200);
				}
				this.onerror = null;
				this.onload = null;
			};
		}
		
		var delimiter = "&";
		if(this._url.indexOf('?')==-1){
			delimiter = "?";
		}
		if (data) {
			data = "&" + data;
		}else{
			data = "";
		}
		// test url for spec.
		this._test_url = this._url+delimiter+info.callbackname+"="+info.name+data;
		this._script.src = this._url+delimiter+info.callbackname+"="+info.name+data;
				
	}
}).extend(jindo.$Ajax.RequestBase);

/**
 * @class
 */
jindo.$Ajax.SWFRequest = jindo.$Class({
	_decode : true,
	_headers : {},
	_respHeaders : {},
	_callback : function(status, data, headers){
		this.readyState = 4;
		// ���� ȣȯ�� ���� status�� boolean ���� ��쵵 ó��
		if( (typeof status).toLowerCase() == 'number'){
			this.status = status;
		}else{
			if(status==true) this.status=200;
		}		
		if (this.status==200) {
			if (typeof data == "string") {
				try {
					this.responseText = this._decode?decodeURIComponent(data):data;
					if(!this.responseText || this.responseText=="") {
						this.responseText = data;
					}	
				} catch(e) {
					//������ �ȿ� utf-8�� �ƴ� �ٸ� ���ڵ��϶� ���ڵ��� ���ϰ� �ٷ� text�� ����.
					if(e.name == "URIError"){
						this.responseText = data;
						if(!this.responseText || this.responseText=="") {
							this.responseText = data;
						}
					}
				}
			}
			// �ݹ��ڵ�� �־�����, ���� SWF���� ������� ���� ����
			if(typeof headers == "object"){
				this._respHeaders = headers;				
			}
		}
		
		this.onload(this);
	},
	open : function(method, url) {
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;

		this._url    = url;
		this._method = method;
	},
	send : function(data) {
		this.responseXML  = false;
		this.responseText = "";

		var t    = this;
		var dat  = {};
		var info = this._getCallbackInfo();
		var swf  = window.document[jindo.$Ajax.SWFRequest._tmpId];

		function f(arg) {
			switch(typeof arg){
				case "string":
					return '"'+arg.replace(/\"/g, '\\"')+'"';
					break;
				case "number":
					return arg;
					break;
				case "object":
					var ret = "", arr = [];
					if (arg instanceof Array) {
						for(var i=0; i < arg.length; i++) {
							arr[i] = f(arg[i]);
						}
						ret = "["+arr.join(",")+"]";
					} else {
						for(var x in arg) {
							arr[arr.length] = f(x)+":"+f(arg[x]);
						}
						ret = "{"+arr.join(",")+"}";
					}
					return ret;
				default:
					return '""';
			}
		}

		data = (data || "").split("&");

		for(var i=0; i < data.length; i++) {
			pos = data[i].indexOf("=");
			key = data[i].substring(0,pos);
			val = data[i].substring(pos+1);

			dat[key] = decodeURIComponent(val);
		}

		window.__jindo2_callback[info.id] = function(success, data){
			try {
				t._callback(success, data);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};
		
		var oData = {
			url  : this._url,
			type : this._method,
			data : dat,
			charset  : "UTF-8",
			callback : info.name,
			header_json : this._headers
		};
			
		swf.requestViaFlash(f(oData));
	}
}).extend(jindo.$Ajax.RequestBase);

/**
 * $Ajax.SWFRequest.write�� ��û Ÿ���� flash�� ��, request �޼ҵ尡 ȣ��Ǳ� �� �ݵ�� �� �� �����ؾ� �Ѵ�(�� �� �̻� �����ص� ������ �߻��Ѵ�). �� ���ɾ ȣ��Ǹ� ����� ���� swf ��ü�� ���� ���� �߰��ȴ�.
 * @param {String} [swf_path] ����� ����� swf ������ ���. �⺻���� "./ajax.swf" �̴�.
 */
jindo.$Ajax.SWFRequest.write = function(swf_path) {
	if(typeof swf_path == "undefined") swf_path = "./ajax.swf";
	jindo.$Ajax.SWFRequest._tmpId = 'tmpSwf'+(new Date).getMilliseconds()+Math.floor(Math.random()*100000);

	document.write('<div style="position:absolute;top:-1000px;left:-1000px"><object id="'+jindo.$Ajax.SWFRequest._tmpId+'" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"><param name="movie" value="'+swf_path+'"><param name = "allowScriptAccess" value = "always" /><embed name="'+jindo.$Ajax.SWFRequest._tmpId+'" src="'+swf_path+'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true"></embed></object></div>');
};

/**
 * flash�� �ε� �Ǿ����� Ȯ�� �ϴ� ����.
 */
jindo.$Ajax.SWFRequest.activeFlash = false;

/**
 * flash���� �ε� �� ���� ��Ű�� �Լ�.
 * @ignore
 */
jindo.$Ajax.SWFRequest.loaded = function(){
	jindo.$Ajax.SWFRequest.activeFlash = true;
}

/**
 * @class
 */
jindo.$Ajax.FrameRequest = jindo.$Class({
	_headers : {},
	_respHeaders : {},
	_frame  : null,
	_proxy  : "",
	_domain : "",
	_callback : function(id, data, header) {
		var self = this;

		this.readyState   = 4;
		this.status = 200;
		this.responseText = data;

		this._respHeaderString = header;
		header.replace(/^([\w\-]+)\s*:\s*(.+)$/m, function($0,$1,$2) {
			self._respHeaders[$1] = $2;
		});

		this.onload(this);

		setTimeout(function(){ self.abort() }, 10);
	},
	abort : function() {
		if (this._frame) {
			try {
				this._frame.parentNode.removeChild(this._frame);
			} catch(e) {
			}
		}
	},
	open : function(method, url) {
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var dom = document.location.toString().match(re);

		this._method = method;
		this._url    = url;
		this._remote = String(url).match(/(https?:\/\/[a-z0-9_\-\.]+)(:[0-9]+)?/i)[0];
		this._frame = null;
		this._domain = (dom[1] != document.domain)?document.domain:"";
	},
	send : function(data) {
		this.responseXML  = "";
		this.responseText = "";

		var t      = this;
		var re     = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var info   = this._getCallbackInfo();
		var url;
		var _aStr = [];
		_aStr.push(this._remote+"/ajax_remote_callback.html?method="+this._method);
		var header = new Array;

		window.__jindo2_callback[info.id] = function(id, data, header){
			try {
				t._callback(id, data, header);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};

		for(var x in this._headers) {
			header[header.length] = "'"+x+"':'"+this._headers[x]+"'";
		}

		header = "{"+header.join(",")+"}";
		
		
		_aStr.push("&id="+info.id);
		_aStr.push("&header="+encodeURIComponent(header));
		_aStr.push("&proxy="+encodeURIComponent(this._proxy));
		_aStr.push("&domain="+this._domain);
		_aStr.push("&url="+encodeURIComponent(this._url.replace(re, "")));
		_aStr.push("#"+encodeURIComponent(data));

		var fr = this._frame = jindo.$("<iframe>");
		fr.style.position = "absolute";
		fr.style.visibility = "hidden";
		fr.style.width = "1px";
		fr.style.height = "1px";

		var body = document.body || document.documentElement;
		if (body.firstChild){ 
			body.insertBefore(fr, body.firstChild);
		}else{ 
			body.appendChild(fr);
		}
		fr.src = _aStr.join("");
	}
}).extend(jindo.$Ajax.RequestBase);


/**
 * $Ajax ��ü�� ������� ȣ���� �� �ִ� ����� �����Ѵ�.
 * @class $Ajax.Queue�� ajax ��û�� ������� ó���� �� �ְ� �����Ѵ�.
 * @since 1.3.7 
 * @constructor
 */
jindo.$Ajax.Queue = function (option) {
	var cl = arguments.callee;
	if (!(this instanceof cl)){ return new cl(option);}
	
	this._options = {
		async : false,
		useResultAsParam : false,
		stopOnFailure : false
	};

	this.option(option);
	
	this._queue = [];	
}

/**
 * $Ajax.Queue �� �ɼ��� �����Ѵ�.
 * @param {Object} name
 * @param {Object} value
 */
jindo.$Ajax.Queue.prototype.option = function(name, value) {
	if (typeof name == "undefined"){ return "";}
	if (typeof name == "string") {
		if (typeof value == "undefined"){ return this._options[name];}
		this._options[name] = value;
		return this;
	}

	try { 
		for(var x in name) {
			this._options[x] = name[x] 
		}
	} catch(e) {
	};

	return this;
};

/**
 * Ajax Queue�� ��û�� �߰��Ѵ�.
 * @param {$Ajax} �߰��� Ajax��ü
 * @param {Object} ��û�� ������ �Ķ���� ��ü
 */
jindo.$Ajax.Queue.prototype.add = function (oAjax, oParam) {
	this._queue.push({obj:oAjax, param:oParam});
}

/**
 * Ajax Queue�� ��û�Ѵ�.
 */
jindo.$Ajax.Queue.prototype.request = function () {
	if(this.option('async')){
		this._requestAsync();
	} else {
		this._requestSync(0);
	}
}

jindo.$Ajax.Queue.prototype._requestSync = function (nIdx, oParam) {
	var t = this;
	if (this._queue.length > nIdx+1) {
		this._queue[nIdx].obj._oncompleted = function(bSuccess, oResult){
			if(!t.option('stopOnFailure') || bSuccess) t._requestSync(nIdx + 1, oResult);
		};
	}
	var _oParam = this._queue[nIdx].param||{};
	if(this.option('useResultAsParam') && oParam){
		try { for(var x in oParam) if(typeof _oParam[x] == 'undefined') _oParam[x] = oParam[x] } catch(e) {};		
	}
	this._queue[nIdx].obj.request(_oParam);
}

jindo.$Ajax.Queue.prototype._requestAsync = function () {
	for( var i=0; i<this._queue.length; i++)
		this._queue[i].obj.request(this._queue[i].param);
}
/**
 * @fileOverview $H�� ������ �� �޼��带 ������ ����
 * @name hash.js
 */
 
/**
 * $H �ؽ� ��ü�� �����Ѵ�
 * @class $H Ŭ������ Ű�� ���� ���ҷ� ������ ������ �迭�� �ؽø� �����ϰ�, �ؽø� �ٷ�� ���� ���� ���� ���� �޼��带 �����Ѵ�.  
 * @param {Object} hashObject �ؽ÷� ���� ��ü.
 * @return {$H} �ؽ� ��ü
 * @constructor
 * @example
var h = $H({one:"first", two:"second", three:"third"})
 * @author Kim, Taegon
 */
jindo.$H = function(hashObject) {
	var cl = arguments.callee;
	if (typeof hashObject == "undefined") hashObject = new Object;
	if (hashObject instanceof cl) return hashObject;
	if (!(this instanceof cl)) return new cl(hashObject);

	this._table = {};
	for(var k in hashObject) {
		if (this._table[k] == hashObject[k]) continue;
		this._table[k] = hashObject[k];
	}
};

/**
 * $value �޼���� �ؽ� ����� ��ü�� ��ȯ�Ѵ�.
 * @return {Object} �ؽ� ��� ��ü
 */
jindo.$H.prototype.$value = function() {
	return this._table;
};

/**
 * $ �޼���� Ű�� ���� �����ϰų� Ű�� �ش��ϴ� ���� ��ȯ�Ѵ�.
 * @param {String} key Ű
 * @param {void} [value] ��
 * @return {void|$H} Ű�� �ش��ϴ� �� Ȥ�� $H ��ü
 * @example
 * var hash = $H({one:"first", two:"second"});
 *
 * // ���� ������ ��
 * hash.$("three", "third");
 * 
 * // hash => {one:"first", two:"second", three:"third"}
 *
 * // ���� ��ȯ�� ��
 * var three = hash.$("three");
 *
 * // three => "third"
 */
jindo.$H.prototype.$ = function(key, value) {
	if (typeof value == "undefined") {
		return this._table[key];
	} 

	this._table[key] = value;
	return this;
};

/**
 * length �޼���� �ؽ� ��ü�� ũ�⸦ ��ȯ�Ѵ�.
 * @return {Number} �ؽ��� ũ��
 */
jindo.$H.prototype.length = function() {
	var i = 0;
	for(var k in this._table) {
		if (typeof Object.prototype[k] != "undeifned" && Object.prototype[k] === this._table[k]) continue;
		i++;
	}

	return i;
};

/**
 * forEach �޼���� �ؽ� ��ü�� Ű�� ���� �μ��� ������ �ݹ� �Լ��� �����Ѵ�.
 * @param {Function} callback ������ �ݹ� �Լ� 
 * @param {Object} thisObject �ݹ� �Լ��� this
 * @example
function printIt(value, key) {
   document.write(key+" => "+value+" <br>");
}
$H({one:"first", two:"second", three:"third"}).forEach(printIt);
 */
jindo.$H.prototype.forEach = function(callback, thisObject) {
	var t = this._table;
	var h = this.constructor;
	
	for(var k in t) {
		if (!t.propertyIsEnumerable(k)) continue;
		try {
			callback.call(thisObject, t[k], k, t);
		} catch(e) {
			if (e instanceof h.Break) break;
			if (e instanceof h.Continue) continue;
			throw e;
		}
	}
	return this;
};

/**
 * filter �޼���� �ؽ� ��ü���� ���� �ݹ� �Լ��� �����ϴ� ���Ҹ� �����Ѵ�. ������ ���Ҵ� ���ο� $H ��ü�� ���Ұ� �ȴ�.
 * �ݹ��Լ��� Boolean ���� ��ȯ�ؾ� �Ѵ�.
 * @param {Function} callback ���� �ݹ� �Լ� 
 * @param {Object} thisObject �ݹ� �Լ��� this
 * @return {$H} ������ ���ҷ� ���� ���� �ؽ� ��ü
 * @remark ���� �ݹ� �Լ��� ����� true�� ���Ҹ� �����Ѵ�. �ݹ� �Լ��� ������ ������ �����Ѵ�.
 * @example
function callback(value, key, object) {
   // value    �ؽ��� �� 
   // key      �ؽ��� ������ Ű Ȥ�� �̸�
   // object   JavaScript Core Object ��ü
}
 */
jindo.$H.prototype.filter = function(callback, thisObject) {
	var h = jindo.$H();
	this.forEach(function(v,k,o) {
		if(callback.call(thisObject, v, k, o) === true) {
			h.add(k,v);
		}
	});
	return h;
};

/**
 * map �޼���� �ؽ� ��ü�� ���Ҹ� �μ��� �ݹ� �Լ��� �����ϰ�, �Լ��� ���� ���� �ش� ������ ������ �����Ѵ�.
 * @param {Function} callback �ݹ� �Լ�
 * @param {Object} thisObject �ݹ� �Լ��� this
 * @return {$H} ���� ������ �ؽ� ��ü
 * @remark �ݹ� �Լ��� ������ ������ �����Ѵ�.
 * @example
function callback(value, key, object ) {
   // value    �ؽ��� �� 
   // key      �ؽ��� ������ Ű Ȥ�� �̸�
   // object   JavaScript Core Object ��ü
 
   var r = key+"_"+value;
   document.writeln (r + "<br />"); 
   return r;
}
$H({one:"first", two:"second", three:"third"}).map(callback);
 */
jindo.$H.prototype.map = function(callback, thisObject) {
	var t = this._table;
	this.forEach(function(v,k,o) {
		t[k] = callback.call(thisObject, v, k, o);
	});
	return this;
};

/**
 * �ؽ� ���̺��� ���� �߰��Ѵ�.
 * @param {String} key �߰��� ���� ���� Ű 
 * @param {String} value �ؽ� ���̺��� �߰��� ��
 * @return {$H} ���� �߰��� �ؽ� ��ü
 */
jindo.$H.prototype.add = function(key, value) {
	//if (this.hasKey(key)) return null;
	this._table[key] = value;

	return this;
};

/**
 * remove �޼���� �ؽ� ���̺��� ���Ҹ� �����Ѵ�.
 * @param {String} key ������ ������ Ű
 * @return {void} ������ Ű ��
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.remove ("two");
// h�� �ؽ� ���̺��� {one:"first", three:"third"}
 */
jindo.$H.prototype.remove = function(key) {
	if (typeof this._table[key] == "undefined") return null;
	var val = this._table[key];
	delete this._table[key];
	
	return val;
};

/**
 * search �޼���� �ؽ� ���̺����� �μ��� ������ ���� ã�´�.
 * @param {String} value �˻��� ��
 * @returns {String | Boolean} ���� ã�Ҵٸ� ���� ���� Ű. ���� ã�� ���ߴٸ� false. 
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.search ("second");
// two

h.search ("fist");
// false
 */
jindo.$H.prototype.search = function(value) {
	var result = false;
	this.forEach(function(v,k,o) {
		if (v === value) {
			result = k;
			jindo.$H.Break();
		}
	});
	return result;
};

/**
 * hasKey �޼���� �ؽ� ���̺��� �μ��� ������ Ű�� �ִ��� ã�´�.
 * @param {String} key �ؽ� ���̺����� �˻��� Ű
 * @return {Boolean} Ű�� ���� ����
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.hasKey("four"); // false
h.hasKey("one"); // true
 */
jindo.$H.prototype.hasKey = function(key) {
	var result = false;
	
	return (typeof this._table[key] != "undefined");
};

/**
 * hasValue �޼���� �ؽ� ���̺��� �μ��� ������ ���� �ִ��� Ȯ���Ѵ�.
 * @param {String} value �ؽ� ���̺����� �˻��� ��
 * @return {Boolean} ���� ���� ����
 */
jindo.$H.prototype.hasValue = function(value) {
	return (this.search(value) !== false);
};

/**
 * sort �޼���� ���� �������� ���Ҹ� �������� �����Ѵ�.
 * @return {$H} ���Ҹ� ������ �ؽ� ��ü.
 * @see $H#ksort
 * @example
var h = $H({one:"�ϳ�", two:"��", three:"��"});
h.sort ();
// {two:"��", three:"��", one:"�ϳ�"}
 */
jindo.$H.prototype.sort = function() {
	var o = new Object;
	var a = this.values();
	var k = false;

	a.sort();

	for(var i=0; i < a.length; i++) {
		k = this.search(a[i]);

		o[k] = a[i];
		delete this._table[k];
	}
	
	this._table = o;
	
	return this;
};

/**
 * ksort �޼���� Ű�� �������� ���Ҹ� �������� �����Ѵ�. 
 * @return {$H} ���Ҹ� ������ �ؽ� ��ü
 * @see $H#sort
 * @example
var h = $H({one:"�ϳ�", two:"��", three:"��"});
h.sort ();
// h => {one:"�ϳ�", three:"��", two:"��"}
 */
jindo.$H.prototype.ksort = function() {
	var o = new Object;
	var a = this.keys();

	a.sort();

	for(var i=0; i < a.length; i++) {
		o[a[i]] = this._table[a[i]];
	}

	this._table = o;

	return this;
};

/**
 * keys �޼���� �ؽ� Ű�� �迭�� ��ȯ�Ѵ�.
 * @return {Array} �ؽ� Ű�� �迭
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.keys ();
// ["one", "two", "three"]
 * @see $H#values
 */
jindo.$H.prototype.keys = function() {
	var keys = new Array;
	for(var k in this._table) {
		keys.push(k);
	}

	return keys;
};

/**
 * values �޼���� �ؽ� ���� �迭�� ��ȯ�Ѵ�.
 * @return {Array} �ؽ� ���� �迭
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.values();
// ["first", "second", "third"]
 * @see $H#keys
 */
jindo.$H.prototype.values = function() {
	var values = [];
	for(var k in this._table) {
		values[values.length] = this._table[k];
	}

	return values;
};

/**
 * toQueryString�� �ؽ� ��ü�� ���� ��Ʈ�� ���·� �����.
 * @return {String} 
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.toQueryString();
// "one=first&two=second&three=third"
 */
jindo.$H.prototype.toQueryString = function() {
	var buf = [], val = null, idx = 0;
	for(var k in this._table) {
		if (typeof(val = this._table[k]) == "object" && val.constructor == Array) {
			for(i=0; i < val.length; i++) {
				buf[buf.length] = encodeURIComponent(k)+"[]="+encodeURIComponent(val[i]+"");
			}
		} else {
			buf[buf.length] = encodeURIComponent(k)+"="+encodeURIComponent(this._table[k]+"");
		}
	}
	
	return buf.join("&");
};

/**
 * empty�� �ؽ� ��ü�� �� ��ü�� �����.
 * @return {$H} ����� �ؽ� ��ü
 * @example
var hash = $H({a:1, b:2, c:3});
// hash => {a:1, b:2, c:3}

hash.empty();
// hash => {}
 */
jindo.$H.prototype.empty = function() {
	var keys = this.keys();

	for(var i=0; i < keys.length; i++) {
		delete this._table[keys[i]];
	}

	return this;
};

/**
 * Break �޼���� �ݺ����� ������ �ߴ��� �� ����Ѵ�.
 * @remark forEach, filter, map�� ���� ������ �ߴ��Ѵ�. ������ exception�� �߻���Ű�Ƿ� try ~ catch �������� �� �޼ҵ带 �����ϸ� ���������� �������� ���� �� �ִ�.
 * @example
$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
   ...
   if (k == "b") $H.Break();
   ...
});
 * @see $H.Continue
 */
jindo.$H.Break = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * Continue �޼���� ������ �����ϴ� ���� �ܰ�� �Ѿ �� ����Ѵ�. 
 * @remark forEach, filter, map�� ���� ���� ���� ���߿� ���� ������ �ߴ��ϰ� �������� �Ѿ��. ������ exception�� �߻���Ű�Ƿ� try ~ catch �������� �� �޼ҵ带 �����ϸ� ���������� �������� ���� �� �ִ�.
 * @example
$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
   ...
   if (v % 2 == 0) $H.Continue();
   ...
});
 * @see $H.Break
 */
jindo.$H.Continue = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * @fileOverview $Json�� ������ �� �޼��带 ������ ����
 * @name json.js
 */

/**
 * $Json ��ü�� ��ȯ�Ѵ�.
 * @class $Json ��ü�� Javascipt���� JSON(JavaScript Object Notation)�� �ٷ�� ���� �پ��� �޼��带 �����Ѵ�.
 * @param {Object | String} sObject ��ü, Ȥ�� JSON���� ���ڵ� ������ ���ڿ�.
 * @return {$Json} �μ��� ���ڵ��� $Json ��ü.
 * @remark XML ���ڸ� ����Ͽ� $Json ��ü�� �����Ϸ��� $Json#fromXML �޼��带 ����Ѵ�.
 * @example 
var oStr = $Json ('{ zoo: "myFirstZoo", tiger: 3, zebra: 2}');

var d = {name : 'nhn', location: 'Bundang-gu'}
var oObj = $Json (d);

 * @constructor
 * @author Kim, Taegon
 */
jindo.$Json = function (sObject) {
	var cl = arguments.callee;
	if (typeof sObject == "undefined") sObject = new Object;
	if (sObject instanceof cl) return sObject;
	if (!(this instanceof cl)) return new cl(sObject);
	
	if (typeof sObject == "string") {
		try {
			sObject = new Function("return "+sObject)();
		} catch(e) {
			sObject = new Object;
		}
	}

	this._object = sObject;
}

/**
 * fromXML �޼���� XML ���ڿ��� $Json ��ü�� ���ڵ��Ѵ�.
 * @param {String} sXML $Json  ��ü�� ���ڵ��� XML ���ڿ� 
 * @returns {Object} $Json ��ü
 * @remark �Ӽ��� CDATA�� ������ �±״� CDATA�� '$cdata' �Ӽ��� ������ ���ڵ��Ѵ�.  
 * @example
var j1 = $Json.fromXML('<data>only string</data>');
// {"data":"only string"}

var j2 = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
{"data":{"id":"Faqh%$","str":{"attr":"123","$cdata":"string value"}}} 
  */
jindo.$Json.fromXML = function(sXML) {
	var o  = new Object;
	var re = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*((?:\/>)|(?:><\/\1>|\s*))|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*>?([^<]*)/ig;
	var re2= /^[0-9]+(?:\.[0-9]+)?$/;
	var ec = {"&amp;":"&","&nbsp;":" ","&quot;":"\"","&lt;":"<","&gt;":">"};
	var fg = {tags:["/"],stack:[o]};
	var es = function(s){return s.replace(/&[a-z]+;/g, function(m){ return (typeof ec[m] == "string")?ec[m]:m; })};
	var at = function(s,c){s.replace(/([\w\:\-]+)\s*=\s*(?:"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)')/g, function($0,$1,$2,$3){c[$1] = es(($2?$2.replace(/\\"/g,'"'):undefined)||($3?$3.replace(/\\'/g,"'"):undefined));}) };
	var em = function(o){for(var x in o){if(Object.prototype[x])continue;return false;};return true};
	
	// $0 : ��ü 
	// $1 : �±׸�
	// $2 : �Ӽ����ڿ�
	// $3 : �ݴ��±�
	// $4 : CDATA�ٵ�
	// $5 : �׳� �ٵ� 
	var cb = function($0,$1,$2,$3,$4,$5) {
		var cur, cdata = "";
		var idx = fg.stack.length - 1;
		
		if (typeof $1 == "string" && $1) {
			if ($1.substr(0,1) != "/") {
				var has_attr = (typeof $2 == "string" && $2);
				var closed   = (typeof $3 == "string" && $3);
				var newobj   = (!has_attr && closed)?"":{};

				cur = fg.stack[idx];
				
				if (typeof cur[$1] == "undefined") {
					cur[$1] = newobj; 
					cur = fg.stack[idx+1] = cur[$1];
				} else if (cur[$1] instanceof Array) {
					var len = cur[$1].length;
					cur[$1][len] = newobj;
					cur = fg.stack[idx+1] = cur[$1][len];  
				} else {
					cur[$1] = [cur[$1], newobj];
					cur = fg.stack[idx+1] = cur[$1][1];
				}
				
				if (has_attr) at($2,cur);

				fg.tags[idx+1] = $1;

				if (closed) {
					fg.tags.length--;
					fg.stack.length--;
				}
			} else {
				fg.tags.length--;
				fg.stack.length--;
			}
		} else if (typeof $4 == "string" && $4) {
			cdata = $4;
		} else if (typeof $5 == "string" && $5) {
			cdata = es($5);
		}
		
		if (cdata.length > 0) {
			var par = fg.stack[idx-1];
			var tag = fg.tags[idx];

			if (re2.test(cdata)) {
				cdata = parseFloat(cdata);
			}else if (cdata == "true" || cdata == "false"){
				cdata = new Boolean(cdata);
			}

			if(typeof par =='undefined') return;
			
			if (par[tag] instanceof Array) {
				var o = par[tag];
				if (typeof o[o.length-1] == "object" && !em(o[o.length-1])) {
					o[o.length-1].$cdata = cdata;
					o[o.length-1].toString = function(){ return cdata; }
				} else {
					o[o.length-1] = cdata;
				}
			} else {
				if (typeof par[tag] == "object" && !em(par[tag])) {
					par[tag].$cdata = cdata;
					par[tag].toString = function(){ return cdata; }
				} else {
					par[tag] = cdata;
				}
			}
		}
	};
	
	sXML = sXML.replace(/<(\?|\!-)[^>]*>/g, "");
	sXML.replace(re, cb);
	
	return jindo.$Json(o);
};

/**
 * get �޼���� $Json ��ü�� ���� path ���·� �����Ѵ�.
 * @param {String} sPath path ���ڿ�
 * @return {Array} ��ü�� �迭
 * @example
var j = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
var r = j.get ("/data/id");
// Faqh%$

 */
jindo.$Json.prototype.get = function(sPath) {
	var o = this._object;
	var p = sPath.split("/");
	var re = /^([\w:\-]+)\[([0-9]+)\]$/;
	var stack = [[o]], cur = stack[0];
	var len = p.length, c_len, idx, buf, j, e;
	
	for(var i=0; i < len; i++) {
		if (p[i] == "." || p[i] == "") continue;
		if (p[i] == "..") {
			stack.length--;
		} else {
			buf = [];
			idx = -1;
			c_len = cur.length;
			
			if (c_len == 0) return [];
			if (re.test(p[i])) idx = +RegExp.$2;
			
			for(j=0; j < c_len; j++) {
				e = cur[j][p[i]];
				if (typeof e == "undefined") continue;
				if (e instanceof Array) {
					if (idx > -1) {
						if (idx < e.length) buf[buf.length] = e[idx];
					} else {
						buf = buf.concat(e);
					}
				} else if (idx == -1) {
					buf[buf.length] = e;
				}
			}
			
			stack[stack.length] = buf;
		}
		
		cur = stack[stack.length-1];
	}

	return cur;
};

/**
 * toString �޼���� $Json ��ü�� JSON ���ڿ��� ��ȯ�Ѵ�.
 * @return {String} JSON ���ڿ�
 * @example
var j = $Json({foo:1, bar: 31});
document.write (j.toString());
document.write (j);

 */
jindo.$Json.prototype.toString = function() {
	var func = {
		$ : function($) {
			if (typeof $ == "object" && $ == null) return 'null';
			if (typeof $ == "undefined") return '""';
			if (typeof $ == "boolean") return $?"true":"false";
			if (typeof $ == "string") return this.s($);
			if (typeof $ == "number") return $;
			if ($ instanceof Array) return this.a($);
			if ($ instanceof Object) return this.o($);
		},
		s : function(s) {
			var e = {'"':'\\"',"\\":"\\\\","\n":"\\n","\r":"\\r","\t":"\\t"};
			var c = function(m){ return (typeof e[m] != "undefined")?e[m]:m };
			return '"'+s.replace(/[\\"'\n\r\t]/g, c)+'"';
		},
		a : function(a) {
			var s = "[",c = "",n=a.length;
			for(var i=0; i < n; i++) {
				if (typeof a[i] == "function") continue;
				s += c+this.$(a[i]);
				if (!c) c = ",";
			}
			return s+"]";
		},
		o : function(o) {
			var s = "{",c = "";
			for(var x in o) {
				if (typeof o[x] == "function") continue;
				s += c+this.s(x)+":"+this.$(o[x]);
				if (!c) c = ",";
			}
			return s+"}";
		}
	}

	return func.$(this._object);
};

/**
 * toXML �޼���� $Json ��ü�� XML ���ڿ��� ��ȯ�Ѵ�.
 * @return {String} XML ���ڿ�
 * @example
var json = $Json({foo:1, bar: 31});
json.toXML();
// <foo>1</foo><bar>31</bar>
 */
jindo.$Json.prototype.toXML = function() {
	var f = function($,tag) {
		var t = function(s,at) { return "<"+tag+(at||"")+">"+s+"</"+tag+">" };
		
		switch (typeof $) {
			case "undefined":
			case "null":
				return t("");
			case "number":
				return t($);
			case "string":
				if ($.indexOf("<") < 0){
					 return t($.replace(/&/g,"&amp;"));
				}else{
					return t("<![CDATA["+$+"]]>");
				}
			case "boolean":
				return t(String($));
			case "object":
				var ret = "";
				if ($ instanceof Array) {
					var len = $.length;
					for(var i=0; i < len; i++) { ret += f($[i],tag); };
				} else {
					var at = "";

					for(var x in $) {
						if (x == "$cdata" || typeof $[x] == "function") continue;
						ret += f($[x], x);
					}

					if (tag) ret = t(ret, at);
				}
				return ret;
		}
	};
	
	return f(this._object, "");
};

/**
 * toObject �޼���� $Json ��ü ������ JSON ������ ��ü�� ��ȯ�Ѵ�.
 * @return {Object} ������ ��ü
 * @example
var json = $Json({foo:1, bar: 31});
json.toObject();
// {foo: 1, bar: 31}
 */
jindo.$Json.prototype.toObject = function() {
	return this._object;
};

/**
 * $value �޼���� $Json.toObject�� ��Ī(Alias)�̴�. 
 * @return {Object} ������ ��ü
 */
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;
/**

 * @fileOverview $Cookie�� ������ �� �޼��带 ������ ����

 * @name cookie.js

 */



/**

 * $Cookie ��ü�� �����Ѵ�.

 * @class $Cookie Ŭ������ ��Ű(Cookie)�� �߰�, ����, Ȥ�� �����ϰų� ��Ű�� ���� �����´�.

 * @constructor

 * @author Kim, Taegon

 * @example 

var cookie = $Cookie();

cookie.set("session_id", "eac312d1d51ab", 1);



document.write (cookie.keys());

 */

jindo.$Cookie = function() {

	var cl = arguments.callee;

	var cached = cl._cached;

	

	if (cl._cached) return cl._cached;

	if (!(this instanceof cl)) return new cl;

	if (typeof cl._cached == "undefined") cl._cached = this;

};



/**

 * ��Ű �̸��� �迭�� ��ȯ�Ѵ�.

 * @return {Array} ��Ű �̸��� �迭

 */

jindo.$Cookie.prototype.keys = function() {

	var ca = document.cookie.split(";");

	var re = /^\s+|\s+$/g;

	var a  = new Array;

	

	for(var i=0; i < ca.length; i++) {

		a[a.length] = ca[i].substr(0,ca[i].indexOf("=")).replace(re, "");

	}

	

	return a;

};



/**

 * �̸��� �ش��ϴ� ��Ű ���� �����´�. ���� �������� �ʴ´ٸ� null�� ��ȯ�Ѵ�.

 * @param {String} sName ��Ű �̸�

 * @return {String} ��Ű ��

 * @example 

var cookie = $Cookie();

cookie.set("session_id", "eac312d1d51ab", 1);



// ...



document.write (cookie.get ("session_id"));

 */

jindo.$Cookie.prototype.get = function(sName) {

	var ca = document.cookie.split(/\s*;\s*/);

	var re = new RegExp("^(\\s*"+sName+"\\s*=)");

	

	for(var i=0; i < ca.length; i++) {

		if (re.test(ca[i])) return unescape(ca[i].substr(RegExp.$1.length));

	}

	

	return null;

};



/**

 * �̸��� �ش��ϴ� ��Ű ���� �����Ѵ�.

 * @param {String} sName ��Ű �̸�.

 * @param {String} sValue ��Ű ��.

 * @param {Number} [nDays] ��Ű ��ȿ �ð�. ��ȿ �ð��� �ϴ����� �����Ѵ�. ��ȿ�ð��� �����ߴٸ� ��Ű�� �� �������� ����Ǹ鼭 ��������.

 * @param {String} [sDomain] ��Ű ������.

 * @param {String} [sPath] ��Ű �н�.

 * @return {$Cookie} $Cookie ��ü

 */

jindo.$Cookie.prototype.set = function(sName, sValue, nDays, sDomain, sPath) {

	var sExpire = "";

	

	if (typeof nDays == "number") {

		sExpire = ";expires="+(new Date((new Date()).getTime()+nDays*1000*60*60*24)).toGMTString();

	}

	if (typeof sDomain == "undefined") sDomain = "";

	if (typeof sPath == "undefined") sPath = "/";

	

	document.cookie = sName+"="+escape(sValue)+sExpire+"; path="+sPath+(sDomain?"; domain="+sDomain:"");

	

	return this;

};



/**

 * �̸��� �ش��ϴ� ��Ű ���� �����Ѵ�.

 * @param {String} sName ��Ű �̸�

 * @return {$Cookie} $Cookie ��ü

 */

jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {

	if (this.get(sName) != null) this.set(sName, "", -1, sDomain, sPath);

	

	return this;

};


/**
 * @fileOverview $Element�� ������ �� �޼��带 ������ ����
 * @name element.js
 */

/**
 * $Element ��ü�� ���� �� �����Ѵ�.
 * @class $Element Ŭ������ DOM ������Ʈ�� �ٷ�� ���� ���� ���� �޼��带 �����Ѵ�.
 * @param {Element | String} el	$Element�� ����� DOM ������Ʈ, Ȥ�� DOM ������Ʈ�� ������ id. ���� �������� ���� id�� �����ϸ� ���� ���� ������ ������Ʈ�� ��ȯ�Ѵ�.
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 */
jindo.$Element = function(el) {
	var cl = arguments.callee;
	
	if (el && el instanceof cl) return el;
	
	if(!jindo.$(el)) return null;
		
	if (!(this instanceof cl)) return new cl(el);

	this._element = jindo.$(el);
			
	// tagname
	this.tag = (typeof this._element.tagName!='undefined')?this._element.tagName.toLowerCase():''; 

}
/**
 *	agent�� dependency�� ������ ���� ���ε� ����.
 *	@ignore
 **/
var IS_IE = navigator.userAgent.indexOf("MSIE") > -1;
var IS_FF = navigator.userAgent.indexOf("Firefox") > -1;
var IS_OP = navigator.userAgent.indexOf("Opera") > -1;
var IS_SF = navigator.userAgent.indexOf("Apple") > -1;
var IS_CH = navigator.userAgent.indexOf("Chrome") > -1;

/**
 * $value �޼���� ���ε� ������ DOM ������Ʈ�� �����Ѵ�.
 * @return {HTMLElement} DOM ������Ʈ
 * @description [Lite]
 */
jindo.$Element.prototype.$value = function() {
	return this._element;
};

/**
 * visible �޼���� DOM ������Ʈ�� CSS�� display �Ӽ��� �����ؼ� ������Ʈ�� ���̴� �������� Ȯ���Ѵ�.
 * @param {Boolean} bVisible ������Ʈ�� ���̰ų� �� ���̰� �����Ѵ�. true�� show() �޼��带, false�� hide() �޼��带 �����ϴ� �Ͱ� ������ ����� ��´�.
 * @return {Boolean|$Element} display �Ӽ��� none�̸� false ��, �� ���� ���̸� true�� �����Ѵ�. �����ϰ� �Ǹ� ������ this ��ü�� ��ȯ�Ѵ�.
 * @description [Lite]
 * @since ���� ����� 1.1.2����
 */
jindo.$Element.prototype.visible = function(bVisible) {
	if (typeof bVisible != "undefined") {
		this[bVisible?"show":"hide"]();
		return this;
	}

	return (this.css("display") != "none");
};

/**
 * show �޼���� DOM ������Ʈ�� ȭ�鿡 ���̵��� CSS�� display �Ӽ��� �����Ѵ�.
 * @return {$Element} display �Ӽ��� ������ $Element ��ü.
 * @description [Lite]
 * @see $Element#hide
 */
jindo.$Element.prototype.show = function() {
	var s = this._element.style;
	var b = "block";
	var c = {p:b,div:b,form:b,h1:b,h2:b,h3:b,h4:b,ol:b,ul:b,fieldset:b,td:"table-cell",th:"table-cell",li:"list-item",table:"table",thead:"table-header-group",tbody:"table-row-group",tfoot:"table-footer-group",tr:"table-row",col:"table-column",colgroup:"table-column-group",caption:"table-caption",dl:b,dt:b,dd:b};

	try {
		if(typeof c[this.tag] == "string") {
			s.display = c[this.tag];
		} else {
			s.display = "inline";
		}
	} catch(e) {
		s.display = "block";
	}

	return this;
};

/**
 * hide �޼���� DOM ������Ʈ�� ȭ�鿡 ������ �ʵ��� CSS�� display �Ӽ��� none���� �����Ѵ�.
 * @returns {Object} this	display �Ӽ��� ������ $Element ��ü.
 * @see $Element#show
 * @description [Lite]
 */
jindo.$Element.prototype.hide = function() {
	this._element.style.display = "none";

	return this;
};

/**
 * toggle �޼���� CSS�� Display �Ӽ��� �����Ͽ� DOM ������Ʈ�� ȭ�鿡 ���̰ų� ������ �ʰ� �Ѵ�.
 * @returns {Object} this display �Ӽ��� ������ $Element ��ü.
 * @see $Element#show
 * @see $Element#hide
 * @description [Lite]
 * @example

var isOpen 	= e.toggle().visible();
var bullet	= (isOpen) ? '-' : '+';

 */
jindo.$Element.prototype.toggle = function() {
	this[this.visible()?"hide":"show"]();

	return this;
};

/**
 * opacity �޼���� DOM ������Ʈ�� ������ ���� �����ϰų� �����Ѵ�.
 * @param {Number} value	������ ������ ��. ������ ���� 0 ~ 1 ������ �Ǽ������� ���Ѵ�. ���� 0���� ������ 0��, 1���� ũ�� 1�� �����Ѵ�.
 * @return {Number} DOM ������Ʈ�� ������ ��.
 * @description [Lite]
 */
jindo.$Element.prototype.opacity = function(value) {
	var v,e = this._element,b=this.visible();
	
	value = parseFloat(value);
	
	if (!isNaN(value)) {
		value = Math.max(Math.min(value,1),0);

		if (typeof e.filters != "undefined") {
			value = Math.ceil(value*100);
			
			if (typeof e.filters != 'unknown' && typeof e.filters.alpha != "undefined") {
				e.filters.alpha.opacity = value;
			} else {
				e.style.filter = (e.style.filter + " alpha(opacity=" + value + ")");
			}		
		} else {
			e.style.opacity = value;
		}

		return value;
	}

	if (typeof e.filters != "undefined") {
		v = (typeof e.filters.alpha == "undefined")?(b?100:0):e.filters.alpha.opacity;
		v = v / 100;
	} else {
		v = parseFloat(e.style.opacity);
		if (isNaN(v)) v = b?1:0;
	}

	return v;
};

/**
 * css �޼���� DOM ������Ʈ�� CSS �Ӽ����� �������ų� �����Ѵ�. �Ӽ�����
 * �μ� �ϳ��� ����ϸ� CSSS���� String�� �ش��ϴ� CSS �Ӽ��� ���� �����´�.
 * �μ� �� ���� ����ϸ� ù��° �μ��� �ش��ϴ� CSS �Ӽ��� �ι�° �μ��� ������ �����Ѵ�.
 * Object Ȥ�� $Hash Ÿ���� ��ü�� ����ϸ� �� �� �̻��� CSS �Ӽ��� �Ѳ����� ������ �� �ִ�.
 * @remark CSS �Ӽ��� Camel ǥ����� ����Ѵ�. ���� border-width-bottom�� borderWidthBottom���� �����Ѵ�.
 * @remark float �Ӽ��� Javascript�� ������ ����ϹǷ� css �޼��忡���� float ��� cssFloat�� ����Ѵ�. (Internet Explorer������ styleFloat��, �� ���� ������������ cssFloat�� ����Ѵ�.)
 * @param {String | Object | $H} sName CSS �Ӽ� | �ϳ� �̻��� CSS �Ӽ��� ���� ������ ��ü.
 * @param {String | Number} [sValue] CSS �Ӽ��� ������ ��. ������ �ʿ��� ���� Number, Ȥ�� ������ �����ϴ� String���� �����Ѵ�.
 * @return {String | $Element} ���� ������ ���� String ��������, ���� ������ ���� ���� ������ ������ $Element�� �����Ѵ�. ���� ������ �� CSS �Ӽ��� �������� ������ null�� �����Ѵ�.
 * @description [Lite]
 * @example

<style>
	#btn {
		width: 120px;
		height: 30px;
		background-color: blue;
	}
</style>

...

<script type="text/javascript" charset="utf-8">
	window.onload = function () {
		$Element('btn').css('backgroundColor');
		// rgb (0, 0, 256)

		$Element('btn').css('backgroundColor', 'red');
		// $Element('btn').css('backgroundColor') -> reb (255, 0, 0)

		$Element('btn').css({
			width: "200px",
			height: "80px"
		});
		// $Element('btn').css('width') -> "200px"
		// $Element('btn').css('height') -> "80px"
 	}
</script>
 */
jindo.$Element.prototype.css = function(sName, sValue) {
	var e = this._element;

	if (sName == 'opacity') return typeof sValue == 'undefined' ? this.opacity() : this.opacity(sValue);

	if (typeof sName == "string") {
		var view;

		if (typeof sValue == "string" || typeof sValue == "number") {
			var obj = new Object;
			obj[sName] = sValue;
			sName = obj;
		} else {
			if((IS_FF||IS_OP)&&(sName=="backgroundPositionX"||sName=="backgroundPositionY")){
				var bp = this._getCss(e, "backgroundPosition").split(/\s+/);
				return (sName == "backgroundPositionX") ? bp[0] : bp[1];
			}
			if (IS_IE && sName == "backgroundPosition") {
				return this._getCss(e, "backgroundPositionX") + " " + this._getCss(e, "backgroundPositionY")
			}
			if ((IS_FF||IS_SF||IS_CH) && (sName=="padding"||sName=="margin")) {
				var top		= this._getCss(e, sName+"Top");
				var right	= this._getCss(e, sName+"Right");
				var bottom	= this._getCss(e, sName+"Bottom");
				var left	= this._getCss(e, sName+"Left");
				if ((top == right) && (bottom == left)) {
					return top;
				}else if (top == bottom) {
					if (right == left) {
						return top+" "+right;
					}else{
						return top+" "+right+" "+bottom+" "+left;
					}
				}else{
					return top+" "+right+" "+bottom+" "+left;
				}
			}
			return this._getCss(e, sName);
		}
	}

	if (typeof jindo.$H != "undefined" && sName instanceof jindo.$H) {
		sName = sName.$value();
	}

	if (typeof sName == "object") {
		var v, type;

		for(var k in sName) {
			v    = sName[k];
			type = (typeof v);
			if (type != "string" && type != "number") continue;
			if (k == 'opacity') {
				type == 'undefined' ? this.opacity() : this.opacity(v);
				continue;
			}
			if (k == "cssFloat" && navigator.userAgent.indexOf("MSIE") > -1) k = "styleFloat";
			
			if((IS_FF||IS_OP)&&( k =="backgroundPositionX" || k == "backgroundPositionY")){
				var bp = this.css("backgroundPosition").split(/\s+/);
				v = k == "backgroundPositionX" ? v+" "+bp[1] : bp[0]+" "+v;
				this._setCss(e, "backgroundPosition", v);
			}else{
				this._setCss(e, k, v);
			}
			
			
		}
	}

	return this;
};

/**
 * css���� ���Ǵ� �Լ�
 * @ignore
 * @param {Element} e
 * @param {String} sName
 */
jindo.$Element.prototype._getCss = function(e, sName){
	if (e.currentStyle) {
		if (sName == "cssFloat") sName = "styleFloat";
		return e.currentStyle[sName]||e.style[sName];
	} else if (window.getComputedStyle) {
		if (sName == "cssFloat") sName = "float";
		var d = e.ownerDocument || e.document || document;
		return d.defaultView.getComputedStyle(e,null).getPropertyValue(sName.replace(/([A-Z])/g,"-$1").toLowerCase())||e.style[sName];
	} else {
		if (sName == "cssFloat" && /MSIE/.test(window.navigator.userAgent)) sName = "styleFloat";
		return e.style[sName];
	}

	return null;
	
}
/**
 * css���� css�� �����ϱ� ���� �Լ�
 * @ignore 
 * @param {Element} e
 * @param {String} k
 * @param {String} v
 */
jindo.$Element.prototype._setCss = function(e, k, v){
	try {
		e.style[k] = v;
	} catch(err) {
		if (k == "cursor" && v == "pointer") {
			e.style.cursor = "hand";
		} else if (v != "NaNpx"  && ("#top#left#right#bottom#").indexOf(k+"#") > 0 && (type == "number" || !isNaN(parseInt(v)))) {
			e.style[k] = parseInt(v)+"px";
		}
	}
}

/**
 * attr �޼���� DOM ������Ʈ�� HTML �Ӽ��� �������ų� �����Ѵ�.
 * �ϳ��� �μ��� ����ϸ� �ش� HTML �Ӽ��� �Ӽ����� �����´�.
 * �� ���� �μ��� ����ϸ� ù��° �μ��� �ش��ϴ� HTML �Ӽ��� �Ӽ����� �����Ѵ�.
 * Object Ȥ�� $Hash Ÿ���� ��ü�� ����ϸ� �� �� �̻��� HTML �Ӽ��� �Ѳ����� ������ �� �ִ�.
 * @param {String | Object | $H} sName HTML �Ӽ� �̸� Ȥ�� ������ ��ü
 * @param {String | Number} [sValue] ������. �������� null�� �����ϸ� HTML �Ӽ��� �����.
 * @return {String | $Element} ���� ������ ���� String ��������, ���� ������ ���� ���� ������ ������ $Element�� �����Ѵ�.
 * @description [Lite]
 */
jindo.$Element.prototype.attr = function(sName, sValue) {
	var e = this._element;

	if (typeof sName == "string") {
		if (typeof sValue != "undefined") {
			var obj = new Object;
			obj[sName] = sValue;
			sName = obj;
		} else {
			if (sName == "class" || sName == "className") return e.className;
			return e.getAttribute(sName);
		}
	}

	if (typeof jindo.$H != "undefined" && sName instanceof jindo.$H) {
		sName = sName.$value();
	}

	if (typeof sName == "object") {
		for(var k in sName) {
			if(/^on[a-zA-Z]+$/.test(k)){
				e[k] = sName[k];
				continue;
			}
			if (typeof(sValue) != "undefined" && sValue === null) {
				e.removeAttribute(k);
			}else{
				e.setAttribute(k, sName[k]);
			} 
		}
	}

	return this;
};

/**
 * width �޼���� DOM ������Ʈ�� �ʺ� �������ų� �����Ѵ�.
 * @remark width �޼���� ������Ʈ�� ���� �ʺ� �����´�. ���������� Box ���� ũ�� ��� ����� �ٸ��Ƿ� CSS�� width �Ӽ����� width �޼����� ���� ���� ���� �ٸ� �� �ִ�.
 * @param {Number} [width]	������ �ʺ�. ������ px. (1.4.1���� ie���Ͽ� auto�� ���� ����.)
 * @return {Number|$Element} DOM ������Ʈ�� ���� �ʺ�. �ʺ� �����ϸ� this�� ��ȯ�Ѵ�.
 * @description [Lite]
 */
jindo.$Element.prototype.width = function(width) {
	
	if (typeof width == "number") {
		var e = this._element;
		e.style.width = width+"px";
		if (e.offsetWidth != width) {
			e.style.width = (width*2 - e.offsetWidth) + "px";
		}
		return this;
	}

	return this._element.offsetWidth;
};

/**
 * height �޼���� DOM ������Ʈ�� ���̸� �������ų� �����Ѵ�.
 * @remark height �޼���� ������Ʈ�� ���� ���̸� �����´�. ���������� Box ���� ũ�� ��� ����� �ٸ��Ƿ� CSS�� height �Ӽ����� height �޼����� ���� ���� ���� �ٸ� �� �ִ�.
 * @param {Number} height	������ ����. ������ px.(1.4.1���� ie���Ͽ� auto�� ���� ����.)
 * @return {Number|$Element} DOM ������Ʈ�� ���� ����. ���̸� �����ϸ� this�� ��ȯ�Ѵ�.
 * @description [Lite]
 */
jindo.$Element.prototype.height = function(height) {
	if (typeof height == "number") {
		var e = this._element;
		e.style.height = height+"px";
		if (e.offsetHeight != height) {
			var height = (height*2 - e.offsetHeight);
			if(height>0)
				e.style.height = height + "px";
		}

		return this;
	}

	return this._element.offsetHeight;
};

/**
 * className �޼���� DOM ������Ʈ�� Ŭ���� �̸��� �����ϰų� ��ȯ�Ѵ�.
 * @param {String} sClass 	Ŭ���� �̸�. �� �� �̻��� Ŭ������ �����ߴٸ� ������ ������ ���ڿ��� ��ȯ�Ѵ�.
 * @description [Lite]
 * @example

<div id="zoo" class="animal rest">

..

<script type="text/javascript">

var el = $Element("zoo");
el.className();
// "animal rest"

el.className("entertainment");
el.className();
// "entertainment"

</script>
 */
jindo.$Element.prototype.className = function(sClass) {
	var e = this._element;

	if (typeof sClass == "undefined") return e.className;
	e.className = sClass;

	return this;
};

/**
 * hasClass �޼���� DOM ������Ʈ���� Ư���� Ŭ������ ����ϰ� �ִ��� Ȯ���Ѵ�.
 * @param {String} sClass Ȯ���� Ŭ���� ������
 * @return {Boolean} Ŭ������ ��� ����.
 * @description [Lite]
 */
jindo.$Element.prototype.hasClass = function(sClass) {
	return (" "+this._element.className+" ").indexOf(" "+sClass+" ") > -1;
};

/**
 * addClass �޼���� DOM ������Ʈ�� Ŭ������ �߰��Ѵ�.
 * @param {String} sClass �߰��� Ŭ���� ������
 * @return {$Element} ������ DOM ������Ʈ
 * @description [Lite]
 */
jindo.$Element.prototype.addClass = function(sClass) {
	var e = this._element;
	if (this.hasClass(sClass)) return this;
	e.className = (e.className+" "+sClass).replace(/^\s+/, "");
	return this;
};

/**
 * removeClass �޼���� DOM ������Ʈ���� Ư�� Ŭ������ �����Ѵ�.
 * @param {String} sClass ������ Ŭ���� �̸�
 * @return {$Element} ������ DOM ������Ʈ
 * @description [Lite]
 */
jindo.$Element.prototype.removeClass = function(sClass) {
	var e = this._element;
	e.className = (" "+e.className+" ").replace(" "+sClass+" ", " ").replace(/\s+$/, "").replace(/^\s+/, "");
	
	return this;
};

/**
 * toggle �޼���� Ŭ���� �������� ����Ѵ�. �ϳ��� Ŭ���� �����͸� �μ��� ����ϸ� �ش� Ŭ������ ����ϰ�, �� ���� �����͸� �μ��� ����ϸ� ����ϰ� �ִ� �����ʹ� �����, ������ �����͸� �߰��Ѵ�.
 * @param {Object} sClass	Ŭ���� ������ �̸�. �ϳ��� Ŭ���� �����͸� �μ��� ����ϸ�, DOM ������Ʈ���� �ش� Ŭ���� �����͸� ����ϴ��� Ȯ���Ѵ�. ���� �����͸� ����ϰ� �ִٸ� �ش� �����͸� �����. ����ϰ� ���� �ʴٸ� �ش� �����͸� �߰��Ѵ�.
 * @param {Object} [sClass2]	Ŭ���� ������ �̸�.  �� ���� Ŭ���� �����͸� �μ��� ����ϸ�, �� ������ �� ����ϰ� �ִ� �����͸� ����� ������ �����͸� �߰��Ѵ�.
 * @import core.$Element[hasClass,addClass,removeClass]
 * @description [Lite]
 * @example

<div id="naver" class="search highlight active">Naver</div>

<script>
var r = $Element("naver")
r.toggleClass("highlight");
// <div id="naver" class="search active">Naver</div>

r.toggleClass("highlight");
// <div id="naver" class="search highlight active">Naver</div>

r.toggleClass("active", "deactive");
// <div id="naver" class="search highlight deactive">Naver</div>

r.toggleClass("active", "deactive");
// <div id="naver" class="search highlight active">Naver</div>
</script>

 */
jindo.$Element.prototype.toggleClass = function(sClass, sClass2) {
	sClass2 = sClass2 || "";
	if (this.hasClass(sClass)) {
		this.removeClass(sClass);
		if (sClass2) this.addClass(sClass2);
	} else {
		this.addClass(sClass);
		if (sClass2) this.removeClass(sClass2);
	}

	return this;
};

/**
 * text �޼���� DOM ������Ʈ�� �ؽ�Ʈ ��尪�� �������ų� �����Ѵ�. String Ÿ���� �μ��� �����ϸ� �μ��� ������ �ؽ�Ʈ ��带 �����ϰ� ������ ����� �����Ѵ�.
 * @param {String} sText ������ �ؽ�Ʈ
 * @returns {String} ������ �ؽ�Ʈ ��
 * @description [Lite]
 */
jindo.$Element.prototype.text = function(sText) {
	var prop = (typeof this._element.textContent != "undefined")?"textContent":"innerText";

	if (this.tag == "textarea" || this.tag == "input") prop = "value";

	if (typeof sText == "string") {
		try { 
			this._element[prop] = sText; 
		} catch(e) {
			return this.html(sText.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
		}
		return this;
	}

	return this._element[prop];
};

/**
 * html �޼���� DOM ������Ʈ�� ���� HTML(innerHTML)�� �������ų� �����Ѵ�. String Ÿ���� �μ��� �����ϸ� �μ��� ������ ���� HTML�� �����ϰ� ������ ����� �����Ѵ�.
 * @param {String} sHTML ������ HTML ���ڿ�
 * @return {String} ���� HTML
 * @description [Lite]
 */
jindo.$Element.prototype.html = function(sHTML) {
	if (arguments.length) {
		sHTML += ""; 
		jindo.$$.release();
		var oEl = this._element;
		var isIe = (typeof window.opera=="undefined" && navigator.userAgent.indexOf("MSIE")>-1);
		var isFF = (navigator.userAgent.indexOf("Firefox")>-1);
		var bBugAgent = isIe || (isFF && !oEl.parentNode);
		
		
		
		if (bBugAgent) {

			/*
				IE �� FireFox �� �Ϻ� ��Ȳ���� SELECT �±׳� TABLE, TR, THEAD, TBODY �±׿� innerHTML �� �����ص�
				������ ������ �ʵ��� ���� - hooriza
			*/
			var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000);
			var oDoc = oEl.ownerDocument || oEl.document || document;

			var oDummy;
			var sTag = oEl.tagName.toLowerCase();

			switch (sTag) {
			case 'select':
			case 'table':
				oDummy = jindo.$('<div>');
				oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
				break;

			case 'tr':
			case 'thead':
			case 'tbody':
				oDummy = jindo.$('<div>');
				oDummy.innerHTML = '<table><' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '></table>';
				break;

			default:
				oEl.innerHTML = sHTML;
				break;
			}

			if (oDummy) {

				var oFound;
				for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild)
					if (oFound.className == sId) break;

				if (oFound) {
					var notYetSelected = true;
					for (var oChild; oChild = oEl.firstChild;) oChild.removeNode(true); // innerHTML = '';

					for (var oChild = oFound.firstChild; oChild; oChild = oFound.firstChild){
						if(sTag=='select'&&isIe){
							/*
							 * ie���� select�ױ��� ��� option�� selected�� �Ǿ� �ִ� option�� �ִ� ��� �߰��� 
							 * selected�� �Ǿ� ������ �� ���� ���ʹ� ��� selected�� true�� �Ǿ� �־� 
							 * �ذ��ϱ� ���� cloneNode�� �̿��Ͽ� option�� ī���� �� selected�� ������. - mixed
							 */
							var cloneNode = oChild.cloneNode(true);
							if (oChild.selected && notYetSelected) {
								notYetSelected = false;
								cloneNode.selected = true;
							}
							oEl.appendChild(cloneNode);
							oChild.removeNode(true);
						}else{
							oEl.appendChild(oChild);
						}

					}
					
					oDummy.removeNode && oDummy.removeNode(true);

				}

				oDummy = null;

			}

		} else {

			oEl.innerHTML = sHTML;

		}
		
		return this;

	}
	return this._element.innerHTML;
};


/**
 * outerHTML �޼���� DOM ������Ʈ�� �ܺ� HTML(outerHTML)�� ��ȯ�Ѵ�.
 * @return {String} �ܺ� HTML
 * @description [Lite]
 */
jindo.$Element.prototype.outerHTML = function() {
	var e = this._element;
	if (typeof e.outerHTML != "undefined") return e.outerHTML;

	var div = jindo.$("<div>");
	var par = e.parentNode;
	
	// ������尡 ������ innerHTML��ȯ
	if(!par) return e.innerHTML;

	par.insertBefore(div, e);
	div.style.display = "none";
	div.appendChild(e);

	var s = div.innerHTML;
	par.insertBefore(e, div);
	par.removeChild(div);

	return s;
};

/**
 * toString �޼���� DOM ������Ʈ�� HTML ���ڿ��� ��ȯ�Ͽ� �����Ѵ�. ���ϰ��� outerHTML�� �����ϴ�.
 * @return {String} �ܺ� HTML
 */
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;

/**
 * @fileOverview $Element�� Ȯ�� �޼��带 ������ ����
 * @name element.extend.js
 */

/**
 * appear �޼���� DOM ������Ʈ�� ������ ��Ÿ���� �Ѵ�. (Fade-in ȿ��)
 * @param {Number} duration DOM ������Ʈ�� �������� ������ ������ �����ؼ� 1�� �ɶ� ���� �ɸ��� �ð�. ������ �ʸ� ����Ѵ�.
 * @param {Function} callback DOM ������Ʈ�� ������ ��Ÿ�� ��, �� �������� 1�� �� �Ŀ� ������ �ݹ� �Լ�.
 * @returns {Object} $Element ��ü
 * @see $Element#show
 * @see $Element#disappear
 */
jindo.$Element.prototype.appear = function(duration, callback) {
	var self = this;
	var op   = this.opacity();
	
	if(!this.visible()) op = 0;

	if (op == 1) return this;
	try { clearTimeout(this._fade_timer); } catch(e){};

	callback = callback || new Function;

	var step = (1-op) / ((duration||0.3)*100);
	var func = function(){
		op += step;
		self.opacity(op);

		if (op >= 1) {
			callback(self);
		} else {
			self._fade_timer = setTimeout(func, 10);
		}
	};

	this.show();
	func();

	return this;
};

/**
 * disappear �޼���� DOM ������Ʈ�� ������ ������� �Ѵ�. (Fade-out ȿ��) DOM ������Ʈ�� ������ ������� ������Ʈ�� CSS �� display �Ӽ��� none���� ���Ѵ�.
 * @param {Number} duration DOM ������Ʈ�� �������� ������ ������ 0�� �� ������ �ɸ��� �ð�. ������ �ʸ� ����Ѵ�.
 * @param {Function} callback DOM ������Ʈ�� ������ ������� �� ��, �� �������� 0�� �� �Ŀ� ������ �ݹ� �Լ�
 * @returns {Object} $Element ��ü
 * @see $Element#hide
 * @see $Element#appear
 */
jindo.$Element.prototype.disappear = function(duration, callback) {
	var self = this;
	var op   = this.opacity();
	
	if (op == 0) return this;
	try { clearTimeout(this._fade_timer); } catch(e){};

	callback = callback || new Function;

	var step = op / ((duration||0.3)*100);
	var func = function(){
		op -= step;
		self.opacity(op);

		if (op <= 0) {
			self.hide();
			self.opacity(1);
			callback(self);
		} else {
			self._fade_timer = setTimeout(func, 10);
		}
	};

	func();

	return this;
};

/**
 * offset �޼���� DOM ������Ʈ�� ��ġ�� �������ų� �����Ѵ�. �������� ������ ������ ���� ����̴�. offset �޼����� �μ��� top, left ���� �����ϸ� DOM ������Ʈ�� ��ġ�� �����Ѵ�.
 * @remark �Ϻ� �������� �Ϻ� ��Ȳ���� inline ������Ʈ�� ���� ��ġ�� �ùٸ��� ������� �ʴ� ������ ������ �� ��� �ش� ������Ʈ�� position:relative; �� �ٲ��ִ� ������ �ذ��� �� �ִ�.
 * @author Hooriza
 * @param {Number} [nTop] ������ �� ������ ���� ������Ʈ �� �������� �Ÿ�. ������ px.
 * @param {Number} [nLeft] ������ ���� �����ڸ����� ������Ʈ�� ���� �����ڸ������� �Ÿ�. ������ px.
 * @return {$Element | Object} ������Ʈ�� ��ġ�� �����ϸ� ���� ������Ʈ��, ������Ʈ�� ��ġ�� �������� ������Ʈ�� x, y ��ǥ�� �Ӽ����� ������ ��ü.
 */
jindo.$Element.prototype.offset = function(nTop, nLeft) {

	var oEl = this._element;
	var oPhantom = null;

	// setter
	if (typeof nTop == 'number' && typeof nLeft == 'number') {

		if (isNaN(parseInt(this.css('top')))) this.css('top', 0);
		if (isNaN(parseInt(this.css('left')))) this.css('left', 0);

		var oPos = this.offset();
		var oGap = { top : nTop - oPos.top, left : nLeft - oPos.left };

		oEl.style.top = parseInt(this.css('top')) + oGap.top + 'px';
		oEl.style.left = parseInt(this.css('left')) + oGap.left + 'px';

		return this;

	}

	// getter
	var bSafari = /Safari/.test(navigator.userAgent);
	var bIE = /MSIE/.test(navigator.userAgent);
	var nVer = bIE?navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1]:0;
	
	var fpSafari = function(oEl) {

		var oPos = { left : 0, top : 0 };

		for (var oParent = oEl, oOffsetParent = oParent.offsetParent; oParent = oParent.parentNode; ) {

			if (oParent.offsetParent) {

				oPos.left -= oParent.scrollLeft;
				oPos.top -= oParent.scrollTop;

			}

			if (oParent == oOffsetParent) {

				oPos.left += oEl.offsetLeft + oParent.clientLeft;
				oPos.top += oEl.offsetTop + oParent.clientTop ;

				if (!oParent.offsetParent) {

					oPos.left += oParent.offsetLeft;
					oPos.top += oParent.offsetTop;

				}

				oOffsetParent = oParent.offsetParent;
				oEl = oParent;
			}
		}

		return oPos;

	};

	var fpOthers = function(oEl) {

		var oPos = { left : 0, top : 0 };

		var oDoc = oEl.ownerDocument || oEl.document || document;
		var oHtml = oDoc.documentElement;
		var oBody = oDoc.body;

		if (oEl.getBoundingClientRect) { // has getBoundingClientRect

			if (!oPhantom) {
				
				if ((bIE && nVer < 8 && window.external) && (window == top || window.frameElement && window.frameElement.frameBorder == 1)) {
					oPhantom = { left : 2, top : 2 };
					oBase = null;

				} else {

					oPhantom = { left : 0, top : 0 };

				}

			}

			var box = oEl.getBoundingClientRect();
			if (oEl !== oHtml && oEl !== oBody) {

				oPos.left = box.left - oPhantom.left;
				oPos.top = box.top - oPhantom.top;

				oPos.left += oHtml.scrollLeft || oBody.scrollLeft;
				oPos.top += oHtml.scrollTop || oBody.scrollTop;

			}

		} else if (oDoc.getBoxObjectFor) { // has getBoxObjectFor

			var box = oDoc.getBoxObjectFor(oEl);
			var vpBox = oDoc.getBoxObjectFor(oHtml || oBody);

			oPos.left = box.screenX - vpBox.screenX;
			oPos.top = box.screenY - vpBox.screenY;

		} else {

			for (var o = oEl; o; o = o.offsetParent) {

				oPos.left += o.offsetLeft;
				oPos.top += o.offsetTop;

			}

			for (var o = oEl.parentNode; o; o = o.parentNode) {

				if (o.tagName == 'BODY') break;
				if (o.tagName == 'TR') oPos.top += 2;

				oPos.left -= o.scrollLeft;
				oPos.top -= o.scrollTop;

			}

		}

		return oPos;

	};

	return (bSafari ? fpSafari : fpOthers)(oEl);
};

/**
 * evalScripts �޼���� ���ڷ� ���� ���ڿ� �߿��� &lt;script&gt; �±� �ȿ� �ִ� ������ �Ľ��ؼ� eval �� �����Ѵ�.
 * @param {String} sHTML &lt;script&gt; �±װ� ���Ե� HTML ���ڿ�
 * @return {$Element} ������ DOM ������Ʈ
 */
jindo.$Element.prototype.evalScripts = function(sHTML) {
	
	var aJS = [];
    sHTML = sHTML.replace(new RegExp('<script(\\s[^>]+)*>(.*?)</'+'script>', 'gi'), function(_1, _2, sPart) { aJS.push(sPart); return ''; });
    eval(aJS.join('\n'));
    
    return this;

};

/**
 * append �޼���� �μ��� ������ DOM ������Ʈ�� $Element ��ü�� ������ �ڽ� ���� �߰��Ѵ�.
 * @param {$Element | HTMLElement | String} oElement	�߰��� DOM ������Ʈ
 * @returns {Object} ���ο� �ڽĳ�带 �߰��� $Element ��ü
 */
jindo.$Element.prototype.append = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	this._element.appendChild(o);

	return jindo.$Element(o);
};

/**
 * prepend �޼���� �μ��� ������ DOM ������Ʈ�� $Element ��ü�� ù��° �ڽ� ���� �߰��Ѵ�.
 * @param {$Element | HTMLElement | String} oElement	�߰��� DOM ������Ʈ, Ȥ�� ������Ʈ�� id
 * @returns {$Element} ���ο� �ڽ� ��带 �߰��� $Element ��ü
 */
jindo.$Element.prototype.prepend = function(oElement) {
	var e = this._element;
	var o = jindo.$Element(oElement).$value();

	if (e.childNodes.length > 0) {
		e.insertBefore(o, e.childNodes[0]);
	} else {
		e.appendChild(o);
	}

	return jindo.$Element(o);
};

/**
 * replace �޼���� $Element ��ü�� ��带 �μ��� ������ DOM ������Ʈ�� ��ü�Ѵ�.
 * @param {$Element | HTMLElement | String} oElement	��ü�� DOM ������Ʈ, Ȥ�� ������Ʈ�� id
 * @returns {$Element} DOM ������Ʈ�� ��ü�� $Element ��ü
 */
jindo.$Element.prototype.replace = function(oElement) {
	jindo.$$.release();
	var e = this._element;
	var o = jindo.$Element(oElement).$value();

	e.parentNode.insertBefore(o, e);
	e.parentNode.removeChild(e);

	return jindo.$Element(o);
};

/**
 * appendTo �޼���� $Element ��ü�� �μ��� ������ DOM ������Ʈ�� ������ �ڽ� ���� �߰��Ѵ�.
 * @param {$Element | HTMLElement | String} oElement �߰��� DOM ������Ʈ, Ȥ�� ������Ʈ�� id
 * @returns {$Element} �ڽ� ��带 �߰��� $Element ��ü
 */
jindo.$Element.prototype.appendTo = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	o.appendChild(this._element);

	return this;
};

/**
 * prependTo �޼���� �μ��� ������ $Element ��ü�� ù��° �ڽ� ���� �߰��Ѵ�.
 * @param {$Element | HTMLElement | String} oElement �߰��� DOM ������Ʈ, Ȥ�� ������Ʈ�� id
 * @returns {$Element} �ڽ� ��带 �߰��� $Element ��ü
 */
jindo.$Element.prototype.prependTo = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	if (o.childNodes.length > 0) {
		o.insertBefore(this._element, o.childNodes[0]);
	} else {
		o.appendChild(this._element);
	}

	return this;
};

/**
 * before �޼���� �μ��� ������ ������Ʈ�� $Element ��ü �ٷ� �տ� �����Ѵ�.
 * @param {$Element | HTMLElement | String} oElement ������ DOM ������Ʈ, Ȥ�� ������Ʈ�� id
 * @returns {Object} ������ DOM ������Ʈ
 */
jindo.$Element.prototype.before = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	this._element.parentNode.insertBefore(o, this._element);

	return jindo.$Element(o);
};

/**
 * after �޼���� �μ��� ������ ������Ʈ�� $Element ��ü�� �ٷ� �ڿ� ������ DOM ������Ʈ�� �����Ѵ�.
 * @param {$Element | HTMLElement | String} oElement ������ DOM ������Ʈ, Ȥ�� ������Ʈ�� id
 * @returns {Object} ������ DOM ������Ʈ
 */
jindo.$Element.prototype.after = function(oElement) {
	var o = this.before(oElement);
	o.before(this);

	return o;
};

/**
 * parent �޼���� Ư�� ����� �θ� ��� (�����̳� ���)�� �˻��Ѵ�.
 * @param {String} [pFunc] ���� ����� �˻� ������ ������ �ݹ� �Լ�. ���� ���� ��带 ���� ���� �˻��Ϸ��� pFunc�� null�� �����ϰ� limit�� ���� ����� ������ �����Ѵ�.
 * @param {Number} [limit] Ž���� ���� ����� ����.
 * @returns {$Element | Array} �θ� ���, Ȥ�� ���� ����� �迭. �θ� ��常 ������ ��� $Element Ÿ����, ���� ����� �迭�� ������ ��� $Element�� �迭�� �����Ѵ�.
 */
jindo.$Element.prototype.parent = function(pFunc, limit) {
	var e = this._element;
	var a = [], p = null;

	if (typeof pFunc == "undefined") return jindo.$Element(e.parentNode);
	if (typeof limit == "undefined" || limit == 0) limit = -1;

	while (e.parentNode && limit-- != 0) {
		p = jindo.$Element(e.parentNode);
		if (e.parentNode == document.documentElement) break;
		if (!pFunc || (pFunc && pFunc(p))) a[a.length] = p;

		e = e.parentNode;
	}

	return a;
};

/**
 * child �޼���� �ڽ� ��带 �˻��Ѵ�.
 * @param {Function} [pFunc]  �ڽ� ����� �˻� ������ ������ �ݹ� �Լ�. ���� ���� ��带 ���� ���� �˻��Ϸ��� pFunc�� null�� �����ϰ� limit�� ���� ����� ������ �����Ѵ�.
 * @param {Number} [limit] Ž���� ���� ��� ����
 * @returns {$Element | Array} �ڽ� ���, Ȥ�� ���ǿ� �´� �ڽ� ����� �迭. �ڽ� ��� �ϳ��� ������ ��� $Element Ÿ����, �ڽ� ����� �迭�� ������ ��� $Element�� �迭�� �����Ѵ�.
 */
jindo.$Element.prototype.child = function(pFunc, limit) {
	var e = this._element;
	var a = [], c = null, f = null;

	if (typeof pFunc == "undefined") return jindo.$A(e.childNodes).filter(function(v){ return v.nodeType == 1}).map(function(v){ return jindo.$Element(v) }).$value();
	if (typeof limit == "undefined" || limit == 0) limit = -1;

	(f = function(el, lim){
		var ch = null, o = null;

		for(var i=0; i < el.childNodes.length; i++) {
			ch = el.childNodes[i];
			if (ch.nodeType != 1) continue;

			o = jindo.$Element(el.childNodes[i]);
			if (!pFunc || (pFunc && pFunc(o))) a[a.length] = o;
			if (lim != 0) f(el.childNodes[i], lim-1);
		}
	})(e, limit-1);

	return a;
};

/**
 * prev �޼���� Ư�� ����� ������ ������ ���� ��带 �˻��Ѵ�.
 * @param {String} [pFunc] ���� ���� ����� �˻� ������ ������ �ݹ� �Լ�. pFunc�� �����ϸ� �ٷ� ���� ���� ��带 �����Ѵ�.
 * @returns {$Element | Array} pFunc�� ���ǿ� �´� ���� $Element�� �迭, Ȥ�� �ٷ� ���� ���� ��带 ����Ű�� $Element.
 */
jindo.$Element.prototype.prev = function(pFunc) {
	var e = this._element;
	var a = [];
	var b = (typeof pFunc == "undefined");

	if (!e) return b?jindo.$Element(null):a;
	
	do {
		e = e.previousSibling;
		
		if (!e || e.nodeType != 1) continue;
		if (b) return jindo.$Element(e);
		if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
	} while(e);

	return b?jindo.$Element(e):a;
};

/**
 * next �޼���� Ư�� ����� ������ ������ ���� ��带 �˻��Ѵ�.
 * @param {String} pFunc ���� ���� ����� �˻� ������ ������ �ݹ� �Լ�. pFunc�� �����ϸ� �ٷ� ������ ���� ��带 ����Ű�� $Element�� �����Ѵ�.
 * @returns {$Element | Array} pFunc�� ���ǿ� �´� ���� $Element�� �迭, Ȥ�� �ٷ� ������ ���� ��带 ����Ű�� $Element.
 */
jindo.$Element.prototype.next = function(pFunc) {
	var e = this._element;
	var a = [];
	var b = (typeof pFunc == "undefined");

	if (!e) return b?jindo.$Element(null):a;
	
	do {
		e = e.nextSibling;
		
		if (!e || e.nodeType != 1) continue;
		if (b) return jindo.$Element(e);
		if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
	} while(e);

	return b?jindo.$Element(e):a;
};

/**
 * first �޼ҵ�� ���� ����� ó�� �ڽ� ��带 ��ȯ�Ѵ�. ������Ʈ ��忡 ���ؼ��� ����ȴ�.
 * @since 1.2.0
 * @returns {$Element} ������ �ڽ� ���
 */
jindo.$Element.prototype.first = function() {
	var el = this._element.firstElementChild||this._element.firstChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.nextSibling;

	return el?jindo.$Element(el):null;
}

/**
 * last �޼ҵ�� ���� ����� ������ �ڽ� ��带 ��ȯ�Ѵ�. ������Ʈ ��忡 ���ؼ��� ����ȴ�.
 * @since 1.2.0
 * @returns {$Element} ������ �ڽ� ���
 */
jindo.$Element.prototype.last = function() {
	var el = this._element.lastElementChild||this._element.lastChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.previousSibling;

	return el?jindo.$Element(el):null;
}

/**
 * isChildOf �޼���� ���� ��尡 ������ ����� �ڽ� ������� Ȯ���Ѵ�.
 * @param {HTMLElement | String | $Element} element �θ� ������� Ȯ���� DOM ������Ʈ, Ȥ�� DOM ������Ʈ�� ������ id
 * @returns {Boolean} ���� ��尡 �μ��� ������ ����� �ڽ� ����̸� true, �׷��� ������ false�� �����Ѵ�.
 */
jindo.$Element.prototype.isChildOf = function(element) {
	var e  = this._element;
	var el = jindo.$Element(element).$value();

	while(e && e.parentNode) {
		e = e.parentNode;
		if (e == el) return true;
	}
	return false;
};

/**
 * isParentOf �޼���� ���� ��尡 ������ ����� �θ����� Ȯ���Ѵ�.
 * @param {HTMLElement,$Element} element	�ڽ� ������� Ȯ���� DOM ������Ʈ, Ȥ�� DOM ������Ʈ�� ������ id.
 * @returns {Boolean} ���� ��尡 �μ��� ������ ����� �θ��̸� true, �׷��� ������ false
 */
jindo.$Element.prototype.isParentOf = function(element) {
	var el = jindo.$Element(element).$value();

	while(el && el.parentNode) {
		el = el.parentNode;
		if (this._element == el) return true;
	}
	return false;
};

/**
 * isEqual �޼���� ���� ��ü�� ���ڷ� �־��� ��ü�� ���� ������Ʈ���� Ȯ���Ѵ�.
 * @param {HTMLElement, $Element} element ���� ������Ʈ ��ü
 * @returns {Boolean} ���� ����̸� true, �׷��� ������ false
 */
jindo.$Element.prototype.isEqual = function(element) {
	try {
		return (this._element === jindo.$Element(element).$value());
	} catch(e) {
		return false;
	}
};

/**
 * fireEvent �޼���� DOM ������Ʈ�� �̺�Ʈ�� �߻���Ų��.
 * event��ü�� �Ӽ��� ������ �� �ִ�.  
 * (����: WebKit�迭������ �̺�Ʈ��ü�� keyCode �� read-only�� ����� key�̺�Ʈ�� fire�� ��� keyCode���� �������� �ʴ´�.) - 1.4.1 ���� ��밡��.
 * @param {String} sEvent ������ �̺�Ʈ �̸�. on ���λ�� �����Ѵ�.
 * @param {Event} oEvent �̺�Ʈ ����� ����� event��ü.
 * @return {$Element} �̺�Ʈ�� �߻���Ų DOM ������Ʈ
 * @example
 	$Element("div").fireEvent("click",{left:true,middle:false,right:false});
 	 	
 	$Element("div").fireEvent("mouseover",{screenX:50,screenY:50,clientX:50,clientY:50});
 	
 	$Element("div").fireEvent("keydown",{keyCode:13,alt:true,shift:false,meta:false,ctrl:true});
 */
jindo.$Element.prototype.fireEvent = function(sEvent, oProps) {
	
	function IE(sEvent, oProps) {
		sEvent = (sEvent+"").toLowerCase();
		var oEvent = document.createEventObject();
		if(oProps){
			for (k in oProps) oEvent[k] = oProps[k];
			oEvent.button = (oProps.left?1:0)+(oProps.middle?4:0)+(oProps.right?2:0);
			oEvent.relatedTarget = oProps.relatedElement||null;
		}
		this._element.fireEvent("on"+sEvent, oEvent);
		return this;
	};

	function DOM2(sEvent, oProps) {
		var sType = "HTMLEvents";
		sEvent = (sEvent+"").toLowerCase();

		if (sEvent == "click" || sEvent.indexOf("mouse") == 0) {
			sType = "MouseEvent";
			if (sEvent == "mousewheel") sEvent = "dommousescroll";
		} else if (sEvent.indexOf("key") == 0) {
			sType = "KeyboardEvent";
		}
		var evt;
		if (oProps) {
			switch (sType) {
				case 'MouseEvent':
					evt = document.createEvent(sType);
					oProps.button = 0 + (oProps.middle?1:0) + (oProps.right?2:0);
					evt.initMouseEvent(sEvent, true, true, null, oProps.detail, oProps.screenX, oProps.screenY, oProps.clientX, oProps.clientY, oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.button, oProps.relatedElement);
					break;
				case 'KeyboardEvent':
					if (window.KeyEvent) {
				        evt = document.createEvent('KeyEvents');
				        evt.initKeyEvent(sEvent, true, true, window,  oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.keyCode, oProps.keyCode);
				    } else {
						try {
				            evt = document.createEvent("Events");
				        } catch (e){
				            evt = document.createEvent("UIEvents");
				        } finally {
							evt.initEvent(sEvent, true, true);
							evt.ctrlKey  = oProps.ctrl;
					        evt.altKey   = oProps.alt;
					        evt.shiftKey = oProps.shift;
					        evt.metaKey  = oProps.meta;
					        evt.keyCode = oProps.keyCode;
					        evt.which = oProps.keyCode;
				        }          
				    }
					break;
				default:
					evt = document.createEvent(sType);
					evt.initEvent(sEvent, true, true);				
			}
		}else{
			evt = document.createEvent(sType);			
			evt.initEvent(sEvent, true, true);
		}
		this._element.dispatchEvent(evt);
		return this;
	};

	jindo.$Element.prototype.fireEvent = (typeof this._element.dispatchEvent != "undefined")?DOM2:IE;

	return this.fireEvent(sEvent, oProps);
};

/**
 * empty �޼���� ���� ����� �ڽ� ��带 ��� �����Ѵ�.
 * @return {$Element} �ڽ� ��带 ��� ������ ���� ���
 */
jindo.$Element.prototype.empty = function() {
	jindo.$$.release();
	this.html("");
	return this;
};

/**
 * remove �޼���� ���� ����� �ڽ� ��带 �����Ѵ�.
 * ���ŵǴ� �ڽ� ��忡 attach�� �̺�Ʈ �ڵ鷯�� ��� detach ��Ų��.
 */
jindo.$Element.prototype.remove = function(oChild) {
	jindo.$$.release();
	jindo.$Element(oChild).leave();
	return this;
}

/**
 * leave �޼���� ���� ��带 �θ� ��忡�� �����Ѵ�.
 * ���ŵǴ� ��忡 attach�� �̺�Ʈ �ڵ鷯�� ��� detach ��Ų��.
 * @return {$Element} �θ� ��忡�� ������ $Element ��ü
 */
jindo.$Element.prototype.leave = function() {
	var e = this._element;

	if (e.parentNode) {
		jindo.$$.release();
		e.parentNode.removeChild(e);
	}
	
	jindo.$Fn.freeElement(this._element);

	return this;
};

/**
 * wrap �޼���� �μ��� ������ ���� ���� ��带 ���Ѵ�.
 * @param {String | HTMLElement} wrapper ���� ��� Ȥ�� ����� ������ id ��
 * @return {$Element} ���ο� ���� ������ $Element ��ü
 */
jindo.$Element.prototype.wrap = function(wrapper) {
	var e = this._element;

	wrapper = jindo.$Element(wrapper).$value();
	if (e.parentNode) {
		e.parentNode.insertBefore(wrapper, e);
	}
	wrapper.appendChild(e);

	return this;
};

/**
 * ellipsis �޼���� DOM ������Ʈ�� �ؽ�Ʈ ��尡 �������� �� �ٷ� ���̵��� ���̸� �����Ѵ�. ���̸� �����Ѵٸ� stringTail���� ������ ���ڿ��� �ؽ�Ʈ ����� �� ���� ���δ�.
 * @remark �� �޼���� ������Ʈ�� �ؽ�Ʈ ��常 �����Ѵٰ� �����Ѵ�. ����, �̿��� ��Ȳ������ ������ �������� �ʴ´�.
 * @remark ������������ ������Ʈ �ʺ� �����ϰ� �� �ʺ� �������� �ؽ�Ʈ ����� ���̸� ���ϹǷ� ������Ʈ�� �ݵ�� ���̴� �����̾�� �Ѵ�.
 * @remark ȭ�鿡 ��ü �ؽ�Ʈ ��尡 �����ٰ� �پ��� ��찡 �ִ�. ����, ������Ʈ���� overflow:hidden �Ӽ��� Ȱ���ϸ� �̷� ������ ���� �� �ִ�. ??
 * @param {String} stringTail ������ ǥ����. �����ϸ� ������ǥ('...')�� ����Ѵ�.
 */
jindo.$Element.prototype.ellipsis = function(stringTail) {
	stringTail = stringTail || "...";

	var txt   = this.text();
	var len   = txt.length;
	var cur_h = this.height();
	var i     = 0;
	var h     = this.text('A').height();

	if (cur_h < h * 1.5) return this.text(txt);

	cur_h = h;
	while(cur_h < h * 1.5) {
		i += Math.max(Math.ceil((len - i)/2), 1);
		cur_h = this.text(txt.substring(0,i)+stringTail).height();
	}

	while(cur_h > h * 1.5) {
		i--;
		cur_h = this.text(txt.substring(0,i)+stringTail).height();
	}
};

/**
 * indexOf �޼ҵ�� �־��� ������Ʈ�� �� ��ü�� �� ��° �ڽĳ������ ��ȯ�Ѵ�. �ε����� 0���� �����ϹǷ� ù��° �ڽ� ��带 ���ڷ� �����ϸ� 0�� ��ȯ�Ѵ�. �־��� ������Ʈ�� �� ��ü�� �ڽ��� �ƴ϶��, �ٽ� ����, �־��� ������Ʈ�� �ڽ� ��忡�� ã�� ���ߴٸ� -1�� ��ȯ�Ѵ�.
 * @param {HTMLElement, $Element} element �˻��� ������Ʈ
 * @since 1.2.0
 * @return {Number} �˻� ���
 */
jindo.$Element.prototype.indexOf = function(element) {
	try {
		var e = jindo.$Element(element).$value();
		var n = this._element.childNodes;
		var c = 0;
		var l = n.length;

		for (var i=0; i < l; i++) {
			if (n[i].nodeType != 1) continue;

			if (n[i] === e) return c;
			c++;
		}
	}catch(e){}

	return -1;
};

/**
 * ����� ���� ��忡�� �־��� selector�� ������Ű�� ����� �迭�� ��ȯ�Ѵ�. �����ϴ� ��Ұ� �������� ������ �� �迭�� ��ȯ�Ѵ�.
 * @param {String} sSelector
 * @return {Array} ������ �����ϴ� ����� �迭
 */
jindo.$Element.prototype.queryAll = function(sSelector) { 
	return jindo.$$(sSelector, this._element); 
};

/**
 * ����� ���� ��忡�� �־��� selector�� ������Ű�� ����� ù ��° ��Ҹ� ��ȯ�Ѵ�. �����ϴ� ��Ұ� �������� ������ null�� ��ȯ�Ѵ�.
 * @param {String} sSelector
 * @return {Element} ������ �����ϴ� ����� ù��° ���
 */
jindo.$Element.prototype.query = function(sSelector) { 
	return jindo.$$.getSingle(sSelector, this._element); 
};

/**
 * ��Ұ� �־��� selector�� ������Ű�� ������� ���θ� ��ȯ�Ѵ�.
 * @param {String} sSelector
 * @return {Boolean} ������ �������� ����
 */
jindo.$Element.prototype.test = function(sSelector) { 
	return jindo.$$.test(this._element, sSelector); 
};

/**
 * ��Ҹ� ��������  XPath ������ ����Ͽ� ������Ʈ�� ���´�.
 * @remark �����ϴ� ������ ��ô ���������� Ư���� ��쿡���� ����ϴ� ���� �����Ѵ�.
 * @param {String} sXPath
 * @return {Array} path�� �ش��ϴ� ���
 */
jindo.$Element.prototype.xpathAll = function(sXPath) { 
	return jindo.$$.xpath(sSelector, this._element); 
};
/**
 * @fileOverview $Fn�� ������ �� �޼��带 ������ ����
 * @name function.js
 */

/**
 * �Լ� ��ü�� �����Ѵ�.
 * @name $Fn
 * @extends core
 * @class $Fn Ŭ������ Javascript �Լ��� ���� Ŭ�����̴�.  ??
 * @constructor
 * @param {Function | String} func �Լ� ��ü Ȥ�� �Լ��� ���ڸ� ������ ���ڿ�
 * @param {Object | String} thisObject �Լ� ��ü�� �ٸ� ��ü�� �޼����� ��, �ش� ��ü�� ���� �����Ѵ�. Ȥ�� �Լ� ��ü�� �����ϴ� ���ڿ�.
 * @return {$Fn} $Fn ��ü
 * @see $Fn#toFunction
 * @description [Lite]
 * @example
var someObject = {
    func : function() {
       // code here
   }
}

var fn = $Fn(someObject.func, someObject);
 * @author Kim, Taegon
 */
jindo.$Fn = function(func, thisObject) {
	var cl = arguments.callee;
	if (func instanceof cl) return func;
	if (!(this instanceof cl)) return new cl(func, thisObject);

	this._events = [];
	this._tmpElm = null;
	this._key    = null;

	if (typeof func == "function") {
		this._func = func;
		this._this = thisObject;
	} else if (typeof func == "string" && typeof thisObject == "string") {
		this._func = new Function(func, thisObject);
	}
}

/**
 * $value �޼���� ������ Function ��ü�� ��ȯ�Ѵ�.
 * @return {Function} �Լ� ��ü
 * @description [Lite]
 */
jindo.$Fn.prototype.$value = function() {
	return this._func;
};

/**
 * bind �޼���� ��ü�� �޼��带 ���� �ϳ��� Function���� ��ȯ�Ѵ�.
 * @return {Function} �޼ҵ�� ���� Funciton ��ü
 * @see $Fn#bindForEvent
 * @description [Lite]
 */
jindo.$Fn.prototype.bind = function() {
	var a = jindo.$A(arguments).$value();
	var f = this._func;
	var t = this._this;

	var b = function() {
		var args = jindo.$A(arguments).$value();

		// fix opera concat bug
		if (a.length) args = a.concat(args);

		return f.apply(t, args);
	};

	return b;
};

/**
 * bingForEvent�� ��ü�� �޼��带 ���� �ϳ��� �̺�Ʈ �ڵ鷯 Function���� ��ȯ�Ѵ�.
 * @param {Element, ...} [elementN] �̺�Ʈ ��ü�� �Բ� ������ ��
 * @see $Fn#bind
 * @see $Event
 * @description [Lite]
 */
jindo.$Fn.prototype.bindForEvent = function() {
	var a = arguments;
	var f = this._func;
	var t = this._this;
	var m = this._tmpElm || null;

	var b = function(e) {
		var args = jindo.$A(a);
		if (typeof e == "undefined") e = window.event;

		if (typeof e.currentTarget == "undefined") {
			e.currentTarget = m;
		}
		var oEvent = jindo.$Event(e);
		args.unshift(oEvent);

		var returnValue = f.apply(t, args.$value());
		if(typeof returnValue != "undefined" && oEvent.type=="beforeunload"){
			e.returnValue =  returnValue;
		}
		return returnValue;
	};

	return b;
};

/**
 * attach �޼���� �Լ��� Ư�� ������Ʈ�� �̺�Ʈ ��鷯�� ����Ѵ�.
 * @remark �̺�Ʈ �̸��� on ���ξ ������� �ʴ´�.
 * @remark ���콺 �� ��ũ�� �̺�Ʈ�� mousewheel �� ����Ѵ�.
 * @param {Element} oElement �̺�Ʈ�� �߰��� ������Ʈ
 * @param {String} sEvent �߰��� �̺�Ʈ�� ����
 * @param {Boolean} bUseCapture capturing �� ����� ��. (1.4.2 ���� ����.)
 * @see $Fn#detach
 * @description [Lite]
 */
jindo.$Fn.prototype.attach = function(oElement, sEvent, bUseCapture) {
	var fn = null, l, ev = sEvent, el = oElement, ua = navigator.userAgent;
	
	if (typeof bUseCapture == "undefined") {
		bUseCapture = false;
	};
	
	this._bUseCapture = bUseCapture;

	if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el=el.$value()))) {
		for(var i=0; i < el.length; i++) this.attach(el[i], ev, bUseCapture);
		return this;
	}

	if (!el || !ev) return this;
	if (typeof el.$value == "function") el = el.$value();

	el = jindo.$(el);
	ev = ev.toLowerCase();
	
	this._tmpElm = el;
	fn = this.bindForEvent();
	this._tmpElm = null;

	if (typeof el.addEventListener != "undefined") {
		if (ev == "domready") {
			ev = "DOMContentLoaded";	
		}else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0 && !/Opera/.test(ua)) {
			ev = "DOMMouseScroll";	
		}else if (ev == "mouseenter"){
			ev = "mouseover";
			fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
		}else if (ev == "mouseleave"){
			ev = "mouseout";
			fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
		} 
		el.addEventListener(ev, fn, bUseCapture);
	} else if (typeof el.attachEvent != "undefined") {
		if (ev == "domready") {
			jindo.$Fn._domready(el, fn);
			return this;
		} else {
			el.attachEvent("on"+ev, fn);
		}
	}
	
	if (!this._key) {
		this._key = "$"+jindo.$Fn.gc.count++;
		jindo.$Fn.gc.pool[this._key] = this;
	}

	this._events[this._events.length] = {element:el, event:sEvent.toLowerCase(), func:fn};

	return this;
};

/**
 * detach �޼���� �Լ��� Ư�� ������Ʈ�� �̺�Ʈ���� �����Ѵ�.
 * @remark �̺�Ʈ �̸��� on ���ξ ������� �ʴ´�.
 * @remark ���콺 �� ��ũ�� �̺�Ʈ�� mousewheel �� ����Ѵ�.
 * @param {Element} oElement �̺�Ʈ�� ������ ������Ʈ
 * @param {String} sEvent ������ �̺�Ʈ�� �̸�
 * @see $Fn#attach
 * @description [Lite]
 */
jindo.$Fn.prototype.detach = function(oElement, sEvent) {
	var fn = null, l, el = oElement, ev = sEvent, ua = navigator.userAgent;
	
	if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el=el.$value()))) {
		for(var i=0; i < el.length; i++) this.detach(el[i], ev);
		return this;
	}

	if (!el || !ev) return this;
	if (jindo.$Element && el instanceof jindo.$Element) el = el.$value();

	el = jindo.$(el);
	ev = ev.toLowerCase();

	var e = this._events;
	for(var i=0; i < e.length; i++) {
		if (e[i].element !== el || e[i].event !== ev) continue;
		
		fn = e[i].func;
		this._events = jindo.$A(this._events).refuse(e[i]).$value();
		break;
	}

	if (typeof el.removeEventListener != "undefined") {
		
		if (ev == "domready") {
			ev = "DOMContentLoaded";
		}else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0) {
			ev = "DOMMouseScroll";
		}else if (ev == "mouseenter"){
			ev = "mouseover";
		}else if (ev == "mouseleave"){
			ev = "mouseout";
		}
		
		el.removeEventListener(ev, fn, false);
	} else if (typeof el.detachEvent != "undefined") {
		if (ev == "domready") {
			jindo.$Fn._domready.list = jindo.$Fn._domready.list.refuse(fn);
			return this;
		} else {
			el.detachEvent("on"+ev, fn);
		}
	}

	return this;
};

/**
 * delay �޼���� ������ �ð� ���Ŀ� ������ �μ��� �Լ��� ȣ���Ѵ�.
 * @param {Number} nSec �Լ��� ȣ���� ������ ��ٸ� �ð�.
 * @param {Array} args �Լ��� ȣ���� �� ����� �μ�. ���� ���� �μ��� �����ر� ���� �迭�� ����Ѵ�.
 * @see $Fn#bind
 * @see $Fn#repeat
 * @description [Lite]
 * @example
function popup_sum(a, b) {
    alert(a + b);
}

$Fn(popup_sum).delay(5, [3, 5]);
 */
jindo.$Fn.prototype.delay = function(nSec, args) {
	if (typeof args == "undefined") args = [];
	setTimeout(this.bind.apply(this, args), nSec*1000);

	return this;
};

/**
 * repeat �޼���� ������ �ð� ���ݸ��� ������ �μ��� �Լ��� ȣ���Ѵ�.
 * @param {Number} nSec �Լ��� ȣ�Ⱓ ����.
 * @param {Array} args �Լ��� ȣ���� �� ����� �μ�. ���� ���� �μ��� �����ر� ���� �迭�� ����Ѵ�.
 * @return {Object} setInterval�� ������ ��ü
 * @see $Fn#bind
 * @see $Fn#delay 
 * @description [Lite]
 * @example
function popup_sum(a, b) {
    alert(a + b);
}

$Fn(popup_sum).repeat(5, [3, 5]);
 */
jindo.$Fn.prototype.setInterval = function(nSec, args) {
	if (typeof args == "undefined") args = [];
	return setInterval(this.bind.apply(this, args), nSec*1000);
};

/**
 * �޸𸮿��� �� ��ü�� ����� ������ ��� �����Ѵ�(���� ȣ�� ����).
 * @param {Element} �ش� ����� �̺�Ʈ �ڵ鷯�� ����.
 * @ignore
 */
jindo.$Fn.prototype.free = function(oElement) {
	var len = this._events.length;
	while(len > 0) {
		var el = this._events[--len].element;
		if (oElement && el!=oElement)
			continue;
			
		this.detach(el, this._events[len].event);
		delete this._events[len];
	}
	
	if(this._events.length==0)	
		try { delete jindo.$Fn.gc.pool[this._key]; }catch(e){};
};

/**
 * IE���� domready(=DOMContentLoaded) �̺�Ʈ�� ���ķ��̼��Ѵ�.
 * @ignore
 */
jindo.$Fn._domready = function(doc, func) {
	if (typeof jindo.$Fn._domready.list == "undefined") {
		var f = null, l  = jindo.$Fn._domready.list = jindo.$A([func]);
		
		// use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		var done = false, execFuncs = function(){
			if(!done) {
				done = true;
				var evt = {
					type : "domready",
					target : doc,
					currentTarget : doc
				};

				while(f = l.shift()) f(evt);
			}
		};

		(function (){
			try {
				doc.documentElement.doScroll("left");
			} catch(e) {
				setTimeout(arguments.callee, 50);
				return;
			}
			execFuncs();
		})();

		// trying to always fire before onload
		doc.onreadystatechange = function() {
			if (doc.readyState == 'complete') {
				doc.onreadystatechange = null;
				execFuncs();
			}
		};

	} else {
		jindo.$Fn._domready.list.push(func);
	}
};

/**
 * �� IE���� mouseenter/mouseleave �̺�Ʈ�� ���ķ��̼��ϱ� ���� ��� ������ ����� ��쿡�� �����ϴ� �Լ� ����
 * @ignore
 */
jindo.$Fn._fireWhenElementBoundary = function(doc, func) {
	return function(evt){
		var oEvent = jindo.$Event(evt);
		var relatedElement = jindo.$Element(oEvent.relatedElement);
		if(relatedElement && (relatedElement.isEqual(this) || relatedElement.isChildOf(this))) return;
		
		func.call(this,evt);
	}
};

/**
 * gc �޼���� Window���� ��� ��, DOM Element�� �Ҵ�� �̺�Ʈ �ڵ鷯�� �����Ѵ�. ??
 * @see $Fn#free
 */
jindo.$Fn.gc = function() {
	var p = jindo.$Fn.gc.pool;

	for(var key in p) {
		try { p[key].free(); }catch(e){ };
	}

	// delete all missing references
	jindo.$Fn.gc.pool = p = {};
};

/**
 * Ư�� ��ҿ� �Ҵ�� �̺�Ʈ�� ��� �����Ѵ�.
 * @since 1.3.5
 * @see $Fn#gc 
 */
jindo.$Fn.freeElement = function(oElement){
	var p = jindo.$Fn.gc.pool;
	for(var key in p) {
		try { p[key].free(oElement); }catch(e){ };
	}	
}

jindo.$Fn.gc.count = 0;

jindo.$Fn.gc.pool = {};
if (typeof window != "undefined") {
	jindo.$Fn(jindo.$Fn.gc).attach(window, "unload");
}
/**
 * @fileOverview $Event�� ������ �� �޼��带 ������ ����
 * @name event.js
 */

/**
 * $Event Ŭ������ Event ��ü�� ����(Wrapper) Ŭ�����̴�.
 * ����ڴ� $Event.element �޼��带 ����Ͽ� �̺�Ʈ�� ����� ��ü�� �� �� �ִ�.
 * @class JavaScript Core �̺�Ʈ ��ü�κ��� $Event ��ü�� �����Ѵ�.
 * @param {Event} e	DOM Event ��ü
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 */
jindo.$Event = function(e) {
	var cl = arguments.callee;
	if (e instanceof cl) return e;
	if (!(this instanceof cl)) return new cl(e);

	if (typeof e == "undefined") e = window.event;
	if (e === window.event && document.createEventObject) e = document.createEventObject(e);

	this._event = e;
	this._globalEvent = window.event;

	/** �̺�Ʈ�� ���� */
	this.type = e.type.toLowerCase();
	if (this.type == "dommousescroll") {
		this.type = "mousewheel";
	} else if (this.type == "DOMContentLoaded") {
		this.type = "domready";
	}

	this.canceled = false;

	/** �̺�Ʈ�� �߻��� ������Ʈ */
	this.element = e.target || e.srcElement;
	/** �̺�Ʈ�� ���ǵ� ������Ʈ */
	this.currentElement = e.currentTarget;
	/** �̺�Ʈ�� ���� ������Ʈ */
	this.relatedElement = null;

	if (typeof e.relatedTarget != "undefined") {
		this.relatedElement = e.relatedTarget;
	} else if(e.fromElement && e.toElement) {
		this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
	}
}

/**
 * ���콺 �̺�Ʈ�� ��ư, �� ������ �����Ѵ�.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var mouse = evt.mouse();

   mouse.delta;   // Number. ���� ������ ����. ���� ���� ������ ���, �Ʒ��� ������ ����.
   mouse.left;    // Boolean. ���콺 ���� ��ư�� �������� true, �ƴϸ� false
   mouse.middle;  // Boolean. ���콺 �߰� ��ư�� �������� true, �ƴϸ� false
   mouse.right;   // Boolean. ���콺 ������ ��ư�� �������� true, �ƴϸ� false
}
 * @return {Object} ���콺 ������ ������ ��ü. ������ ��ü�� �Ӽ��� ������ �����Ѵ�.
 */
jindo.$Event.prototype.mouse = function() {
	var e    = this._event;
	var delta = 0;
	var left  = (e.which&&e.button==0)||!!(e.button&1);
	var mid   = (e.which&&e.button==1)||!!(e.button&4);
	var right = (e.which&&e.button==2)||!!(e.button&2);
	var ret   = {};

	if (e.wheelDelta) {
		delta = e.wheelDelta / 120;
	} else if (e.detail) {
		delta = -e.detail / 3;
	}

	ret = {
		delta  : delta,
		left   : left,
		middle : mid,
		right  : right
	};

	// replace method
	this.mouse = function(){ return ret };

	return ret;
};

/**
 * Ű���� �̺�Ʈ ������ �����Ѵ�.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var key = evt.key();

   key.keyCode; // Number. ���� Ű������ Ű�ڵ�
   key.alt;     // Boolean. Alt Ű�� �������� true.
   key.ctrl;    // Boolean. Ctrl Ű�� �������� true.
   key.meta;    // Boolean. Meta Ű�� �������� true. MetaŰ�� ���� Ŀ�ǵ�Ű�� ������ �� ����մϴ�.
   key.shift;   // Boolean. Shift Ű�� �������� true.
   key.up;      // Boolean. ���� ȭ��ǥ Ű�� �������� true.
   key.down;    // Boolean. �Ʒ��� ȭ��ǥ Ű�� �������� true.
   key.left;    // Boolean. ���� ȭ��ǥ Ű�� �������� true.
   key.right;   // Boolean. ������ ȭ��ǥ Ű�� �������� true.
   key.enter;   // Boolean. ����Ű�� �������� true
   key.esc;   // Boolean. ESCŰ�� �������� true
   }
}
 * @return {Object} Ű���� �̺�Ʈ�� ���� Ű��. ��ü�� �Ӽ��� ������ �����Ѵ�.
 */
jindo.$Event.prototype.key = function() {
	var e     = this._event;
	var k     = e.keyCode || e.charCode;
	var ret   = {
		keyCode : k,
		alt     : e.altKey,
		ctrl    : e.ctrlKey,
		meta    : e.metaKey,
		shift   : e.shiftKey,
		up      : (k == 38),
		down    : (k == 40),
		left    : (k == 37),
		right   : (k == 39),
		enter   : (k == 13),		
		esc   : (k == 27)
	};

	this.key = function(){ return ret };

	return ret;
};

/**
 * ���콺 Ŀ���� ��ġ ������ �����Ѵ�.
 * @param {Boolean} bGetOffset ���� ������Ʈ�� ���� ���콺 Ŀ���� �����ġ�� offsetX, offsetY�� ���� �������� ����. true�� ���� ���Ѵ�(offsetX, offsetY�� 1.2.0�������� �߰�). $Element �� ���ԵǾ� �־�� �Ѵ�.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var pos = evt.pos();

   pos.clientX;  // Number. ���� ȭ�鿡 ���� X ��ǥ
   pos.clientY;  // Number. ���� ȭ�鿡 ���� Y ��ǥ
   pos.pageX;    // Number. ���� ��ü�� ���� X ��ǥ
   pos.pageY;    // Number. ���� ��ü�� ���� Y ��ǥ
   pos.layerX;   // Number. <b>deprecated.</b> �̺�Ʈ�� �߻��� ��ü�κ����� ������� X ��ǥ
   pos.layerY;   // Number. <b>deprecated.</b> �̺�Ʈ�� �߻��� ��ü�κ����� ������� Y ��ǥ
   pos.offsetX;  // Number. ���� ������Ʈ�� ���� ���콺 Ŀ���� ������� X��ǥ (1.2.0 �̻�)
   pos.offsetY;  // Number. ���� ������Ʈ�� ���� ���콺 Ŀ���� ������� Y��ǥ (1.2.0 �̻�)

}
 * @return {Object} ���콺 Ŀ���� ��ġ ����. ��ü�� �Ӽ��� ������ �����Ѵ�.
 * @remark layerX, layerY�� ���� �������� ����(deprecated) �����Դϴ�.
 */
jindo.$Event.prototype.pos = function(bGetOffset) {
	var e   = this._event;
	var b   = (this.element.ownerDocument||document).body;
	var de  = (this.element.ownerDocument||document).documentElement;
	var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
	var ret = {
		clientX : e.clientX,
		clientY : e.clientY,
		pageX   : 'pageX' in e ? e.pageX : e.clientX+pos[0]-b.clientLeft,
		pageY   : 'pageY' in e ? e.pageY : e.clientY+pos[1]-b.clientTop,
		layerX  : 'offsetX' in e ? e.offsetX : e.layerX - 1,
		layerY  : 'offsetY' in e ? e.offsetY : e.layerY - 1
	};

	// �������� ���ϴ� �޼ҵ��� ����� ũ�Ƿ�, ��û�ÿ��� ���ϵ��� �Ѵ�.
	if (bGetOffset && jindo.$Element) {
		var offset = jindo.$Element(this.element).offset();
		ret.offsetX = ret.pageX - offset.left;
		ret.offsetY = ret.pageY - offset.top;
	}

	return ret;
};

/**
 * �̺�Ʈ�� �����Ѵ�.
 * @remark �������� Ư�� DOM ������Ʈ���� �̺�Ʈ�� �߻����� �� �̺�Ʈ�� ���� ���� ���ĵǴ� �����̴�. ���� ���, div ��ü�� Ŭ���� �� div�� �Բ� ���� ������Ʈ�� document���� onclick �̺�Ʈ�� �߻��Ѵ�. stop() �޼ҵ�� ������ ��ü������ �̺�Ʈ�� �߻��ϵ��� �������� �����Ѵ�.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   someCode();
   evt.stop();
}
 * @example
// ����Ʈ �̺�Ʈ�� ������Ű�� ���� �� (1.1.3���� �̻�)
function stopDefaultOnly(evt) {
	// Here is some code to execute

	// Stop default event only
	evt.stop($Event.CANCEL_DEFAULT);
}
 * @return {$Event} �̺�Ʈ ��ü.
 * @param {Number} nCancel �̺�Ʈ�� ������ �� ������, ����Ʈ �׼� �� ������ų ���� �����Ѵ�. �⺻���� $Event.CANCEL_ALL �̴�(1.1.3 ���� �̻�).
 */
jindo.$Event.prototype.stop = function(nCancel) {
	nCancel = nCancel || jindo.$Event.CANCEL_ALL;

	var e = (window.event && window.event == this._globalEvent)?this._globalEvent:this._event;
	var b = !!(nCancel & jindo.$Event.CANCEL_BUBBLE); // stop bubbling
	var d = !!(nCancel & jindo.$Event.CANCEL_DEFAULT); // stop default event

	this.canceled = true;

	if (typeof e.preventDefault != "undefined" && d) e.preventDefault();
	if (typeof e.stopPropagation != "undefined" && b) e.stopPropagation();

	if(d) e.returnValue = false;
	if(b) e.cancelBubble = true;

	return this;
};

/**
 * default �̺�Ʈ�� �����Ѵ�.
 * @return {$Event} �̺�Ʈ ��ü.
 * @see $Event#stop
 * @description [Lite]
 */
jindo.$Event.prototype.stopDefault = function(){
	return this.stop(jindo.$Event.CANCEL_DEFAULT);
}

/**
 * bubble �̺�Ʈ�� �����Ѵ�.
 * @return {$Event} �̺�Ʈ ��ü.
 * @see $Event#stop
 * @description [Lite]
 */
jindo.$Event.prototype.stopBubble = function(){
	return this.stop(jindo.$Event.CANCEL_BUBBLE);
}

/**
 *  $value �޼���� ���� <Event>�� �����Ѵ�
 * @return {Event} Event
 */
jindo.$Event.prototype.$value = function() {
	return this._event;
};

/**
 * $Event#stop �޼��忡�� �������� ������Ų��.
 * @final
 */
jindo.$Event.CANCEL_BUBBLE = 1;

/**
 * $Event#stop �޼��忡�� ����Ʈ �׼��� ������Ų��.
 * @final
 */
jindo.$Event.CANCEL_DEFAULT = 2;

/**
 * $Event#stop �޼��忡�� �������� ����Ʈ �׼� ��� ������Ų��.
 * @final
 */
jindo.$Event.CANCEL_ALL = 3;

/**
 * @fileOverview $ElementList�� ������ �� �޼��带 ������ ����
 * @name elementlist.js
 */

/**
 * $ElementList ��ü�� ���� �� �����Ѵ�.
 * @class $ElementList Ŭ������ id �迭, Ȥ�� CSS ���� ���� ����Ͽ� DOM ������Ʈ�� �迭�� �����. 
 * @param {String | Array} els �������� DOM ������Ʈ�� ã�� ���� CSS ������ Ȥ�� id, HTMLElement, $Element�� �迭
 * @constructor
 * @borrows $Element#show as this.show
 * @borrows $Element#hide as this.hide
 * @borrows $Element#toggle as this.toggle
 * @borrows $Element#addClass as this.addClass
 * @borrows $Element#removeClass as this.removeClass
 * @borrows $Element#toggleClass as this.toggleClass
 * @borrows $Element#fireEvent as this.fireEvent
 * @borrows $Element#leave as this.leave
 * @borrows $Element#empty as this.empty
 * @borrows $Element#appear as this.appear
 * @borrows $Element#disappear as this.disappear
 * @borrows $Element#className as this.className
 * @borrows $Element#width as this.width
 * @borrows $Element#height as this.height
 * @borrows $Element#text as this.text
 * @borrows $Element#html as this.html
 * @borrows $Element#css as this.css
 * @borrows $Element#attr as this.attr
 * @author Kim, Taegon
 */
jindo.$ElementList = function (els) {
	var cl = arguments.callee;
	if (els instanceof cl) return els;
	if (!(this instanceof cl)) return new cl(els);
	
	if (els instanceof Array || (jindo.$A && els instanceof jindo.$A)) {
		els = jindo.$A(els);
	} else if (typeof els == "string" && cssquery) {
		els = jindo.$A(cssquery(els));
	} else {
		els = jindo.$A();
	}

	this._elements = els.map(function(v,i,a){ return jindo.$Element(v) });
}

/**
 * get �޼���� $ElementList���� �ε����� �ش��ϴ� ������Ʈ�� �����´�. 
 * @param {Number} idx ������ ������Ʈ�� �ε���. �ε����� 0���� ���� �����Ѵ�.
 * @return {$Element} �ε����� �ش��ϴ� ������Ʈ
*/
jindo.$ElementList.prototype.get = function(idx) {
	return this._elements.$value()[idx];
};

/**
 * getFirst �޼���� $ElementList�� ù��° ������Ʈ�� �����´�.
 * @remark getFirst �޼����� ���ϰ��� $ElementList.get(0)�� ���ϰ��� �����ϴ�.
 * @return {$Element} ù��° ������Ʈ
*/
jindo.$ElementList.prototype.getFirst = function() {
	return this.get(0);
};

/**
 * getLast �޼���� $ElementList�� ������ ������Ʈ�� �����´�.
 * @return {$Element} ������ ������Ʈ
*/
jindo.$ElementList.prototype.getLast = function() {
	return this.get(Math.Max(this._elements.length-1,0));
};

(function(proto){
	var setters = 'show,hide,toggle,addClass,removeClass,toggleClass,fireEvent,leave,';
	setters += 'empty,appear,disappear,className,width,height,text,html,css,attr';
	
	jindo.$A(setters.split(',')).forEach(function(name){
		proto[name] = function() {
			var args = jindo.$A(arguments).$value();
			this._elements.forEach(function(el){
				el[name].apply(el, args);
			});
			
			return this;
		}
	});
	
	jindo.$A(['appear','disappear']).forEach(function(name){
		proto[name] = function(duration, callback) {
			var len  = this._elements.length;
			var self = this;
			this._elements.forEach(function(el,idx){
				if(idx == len-1) {
					el[name](duration, function(){callback(self)});
				} else {
					el[name](duration);
				}
			});
			
			return this;
		}
	});
})(jindo.$ElementList.prototype);
/**
 * @fileOverview $Json�� ������ �� �޼��带 ������ ����
 * @name json.js
 */

/**
 * �μ��� ������ ���ڿ��� ����Ͽ� $S Ŭ������ �����Ѵ�.
 * @class $S Ŭ�����¹��ڿ��� ó���ϱ� ���� ����(Wrapper) Ŭ�����̴�.
 * @constructor
 * @author Kim, Taegon
 */
jindo.$S = function(str) {
	var cl = arguments.callee;

	if (typeof str == "undefined") str = "";
	if (str instanceof cl) return str;
	if (!(this instanceof cl)) return new cl(str);

	this._str = str+"";
}

/**
 * $value �޼���� ���ڿ��� �����Ѵ�.
 * @return {String} $S�� ���� ���ڿ�
 * @see $S#toString
 */
jindo.$S.prototype.$value = function() {
	return this._str;
};

/**
 * toString �޼���� ���ڿ��� �����Ѵ�.
 * @return {String} $S�� ���� ���ڿ�
 * @remark ���������� $value�� ����Ѵ�.
 */
jindo.$S.prototype.toString = jindo.$S.prototype.$value;

/**
 * trim �޼���� ���ڿ��� �� �� ������ �����Ѵ�.(1.4.1 ���� �������鵵 ����)
 * @return {$S} ���ڿ��� �� ���� ������ ���ο� $S ��ü
 * @example
 * var str = "   I have many spaces.   ";
 * document.write ( $S(str).trim() );
 *
 * // ��� :
 * // I have many spaces.
 */
jindo.$S.prototype.trim = function() {
	return jindo.$S(this._str.replace(/^(\s|��)+|(\s|��)+$/g, ""));
};

/**
 * escapeHTML �޼���� HTML Ư�� ���ڸ� HTML ��ƼƼ �������� ��ȯ�Ѵ�.
 * @return {$S} HTML Ư�� ���ڸ� ��ƼƼ �������� ��ȯ�� ���ο� $S ��ü
 * @see $S#unescapeHTML
 * @remark  ", &, <, > ,' �� ���� &quot;, &amp;, &lt;, &gt; &#39;�� �����Ѵ�.
 * @example
 * var str = ">_<;;";
 * document.write( $S(str).escapeHTML() );
 *
 * // ��� :
 * // &amp;gt;_&amp;lt;;;
 */
jindo.$S.prototype.escapeHTML = function() {
	var entities = {'"':'quot','&':'amp','<':'lt','>':'gt','\'':'#39'};
	var s = this._str.replace(/[<>&"']/g, function(m0){
		return entities[m0]?'&'+entities[m0]+';':m0;
	});
	return jindo.$S(s);
};

/**
 * stripTags �޼���� ���ڿ����� XML Ȥ�� HTML �±׸� �����Ѵ�.
 * @return {$S} XML Ȥ�� HTML �±׸� ������ ���ο� $S ��ü
 * @example
 * var str = "Meeting <b>people</b> is easy.";
 * document.write( $S(str).stripTags() );
 *
 * // ��� :
 * // Meeting people is easy.
 */
jindo.$S.prototype.stripTags = function() {
	return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
};

/**
 * times �޼���� ���ڿ��� �μ��� ������ ���ڸ�ŭ �ݺ��Ѵ�.
 * @param {Number} nTimes �ݺ��� Ƚ��
 * @return {$S} ���ڿ��� ������ ���ڸ�ŭ �ݺ��� ���ο� $S ��ü
 * @example
 * document.write ( $S("Abc").times(3) );
 *
 * // ��� : AbcAbcAbc
 */
jindo.$S.prototype.times = function(nTimes) {
	var buf = [];
	for(var i=0; i < nTimes; i++) {
		buf[buf.length] = this._str;
	}

	return jindo.$S(buf.join(''));
};

/**
 * unescapeHTML �޼���� �̽��������� HTML�� ������ HTML�� ��ȯ�Ѵ�.
 * @return {$S} �̽��������� HTML�� ������ HTML�� ��ȯ�� ���ο� $S ��ü
 * @remark  &quot;, &amp;, &lt;, &gt; &#39;�� ���� ", &, <, >, ' ���� �����Ѵ�.
 * @see $S#escapeHTML
 * @example
 * var str = "&lt;a href=&quot;http://naver.com&quot;&gt;Naver&lt;/a&gt;";
 * document.write( $S(str).unescapeHTML() );
 *
 * // ��� :
 * // <a href="http://naver.com">Naver</a>
 */
jindo.$S.prototype.unescapeHTML = function() {
	var entities = {'quot':'"','amp':'&','lt':'<','gt':'>','#39':'\''};
	var s = this._str.replace(/&([a-z]+|#[0-9]+);/g, function(m0,m1){
		return entities[m1]?entities[m1]:m0;
	});
	return jindo.$S(s);
};

/**
 * escape �޼���� ���ڿ��� �����ǥ�� ���Ե� �� �ִ� ASCI ���ڿ��� �̽������� ó���Ѵ�.
 * @remark \r, \n, \t, ', ", non-ASCII ���ڸ� �̽������� ó���Ѵ�.
 * @return {$S} ���ڿ��� �̽������� ó���� ���ο� $S ��ü
 * @see $S#escapeHTML
 * @example
 * var str = '��"\'��\\';
 * document.write( $S(str).escape() );
 *
 * // ��� :
 * \uAC00\"\'\uB098\\
 */
jindo.$S.prototype.escape = function() {
	var s = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function(m0,m1,_){
		if(m1) return escape(m1).replace(/%/g,'\\');
		return (_={"\n":"\\n","\r":"\\r","\t":"\\t"})[m0]?_[m0]:"\\"+m0;
	});

	return jindo.$S(s);
};

/**
 * bytes �޼���� ���ڿ��� ���� ����Ʈ(byte) ���� ��ȯ�Ѵ�.
 * @return ���ڿ��� ����Ʈ ��. ��, ù��° �Ķ���͸� �����ϸ� �ڱ� ��ü�� ��ȯ�Ѵ�.
 * @param {Number} nBytes ���� ���� ��
 * @remark ������ charset�� �ؼ��ؼ� ���ڵ� ��Ŀ� ���� �ѱ��� ����� �����ڵ� ���ڿ��� ����Ʈ ���� ���������� ����Ѵ�. �����ڵ� ������ �ƴ϶��, �����ڵ� ���ڿ��� �׻� 2byte�� ����Ѵ�.
 * @example
 * // ������ euc-kr ȯ������ �����մϴ�.
 * var str = "�ѱ۰� English�� ���� ����...";
 * document.write( $S(str).bytes() );
 *
 * // ��� : 29
 */
jindo.$S.prototype.bytes = function(nBytes) {
	var code = 0, bytes = 0, i = 0, len = this._str.length;
	var charset = ((document.charset || document.characterSet || document.defaultCharset)+"").toLowerCase();
	var cut = (typeof nBytes == "number");

	if (charset == "utf-8") {
		// �����ڵ� ���ڿ��� ����Ʈ ���� ��Ű�ǵ�Ƹ� �����ߴ�(http://ko.wikipedia.org/wiki/UTF-8).
		for(i=0; i < len; i++) {
			code = this._str.charCodeAt(i);
			if (code < 128) {
				bytes += 1;
			}else if (code < 2048){
				bytes += 2;
			}else if (code < 65536){
				bytes += 3;
			}else{
				bytes += 4;
			}
			
			if (cut && bytes > nBytes) {
				this._str = this._str.substr(0,i);
				break;
			}
		}
	} else {
		for(i=0; i < len; i++) {
			bytes += (this._str.charCodeAt(i) > 128)?2:1;
			
			if (cut && bytes > nBytes) {
				this._str = this._str.substr(0,i);
				break;
			}
		}
	}

	return cut?this:bytes;
};

/**
 * parseString �޼���� URL ���� ��Ʈ���� ��ü�� �Ľ��Ѵ�.
 * @return {Object} ���ڿ��� �Ľ��� ��ü
 * @example
 * var str = "aa=first&bb=second";
 * var obj = $S(str).parseString();
 *
 * // obj => { aa : "first", bb : "second" }
 */
jindo.$S.prototype.parseString = function() {
	var str = this._str.split(/&/g), pos, key, val, buf = {};

	for(var i=0; i < str.length; i++) {
		key = str[i].substring(0, pos=str[i].indexOf("="));
		val = decodeURIComponent(str[i].substring(pos+1));

		if (key.substr(key.length-2,2) == "[]") {
			key = key.substring(0, key.length-2);
			if (typeof buf[key] == "undefined") buf[key] = [];
			buf[key][buf[key].length] = val;
		} else {
			buf[key] = val;
		}
	}

	return buf;
};

/**
 * ���ԽĿ� ����� �� �ֵ��� ���ڿ��� �̽������� �Ѵ�.
 * @since 1.2.0
 * @return {String} �̽��������� ���ڿ�
 * @example
 * var str = "Slash / is very important. Backslash \ is more important. +_+";
 * document.write( $S(str).escapeRegex() );
 * 
 * // ��� :
 * // Slash \/ is very important\. Backslash \\ is more important\. \+_\+
 */
jindo.$S.prototype.escapeRegex = function() {
	var s = this._str;
	var r = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;

	return jindo.$S(s.replace(r, "\\$1"));
};

/**
 * format �޼���� ���ڿ��� ���� ���ڿ��� ������ ���ο� ���ڿ��� �����. ���� ���ڿ��� %�� �����ϸ�, ���� ���ڿ��� ������ <a href="http://www.php.net/manual/en/function.sprintf.php">PHP</a>�� �����ϴ�.
 * @param {String} formatString ���� ���ڿ�
 * @return {String} ���ڿ��� ���� ���ڿ��� �����Ͽ� ���� ���ο� ���ڿ�.
 * @example
var str = $S("%4d�� %02d�� %02d��").format(2008, 2, 13);
// str == "2008�� 02�� 13��"

var str = $S("�е� %5s �����").format("��");
// str == "�е�     �� �����"

var str = $S("%b").format(10);
// str == "1010"

var str = $S("%x").format(10);
// str == "a"

var str = $S("%X").format(10);
// str == "A"
 * @see $S#times
 */
jindo.$S.prototype.format = function() {
	var args = arguments;
	var idx  = 0;
	var s = this._str.replace(/%([ 0])?(-)?([1-9][0-9]*)?([bcdsoxX])/g, function(m0,m1,m2,m3,m4){
		var a = args[idx++];
		var ret = "", pad = "";

		m3 = m3?+m3:0;

		if (m4 == "s") {
			ret = a+"";
		} else if (" bcdoxX".indexOf(m4) > 0) {
			if (typeof a != "number") return "";
			ret = (m4 == "c")?String.fromCharCode(a):a.toString(({b:2,d:10,o:8,x:16,X:16})[m4]);
			if (" X".indexOf(m4) > 0) ret = ret.toUpperCase();
		}

		if (ret.length < m3) pad = jindo.$S(m1||" ").times(m3 - ret.length).toString();
		(m2 == '-')?(ret+=pad):(ret=pad+ret);

		return ret;
	});

	return jindo.$S(s);
};

/**
 * @fileOverview $Document ������ �� �޼��带 ������ ����
 * @name document.js
 */

/**
 * $Document ��ü�� ���� �� �����Ѵ�.
 * @class $Document Ŭ������ ������ ���õ� �������� ����� �޼��带 �����Ѵ� 
 * @param {Document} doc	��ɿ� ���� document ��ü, �������� ������ �⺻������ ���� ������ document �� �����ȴ�.
 * @constructor
 * @author Hooriza
 */
jindo.$Document = function (el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	this._doc = el || document;
	
	this._docKey = this.renderingMode() == 'Standards' ? 'documentElement' : 'body';	
};

/**
 * $value �޼���� ���ε� ������ document ��ü�� �����Ѵ�.
 * @return {HTMLDocument} document ��ü
 */
jindo.$Document.prototype.$value = function() {
	return this._doc;
};

/**
 * scrollSize �޼���� ������ ���� ����, ���� ũ�⸦ ���Ѵ�
 * @return {Object} ����ũ��� width, ����ũ��� height ��� Ű������ ���ϵȴ�.
 * @example
var size = $Document().scrollSize();
alert('���� : ' + size.width + ' / ���� : ' + size.height); 
 */
jindo.$Document.prototype.scrollSize = function() {

	// webkit �迭������ Standard ���� body�� ����ؾ� �������� scroll Size�� ���´�.
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	
	return {
		width : Math.max(oDoc.scrollWidth, oDoc.clientWidth),
		height : Math.max(oDoc.scrollHeight, oDoc.clientHeight)
	};

};

/**
 * scrollPosition �޼���� ������ ��ũ�ѹ� ��ġ�� ���Ѵ�
 * @return {Object} ���� ��ġ�� left, ������ġ�� top ��� Ű������ ���ϵȴ�.
 * @example
var size = $Document().scrollPosition();
alert('���� : ' + size.left + ' / ���� : ' + size.top); 
* @since 1.3.5
 */
jindo.$Document.prototype.scrollPosition = function() {

	// webkit �迭������ Standard ���� body�� ����ؾ� �������� scroll Size�� ���´�.
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	return {
		left : oDoc.scrollLeft||window.pageXOffset||window.scrollX||0,
		top : oDoc.scrollTop||window.pageYOffset||window.scrollY||0
	};

};

/**
 * clientSize �޼���� ��ũ�ѹٷ� ���� ������ �κ��� ������ ���� �� ���̴� �κ��� ����, ���� ũ�⸦ ���Ѵ�
 * @return {Object} ����ũ��� width, ����ũ��� height ��� Ű������ ���ϵȴ�
 * @example
var size = $Document(document).clientSize();
alert('���� : ' + size.width + ' / ���� : ' + size.height); 
 */
jindo.$Document.prototype.clientSize = function() {
	
	var oDoc = this._doc[this._docKey];
	
	var isSafari = navigator.userAgent.indexOf("WebKit")>-1 && navigator.userAgent.indexOf("Chrome")==-1;

	// ���ĸ��� ��� ������ ��������ÿ� clientWidth,clientHeight���� ���������� ������ �ʾƼ� window.innerWidth,innerHeight�� ��ü
	return (isSafari)?{
					width : window.innerWidth,
					height : window.innerHeight
				}:{
					width : oDoc.clientWidth,
					height : oDoc.clientHeight
				};
};

/**
 * renderingMode �޼���� ������ ������ ����� ��´�
 * @return {String} ������ ���
 * <dl>
 *	<dt>Standards</dt>
 *	<dd>ǥ�� ������ ���</dd>
 *	<dt>Almost</dt>
 *	<dd>���� ǥ�� ������ ��� (IE ���� ���������� DTD �� �ùٸ��� �������� �ʾ����� ����)</dd>
 *	<dt>Quirks</dt>
 *	<dd>��ǥ�� ������ ���</dd>
 * </dl>
 * @example
var mode = $Document().renderingMode();
alert('������ ��� : ' + mode);
 */
jindo.$Document.prototype.renderingMode = function() {

	var isIe = (typeof window.opera=="undefined" && navigator.userAgent.indexOf("MSIE")>-1);
	var isSafari = (navigator.userAgent.indexOf("WebKit")>-1 && navigator.userAgent.indexOf("Chrome")<0 && navigator.vendor.indexOf("Apple")>-1);
	var sRet;

	if ('compatMode' in this._doc){
		sRet = this._doc.compatMode == 'CSS1Compat' ? 'Standards' : (isIe ? 'Quirks' : 'Almost');
	}else{
		sRet = isSafari ? 'Standards' : 'Quirks';
	}

	return sRet;

};

/**
 * �������� �־��� selector�� ������Ű�� ����� �迭�� ��ȯ�Ѵ�. �����ϴ� ��Ұ� �������� ������ �� �迭�� ��ȯ�Ѵ�.
 * @param {String} sSelector
 * @return {Array} ������ �����ϴ� ����� �迭
 */
jindo.$Document.prototype.queryAll = function(sSelector) { 
	return jindo.$$(sSelector, this._doc); 
};

/**
 * �������� �־��� selector�� ������Ű�� ����� ù ��° ��Ҹ� ��ȯ�Ѵ�. �����ϴ� ��Ұ� �������� ������ null�� ��ȯ�Ѵ�.
 * @param {String} sSelector
 * @return {Element} ������ �����ϴ� ����� ù��° ���
 */
jindo.$Document.prototype.query = function(sSelector) { 
	return jindo.$$.getSingle(sSelector, this._doc); 
};

/**
 * ��������  XPath ������ ����Ͽ� ������Ʈ�� ���´�.
 * @remark �����ϴ� ������ ��ô ���������� Ư���� ��쿡���� ����ϴ� ���� �����Ѵ�.
 * @param {String} sXPath
 * @return {Array} path�� �ش��ϴ� ���
 */
jindo.$Document.prototype.xpathAll = function(sXPath) { 
	return jindo.$$.xpath(sSelector, this._doc); 
};
/**
 * @fileOverview $Form ������ �� �޼��带 ������ ����
 * @name form.js
 */

/**
 * $Form ��ü�� ���� �� �����Ѵ�.
 * @class $Form Ŭ������ <form> ������Ʈ�� ���� �Է¿�ҵ��� �ٷ�� ���� ���� ���� �޼��带 �����Ѵ�. 
 * @param {Element | String} el	$Form�� ����� <form> ������Ʈ, Ȥ�� <form> ������Ʈ�� ������ id. ���� �������� ���� id�� �����ϸ� ���� ���� ������ ������Ʈ�� ��ȯ�Ѵ�.
 * @constructor
 * @author Hooriza
 */
jindo.$Form = function (el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	el = jindo.$(el);
	
	if (!el.tagName || el.tagName.toUpperCase() != 'FORM') throw new Error('The element should be a FORM element');
	this._form = el;
}

/**
 * $value �޼���� ���ε� ���� <form> ������Ʈ�� �����Ѵ�
 * @return {HTMLElement} <form> ������Ʈ
 * @example

var el = $('<form>');
var form = $Form(el);

alert(form.$value() === el); // true
 
 */
jindo.$Form.prototype.$value = function() {
	return this._form;
};

/**
 * serialize �޼���� Ư�� �Ǵ� ��ü ������Ʈ  �Է¿�Ҹ� ���ڿ� ���·� �����Ѵ�.
 * @param {Mixed} Mixed �μ��� �������� �ʰų� �μ��� �ϳ� �̻� ������ �� �ִ�. 
 * <dl>
 *	<dt>�μ��� �������� ���� ���</dt>
 *	<dd>�μ��� �������� ������ ���� ������ ���ڿ��� �����Ѵ�.</dd>
 *	<dt>{String} one_element_name</dt>
 *	<dd>�μ��� �ϳ��� ���ڿ��� �����ϸ� ���ڿ��� ������ name �Ӽ��� ������ ������Ʈ�� �� ���� �����Ѵ�.</dd>
 *	<dt>{String, String... } element_names</dt>
 *	<dd>�� �� �̻��� ������Ʈ�� �� ���� �����Ѵ�. </dd>
 * </dl>
 * @return {String} ���� ���ڿ� ���·� ��ȯ�� ������Ʈ�� �� ��.
 * @example

<form id="TEST">
	<input name="ONE" value="1" type="text" />
	<input name="TWO" value="2" checked="checked" type="checkbox" />
	<input name="THREE" value="3_1" type="radio" />
	<input name="THREE" value="3_2" checked="checked" type="radio" />
	<input name="THREE" value="3_3" type="radio" />
	<select name="FOUR">
		<option value="4_1">..</option>
		<option value="4_2">..</option>
		<option value="4_3" selected="selected">..</option>
	</select>
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var allstr = form.serialize();
	alert(allstr == 'ONE=1&TWO=2&THREE=3_2&FOUR=4_3'); // true

	var str = form.serialize('ONE', 'THREE');
	alert(str == 'ONE=1&THREE=3_2'); // true
</script>

 */
jindo.$Form.prototype.serialize = function() {

 	var self = this;
 	var oRet = {};
 	
 	var nLen = arguments.length;
 	var fpInsert = function(sKey) {
 		var sVal = self.value(sKey);
 		if (typeof sVal != 'undefined') oRet[sKey] = sVal;
 	};
 	
 	if (nLen == 0) {
		jindo.$A(this.element()).forEach(function(o) { if (o.name) fpInsert(o.name); });
	}else{
		for (var i = 0; i < nLen; i++) {
			fpInsert(arguments[i]);
		}
	}
 		
 	
	return jindo.$H(oRet).toQueryString();
	
};

/**
 * element �޼���� Ư�� �Ǵ� ��ü �Է¿�Ҹ� �����Ѵ�.
 * @param {String} sKey ����� �ϴ� �Է¿�� ������Ʈ�� name ���ڿ�, �����ÿ��� ��� �Է¿�ҵ��� �迭�� �����Ѵ�.
 * @return {HTMLElement | Array} �Է� ��� ������Ʈ
 */
jindo.$Form.prototype.element = function(sKey) {

	if (arguments.length > 0)
		return this._form[sKey];
	
	return this._form.elements;
	
};

/**
 * enable �޼���� �Է� ����� Ȱ��ȭ ���θ� ��ų� �����Ѵ�.
 * @param {Mixed} mixed ��Ȯ�� �μ��� ������ ����. 
 * <dl>
 *	<dt>{String}fieldName</dt>
 *	<dd>�μ��� �Է¿���� �̸��� �־��ָ� �ش� �Է¿���� Ȱ��ȭ ���θ� true, false �� ��ȯ�Ѵ�</dd>
 *	<dt>{String}fieldName, {Boolean}flag</dt>
 *	<dd>�Է¿�ҿ� Boolean ���� ���°��� �Բ� �־��ָ� �ش� �Է¿�Ҹ� ������ ���·� Ȱ��ȭ ���θ� �����Ѵ�</dd>
 *	<dt>{Object}objectProperties</dt>
 *	<dd>���ÿ� �������� �Է¿�ҿ� ���� Ȱ��ȭ ���θ� �����ϰ� ������ ����Ѵ�</dd>
 * </dl>
 * @return {Boolean|$Form} ������Ʈ�� Ȱ��ȭ ���θ� �������ų� ������Ʈ�� Ȱ��ȭ ���θ� ������ $Form ��ü. 
 * @example

<form id="TEST">
	<input name="ONE" disabled="disabled" type="text" />
	<input name="TWO" type="checkbox" />
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var one_enabled = form.enable('ONE');
	alert(one_enabled === false); // true

	form.enable('TWO', false);

	form.enable({
		'ONE' : true,
		'TWO' : false
	});
</script>

 */
jindo.$Form.prototype.enable = function() {
	
	var sKey = arguments[0];

	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.enable(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) return this;
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length < 2) {
		
		var bEnabled = true;
		jindo.$A(aEls).forEach(function(o) { if (o.disabled) {
			bEnabled = false;
			jindo.$A.Break();
		}});
		return bEnabled;
		
	} else { // setter
		
		var sFlag = arguments[1];
		jindo.$A(aEls).forEach(function(o) { o.disabled = !sFlag; });
		
		return this;
		
	}
	
};

/**
 * value �޼���� �� ������Ʈ�� ���� ��ų� �����Ѵ�.
 * @param {Mixed} Mixed ��Ȯ�� �μ� ������ ������ ����. 
 * <dl>
 *	<dt>{String}fieldName</dt>
 *	<dd>�μ��� ������Ʈ�� �̸��� �����ϸ� ������Ʈ�� ���� �����Ѵ�</dd>
 *	<dt>{String}fieldName, {String}value</dt>
 *	<dd>������Ʈ�� �̸��� ������Ʈ�� ������ ���� �Բ� �����ϸ� ������Ʈ�� ���� ������ ������ �ٲ۴�.������ </br> checkbox, radio, selectbox�� �ش� ���� ���� ������Ʈ�� checked �ϰų� selected�Ѵ�.</dd>
 *	<dt>{Object}objectProperties</dt>
 *	<dd>�� �� �̻��� ������Ʈ ���� ���ÿ� �����ϰ� ������ '������Ʈ �̸� : ������Ʈ ��'�� ���ҷ� ������ ��ü�� �����Ѵ�. </dd>
 * </dl>
 * @return {String|$Form} �μ��� ������Ʈ�� �����ߴٸ� ������ ������Ʈ�� ����, �μ��� �� �����տ� ������Ʈ�� ���� �����ߴٸ� $Form ��ü�� �����Ѵ�.    
 * @example

<form id="TEST">
	<input name="ONE" value="1" type="text" />
	<input name="TWO" value="2" type="checkbox" />
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var one_value = form.value('ONE');
	alert(one_value === '1'); // true

	var two_value = form.value('TWO');
	alert(two_value === undefined); // true

	form.value('TWO', 2);
	alert(two_value === '2'); // true

	form.value({
		'ONE' : '1111',
		'TWO' : '2'
	});	
	// form.value('ONE') -> 1111
	// form.value('ONE') -> 2
</script>

 */
jindo.$Form.prototype.value = function(sKey) {
	
	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.value(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) throw new Error('The element is not exist');
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length > 1) { // setter
		
		var sVal = arguments[1];
		
		jindo.$A(aEls).forEach(function(o) {
			
			switch (o.type) {
				case 'radio':
				case 'checkbox':
					o.checked = (o.value == sVal);
					break;
					
				case 'select-one':
					var nIndex = -1;
					for (var i = 0, len = o.options.length; i < len; i++){
						if (o.options[i].value == sVal) nIndex = i;
					}
					o.selectedIndex = nIndex;
	
					break;
					
				default:
					o.value = sVal;
					break;
			}
			
		});
		
		return this;
	}

	// getter
	
	var aRet = [];
	
	jindo.$A(aEls).forEach(function(o) {
		
		switch (o.type) {
		case 'radio':
		case 'checkbox':
			if (o.checked) aRet.push(o.value);
			break;
		
		case 'select-one':
			if (o.selectedIndex != -1) aRet.push(o.options[o.selectedIndex].value);
			break;
			
		default:
			aRet.push(o.value);
			break;
		}
		
	});
	
	return aRet.length > 1 ? aRet : aRet[0];
	
};

/**
 * submit �޼���� ���� �����͸� ������ ����(submit) �Ѵ�.
 * @param {String} sTargetName ������ ���� �ִ� �������� �̸�. sTargetName�� �����ϸ� �⺻ Ÿ��
 * @param {String} fValidation ������ ���� �븮���̼� �Լ�. form ��Ҹ� ���ڷ� �޴´�.
 * @return {$Form} �����͸� ������ $Form ��ü. 
 * @example
var form = $Form(el);
form.submit();
form.submit('foo');
 */
jindo.$Form.prototype.submit = function(sTargetName, fValidation) {
	
	var sOrgTarget = null;
	
	if (typeof sTargetName == 'string') {
		sOrgTarget = this._form.target;
		this._form.target = sTargetName;
	}
	
	if(typeof sTargetName == 'function') fValidation = sTargetName;
	
	if(typeof fValidation != 'undefined'){
		if(!fValidation(this._form)) return this;	
	}	
	
	this._form.submit();
	
	if (sOrgTarget !== null)
		this._form.target = sOrgTarget;
	
	return this;
	
};

/**
 * reset �޼���� ���� �ʱ�ȭ(reset)�Ѵ�.
 * @param {String} fValidation ������ ���� �븮���̼� �Լ�. form ��Ҹ� ���ڷ� �޴´�.
 * @return {$Form} �ʱ�ȭ�� $Form ��ü.
 * @example
var form = $Form(el);
form.reset(); 
 */
jindo.$Form.prototype.reset = function(fValidation) {
	
	if(typeof fValidation != 'undefined'){
		if(!fValidation(this._form)) return this;	
	}	
	
	this._form.reset();
	return this;
	
};

/**
 * @fileOverview $Template�� ������ �� �޼��带 ������ ����
 * @name template.js
 */

/**
 * ���ø��� �����Ѵ�. ù��° �μ��� ���ø� ���ڿ� �Ǵ� ���ڿ��� ������ HTML ������Ʈ Ȥ�� ������Ʈ�� ���̵� ������ �� �ִ�.
 * ������Ʈ�� &lt;textarea&gt; �Ǵ� &lt;script type="text/template"&gt; �� �����ϴ�(&lt;script&gt; �±׸� ����Ϸ��� �ݵ�� type �Ӽ��� �������־�� �Ѵ�).
 * @class $Template Ŭ������ ���ø� ���ڿ��� �������� ���ڿ��� �����Ѵ�.
 * @constructor
 * @author Kim, Taegon
 * @example
 * <script type="text/javascript">
 * // Template ���ڿ��� �����ϴ� ���
 * var tpl = $Template("Value : {=test}");
 * </script>
 * @example
 * <textarea id="tpl1">
 * Value : {=test}
 * </textarea>
 *
 * <script type="text/template" id="tpl2">
 Value : {=test}
 * </script>
 *
 * <script type="text/javascript">
 * // Textarea ������Ʈ�� ����ϴ� ���
 * var template1 = $Template("tpl1");
 *
 * // Script ������Ʈ�� ����ϴ� ���
 * var template2 = $Template("tpl2");
 * </script>
 */
jindo.$Template = function(str) {
    var obj = null, tag = "";
    var cl  = arguments.callee;

    if (str instanceof cl) return str;
    if (!(this instanceof cl)) return new cl(str);

    if(typeof str == "undefined") {
		str = "";
	}else if( (obj=document.getElementById(str)||str) && obj.tagName && (tag=obj.tagName.toUpperCase()) && (tag == "TEXTAREA" || (tag == "SCRIPT" && obj.getAttribute("type") == "text/template")) ) {
        str = (obj.value||obj.innerHTML).replace(/^\s+|\s+$/g,"");
    }

    this._str = str+"";
}
jindo.$Template.splitter = /(?!\\)[\{\}]/g;
jindo.$Template.pattern  = /^(?:if (.+)|elseif (.+)|for (?:(.+)\:)?(.+) in (.+)|(else)|\/(if|for)|=(.+)|js (.+)|set (.+))$/;

 /**
 * process �޼���� ���ø��� �ؼ��ϰ� �ؼ��� ��� ���ڿ��� ��ȯ�Ѵ�.
 * @param {Object} data ���� �� �Լ� ������
 * @return {String} �ؼ��� ��ģ ���ο� ���ڿ�
 * @example
 * // �ܼ� ���ڿ� ġȯ
 * var tpl  = $Template("Value1 : {=val1}, Value2 : {=val2}")
 * var data = {val1:"first value", val2:"second value"};
 * document.write( tpl.process(data) );
 *
 * // ��� :
 * // Value1 : first value, Value2 : second value
 *
 * @example
 * // ���ǹ�
 * var tpl= $Template("{if num >= 7}7���� ũ�ų� ����.{elseif num =< 5}5���� �۰ų� ����.{else}�Ƹ� 6?{/if}");
 * var data = { num:5 };
 * document.write( tpl.process(data) );
 *
 * // ��� :
 * 5���� �۰ų� ����.
 *
 * @example
 * // �ݺ��� - �ε��� ������
 * var tpl  = $Template("<h1>��Ż ����Ʈ</h1>\n<ul> {for site in potals}\n<li><a href="{=site.url}">{=site.name}</a></li>{/for} \n</ul>");
 * var data = {potals:[
 *		{ name : "���̹�", url : "http://www.naver.com"  },
 *		{ name : "����",  url : "http://www.daum.net"  },
 *		{ name : "����",  url : "http://www.yahoo.co.kr"  }
 * ]};
 *
 * // ���:
 * <h1>��Ż ����Ʈ ���</h1> <ul> <li>���̹�</li><li>����</li><li>����</li>
 * <ul>
 * <li><a href="http://www.naver.com">���̹�</a></li>
 * <li><a href="http://www.daum.net">����</a></li>
 * <li><a href="http://www.yahoo.co.kr">����</a></li>
 * </ul>
 * 
 * @example
 * // �ݺ��� - �ε��� ���
 * var tpl  = $Template("{for num:word in numbers}{=word}({=num}) {/for}");
 * var data = { numbers : ["zero", "one", "two", "three"] };
 * document.write( tpl.process(data) );
 *
 * // ���
 * zero(0) one(1) two(2) three(3) 
 * 
 * @example
 * // �ӽú������. 
 * var tpl  = $Template("{set val3=val1}Value1 : {=val1}, Value2 : {=val2}, Value3 : {=val3}")
 * var data = {val1:"first value", val2:"second value"};
 * document.write( tpl.process(data) );
 *
 * // ��� :
 * // Value1 : first value, Value2 : second value, Value3 : first value
 * 
 * @example
 * // javascript���. 
 * var tpl  = $Template("Value1 : {js $S(=val1).bytes()}, Value2 : {=val2}")
 * var data = {val1:"first value", val2:"second value"};
 * document.write( tpl.process(data) );
 *
 * // ��� :
 * // Value1 : 11, Value2 : second value
 */
jindo.$Template.prototype.process = function(data) {
	var key = "\x01";
	var leftBrace = "\x02";
	var rightBrace = "\x03";
    var tpl = (" "+this._str+" ").replace(/\\{/g,leftBrace).replace(/\\}/g,rightBrace).replace(/(?!\\)\}\{/g, "}"+key+"{").split(jindo.$Template.splitter), i = tpl.length;
	
    var map = {'"':'\\"','\\':'\\\\','\n':'\\n','\r':'\\r','\t':'\\t','\f':'\\f'};
    var reg = [/(["'](?:(?:\\.)+|[^\\["']+)*["']|[a-zA-Z_][\w\.]*)/g, /[\n\r\t\f"\\]/g, /^\s+/, /\s+$/, /#/g];
    var cb  = [function(m){ return (m.substring(0,1)=='"' || m.substring(0,1)=='\''||m=='null')?m:"d."+m; }, function(m){return map[m]||m}, "", ""];
    var stm = [];
	var lev = 0;

	// remove " "
	tpl[0] = tpl[0].substr(1);
	tpl[i-1] = tpl[i-1].substr(0, tpl[i-1].length-1);

    // no pattern
    if(i<2) return tpl;
	
	tpl = jindo.$A(tpl).reverse().$value();
	var delete_info;
    while(i--) {
        if(i%2) {
            tpl[i] = tpl[i].replace(jindo.$Template.pattern, function(){
                var m = arguments;

				// set
				if (m[10]) {
					return m[10].replace(/(\w+)=(?:([a-zA-Z_][a-zA-Z0-9_]+)|(.+))$/g, function(){
										var mm = arguments;
										var str = "d."+mm[1]+"=";
										if(mm[2]){
											str+="d."+mm[2];
										}else {
											str += mm[3].replace(   /(=(?:[a-zA-Z_][\w\.]*)+)/g,
                				                                           function(m){ return (m.substring(0,1)=='=')?"d."+m.replace('=','') : m; }
                                				                        );
										}
										return str;
								}) +	";"; 
				}
				// js 
				if(m[9]) {
					return 's[i++]=' + m[9].replace(   /(=(?:[a-zA-Z_][\w\.]*)+)/g,
                				                                           function(m){ return (m.substring(0,1)=='=')?"d."+m.replace('=','') : m; }
                                				                        )+';';
				}
                // variables
                if(m[8]) return 's[i++]= d.'+m[8]+';';

                // if
                if(m[1]) {
                    return 'if('+m[1].replace(reg[0],cb[0]).replace(/d\.(typeof) /,'$1 ').replace(/ d\.(instanceof) d\./,' $1 ')+'){';
                }

                // else if
                if(m[2]) return '}else if('+m[2].replace(reg[0],cb[0]).replace(/d\.(typeof) /,'$1 ').replace(/ d\.(instanceof) d\./,' $1 ')+'){';

                // for loop
                if(m[5]) {
					delete_info = m[4];
					var _aStr = [];
					_aStr.push('var t#=d.'+m[5]+'||{},p#=isArray(t#),i#=0;');
					_aStr.push('for(var x# in t#){');
					_aStr.push('	if( (p# && isNaN(i#=parseInt(x#))) || (!p# && !t#.propertyIsEnumerable(x#)) ) continue;');
					_aStr.push('	d.'+m[4]+'=t#[x#];');
					_aStr.push(m[3]?'d.'+m[3]+'=p#?i#:x#;':'');
					return _aStr.join("").replace(reg[4], lev++ );
                }

                // else
                if(m[6]) return '}else{';

                // end if, end for
                if(m[7]) {
					if(m[7]=="for"){
						return "delete d."+delete_info+"; };";
					}else{
						return '};';	
					}
                    
                }

                return m[0];
            });
        }else if(tpl[i] == key) {
			tpl[i] = "";
        }else if(tpl[i]){
            tpl[i] = 's[i++]="'+tpl[i].replace(reg[1],cb[1])+'";';
        }
    }
	
	tpl = jindo.$A(tpl).reverse().$value().join('').replace(new RegExp(leftBrace,'g'),"{").replace(new RegExp(rightBrace,'g'),"}");
		
	var _aStr = [];
	_aStr.push('var s=[],i=0;');
	_aStr.push('function isArray(o){ return Object.prototype.toString.call(o) == "[object Array]" };');
	_aStr.push(tpl);
	_aStr.push('return s.join("");');
    tpl = (new Function("d",_aStr.join("")))(data);
	
    return tpl;
};

/**
 * @fileOverview $Date�� ������ �� �޼��带 ������ ����
 * @name date.js
 */

/**
 * $Date ��ü�� �����ϰ� �����Ѵ�.
 * @extends core
 * @class $Date Ŭ������ ��¥�� ó���ϱ� ���� Date Ÿ���� ����(Wrapper) Ŭ�����̴�. 
 * @constructor
 * @author Kim, Taegon
 * @example
$Date();
$Date(milliseconds);
$Date(dateString);
$Date(year, month, date[, hours, minitues, seconds, milliseconds]);
 */
jindo.$Date = function(src) {
	var a=arguments,t="";
	var cl=arguments.callee;

	if (src && src instanceof cl) return src;
	if (!(this instanceof cl)) return new cl(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);

	if ((t=typeof src) == "string") {
		this._date = cl.parse(src);
	} else if (t == "number") {
		if (typeof a[1] == "undefined") {
			this._date = new Date(src);
		}else{
			this._date = new Date(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);
		}
	} else if (t == "object" && src.constructor == Date) {
		(this._date = new Date).setTime(src.getTime());
		this._date.setMilliseconds(src.getMilliseconds());
	} else {
		this._date = new Date;
	}
	this._names = {};
	for(var i in jindo.$Date.names){
		this._names[i] = jindo.$Date.names[i];	
	}
}

/**
 * names �Ӽ��� $Date���� ����� ��, ����, ����/������ �̸��� ������ ���ڿ��̴�. s_ �� ���ξ�� ������ �̸����� ���(abbreviation)�̴�.
 */
jindo.$Date.names = {
	month   : ["January","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
	s_month : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	day     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	s_day   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
	ampm    : ["AM", "PM"]
};

/**
 * now �޼���� ���� �ð��� �и��� ������ ������ �����Ѵ�.
 * @return {Number} �и��� ������ ������ ���� �ð�
 */
jindo.$Date.now = function() {
	return Date.now();
};
/**
 * names�Ӽ��� ���� Ȥ�� ���� �´�.(1.4.1 �߰�)
 * @param {Object} oNames
 */
jindo.$Date.prototype.name = function(oNames){
	if(arguments.length){
		for(var i in oNames){
			this._names[i] = oNames[i];
		}
	}else{
		return this._names;
	}
}

/**
 * parse �޼���� �μ��� ������ ���ڿ��� �Ľ��Ͽ� ���ڿ��� ���Ŀ� �´� Date ��ü�� �����Ѵ�. 
 * @param {String} strDate ��¥, Ȥ�� �ð� ������ ������ �Ľ� ��� ���ڿ�
 * @return {Object} Date ��ü. 
 */
jindo.$Date.parse = function(strDate) {
	return new Date(Date.parse(strDate));
};

/**
 * $value �޼���� $Date�� ���ΰ� �ִ� ���� Date ��ü�� ��ȯ�Ѵ�.
 * @returns {Object} Date ��ü
 */
jindo.$Date.prototype.$value = function(){
	return this._date;
};

/**
 * format �޼���� $Date ��ü�� �����ϰ� �ִ� �ð��� �μ��� ������ ���� ���ڿ��� ���߾� ��ȯ�Ѵ�. ���� ���ڿ��� PHP�� date �Լ��� �����ϰ� ����Ѵ�. ??
 * @param {Date} strFormat  ���� ���ڿ�
 * @returns {String} �ð��� ���� ���ڿ��� ���߾� ��ȯ�� ���ڿ�.
 */
jindo.$Date.prototype.format = function(strFormat){
	var o = {};
	var d = this._date;
	var name = this.name();
	return (strFormat||"").replace(/[a-z]/ig, function callback(m){
		if (typeof o[m] != "undefined") return o[m];

		switch(m) {
			case"d":
			case"j":
				o.j = d.getDate();
				o.d = (o.j>9?"":"0")+o.j;
				return o[m];
			case"l":
			case"D":
			case"w":
			case"N":
				o.w = d.getDay();
				o.N = o.w?o.w:7;
				o.D = name.s_day[o.w];
				o.l = name.day[o.w];
				return o[m];
			case"S":
				return (!!(o.S=["st","nd","rd"][d.getDate()]))?o.S:(o.S="th");
			case"z":
				o.z = Math.floor((d.getTime() - (new Date(d.getFullYear(),0,1)).getTime())/(3600*24*1000));
				return o.z;
			case"m":
			case"n":
				o.n = d.getMonth()+1;
				o.m = (o.n>9?"":"0")+o.n;
				return o[m];
			case"L":
				o.L = this.isLeapYear();
				return o.L;
			case"o":
			case"Y":
			case"y":
				o.o = o.Y = d.getFullYear();
				o.y = (o.o+"").substr(2);
				return o[m];
			case"a":
			case"A":
			case"g":
			case"G":
			case"h":
			case"H":
				o.G = d.getHours();
				o.g = (o.G < 12 )?o.G:o.G%12;
				o.A = o.G<12?name.ampm[0]:name.ampm[1];
				o.a = o.A.toLowerCase();
				o.H = (o.G>9?"":"0")+o.G;
				o.h = (o.g>9?"":"0")+o.g;
				return o[m];
			case"i":
				o.i = (((o.i=d.getMinutes())>9)?"":"0")+o.i;
				return o.i;
			case"s":
				o.s = (((o.s=d.getSeconds())>9)?"":"0")+o.s;
				return o.s;
			case"u":
				o.u = d.getMilliseconds();
				return o.u;
			case"U":
				o.U = this.time();
				return o.U;
			default:
				return m;
		}
	});
};

/**
 * time �޼���� GMT 1970/01/01 00:00:00�� �������� ����� �ð��� �����ϰų� �����´�.
 * @param {Number} nTime �и� �� ������ �ð� ��. 
 * @return {$Date | Number} �μ��� �����ߴٸ� GMT 1970/01/01 00:00:00 ���� ���� �μ���ŭ ���� �ð��� ������ $DAte ��ü. �μ��� �������� �ʾҴٸ� GMT 1970/01/01 00:00:00���� ���� $Date ��ü�� ������ �ð����� ����� �ð�(�и� ��).
 */
jindo.$Date.prototype.time = function(nTime) {
	if (typeof nTime == "number") {
		this._date.setTime(nTime);
		return this;
	}

	return this._date.getTime();
};

/**
 * year �޼���� �⵵�� �����ϰų� �����´�.
 * @param {Number} nYear ������ �⵵��
 * @return {$Date | Number} �μ��� �����Ͽ��ٸ� ���� �⵵ ���� ������ $Date ��ü. �μ��� �������� �ʾҴٸ� $Date ��ü�� �����ϰ� �ִ� �ð��� �⵵�� �����Ѵ�.
 */
jindo.$Date.prototype.year = function(nYear) {
	if (typeof nYear == "number") {
		this._date.setFullYear(nYear);
		return this;
	}

	return this._date.getFullYear();
};

/**
 * month �޼���� ���� �����ϰų� �����´�.
 * @param {Number} nMon ������ ���� ��
 * @return {$Date | Number} �μ��� �����Ͽ��ٸ� ���� ���� ������ $Date ��ü. �μ��� �������� �ʾҴٸ� $Date ��ü�� �����ϰ� �ִ� �ð��� ���� �����Ѵ�.
 * @remark ���� ���� ������ 0(1��)���� 11(12��)�̴�.
 */
jindo.$Date.prototype.month = function(nMon) {
	if (typeof nMon == "number") {
		this._date.setMonth(nMon);
		return this;
	}

	return this._date.getMonth();
};

/**
 * date �޼���� ��¥�� �����ϰų� �����´�.
 * @param {nDate} nDate	������ ��¥ ��
 * @return {$Date | Number} �μ��� �����Ͽ��ٸ� ���� ��¥�� ������ $Date ��ü. �μ��� �������� �ʾҴٸ� $Date ��ü�� �����ϰ� �ִ� �ð��� ��¥�� �����Ѵ�.
 */
jindo.$Date.prototype.date = function(nDate) {
	if (typeof nDate == "number") {
		this._date.setDate(nDate);
		return this;
	}

	return this._date.getDate();
};

/**
 * day �޼���� ������ �����´�. 
 * @return {Number} ���� ��. 0(�Ͽ���)���� 6(�����)�� �����Ѵ�. 
 */
jindo.$Date.prototype.day = function() {
	return this._date.getDay();
};

/**
 * hours �޼���� ��(��)�� �����ϰų� �����´�.
 * @param {Number} nHour ������ �� ��
 * @return {$Date | Number} �μ��� �����Ͽ��ٸ� ���� �� ���� ������ $Date ��ü. �μ��� �������� �ʾҴٸ� $Date ��ü�� �����ϰ� �ִ� �ð��� �� ��.
 */
jindo.$Date.prototype.hours = function(nHour) {
	if (typeof nHour == "number") {
		this._date.setHours(nHour);
		return this;
	}

	return this._date.getHours();
};

/**
 * seconds �޼���� ���� �����ϰų� �����´�.
 * @param {Number} nSec ������ �� ��
 * @return {Number} �μ��� �����Ͽ��ٸ� ���� �� ���� ������ $Date ��ü. �μ��� �������� �ʾҴٸ� $Date ��ü�� �����ϰ� �ִ� �ð��� �� ��.
 */
jindo.$Date.prototype.seconds = function(nSec) {
	if (typeof nSec == "number") {
		this._date.setSeconds(nSec);
		return this;
	}

	return this._date.getSeconds();
};

/**
 * minutes �޼���� ���� �����ϰų� �����´�.
 * @param {Number} nMin ������ �� ��
 * @return {Number} �μ��� �����Ͽ��ٸ� ���� �� ���� ������ $Date ��ü. �μ��� �������� �ʾҴٸ� $Date ��ü�� �����ϰ� �ִ� �ð��� �� ��.
 */
jindo.$Date.prototype.minutes = function(nMin) {
	if (typeof nMin == "number") {
		this._date.setMinutes(nMin);
		return this;
	}

	return this._date.getMinutes();
};

/**
 * isLeapYear �޼���� �ð��� ���� ���θ� Ȯ���Ѵ�.
 * @returns {Boolean} $Date�� ����Ű�� �ִ� �ð��� �����̸� True, �׷��� �ʴٸ� False
 */
jindo.$Date.prototype.isLeapYear = function() {
	var y = this._date.getFullYear();

	return !(y%4)&&!!(y%100)||!(y%400);
};
/**
 * @fileOverView $Window�� ������ �� �޼��带 ������ ����
 * @name window.js
 */

/**
 * $Window ��ü�� �����ϰ� ������ ��ü�� ��ȯ�Ѵ�.
 * @class $Window ��ü�� �ڹٽ�ũ��Ʈ ����Ƽ�� ��ü�� window ��ü�� �����ϰ�, �̸� �ٷ�� ���� �������� �޼��带 �����Ѵ�.
 * @param {HTMLWidnow} el $Window�� ���� window ������Ʈ.
 * @author gony
 */
jindo.$Window = function(el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);

	this._win = el || window;
}

/**
 * $value �޼���� $Window ��ü�� ���� ������ window ��ü�� ��ȯ�Ѵ�.
 * @return {HTMLWindow} window ������Ʈ
 */
jindo.$Window.prototype.$value = function() {
	return this._win;
};

/**
 * resizeTo �޼���� window ��ü�� ũ�⸦ �־��� ũ��� �����Ѵ�.
 * �� ũ��� �������� ������ â ��ü�� ũ�⸦ ��Ÿ���Ƿ� ������ ǥ���ϴ� ����Ʈ �������
 * ������ ������ ������ ���� �޶��� �� �ִ�.
 * @remark �������� ���� ���� ���� ������, â ũ�Ⱑ ȭ���� ���� ������ ����� Ŀ���� ���ϵ��� ���� ��쵵 �ִ�. �� ��쿡�� ������ ũ�⺸�� �۰� â�� Ŀ����.
 * @param {Number} nWidth â�� �ʺ�
 * @param {Number} nHeight â�� ����
 * @return {$Window} â ũ�Ⱑ ����� $Window ��ü this
 * @see $Window#resizeBy
 * @example
 * 	// ���� â�� �ʺ� 400, ���̸� 300���� �����Ѵ�.
 *  $Window.resizeTo(400, 300);
 */
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
	this._win.resizeTo(nWidth, nHeight);
	return this;
};

/**
 * resizeBy �޼���� window ��ü�� ũ�⸦ �־��� ũ�⸸ŭ �����Ѵ�.
 * @param {Number} nWidth �þ â�� �ʺ�
 * @param {Number} nHeight �þ â�� ����
 * @see $Window#resizeTo
 * @example
 *   // ���� â�� �ʺ� 100, ���̸� 50 ��ŭ �ø���.
 *   $Window().resize(100, 50);
 */
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
	this._win.resizeBy(nWidth, nHeight);
	return this;
};

/**
 * moveTo �޼���� â�� �־��� ��ġ�� �̵���Ų��. ��ǥ�� �������� ���� �������� ���� ����� �������� �Ѵ�.
 * @param {Number} nLeft �̵��� x��ǥ (pixel ����)
 * @param {Number} nTop �̵��� y��ǥ (pixel ����)
 * @see $Window#moveBy
 * @example
 *  // ���� â�� (15, 10) ���� �̵���Ų��.
 *  $Window().moveTo(15, 10);
 */
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
	this._win.moveTo(nLeft, nTop);
	return this;
};

/**
 * moveTo �޼���� â�� �־��� ��ġ��ŭ �̵���Ų��.
 * @param {Number} nLeft x��ǥ�� �̵��� �� (pixel ����)
 * @param {Number} nTop y��ǥ �̵��� �� (pixel ����)
 * @see $Window#moveTo
 * @example
 *  // ���� â�� �������� 15px, �Ʒ��� 10px��ŭ �̵���Ų��.
 *  $Window().moveBy(15, 10);
 */
 jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
	this._win.moveBy(nLeft, nTop);
	return this;
};

/**
 * sizeToContent �޼���� ���� ���� ũ�⿡ ���߾� ��ü�� ũ�⸦ �����Ѵ�.
 * @remark �޼����� Ư���� ���� ������ ������ �ε��� ������ ����Ǿ�� �Ѵ�. ����, â�� ���� �������� ū ��쿡�� ���� ������ ���� �� �����Ƿ�, �ݵ�� â ũ�⸦ ���� �������� �۰� �����.
 * @example
 * // �� â�� ���� �ڵ����� â ũ�⸦ ����Ʈ�� �°� �����ϴ� �Լ�
 * function winopen(url) {	
 *		try {
 *			win = window.open(url, "", "toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=250,height=300");
 *			win.moveTo(200, 100);
 *			win.focus();
 *		} catch(e){}
 *
 *		setTimeout(function() {
 *			$Window(win).sizeToContent();
 *		}, 1000);
 *		
 *	}
 *
 * winopen('/samples/popup.html');
 */
jindo.$Window.prototype.sizeToContent = function() {
	if (typeof this._win.sizeToContent == "function") {
		this._win.sizeToContent();
	} else {
		var doc = jindo.$Document(this._win.document);
		var clientSize = doc.clientSize();
		var scrollSize = doc.scrollSize();

		this.resizeBy(scrollSize.width - clientSize.width, scrollSize.height - clientSize.height);
	}

	return this;
};
/**
 * @fileOverview	�ٸ� �����ӿ� ���� jindo�� ����� ��� ���Ǽ��� ���� jindo ��ü�� window�� ����
 */
// copy jindo objects to window
if (typeof window != "undefined") {
	for (prop in jindo) {
		window[prop] = jindo[prop];
	}
}