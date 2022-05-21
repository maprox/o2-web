/**
 * Offers panel view
 * @class O.act.dn.offer.Panel
 * @extends C.ui.Panel
 */
C.define('O.act.dn.offer.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_dn_offer',

/** Translated fields */
	lngSaveChangesTitle: 'Save changes?',
	lngSaveChangesText: 'Do you want to save changes?',

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;
		Ext.apply(this, {
			iconCls: 'offers',
			layout: 'border',
			items: [{
				xtype: 'dnofferlist',
				region: 'west',
				border: false,
				split: true,
				width: 300
			}, {
				xtype: 'dnoffertabs',
				region: 'center'
			}]
		});
		this.callParent(arguments);
		// init component links
		this.list = this.down('dnofferlist');
		this.tabs = this.down('dnoffertabs');
	}
});