/**
 *
 * @class O.dn.act.priceresponse.Editor
 * @extends C.ui.Panel
 */
C.define('O.dn.act.priceresponse.Editor', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesresponse_editor',

	title: 'Prices response contents',

	disabled: true,

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'pricesresponse_editorlist',
				flex: 1,
				split: true
			}, {
				xtype: 'splitter'
			}, {
				xtype: 'pricesresponse_editorlines',
				disabled: true,
				flex: 2
			}]
		});

		this.callParent(arguments);
	}

});
