/**
 * @class O.lib.billing.tab.Act
 */
C.utils.inherit('O.lib.billing.tab.Act', {
/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		// load acts
		if (this.grid) {
			this.grid.getSelectionModel().on({
				selectionchange: 'onGridSelectionChange',
				scope: this
			});
		}
		if (this.btnPrint) {
			this.btnPrint.setDisabled(true);
			this.btnPrint.setHandler(this.printAct, this);
		}
		var canEditActs = C.userHasRight('dn_act', C.manager.Auth.$CAN_WRITE);
		if (this.btnCreate) {
			this.btnCreate.setHandler(this.createAct, this);
			this.btnCreate.setVisible(canEditActs);
		}
		if (this.btnDelete) {
			this.btnDelete.setDisabled(true);
			this.btnDelete.setHandler(this.deleteAct, this);
			this.btnDelete.setVisible(canEditActs);
		}
	},

/**
	* Loads history by account identifier
	* @param {Integer} accountId
	*/
	loadByAccountId: function(accountId) {
		if (this.selected && this.selected.get) {
			this.gridStore.getProxy().extraParams.$firm =
				this.selected.get('id_firm');
		}
		this.gridStore.load();
	},

/**
	* Open print window
	*/
	printAct: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		window.open(Ext.String.format("/reports/export?data={0}",
			escape(Ext.encode({
				report: '/reports/observer/docsnet/act',
				format: 'PDF',
				params: {
					actid: record.get('id')
				}
			})))
		);
	},

/**
	* Creates new act
	*/
	createAct: function() {
		if (!this.createactWindow) {
			this.createactWindow = Ext.widget('act-billing-createactwindow');
			this.createactWindow.on('aftercreate', 'onCreateAct', this);
		}
		if (this.selected && this.selected.get) {
			this.createactWindow.firmid = this.selected.get('id_firm');
		}
		this.createactWindow.show();
	},

/**
	* Handles act creation - refresh store data
	* @param {Ext.Component} sender
	* @param {Number} actId Act identifier
	* @private
	*/
	onCreateAct: function(sender, actId) {
		var me = this;
		this.gridStore.load(function() {
			me.selectById(actId);
		});
	},

/**
	* Selects record by its identifier
	* @param {Number} id
	*/
	selectById: function(id) {
		var index = this.gridStore.findExact('id', id);
		if (index) {
			var record = this.gridStore.getAt(index);
			var sm = this.grid.getSelectionModel();
			if (sm) {
				sm.select(record);
			}
		}
	},

/**
	* Deletes selected act
	*/
	deleteAct: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		O.msg.confirm({
			msg: _('Do you realy want to delete selected act?'),
			fn: function(buttonId) {
				if (buttonId != 'yes') { return; }
				this.gridStore.remove(record);
				this.gridStore.sync();
			},
			scope: this
		});
	},

/**
	* Обработчик смены текущей строки грида
	*/
	onGridSelectionChange: function(sm, selections) {
		var record = this.getSelectedRecord();
		if (this.btnPrint) {
			this.btnPrint.setDisabled(!record);
		}
		if (this.btnDelete) {
			this.btnDelete.setDisabled(!record);
		}
	},

/**
	* Возвращает текущую выбранную запись в гриде
	* @return {Object Ext.data.Model}
	*/
	getSelectedRecord: function() {
		var record = null;
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection) {
			record = sm.getSelection()[0];
		}
		return record;
	}
});
