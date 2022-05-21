/**
 * @copyright  2012, Maprox LLC
 *
 * Msg Panel
 * @class O.app.view.MsgPanel
 * @extend C.ui.Panel
 */
Ext.define('O.app.view.MsgPanel', {
	extend: 'C.ui.Panel',
	alias: 'widget.msgpanel',

/** Configuration */
	config: {
		layout: 'fit'
	},

	/**
	 * @construct
	 */
	initialize: function() {
		// call parent
		this.callParent(arguments);

		this.store = C.getStore('n_work');

		var tplIf = '<tpl if="packetid"> packet</tpl>';

		this.setItems([
			{
				xtype: 'list',
				store: this.store,
				itemTpl:
					'<div class="msg' + tplIf + '">' +
						'<div class="datetime">' +
							'<span class="date">{date}</span> ' +
							'<span class="time">{time}</span>' +
						'</div>' +
						'<div class="text">{message}</div>' +
					'</div>'
			}
		]);
		this.list = this.down('list');
	}
});