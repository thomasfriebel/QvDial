
Qva.LoadScript(Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=' + 'Extensions/QvDial/lib/js/jquery.knob.js', init_QvDial);

function init_QvDial() {
	Qva.AddExtension('QvDial', function() {
		var _this = this
		_this.version = '1.0'
		_this._uniqueId = _this.Layout.ObjectId.replace("\\","_");
		_this._variable = getQVStringProp(0) //Variable name
		_this._minValue = getQVStringProp(1) ? getQVStringProp(1) : 0 //0.3 - 0.8
		_this._maxValue = getQVStringProp(2) ? getQVStringProp(2) : 100 //0.3 - 0.8
		_this._fgColor = getQVStringProp(3) //fore ground color
		_this._cursor = getQVStringProp(4) == 0 ? false : 12 //cursor mode (=1), else (=0)
		_this._bgColor = getQVStringProp(5) //back ground color
		_this._thickness = 0.4
		_this._type = 'ring'
		_this._offset = 0
		if (getQVStringProp(6)=='thick'){ //normal,thin,thick
			_this._thickness = 0.5
		}
		else if (getQVStringProp(6)=='thin') {
			_this._thickness = 0.3
		}
		if (getQVStringProp(7) == 'arc') {
			_this._type = 'arc' 
		}
		if (getQVStringProp(8) == 'e')      {
			_this._offset = 90
		} else if (getQVStringProp(8) == 's') {
			_this._offset = 180
		} else if (getQVStringProp(8) == 'w') {
			_this._offset = 270
		}
				
		
		
		_this.getVariable = function(vName,callbackFn) {
			var myDoc = Qv.GetCurrentDocument();
			var theVar = null
			myDoc.GetAllVariables(function(vars) {
				if (vars) {
					theVar = $.grep(vars, function(elem, idx){
						return (elem.name == vName)
					})
					if (theVar && theVar[0]) {
						_this._value = theVar[0].value
					} else {
						_this._value = 0
					}
				} else {
					_this._value = 0
				}
				callbackFn()
			})

		}
		
		
		_this._paintInitial = function() {
			$(_this._input).unbind('change')
			$(_this.Element).empty()
			
			_this._input = $('<input>').attr({'id':'qvdial_'+_this._uniqueId,'type':'text'}).addClass("dial").val(_this._value).attr('title',_this._variable)
			$(_this.Element).append(_this._input)
			//hook on standard change event
			_this._input.change(function(ev){_this._onChange($(ev.target).val())})
			//initialize knob control
			var maxWidthHeight = ($(_this.Element).outerWidth() < $(_this.Element).outerHeight() ? $(_this.Element).outerWidth() : $(_this.Element).outerHeight()) 
			_this._input.knob({
				fgColor:_this._fgColor
				,bgColor:_this._bgColor
				,thickness:_this._thickness
				,cursor:_this._cursor
				,min:_this._minValue
				,max:_this._maxValue
				,angleArc: (_this._type=='ring'?360:250)
				,angleOffset : (_this._type=='ring'? _this._offset :-125)
				,displayInput:true
				,width: maxWidthHeight -5
				,height: maxWidthHeight -5
				,stopper:true
				,'release' : function(v){_this._onChange(v)}
			});
		}
		
		_this._onChange = function(value) {
			SetVarValue(_this._variable,value)
		}
		
		_this.getVariable(_this._variable, function(){_this._paintInitial()})
		//--------------------------------------------------------------------------------------------------
		function SetVarValue(varName,val) {
            var qvDoc = Qv.GetCurrentDocument();
            qvDoc.SetVariable(varName, val);
        }
		
		function getQVStringProp(idx) {
            var p = '';
			try {
                if (_this.Layout['Text' + idx]) {
                    p = _this.Layout['Text' + idx].text //eval('_this.Layout.Text' + idx + '.text || _this.Layout.Text' + idx + '.value');
                }
			} catch (Exception) {
				alert("Exception")
			}
            return p;
        }		
		
	});
}; /*init_QvDial*/