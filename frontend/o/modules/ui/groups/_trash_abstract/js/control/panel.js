/**
 *
 * @class O.ui.groups.Zones
 */
C.utils.inherit('O.ui.groups.Abstract', {

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			getState: function() {
				var o = {
					selectedObjectId: this.getSelectedObjectId()
				};
				return o;
			}
		});
		this.callOverridden();
		this.on('afterrender', this.reload, this);
		O.manager.Model.bind(
			['group' + this.classAlias, 'x_user', this.classAlias],
			this.onModelChange,
			this
		);
	},

/**
	* Data reload on model change
	* @param {Object} data Changed data
	*/
	onModelChange: function(data) {
		console.log(data);
		this.reload();
	},

/**
	* Loads groups from model
	*/
	reload: function() {
		/*if (this.classAlias === 'mon_geofence') {
			// TEMPORARY FIX
			// (while moving to mon_geofence)
			var groups = new Ext.util.MixedCollection();
			C.get(this.classAlias, function(objects) {
				this.localData.applyGroupsCollection(groups, 'items');
				this.localData.applyObjectsCollection(objects);
				this.loadData(this.localData);
				this.fireEvent('listchange', this, this.getSelectedItems());
			}, this);
		} else {*/
			// OLD CODE
			C.get('x_group_' + this.classAlias, function(groups) {
				C.get(this.classAlias, function(objects) {
					this.localData.applyGroupsCollection(groups, 'items');
					this.localData.applyObjectsCollection(objects);
					this.loadData(this.localData);
					this.fireEvent('listchange', this, this.getSelectedItems());
				}, this);
			}, this);
		//}
	},

	/**
	 * State initialization
	 */
	initiateState: function() {
		var me = this;
		Ext.defer(function() {
			if (me.selectedObjectId)
				me.selectObjectId(me.selectedObjectId);
		}, 10);
	}
});
