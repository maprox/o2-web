/**
 * @class O.x.lib.company.tab.Contacts
 */
C.utils.inherit('O.x.lib.company.tab.Contacts', {

	/**
	 * @constructor
	 */
	initComponent: function() {
		this.callOverridden(arguments);

		this.relayEvents(this.emailsEditor, [
			'dirtychange',
			'validitychange'
		]);
		this.relayEvents(this.phonesEditor, [
			'dirtychange',
			'validitychange'
		]);
	},

	/**
	 * Loads data from record
	 * @param {Ext.data.Model} record
	 * @param {Boolean} noReset (optional) If true, use field.setValue method
	 *     for forms to disable dirty change. Defaults to false
	 */
	selectRecord: function(record, noReset) {
		this.emailsEditor.setData(record.get(this.prefix + 'email'));
		this.phonesEditor.setData(record.get(this.prefix + 'phone'));

		this.callParent(arguments);
	},

	/**
	 * Returns true if current tab data has changes
	 * @return {Boolean}
	 */
	isDirty: function() {
		return (
			this.emailsEditor.isDirty() ||
			this.phonesEditor.isDirty() ||
			this.emailsEditor.isNewEntryDirty() ||
			this.phonesEditor.isNewEntryDirty()
		);
	},

	/**
	 * Returns true if current tab data is valid
	 * @return {Boolean}
	 */
	isValid: function() {
		return true;
	},

	/**
	 * Updates record with form data
	 * @param {Ext.data.Model} record
	 */
	updateRecord: function(record) {
		this.callParent(arguments);
		if (!record) { return; }
		var write = {};
		if (this.emailsEditor.isDirty() || this.emailsEditor.isNewEntryDirty()) {
			write[this.prefix + 'email'] = this.emailsEditor.getData();
		}
		if (this.phonesEditor.isDirty() || this.phonesEditor.isNewEntryDirty()) {
			write[this.prefix + 'phone'] = this.phonesEditor.getData();
		}
		if (!C.utils.isEmptyObject(write)) {
			record.set(write);
		}
	},

	/**
	 * Resets form data
	 */
	reset: function() {
		var record = this.getSelectedRecord();
		this.emailsEditor.setData(record.get(this.prefix + 'email'));
		this.phonesEditor.setData(record.get(this.prefix + 'phone'));
	},

	/**
	 * Clears data
	 */
	clear: function() {
		this.emailsEditor.setData([]);
		this.phonesEditor.setData([]);
	}
});