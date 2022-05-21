/**
 * @class O.mon.lib.waylist.EditorWindow
 */
C.utils.inherit('O.mon.lib.waylist.EditorWindow', {
/**
	* @constructor
	*/
	initComponent: function() {

		this.lastRecordStore = C.getStore('mon_waylist', {
			remoteFilter: true,
			remoteSort: true,
			sorters: [{
				property: 'id',
				direction: 'DESC'
			}],
			proxy: {
				type: 'ajax',
				url: '/mon_waylist',
				reader: {
					type: 'json',
					root: 'data',
					totalProperty: 'count'
				},
				extraParams: {
					'$joined': 1,
					'$showtotalcount': 1
				}
			},
			pageSize: 1,
			autoLoad: false
		});

		this.callOverridden(arguments);
		this.editorPanel.on('beforetabchange', 'onBeforeTabChange', this);
		this.editorPanel.on('tabchange', 'onTabChange', this);
		this.editorPanel.on('select', this.onRecordSelect, this);
		this.btnClose.setHandler(this.waylistClose, this);
		this.btnStart.setHandler(this.waylistStart, this);

		this.tabProps.on('garage_change', this.onGarageChange, this);
		this.tabProps.on('vehicle_change', this.onMapParamsChange, this);
		this.tabProps.on('sdt_edt_change', this.onMapParamsChange, this);
	},

/**
	* Shows window with specified record
	* @param {Ext.data.Model} record
	*/
	execute: function(record) {
		this.callParent(arguments);
		// Set loader for loading default values
		if (!record) {
			this.setLoading(true);
		}
	},

	/**
	 * Synchronizes ui
	 * @protected
	 */
	syncUi: function() {
		this.callParent(arguments);

		if (!this.editorPanel) { return; }

		var current = this.editorPanel.getSelectedRecord();
		if (current) {
/*			if (current.get('status') == Mon.Waylist.CLOSED) {
				this.btnClose.setDisabled(true);
				this.btnSave.setDisabled(true);
				this.btnReset.setDisabled(true);

				Ext.each(this.editorPanel.getTabs(), function(tab){
					if (tab.setReadonly) {
						tab.setReadonly();
					}
				});
			} else {
				this.btnClose.setDisabled(false);
				Ext.each(this.editorPanel.getTabs(), function(tab){
					if (tab.setWriteable) {
						tab.setWriteable();
					}
				});
			} */

			if (current.get('status') == Mon.Waylist.STARTED) {
				this.btnStart.hide();
				this.btnClose.show();
			} else {
				this.btnStart.show();
				this.btnClose.hide();
			}
		}
	},

/**
	* Clears the fields data of window panel.
	* Used during creation of model object (to clear previous data)
	*/
	reset: function() {
		this.callParent(arguments);

		// Call initStores to reapply filter to specialization stores
		Ext.each(this.editorPanel.getTabs(), function(tab) {
			if (tab && tab.initStores) {
				tab.initStores();
			}
		});
	},

	/**
	 * Finalizes waylist by setting its state
	 */
	waylistStart: function() {
		if (!this.editorPanel) { return; }

		var current = this.editorPanel.getSelectedRecord();
		if (current) {
			current.set('status', Mon.Waylist.STARTED);
			var data = current.getSubmitData();
			data.id = current.get('id');
			this.setLoading(true);
			O.manager.Model.set('mon_waylist', data, function(success, r) {
				if (!r.data.status == Mon.Waylist.CREATED) {
					current.set('status', Mon.Waylist.CREATED);
				}
				this.setLoading(false);
				this.syncUi();
			}, this);
		}
	},

	/**
	 * Writes changes to record
	 * @param {Ext.data.Model} record
	 * @param {Boolean} success
	 */
	commitRecordData: function(record, success) {
		if (!success) {
			var modified = record.modified;
			var persistent = record[record.persistenceProperty];
			if (typeof modified.status != 'undefined') {
				persistent.status = modified.status;
			}
			if (typeof modified.id_vehicle != 'undefined') {
				persistent.id_vehicle = modified.id_vehicle;
			}
			if (typeof modified.sdt != 'undefined') {
				persistent.sdt = modified.sdt;
			}
			if (typeof modified.edt != 'undefined') {
				persistent.edt = modified.edt;
			}
		}
		record.commit();
	},

	/**
	 * Finalizes waylist by setting its state
	 */
	waylistClose: function() {
		if (!this.editorPanel) { return; }

		var current = this.editorPanel.getSelectedRecord();
		if (current) {
			current.set('status', Mon.Waylist.CLOSED);
			var data = current.getSubmitData();
			data.id = current.get('id');
			O.manager.Model.set('mon_waylist', data);

			this.syncUi();
		}
	},

/**
	* On record select
	*/
	onRecordSelect: function(panel, record) {
		// If record is new
		if (!record.get('id')) {
			// Get last added waylist for copying data to new
			panel.setLoading(true);
			this.lastRecordStore.loadPage(1, {
				scope: this,
				callback: function(records, operation, success) {
					this.setLoading(false);
					if (!records || !records.length) {
						return;
					}
					var last = records[0].getData();

					// Set default values
					var num = last.num + 1;
					panel.setChanges({
						'serial_num': last.serial_num,
						'num': num,
						'id_driver': last.id_driver,
						'id_vehicle': last.id_vehicle,
						'id_point_submission': last.id_point_submission,
						'id_company_disposal' : last.id_company_disposal,
						'refuel_list_number': last.refuel_list_number,
						'refuel_amount': last.refuel_amount,
						's_id_dispatcher': last.s_id_dispatcher,
						's_id_mechanic': last.s_id_mechanic,
						'medician': last.medician,
						'id_type': last.id_type || 1,
						'note' : last.note
					});
				}
			});
		}
	},

	/**
	 * On garage select
	 */
	onGarageChange: function() {
		this.tabRoute.onGarageChange();
	},

	/**
	 * On change of map params: vehicle, sdt, edt
	 */
	onMapParamsChange: function() {
		this.tabRoute.onMapParamsChange();
	},

/**
	* Returns new record object for creation
	* @protected
	* @return {Ext.data.Model}
	*/
	getNewRecord: function() {
		// Default values for new record
		var dt = (new Date).pg_utc(C.getSetting('p.utc_value'), true);
		return Ext.create(this.model, {
			id_company_owner: C.getSetting("f.id"),
			dt: dt,
			sdt: dt,
			edt: dt,
			id_type: 1
		});
	},

/**
	* Handler of tab changing
	* @param {Ext.tab.Panel} cmp
	* @param {Ext.Panel} tab
	* @private
	*/
	onBeforeTabChange: function(cmp, tab) {
		var record  = this.editorPanel.getSelectedRecord();
		if (!record.getId() && tab.itemId === 'route') {
			if (this.editorPanel.isDirty()) {
				O.msg.confirm({
					msg: _('You must save the way-list ' +
						'before changing its route.') + '<br/>' +
						_('Save the way-list?'),
					fn: function(buttonId) {
						if (buttonId != 'yes') { return; }
						this.tabWaitForSelection = tab;
						this.editorPanel.saveChanges();
					},
					scope: this
				});
			} else {
				O.msg.info(_('Please, fill way-list properties.'));
			}
			return false;
		}
	},

	/**
	 * Handler of tab changing
	 * @param {Ext.tab.Panel} cmp
	 * @param {Ext.Panel} tab
	 * @private
	 */
	onTabChange: function(cmp, tab) {
		if (tab.itemId === 'route') {
			tab.onSelected();
		}
	},

/**
	* Handles creation or updating of a record
	* @private
	*/
	onSave: function() {
		if (this.tabWaitForSelection) {
			this.editorPanel.selectTab(this.tabWaitForSelection);
			this.tabWaitForSelection = null;
		}
		this.callOverridden(arguments);
	}
});