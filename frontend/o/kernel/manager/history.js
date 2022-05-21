/**
 * Browser history manager
 * @class O.manager.History
 * @singleton
 */
Ext.define('O.manager.History', {
	singleton: true,
	isInitialized: false,
	isDisabled: false,
	innerChange: false,

/**
	* History initialization
	*/
	init: function() {

		if (!Ext.History) { return; }

		var me = this;
		var callModuleByToken = function(token) {
			var parsed = me.parseToken(token);
			if (parsed.length > 0) {
				var moduleName = parsed[0].name;
				var moduleParams = parsed.slice(1);
				O.ui.Desktop.callModule(moduleName, moduleParams);
			}
		};

		// It must be before Ext.History.init(), because
		// Ext.History.getToken() gets data from window.location.href if
		// Ext.History is not initialized
		callModuleByToken(this.getCurrentToken());

		Ext.History.init();
		Ext.History.on('change', function(token) {
			callModuleByToken(token);
		}, this);

		this.isInitialized = true;
		O.ui.Desktop.on('moduleactivated', 'traceModule', this);
	},

/**
	* Returns the current history token
	* @return {String}
	*/
	getCurrentToken: function() {
		return (Ext.History) ? Ext.History.getToken() : '';
	},

/**
	* Parses history token param into object with 'name' and 'value'
	* @param {String} token History token
	* @return {Object}
	* @private
	*/
	parseParam: function(param) {
		var delimiter = C.cfg.history.paramDelimiter;
		var result = null;
		var v = param.split(delimiter);
		if (v.length > 1) {
			result = {
				name: v[0],
				value: v.slice(1).join(delimiter)
			};
		} else {
			result = {
				name: v[0]
			};
		}
		return result;
	},

/**
	* Parses history token into array of parameters
	* @param {String} token History token
	* @return {Array}
	* @private
	*/
	parseToken: function(token) {
		var params = [];
		if (!token) { return params; }
		var parts = token.split(C.cfg.history.tokenDelimiter);
		if (parts.length) {
			Ext.each(parts, function(part) {
				params.push(this.parseParam(part));
			}, this);
		}
		return params;
	},

/**
	* Unparse token params into token string
	* @param {Object[]} params Array of params
	* @return {String}
	*/
	unparse: function(tokenParams) {
		var params = [];
		Ext.each(tokenParams, function(tokenParam) {
			var p = [];
			if (tokenParam.name) { p.push(tokenParam.name); }
			if (tokenParam.value) { p.push(tokenParam.value); }
			params.push(p.join(C.cfg.history.paramDelimiter));
		});
		return params.join(C.cfg.history.tokenDelimiter);
	},

/**
	* Adds a token to the surfing history
	*/
	add: function(tokenArray) {
		if (!Ext.History || !this.isInitialized) { return; }
		if (this.isDisabled) { return; }
		var newToken = this.unparse(tokenArray);
		var oldToken = Ext.History.getToken();
		if (oldToken === null || oldToken !== newToken) {
			Ext.History.add(newToken);
		}
	},

/**
	* Returns panel itemId or index within container
	*/
	getPanelName: function(container, panel) {
		return panel.itemId ||
		    container.items.indexOf(panel).toString();
	},

/**
	* Adds path to the panel
	* @param {Ext.Component} panel Component to trace path
	*/
	trace: function(panel) {
		if (!Ext.History) { return; }
		if (this.isDisabled || !panel) { return; }
		if (panel.module) {
			// Trace module panels
			this.traceModule(panel.module);
		} else {
			var tokenArray = this.getTokenArray(panel);
			this.add(tokenArray);
		}
	},

/**
	* Trace non-module panels (at this moment only tabs are traced)
	* We must run up for tabpanel containers of this component
	* @param {Ext.Component} panel Component to trace path
	* @return {Object[]}
	*/
	getTokenArray: function(panel) {
		if (!panel) { return []; }

		var tokenArray = [];
		var tabpanel = panel.up('tabpanel');
		while (tabpanel) {
			var parentPanel = null;
			var panels = tabpanel.query('> panel');
			if (panels.length) {
				Ext.each(panels, function(p) {
					if (p === panel || panel.isDescendantOf(p)) {
						parentPanel = p;
					}
				}, this);
			}
			if (tabpanel && parentPanel) {
				if (parentPanel.module) {
					tokenArray.push({
						name: parentPanel.module.id
					});
					break;
				}
				tokenArray.push({
					name: this.getPanelName(tabpanel, parentPanel)
				});
			}
			tabpanel = tabpanel.up('tabpanel');
		}
		return tokenArray.reverse();
	},

/**
	* Returns hashlink to component
	* @param {Ext.Component} panel Component to get hashlink
	* @return {String}
	*/
	getLink: function(panel) {
		var tokenArray = this.getTokenArray(panel);
		var ret = '#';
		Ext.each(tokenArray, function(token) {
			ret = ret + token.name + '/';
		});
		return ret.slice(0, -1);
	},

/**
	* Returns unique string to component
	* @param {Ext.Component} panel Component to get hashlink
	* @return {String}
	*/
	getIdString: function(panel) {
		var tokenArray = this.getTokenArray(panel);

		var ret = '';

		Ext.each(tokenArray, function(token) {
			ret = ret + token.name + '_';
		});

		return ret.slice(0, -1);
	},

/**
	* Trace module activating
	* @param {C.ui.Module} module
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	traceModule: function(module, params) {
		var tokenArray = [];
		tokenArray.push({
			name: module.id
		})
		if (params && Ext.isArray(params)) {
			tokenArray = Ext.Array.merge(tokenArray, params);
		}
		this.innerChange = true;
		this.add(tokenArray);
	},

/**
	* Enable history tracing
	*/
	enable: function() {
		this.isDisabled = false;
	},

/**
	* Disable history tracing
	*/
	disable: function() {
		this.isDisabled = true;
	}

});
