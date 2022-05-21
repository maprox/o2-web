/**
   @copyright  2012, Maprox LLC <http://maprox.net>

   @author     Alexander Lyapko <sunsay@maprox.net>
   @author     Anton Grinin <agrinin@maprox.net>
   @author     Konstantin Pakshaev <kpakshaev@maprox.net>
*/

/**
 * @class O.lib.billing.tab.History
 */
C.utils.inherit('O.lib.billing.tab.History', {

/**
	* @constructs
	*//*
	initComponent: function() {
		this.callOverridden(arguments);
	},*/

/**
	* Loads history by account identifier
	* @param {Integer} accountId
	*/
	loadByAccountId: function(accountId) {
		this.gridStore.getProxy().extraParams = {
			accountId: accountId
		};

		this.gridStore.load();
		if (this.btnExport) {
			this.btnExport.setHandler(this.onExportClick, this);
		}
	},

/**
	* Reloads history using same account id
	*/
	loadCurrentId: function() {

		if (this.gridStore.getProxy().extraParams.accountId) {

			//if (this.grid.getView().loadMask) {
			//	this.grid.getView().loadMask.disable();
			//}

			var record = this.getSelectedRecord();
			this.lastSelectedIndex = (record) ?
				this.gridStore.indexOf(record) : null;

			this.gridStore.load({
				scope: this,
				callback: function() {
					if (this.lastSelectedIndex !== null) {
						this.grid.getSelectionModel().
							select(this.lastSelectedIndex);
					}
				}
			});

			//if (this.grid.getView().loadMask) {
			//	this.grid.getView().loadMask.enable();
			//}
		}
	},

/**
	* Returns current selected record in grid
	* @return {Object Ext.data.Model}
	*/
	getSelectedRecord: function() {
		var record = null;
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection) {
			record = sm.getSelection()[0];
		}
		return record;
	},

/**
	* Handles click on 'Export...' button
	* @private
	*/
	onExportClick: function() {
		if (!this.exportWindow) {
			this.exportWindow = Ext.widget('act-billing-exportwindow');
		}
		this.exportWindow.firmid = this.firmid;
		this.exportWindow.show();
	}
});
