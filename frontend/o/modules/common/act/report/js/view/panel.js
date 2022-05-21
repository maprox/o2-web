/**
 * Reports panel
 * @class O.common.act.report.Panel
 * @extends C.ui.Panel
 */
C.define('O.common.act.report.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.reports',

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'border',
			items: [{
				title: _('Reports list'),
				collapsible: true,
				region: 'west',
				width: 500,
				split: true,
				stateId: 'reports_west',
				stateful: true,
				stateEvents: ['resize'],
				getState: function() {
					return {
						width: this.width
					};
				},
				layout: 'border',
				items: [{
					region: 'north',
					xtype: 'common-report-chooser',
					minHeight: 100,
					split: true,
					stateId: 'reports_reportschooser',
					stateful: true,
					stateEvents: ['resize'],
					getState: function() {
						return {
							height: this.height
						};
					}
				}, {
					region: 'center',
					xtype: 'common-report-settings',
					itemId: 'reportssettings',
					border: false,
					dockedItems: [{
						dock: 'top',
						xtype: 'toolbar',
						items: [{
							xtype: 'tbseparator'
						}, {
							itemId: 'btnGenerate',
							iconCls: 'generate',
							text: _('Generate'),
							disabled: true
						}]
					}]
				}]
			}, {
				region: 'center',
				xtype: 'common-report-preview',
				border: true
			}]
		});
		this.callParent(arguments);
		// init variables
		this.reports = this.down('common-report-chooser');
		this.params = this.down('common-report-settings');
		this.preview = this.down('common-report-preview');
		this.btnGenerate = this.down('#btnGenerate');
	}
});