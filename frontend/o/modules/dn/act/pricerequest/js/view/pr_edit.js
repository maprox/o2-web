/**
 *
 * @class O.dn.act.pricerequest.Editor
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.Editor', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesrequest_editor',

	title: 'Prices request contents',

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
				xtype: 'pricesrequest_editorlist',
				flex: 1,
				split: true
			}, {
				xtype: 'splitter'
			}, {
				xtype: 'pricesrequest_editorlines',
				disabled: true,
				flex: 1
			}]
		});

		this.callParent(arguments);
		this.editorList = this.down('pricesrequest_editorlist');
		this.editorLines = this.down('pricesrequest_editorlines');
	}

});
