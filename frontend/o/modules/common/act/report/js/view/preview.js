/**
 * Report preview panel
 * @class O.common.act.report.Preview
 * @extends C.ui.Panel
 */
C.define('O.common.act.report.Preview', {
	extend: 'C.ui.Panel',
	alias: 'widget.common-report-preview',

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			autoScroll: true,
			cls: 'preview',
			html: '<div style="padding:10px">' +
				_('Report HTML preview') + '</div>',
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				action: 'export',
				items: [_('Export') + ':', {
					text: 'PDF',
					iconCls: 'fmt-pdf',
					handler: this.exportHandler('PDF')
				}, {
					text: 'XLS',
					iconCls: 'fmt-xls',
					handler: this.exportHandler('XLS')
				}/*, {
					text: 'RTF',
					iconCls: 'fmt-rtf',
					disabled: true,
					handler: this.exportHandler('RTF')
				}, {
					text: 'CSV',
					iconCls: 'fmt-csv',
					disabled: true,
					handler: this.exportHandler('CSV')
				}, {
					text: 'ODS',
					iconCls: 'fmt-ods',
					handler: this.exportHandler('ODS')
				}, {
					text: 'ODT',
					iconCls: 'fmt-odt',
					handler: this.exportHandler('ODT')
				}*/]
			}]
		});
		this.callParent(arguments);
		this.getToolbar().disable();
	},

/**
	* Returns top toolbar
	* @return {Ext.toolbar.Toolbar}
	*/
	getToolbar: function() {
		var a = this.getDockedItems('toolbar[action=export]');
		return (a.length > 0) ? a[0] : {
			disable: Ext.emptyFn,
			enable: Ext.emptyFn
		};
	},

/**
	* Returns a function wich should handle export in supplied format
	* @param {String} format Report format alias
	*/
	exportHandler: function(format) {
		// Must be rewriten by child class
		return Ext.emptyFn;
	}

});