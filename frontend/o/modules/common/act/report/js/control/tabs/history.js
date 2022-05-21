/**
 * @class O.common.act.report.tab.History
 */
C.utils.inherit('O.common.act.report.tab.History', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.currentReport = 0;
	},

/**
	* Report loading
	* @param {} report
	* @param {Boolean} reload
	*/
	loadReport: function(report, reload) {
		var tabHistory = this;
		if (!reload) {
			this.currentReport = report.id;
		}
		Ext.Ajax.request({
			url: '/reports/history',
			params: {id: this.currentReport},
			success: function(response) {
				var answer = Ext.JSON.decode(response.responseText);
				if (answer.success) {
					tabHistory.store.loadData(answer.data);
				}
			}
		});
	}
});