/**
 *
 * @class O.dn.act.pricerequest.Editor
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.pricerequest.EditorLines', {

/**
	* Component initialization
	*/
	initComponent: function() {

		this.callOverridden(arguments);

		this.addEvents(
			/**
			 * @event amount_change
			 * Fires when total amount have been changed
			 */
			'amount_change'
		);

		this.grid = this.down('gridpanel');

		if (this.grid) {

			this.gridEditor = this.grid.getPlugin('editor');
			this.gridStore = this.grid.getStore();

			this.gridStore.on({
				write: this.onStoreUpdated,
				scope: this
			});

			var worker = this.gridStore.getProxy().getStorageObject();

			worker.on({
				beforeload: this.onStoreLoading,
				load: this.onStoreLoaded,
				scope: this
			});
		}

		if (this.emptyButton) {
			this.emptyButton.relayEvents(this.gridStore, ['load']);
			this.emptyButton.on('toggle', this.toggleEmpty, this);
		}
	},

/**
	* Toggle displaying of empty records
	*/
	toggleEmpty: function() {
		var button = this.emptyButton;
		if (!button.pressed) {
			var fn = function(record){
				return record.get("amount") > 0;
			};

			this.gridStore.getProxy().store.filterBy(fn);
			this.gridStore.filterBy(fn);
		} else {
			this.gridStore.getProxy().needReload = true;
		}
		this.gridStore.loadPage(1);
	},

/**
	* Загрузка данных
	*/
	load: function(record, requestId) {
		var warehouseId = record.get('id');

		this.gridStore.removeAll();

		if (this.gridStore.filters.items.length) {
			this.gridStore.clearFilter();
		}

		this.gridStore.getProxy().needReload = true;
		this.gridStore.filter([
			{property: "id_request", value: requestId},
			{property: "id_place", value: warehouseId}
		]);

		this.gridStore.loadPage(1);
	},

/**
	* Очистка данных
	*/
	clear: function() {
		this.gridStore.loadRecords([]);
	},

	disableEditor: function() {

		this.toggleEditor(false);
	},

	enableEditor: function() {

		this.toggleEditor(true);
	},

	toggleEditor: function(editorEnabled) {

		this.gridEditor.beforeEdit = function (){
			return editorEnabled;
		}
	},

	onStoreLoading: function() {
		this.grid.setLoading(true);
	},

	onStoreLoaded: function() {
		this.grid.setLoading(false);

		if (!this.emptyButton.pressed) {
			var fn = function(record){
				return record.get("amount") > 0;
			};

			this.gridStore.getProxy().store.filterBy(fn);
			this.gridStore.filterBy(fn);
		}
	},

	onStoreUpdated: function() {
		var haveAmount = false,
			requestId = false,
			placeId = false;

		this.gridStore.each(function(record){
			if (!requestId) {
				requestId = record.get('id_request');
			}

			if (!placeId) {
				placeId = record.get('id_place');
			}

			if (record.get('amount')) {
				haveAmount = true;
				return false;
			}
		});

		if (requestId && placeId) {
			if (!haveAmount) {
				Ext.Ajax.request({
					url: '/pricesrequests/amount',
					method: 'post',
					params: {requestId: requestId, placeId: placeId},
					scope: this,
					success: function(response) {

						if (response) {

							var response = Ext.decode(response.responseText);

							if (response.data) {
								haveAmount = response.data > 0;
							}
						}

						this.fireEvent('amount_change', {requestId:
							requestId, placeId: placeId, haveAmount: response.data});
					}
				});
			} else {
				this.fireEvent('amount_change', {requestId:
					requestId, placeId: placeId, haveAmount: haveAmount});
			}
		}
	}
});
