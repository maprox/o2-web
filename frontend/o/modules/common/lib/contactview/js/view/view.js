/**
 * Contact view
 * @class O.lib.contactview.View
 * @extends Ext.view.View
 */

C.define('O.lib.contactview.View', {
	extend: 'Ext.view.View',
	alias: 'widget.contactview',

	/**
	* Component initiazliation
	*/
	initComponent: function() {
		// Field with contact
		var keyfield = this.keyfield;
		// Contacts template
		Ext.apply(this, {
			tpl: new Ext.XTemplate(
				'<table class="contacts-table">',
				'<tpl for=".">',
					'<tr class="contact-tr">',
						'<td class="icon-td">',
						'<div class="contact-icon contact-' + keyfield +'"></div>',
						'<td>',
						'<td class="contact-text">{'+ keyfield +'}</td>',
						'<td class="contact-note">{note}</td>',
					'</tr>',
				'</tpl>',
				'</div>'
			),
			itemSelector: 'tr.contact-tr'
		})
		this.callParent(arguments);
	}
});