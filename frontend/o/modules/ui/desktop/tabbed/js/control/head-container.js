/**
 * @class O.ui.HeadContainer
 */
C.utils.inherit('O.ui.HeadContainer', {
/**
	* Initialization
	* @constructs
	*/
	initComponent: function() {
		this.callParent(arguments);
		if (this.btnSelectModule) {
			O.ui.Desktop.on('moduleactivated', 'onModuleActivated', this);
			this.initModuleMenu();
		}

		if (this.headerInfo) {
			this.initClockMenu();
		}
		C.bind('clock10', this);
	},

/**
	 * Clock menu initialization
	 */
	initClockMenu: function() {
		var me = this;
		var btn = this.headerInfo;

		var store = C.getStore('x_utc', {
			sorters: [{
				property: 'id',
				direction: 'DESC'
			}]
		});
		var utcData = store.getRange();

		for (var i = 0; i < utcData.length; i++) {
			btn.menu.add({
				text: utcData[i].get('name'),
				id_utc: utcData[i].get('id'),
				handler: function(item) {
					this.onUtcClicked(item)
				},
				scope: me
			});
		}
	},

/**
	 * On utc menu item clicked
	 * @param item
	 */
	onUtcClicked: function(item) {
		this.headerInfo.toggle(false);
		var mask = new Ext.LoadMask(this.headerInfo, {
			msg: _('Loading...'),
			cls: 'text-mask'
		});
		mask.show();

		var data = [{
			id: 'p.utc',
			value: item.id_utc
		}];
		O.manager.Model.set('settings', data, function(success, result) {
			O.manager.Model.getProxy('settings').setDirty();
			if (success) {
				//O.msg.info(_('UTC setting has been saved'));
			}
			mask.destroy();
		}, this);
	},

/**
	* Module menu initialization
	*/
	initModuleMenu: function() {
		var selected = false;
		var btn = this.btnSelectModule;
		Ext.each(O.ui.Desktop.getModulesByType('module'), function(module) {
			if (module && module.panel) {
				btn.menu.add({
					link_module: module,
					iconCls: module.id,
					text: module.textShort,
					tooltip: module.textLong,
					handler: this.onMenuItemClicked,
					scope: this
				});
				if (!selected) {
					O.ui.Desktop.callModule(module.id);
					selected = true;
				}
			}
		}, this);
		this.btnSelectModule.setVisible(selected);
	},

/**
	* Fired when menu item is clicked
	*/
	onMenuItemClicked: function(item) {
		var module = item.link_module;
		if (!module) { return; }
		O.ui.Desktop.callModule(module.id);
	},

/**
	* Fires when application module is activated
	*/
	onModuleActivated: function(module) {
		var btn = this.btnSelectModule;
		btn.setText(module.textShort);
		btn.setIconCls(module.id);
	},

/**
	* Updates clock
	*/
	onUpdateClock10: function() {
		this.overwriteInfoTemplate(O.manager.Model.getServerTime());
	},

/**
	 * Updates connection status
	 * @param Boolean connection
	 */
	updateConnectionStatus: function(connection) {
		var status = connection ? 'online' : 'offline';
		var tooltip;

		if (connection) {
			tooltip = _('Server connection established');
		} else {
			tooltip =  _('Connection to sever lost')
			 + '.<br /> ' + _('Please check your connection');
		}

		var tpl = this.getConnectionTemplate();
		var data = {
			connection: status,
			tooltip: tooltip
		}

		tpl.overwrite(this.connectionInfo.el, data);
	},

/**
	* Overwrites info template
	* @param {String} dt Date
	*/
	overwriteInfoTemplate: function(dt) {
		var tpl = this.getInfoTemplate();
		C.get('settings', function(s) {
			var uval = C.getSetting('p.utc_value', s);
			var time = dt.pg_utc(uval);
			var data = {
				utc: C.getSetting("p.utc_name", s),
				date: Ext.Date.format(time, O.format.Date),
				time: Ext.Date.format(time, O.format.TimeShort)
			};
			//this.headerInfo.update(tpl.apply(data));
			tpl.overwrite(this.headerInfo.el, data);
		}, this);
	}
});
