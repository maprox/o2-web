/**
 * Vehicle list
 * @class O.mon.vehicle.List
 * @extends O.common.lib.modelslist.List
 */
C.utils.inherit('O.mon.sim.card.List', {

/**
	 * @constructs
	 */
	initComponent: function() {
		this.callParent(arguments);
		this.store.on('add', this.onStoreAdd, this);
		this.store.on('datachanged', this.onDataChanged, this);
		this.store.on('update', this.onStoreUpdate, this);
		this.store.on('load', this.onStoreLoad, this);

		// Page to reload
		this.reloadPage = null;

		// Last database item id
		this.lastItemId = null;

		this.btnSendSettings = this.down('#btnSendSettings');
		this.btnSendSettings.on('click', this.onSendSettings, this);

		//this.on('afterrender', this.onAfterRender, this);
	},

/**
	 * On after render
	 */
	onAfterRender: function() {
		this.callParent(arguments);
		this.store.loadPage(1);
	},

/**
	 * On send settings
	 */
	onSendSettings: function() {
		var me = this;
		var selected = this.getSelectedRecord();
		if (!selected) {
			return;
		}

		me.setLoading(true);

		// Get apn
		var provider = this.providerStore.getById(selected.get('provider'));

		var data =  {
			identifier: selected.get('imei_tracker'),
			phone: selected.get('phone_number'),
			protocol: selected.get('id_device_protocol'),
			apn: provider.get('apn'),
			login: provider.get('login'),
			password: provider.get('password')
		};

		Ext.Ajax.request({
			url: '/mon_sim_card/configure',
			method: 'POST',
			params: {
				data: Ext.JSON.encode(data)
			},
			callback: function(opts, success, response) {
				me.setLoading(false);
				if (!success) { return; }
				// response from server
				var answer = C.utils.getJSON(response.responseText, opts);
				if (answer.success) {
					O.msg.info(_('The task of configuring the device ' +
						'is successfully created'));
				} else {
					O.msg.warning(_('An error occurred while trying to ' +
						'create device configuration task'));
				}
			},
			scope: this
		});
	},

/**
	* Search field handler
	*/
	search: function() {
		var searchString = this.fieldSearch.getValue();

		if (searchString.length < 3) {
			if (this.store.getProxy().extraParams['$search']) {
				// Delete $search param
				delete this.store.getProxy().extraParams['$search'];
			}
			if (!searchString.length) {
				this.store.loadPage(1);
			}
			return;
		}

		this.store.getProxy().extraParams['$search'] = searchString;
		this.store.loadPage(1);
	},

/**
	 * Store add handler
	 */
	onStoreAdd: function() {
	},

/**
	 * Model changed
	 */
	modelChanged: function(data) {
		this.callParent(arguments);

		if (!data.length) {
			return;
		}

		// Received item
		var item = data[0];
		var itemId = item.id;

		//this.reloadPage = this.store.currentPage;

		// Check if item exists on page
		var currentItem = this.store.getById(itemId);
		if (currentItem)
		{
			// Check equality
			// Do not reload page if nothing changed
			var currentData = currentItem.data;
			// TODO: probably not very good solution
			delete currentData['x_company.name'];
			delete item['foreign'];
			delete item['iseditable'];
			delete item['isshared'];

			var itemRecord = Ext.create('Mon.Sim.Card', item);
			var itemData = itemRecord.data;


			if (!C.utils.equals(currentData, itemData)) {
				this.reloadPage = this.store.currentPage;
			}
		}

		// If entry deleted
		if (item.state === C.cfg.RECORD_IS_TRASHED) {
			this.reloadPage = this.store.currentPage;
		}

		// If new entry added
		if (item.id > this.lastItemId) {
			this.reloadPage = this.store.currentPage;
			this.lastItemId = item.id;
		}

		// Reload if needed
		this.maybeReloadPage();
	},

/**
	* Synchronizes user interface with current state of list.
	* Disables or enables buttons.
	* @private
	*/
	syncUi: function() {
		this.callParent(arguments);
		var selected = this.getSelectedRecord();

		if (!selected) {
			this.btnSendSettings.disable();
			return;
		}

		if (selected.get('imei_tracker')
			&& selected.get('phone_number')
			&& selected.get('id_device_protocol')
			&& selected.get('provider')
		) {
			this.btnSendSettings.enable();
		} else {
			this.btnSendSettings.disable();
		}
	},

/**
	 * Maybe reload page
	 */
	maybeReloadPage: function() {
		if (!this.getEditedRecord() && this.reloadPage) {
			this.store.loadPage(this.reloadPage);
			this.reloadPage = null;
		}
	},

/**
	 * On data changed
	 */
	onDataChanged: function() {
		// Save last store id
		if (!this.lastItemId && this.store.first()) {
			this.lastItemId = this.store.first().get('id');
		}
	},

/**
	 * On store load
	 */
	onStoreLoad: function() {

		// TODO:
		// ExtJS 4.2.0 - 4.2.1.744 bug, selection model keeps old record
		// after store load
		// http://www.sencha.com/forum/showthread.php?263736
		// http://www.sencha.com/forum/showthread.php?261111
		// Workaround:
		var selected = this.getSelectedRecord();
		if (selected) {
			this.getSelectionModel().deselectAll();
			this.getSelectionModel().select(selected.index);
		}
	},

/**
	 * On store update
	 */
	onStoreUpdate: function() {
	},

/**
	 * After edit handler
	 */
	afterEdit: function(e) {
		this.callParent(arguments);
		this.maybeReloadPage();
	},

/**
	 * After edit cancel handler
	 * @private
	 */
	afterEditCancel: function() {
		this.callParent(arguments);
		this.maybeReloadPage();
	}
});