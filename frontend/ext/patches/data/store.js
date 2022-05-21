Ext.define('M.data.Store', {
	override: 'Ext.data.Store',

	/**
	 * Ext.data.Store.setData() alias
	 */
	loadData: function() {
		return this.setData.apply(this, arguments);
	},

	/**
	 * Ext.data.Store.commitChanges() alias
	 */
	commitChanges: function() {
		this.each(function(rec){
			rec.commit();
		});
	}
});