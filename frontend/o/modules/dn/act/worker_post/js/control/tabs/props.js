/**
 * @class O.dn.worker_post.tab.Props
 */
C.utils.inherit('O.dn.worker_post.tab.Props', {

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		this.callParent(arguments);
	},

/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		this.callParent(arguments);
		if (!record) { return; }

		var newSpec = [];
		this.specCheckboxes.items.each(function(spec) {
			if ((spec.name == 'spec_driver') && (spec.checked === true)) {
				newSpec.push('Driver');
			}
			if ((spec.name == 'spec_engineer') && (spec.checked === true)) {
				newSpec.push('Engineer');
			}
			if ((spec.name == 'spec_dispatcher') && (spec.checked === true)) {
				newSpec.push('Dispatcher');
			}
		});

		// Check if checkbox values has been changed
		var originSpec = record.get('specialization');
		var originDiff = Ext.Array.difference(originSpec, newSpec);
		var newDiff = Ext.Array.difference(newSpec, originSpec);
		if (originDiff.length > 0 || newDiff.length > 0) {
			if (newSpec.length == 0) {
				newSpec.push("");
			}
			record.set('specialization', newSpec);
		}
	}
});
