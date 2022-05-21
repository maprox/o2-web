/*
 * @class O.x.notification.action.Url
 */
C.utils.inherit('O.x.notification.action.Url', {

	/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		// init handlers
		if (!this.listUrl) {
			return;
		}

		if (!this.listParam) {
			return;
		}

		this.urlStore = this.listUrl.getStore();
		this.listUrl.on('select', this.onUrlSelect, this);
		this.listUrl.on('create', this.onUrlCreate, this);
		this.listUrl.on('remove', this.onUrlRemove, this);
		this.listUrl.on({
			create: 'onUrlChange',
			update: 'onUrlChange',
			remove: 'onUrlChange',
			scope: this
		});
		this.listParam.on({
			create: 'onParamChange',
			update: 'onParamChange',
			remove: 'onParamChange',
			scope: this
		});
		this.paramStore = this.listParam.getStore();
	},

/**
	 * On param change
	 */
	onParamChange: function() {
		var selected = this.listUrl.getSelectedRecord();
		var data = []
		var range = this.paramStore.getRange();
		Ext.Array.each(range, function(item) {
			data.push(item.data);
		});
		selected.set('params', data);

		this.onChange();
	},

/**
	 * On URL create
	 */
	onUrlCreate: function() {
		this.listParam.clear();
		this.listParam.enable();
	},

/**
	 * On url remove
	 */
	onUrlRemove: function() {
		this.listParam.clear();
		this.listParam.disable();
	},

/**
	 * On url change
	 */
	onUrlChange: function() {
		this.onChange();
	},

/**
	 * On url select
	 */
	onUrlSelect: function(grid, record) {
		if (!record.get('url')) {
			return;
		}

		this.listParam.enable();
		this.listParam.setLoading(true);

		var params = record.get('params');
		if (params && params.length) {
			this.paramStore.loadData(params);
		} else {
			this.paramStore.removeAll();
		}

		this.listParam.setLoading(false);
	},

	/**
	* Returns a value array for this parameter panel
	* Example: <pre>
	* [{
	*	"param": "mon_device",
	*	"value": 28
	* }, {
	*	"param": "x_group_mon_device",
	*	"value": 10
	* }]
	* </pre>
	* @return array
	*/
	getValue: function() {
		var gridStore = this.listUrl.getStore();
		var data = gridStore.getRange();
		if (this.collapsed && !this.actionId) {
			return null;
		}
		var result = {
			id_action_type: this.actionType,
			state: !this.collapsed ?
				C.cfg.RECORD_IS_ENABLED :
				C.cfg.RECORD_IS_TRASHED
		};
		if (this.actionId) {
			result.id = this.actionId;
		}

		var items = [];

		gridStore.each(function(record) {

			var data = {
				url: record.get('url'),
				method: record.get('method'),
				params: record.get('params') || []
			}

			items.push({
				name: 'target',
				value: Ext.JSON.encode(data)
			});
		});

		result.params = items;
		return result;
	},

/**
	* Set value for current parameter
	* @param {Object[]} value
	*/
	setValue: function(value) {
		if (!value || !Ext.isArray(value)) {
			return;
		}
		if (!this.listUrl) { return; }
		this.loading = true;
		this.clear();
		var store = this.listUrl.gridStore;
		// Find current action
		Ext.each(value, function(action) {
			if (action && action.id_action_type === this.actionType) {
				this.actionId = action.id;
				if (action.state === C.cfg.RECORD_IS_ENABLED) {
					this.expand();
				}

				// Add to store
				Ext.each(action.params, function(item) {
					var value = Ext.JSON.decode(item.value);
					value.state = C.cfg.RECORD_IS_ENABLED;
					store.add(value);
				}, this);
			}
		}, this);
		// Reset checkbox original value
		this.checkboxCmp.resetOriginalValue();
		this.loading = false;
		return;
	},

/**
	* Clears list
	*/
	clear: function() {
		if (!this.listUrl) { return; }
		this.actionId = null;
		this.listUrl.clear();
		this.listParam.clear();
		this.listParam.disable();
		this.collapse();
	}
});