/**
 * @class O.x.notification.action.AbstractList
 */
C.utils.inherit('O.x.notification.action.AbstractList', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		// init handlers
		if (!this.list) {
			return;
		}
		this.list.on({
			create: 'onChange',
			update: 'onChange',
			remove: 'onChange',
			scope: this
		});
		this.clear();
	},

/**
	* Returns a value array for this actions panel
	* Example: <pre>
	*    "id": 3,
    *    "id_action_type": 2,
    *    "state": 1,
    *    "params": [{
    *        "name": "email",
    *        "value": "sunsay@maprox.net"
    *    }, {
    *        "name": "email",
    *        "value": "sunsay@mail.ru"
    *    }]
	* </pre>
	* @return array
	*/
	getValue: function() {
		if (!this.list) {
			return null;
		}
		var data = this.list.gridStore.getRange();
		if (this.collapsed
				&& data && data.length == 0
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
		Ext.each(data, function(item) {
			var val = item.get('name');
			/*if (parseInt(val) == val) {
				// convert val to integer
				val = parseInt(val);
			}*/
			items.push({
				name: 'target',
				value: val
			});
		}, this);
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
		if (!this.list) { return; }
		this.loading = true;
		this.clear();
		var store = this.list.gridStore;
		Ext.each(value, function(action) {
			if (action && action.id_action_type === this.actionType) {
				this.actionId = action.id;
				if (action.state === C.cfg.RECORD_IS_ENABLED) {
					this.expand();
				}
				Ext.each(action.params, function(item) {
					store.add({name: item.value, state: C.cfg.RECORD_IS_ENABLED});
				}, this);
			}
		}, this);
		// Reset checkbox original value
		this.checkboxCmp.resetOriginalValue();
		this.loading = false;
	},

/**
	* Clears list
	*/
	clear: function() {
		if (!this.list) { return; }
		this.actionId = null;
		this.list.clear();
	// Не понимаю, почему но это состояние потом никак не изменяется и ExtJS уверен что панель свернута перманентно
	// Соответственно он не дает редактировать данные потому как уверен что грид не видно
	// Вроде как и с закомментированной этой строчкой гриды исправно сворачиваются когда надо
	//	this.collapse();
	}
});