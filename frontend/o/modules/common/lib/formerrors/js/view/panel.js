/**
 *
 * @class O.common.formerrors.Panel
 * @extends Ext.button.Button
 */
C.define('O.common.formerrors.Panel', {
	extend: 'Ext.button.Button',
	alias: 'widget.formerrors',

	cls: 'form-has-errors',
	iconCls: 'icon-warning',
	hidden: true,

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			text: _('Form has errors')
		});
		this.callParent(arguments);
	}
});
