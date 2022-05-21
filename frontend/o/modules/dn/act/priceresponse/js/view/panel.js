/**
 *
 * @class O.dn.act.priceresponse.Panel
 * @extends C.ui.Panel
 */
C.define('O.dn.act.priceresponse.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_pricesresponse',

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
				xtype: 'pricesresponses_list',
				flex: 1,
				split: true
			}, {
				xtype: 'splitter'
			}, {
				flex: 5,
				xtype: 'pricesresponse_editor'
			}]
		});
		this.callParent(arguments);
	}

});
