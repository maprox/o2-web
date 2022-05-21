/**
 * @class Ext.form.field.File
 */

C.utils.inherit('Ext.form.field.File', {
	/**
	 * Remove fakepath
	 * @author http://www.sencha.com/forum/showthread.php?107982-FileUpload-fakepath&p=656872&viewfull=1#post656872
	 */
	initComponent: function() {
		this.callParent(arguments);
		this.on('change', function() {
			var fullPath = this.getValue();
			var lastIndex = fullPath.lastIndexOf('\\');
			if (lastIndex == -1)
				return;
			var fileName = fullPath.substring(lastIndex + 1);
			this.setValue(fileName);
		});
	},

	/**
	 * Getted from Ext.form.field.Text
	 */
	setValue: function(value) {
		var me = this,
			inputEl = me.inputEl;

		if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
			inputEl.removeCls(me.emptyCls);
		}

		me.callParent(arguments);

		me.applyEmptyText();
		return me;
	}
});
