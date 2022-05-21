/**
 * TODO COMMENT THIS
 * @deprecated
 */
/*
C.utils.inherit('Ext.panel.Table', {

	initComponent: function() {
		this.callParent(arguments);

		this.relayEvents(this.store, ['groupchange']);
	},

	applyState: function(state) {
		console.debug('STATE ->>>>>>>>>> GROUP', state);
		if (state.group) {

			// http://www.sencha.com/forum/showthread.php?264893-4.2.1-Groupers-error-no-method-getGroupString
			//this.store.groupers = new Ext.util.MixedCollection();
			//this.store.groupers.add(state.group);

			this.store.clearGrouping();
			this.store.group(state.group);
		}

		this.callParent(arguments);


	},

	getState: function() {
		var me = this;
		var state = me.callParent();

		var grouper = me.store.groupers.first();
		var sorter = me.store.sorters.first();

		if (sorter) {
			state = me.addPropertyToState(state, 'sort', {
				property: sorter.property,
				direction: sorter.direction,
				root: sorter.root
			});
		}

		if (grouper) {
			state = me.addPropertyToState(state, 'group', {
					property: grouper.property,
					direction: grouper.direction,
					root: grouper.root
			});
		}

		return state;
	}
});
*/