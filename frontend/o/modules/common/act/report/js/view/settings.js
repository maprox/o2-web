/**
 * Report params panel
 * @class O.common.act.report.Settings
 * @extends O.ui.TabPanel
 */

C.define('O.common.act.report.Settings', {
	extend: 'O.ui.TabPanel',
	alias:'widget.common-report-settings',

	initComponent: function() {
		Ext.apply(this, {
			items: this.createTabs()
		});
		this.callParent(arguments);
		this.on('afterrender', this.onAfterRender, this);
	},

	/*
	 * Создание вкладок параметров отчета
	 */
	createTabs: function() {
		var reportsSettings = this;
		this.paramsTab = Ext.create('O.reports.Params', {
			title: _('Parameters'),
			listeners: {
				paramsloaded: function() {
					reportsSettings.fireEvent('paramsloaded');
				}
			}
		});
		this.descriptionTab = Ext.widget('common-report-tab-description', {
			title: _('Description'),
			itemId: 'description'
		});
		this.historyTab = Ext.widget('common-report-tab-history', {
			title: _('History'),
			itemId: 'history'
		});
		return [
			this.paramsTab,
			//this.descriptionTab,
			this.historyTab
		];
	}
});
