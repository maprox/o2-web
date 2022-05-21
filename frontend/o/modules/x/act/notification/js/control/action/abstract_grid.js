/**
 * @class O.x.notification.action.User
 * @extends O.x.notification.action.AbstractList
 */
C.utils.inherit('O.x.notification.action.AbstractGrid', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.checkcolumn.on('checkchange', 'onChange' ,this);
		this.clear();
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
		var gridStore = this.grids.grid.getStore();
		var data = gridStore.getRange();
		var enabled = gridStore.query('enabled', true);
		if (this.collapsed
				&& enabled && enabled.length == 0
				&& !this.actionId) {
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
			if (record.get('enabled')) {
				items.push({
					name: 'target',
					value: "" + record.get('id')
				});
			}
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
		this.loading = true;
		this.clear();
		var gridStore = this.grids.grid.getStore();

		Ext.each(value, function(action) {
			if (action && action.id_action_type === this.actionType) {
				this.actionId = action.id;
				if (action.state === C.cfg.RECORD_IS_ENABLED) {
					this.expand();
				}
				Ext.each(action.params, function(item) {
					var record = gridStore.getById(+item.value);
					record.set('enabled', true);
					record.commit();
				}, this);
			}
		}, this);
		this.checkboxCmp.resetOriginalValue();
		this.loading = false;

		this.gridStore.sort('enabled', 'DESC');
		return;
	},

/**
	* Clears list
	*/
	clear: function() {
		this.actionId = null;
		var gridStore = this.grids.grid.getStore();
		gridStore.each(function(record) {
			record.set('enabled', false);
			record.commit(true);
		});
		this.collapse();
	}
});