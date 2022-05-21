/**
 * Report choosing panel
 * @class O.common.act.report.Chooser
 * @extends C.ui.Panel
 */
C.define('O.common.act.report.Chooser', {
	extend: 'C.ui.Panel',
	alias: 'widget.common-report-chooser',

/**
	* @constructs
	*/
	initComponent: function() {
		this.reportStore = C.getStore('x_report');
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'grid',
				store: this.reportStore,
				columns: [
					{ header: 'Name',  dataIndex: 'name', flex: 1 }
				],
				id: 'reports-list',
				hideHeaders: true
			}]
		});
		this.callParent(arguments);
		// init variables
		this.radioGroup = this.down('radiogroup');
		this.reportsList = this.down('#reports-list');
	}
});