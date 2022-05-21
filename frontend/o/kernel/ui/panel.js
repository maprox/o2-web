/**
 */
/**
 * Base class for application module panel
 * @class C.ui.Panel
 */
C.utils.inherit('C.ui.Panel', {

/**
	* @event lock
	* Fires when panel is locked via lock method
	* @param {C.ui.Panel} this
	*/
/**
	* @event unlock
	* Fires when panel is unlocked via unlock method
	* @param {C.ui.Panel} this
	*/

	border: false,

/**
	* Initialization
	*/
	initComponent: function() {
		if (this.module && this.module instanceof C.ui.Module) {
			Ext.applyIf(this, {
				iconCls: this.module.id,
				title: this.module.textShort,
				tooltip: this.module.textLong
			});
		}
		this.callParent(arguments);
	},

/**
	* Opens tabpanel's tabs above this panel
	* @private
	*/
	openTabsAbove: function() {
		var tabpanel = this.up('tabpanel');
		var tabs = [];
		while (tabpanel) {
			var panel = null;
			var panels = tabpanel.query('> panel');
			if (panels.length) {
				Ext.each(panels, function(p) {
					if (p === this || this.isDescendantOf(p)) {
						panel = p;
					}
				}, this);
			}
			if (tabpanel && panel) {
				tabs.push({
					container: tabpanel,
					panel: panel
				})
			}
			tabpanel = tabpanel.up('tabpanel');
		}
		Ext.each(tabs.reverse(), function(tab) {
			tab.container.setActiveTab(tab.panel);
		});
	},

/**
	* Opens tabpanel's tabs under this panel according to 'params' array
	* @param {Object[]} params Array of a module params
	* @private
	*/
	openTabsUnder: function(params) {
		if (O.ui.Desktop.isLocked()) {
			return;
		}
		var panel = this;
		var stopIteration = false;

		Ext.each(params, function(param) {
			if (stopIteration || !param || !param.name) { return; }
			if (param.name === 'focus') {
				if (param.value) {
					var f = panel.down(param.value);
					if (f) {
						f.focus();
					}
				}
			} else if (param.value) {
				var tabpanel = panel.getComponent(this.tryNumberCast(param.name));
				if (tabpanel) {
					panel = tabpanel.getComponent(
						this.tryNumberCast(param.value)
					);
				}
			} else {
				tabpanel = panel.is('tabpanel') ? panel : panel.down('tabpanel');
				if (tabpanel) {
					panel = tabpanel.getComponent(
						this.tryNumberCast(param.name)
					);
				}
			}
			if (panel && panel.isDisabled && tabpanel && tabpanel.isDisabled) {
				if (!tabpanel.isDisabled() && !panel.isDisabled()) {
					// ExtJS 4.1 disabled tab issue fix
					var wasDisabled = (panel.tab && panel.tab.disabled);
					if (wasDisabled) {
						panel.tab.disabled = false;
					}
					// activate selected tab
					tabpanel.setActiveTab(panel);
					if (wasDisabled) {
						panel.tab.disabled = true;
					}
				} else {
					stopIteration = true;
				}
			}
		}, this);
	},

/**
	* Try to convert value to a number.
	* If succeeded the return value is a number, if not it is a value type
	* @param {?} value
	* @return {Number|?}
	*/
	tryNumberCast: function(value) {
		var result = Ext.Number.from(value, 0);
		if (result === 0 && value !== '0') {
			result = value;
		}
		return result;
	},

/**
	* Activating module panel
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	moduleActivate: function(params) {
		this.openTabsAbove();
		this.openTabsUnder(params);
	},

/**
	* Locks panel while loading data
	*/
	lock: function() {
		if (this.fireEvent('lock', this)) {
			this.setLoading(true);
		}
	},

/**
	* Unlock panel
	*/
	unlock: function() {
		if (this.fireEvent('unlock', this)) {
			this.setLoading(false);
		}
	},

/**
	 * Suspends loader by binding function that always returns false on 'lock'
	 */
	suspendLoader: function() {
		this.on('lock', C.utils.falseFn);
	},

/**
	 * Resumes loader by unbinding false function
	 */
	resumeLoader: function() {
		this.un('lock', C.utils.falseFn);
	}
});
