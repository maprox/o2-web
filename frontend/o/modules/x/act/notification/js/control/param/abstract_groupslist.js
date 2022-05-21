/**
 * @class O.x.notification.param.AbstractGroupslist
 */
C.utils.inherit('O.x.notification.param.AbstractGroupslist', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		if (this.itemsList) {
			this.itemsList.on('checkchange', 'onChange', this);
		}
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
		if (!this.itemsList) { return []; }
		var result = [];
		Ext.each(this.itemsList.getSelectedObjects(), function(objectId) {
			result.push({
				name: this.tableAlias,
				value: objectId
			});
		}, this);
		Ext.each(this.itemsList.getSelectedGroups(), function(groupId) {
			result.push({
				name: 'x_group_' + this.tableAlias,
				value: groupId
			});
		}, this);
		return result;
	},

/**
	* Set value for current parameter
	* @param {Object[]} value
	*/
	setValue: function(value) {
		//console.time('setValue' + this.tableAlias);
		this.itemsList.resetSelection();
		var objects = [];
		var groups = [];
		Ext.each(value, function(param) {
			switch (param['name']) {
				case this.tableAlias:
					objects.push(param['value']);
					break;
				case 'x_group_' + this.tableAlias:
					groups.push(param['value']);
					break;
			}
		}, this);
		this.itemsList.checkObjects(objects);
		this.itemsList.checkGroups(groups);
		//console.timeEnd('setValue' + this.tableAlias);
	}
});