/**
 * @class O.common.lib.shareaccess.tab.Access
 */
C.utils.inherit('O.common.lib.shareaccess.tab.Access', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callParent(arguments);

		// Manager alias
		this.managerAlias = this.managerAlias || 'undefined_manager_alias';

		this.on('recordload', this.onRecordLoad, this);
		this.accessGrid = this.down('#accessGrid');
		this.btnGrant = this.down('#btnGrant');
		this.btnRevoke = this.down('#btnRevoke');
		this.btnTransfer = this.down('#btnTransfer');
		this.btnShowClosed = this.down('#btnShowClosed');
		this.columnWriteable = this.down('#columnWriteable')

		// Editor
		if (this.accessGrid) {
			this.editor = this.accessGrid.getPlugin('editor');
		}
		if (this.editor) {
			this.editor.on({
				beforeedit: this.beforeEdit,
				edit: this.afterEdit,
				canceledit: this.cancelEdit,
				scope: this
			});
		}
		if (this.accessGrid) {
			this.accessGrid.on('select', this.onGridSelect, this);
			this.sm = this.accessGrid.getSelectionModel();
		}
		if (this.btnGrant) {
			this.btnGrant.on('click', this.onGrant, this);
		}
		if (this.btnRevoke) {
			this.btnRevoke.on('click', this.onRevoke, this);
		}
		if (this.btnTransfer) {
			this.btnTransfer.on('click', this.onTransfer, this);
		}
		if (this.btnShowClosed) {
			this.btnShowClosed.on('toggle', this.onToggleShowClosed, this);
		}
		if (this.columnWriteable) {
			this.columnWriteable.on('beforecheckchange',
				this.onWriteableCheckchange, this);
		}

		this.syncUi();
	},


/**
	 * On writeable check change
	 */
	onWriteableCheckchange: function() {
		return false;
	},

/**
	 * On grid select
	 */
	onGridSelect: function() {
		this.syncUi();
	},

/**
	* Sync ui
	*/
	syncUi: function() {
		var selection = this.sm.getSelection();
		if (selection.length > 0 && !this.editor.editing) {
			var utcval = C.getSetting('p.utc_value');
			var now = new Date().toUtc();
			if (!selection[0].get('edt')
				|| selection[0].get('edt') > now)
			{
				this.btnRevoke.enable();
				return;
			}
		}

		this.btnRevoke.disable();
	},

/**
	* On record load
	*/
	onRecordLoad: function(cmp, record) {
		if (record.get('isshared')
				|| !C.userHasRight('view_access_list'))
		{
			this.fireEvent('actionrequest', 'disableaccess');
		} else {
			this.fireEvent('actionrequest', 'enableaccess');
		}

		// Check if another record selected
		var firstTime = false;
		if (this.lastLoadedRecord
				&& record.getId() !== this.lastLoadedRecord.getId())
		{
			this.lastSelected = null;
			firstTime = true;
		}

		// Load access data to store
		this.lastLoadedRecord = record;

		if (!this.editor.editing && !this.loading) {
			this.loadAccessData(firstTime);
		}
	},

/**
	 * Loads data to access grid
	 * @param {Boolean} firstTime Loading data for first time
	 */
	loadAccessData: function(firstTime) {
		if (!firstTime) {
			// Store selection
			this.storeSelection();
		}
		var record = this.getSelectedRecord();
		if (record.get('$accesslist').length) {
			this.accessStore.loadData(record.get('$accesslist'));
		} else {
			this.accessStore.loadData({});
		}

		if (!firstTime) {
			// Restore selection
			this.restoreSelection();
		}
		// Apply store filters
		this.maybeFilterStore();
		this.syncUi();
	},

/**
	* Returns true if access expired
	* @param Type record
	*/
	isAccessExpired: function(record) {
		var now = new Date().toUtc();
		var edt = record.get('edt');
		if (record.get('status') == C.cfg.STATUS_REJECTED) {
			return 1;
		}
		if (edt && (edt < now)) {
			return true;
		}
		return false;
	},

/**
	* Filter grid store depends on "show closed" button state
	*/
	maybeFilterStore: function() {
		var me = this;
		var pressed = this.btnShowClosed.pressed;

		if (pressed) {
			// Show closed
			this.accessStore.clearFilter();
			this.accessStore.filter(function(item) {
				return item.get('id_firm') > 0;
			});
		} else {
			// Hide closed
			this.accessStore.filter([{
				filterFn: function(item) {
					return !me.isAccessExpired(item);
				}
			}, {
				filterFn: function(item) {
					return item.get('id_firm') > 0;
				}
			}]);
		}
	},

/**
	* Toggle show closed btn
	* @param Type button
	* @param Type pressed
	*/
	onToggleShowClosed: function(button, pressed) {
		this.maybeFilterStore();
	},

/**
	* Store selection
	*/
	storeSelection: function() {
		this.lastSelected = this.getSelectedAccess();
	},

/**
	* returns selected access entry
	*/
	getSelectedAccess: function() {
		var selection = this.sm.getSelection();
		if (selection.length > 0) {
			return selection[0];
		}

		return null;
	},

/**
	* Restores selection
	*/
	restoreSelection: function() {
		if (this.lastSelected) {
			var record = this.accessStore.getById(this.lastSelected.getId());
			if (record) {
				this.sm.select(record);
			}
		}
	},

/**
	* Before edit
	*/
	beforeEdit: function() {
		// Lock list
		this.fireEvent('listlock', true);
	},

/**
	* After edit
	*/
	afterEdit: function(editor, e) {
		var me = this;
		this.setLoading(true);
		this.loading = true;
		var record = e.record;
		var data;

		// If record is new
		if (!record.getId()) {
			data = {
				id: this.getSelectedRecord().getId(),
				'$accessGrant': [{
					id_firm: record.data.id_firm,
					write: record.data.writeable,
					sdt: record.data.sdt,
					edt: record.data.edt,
					$notify: true, // Notify firm users by email
					$notify_template: this.notifyTemplate || null
				}]
			}

			O.manager.Model.set(this.managerAlias, data,
				function(success, object) {
					if (success) {
						// Info message
						O.msg.info(_('New access has been granted'));
						if (object.data.$grantedIds) {
							var id = object.data.$grantedIds[0];
						}

						// Set ID of inserted record
						record.set('id', id);
						record.commit();
					}
					// Disable loading
					this.setLoading(false);
					this.loading = false;
					// Sync UI
					this.syncUi();
					// Unlock list
					this.fireEvent('listlock', false);
				},
				this
			);

		} else {
			data = {
				id: this.getSelectedRecord().getId(),
				'$accessEdit': [{
					id: record.getId(),
					data: record.getChanges()
				}]
			};

			O.manager.Model.set(this.managerAlias, data, function(success) {
				if (success) {
					// Info message
					O.msg.info(_('Access settings have been changed'));

					record.commit();

					me.maybeFilterStore();
				}
				// Disable loading
				this.setLoading(false);
				this.loading = false;
				// Sync UI
				this.syncUi();
				// Unlock list
				this.fireEvent('listlock', false);
			}, this);
		}
	},

/**
	* On btn revoke click
	*/
	onRevoke: function() {
		var me = this;
		this.setLoading(true);
		this.loading = true;
		var record = this.sm.getLastSelected();
		var edt = new Date().toUtc()
		record.set('edt', edt);

		var data = {
			id: this.getSelectedRecord().getId(),
			'$accessEdit': [{
				id: record.getId(),
				data: record.getChanges()
			}]
		};

		O.manager.Model.set(this.managerAlias, data, function(success) {
			if (success) {
				// Info message
				O.msg.info(_('Access has been revoked'));

				record.commit();

				me.maybeFilterStore();
			}
			// Disable loading
			this.setLoading(false);
			this.loading = false;
			// Sync UI
			this.syncUi();
		}, this);
	},

/**
	*  On btn grant click
	*/
	onGrant: function() {
		var shareWindow = Ext.widget('sharewindow');
		shareWindow.on('firmloaded', this.onFirmLoaded, this);
		shareWindow.show();
	},

/**
	 * On transfer click
	 */
	onTransfer: function() {
		var transferWindow = Ext.widget('transferwindow');
		transferWindow.managerAlias = this.managerAlias;
		transferWindow.selectedObject = this.getSelectedRecord();
		transferWindow.show();
	},

/**
	* When firm was found by shared window
	*/
	onFirmLoaded: function(firm) {
		this.loading = true;
		// Add new entry to the store
		this.accessStore.insert(0, {
			id_firm: firm.id,
			firm_name: firm.name,
			writeable: 0,
			shared: 1,
			sdt: new Date().toUtc()
		});

		// Lock list
		this.fireEvent('listlock', true);

		// Start edit it
		this.editor.startEdit(this.accessStore.getAt(0), 0);
	},

/**
	* Cancel edit handler
	*/
	cancelEdit: function() {
		// If entry was new, remove
		if (!this.lastSelected) {
			this.accessStore.removeAt(0);
		}
		this.loadAccessData();
		this.loading = false;

		this.fireEvent('listlock', false);
	}
});