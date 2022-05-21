/**
 * @class O.dn.act.priceresponse.List
 */
C.utils.inherit('O.dn.act.priceresponse.List', {

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.addEvents(
			/**
			 * @event select
			 * Fires when payment response is selected
			 */
			'select',
			/**
			 * @event accept
			 * Fires when prices request is accepted
			 */
			'accept'
		);

		this.grid = this.down('gridpanel');

		if (this.grid) {

			this.grid.getSelectionModel().on({
				selectionchange: this.onGridSelectionChange,
				scope: this
			});

			this.gridStore = this.grid.getStore();
			this.gridStore.on({
				datachanged: this.onUpdate,
				scope: this
			});

		}

		this.btnAccept = this.down('#btnAccept');
		this.btnAccept.on('click', this.actionAccept, this);
	},

/**
	* TODO COMMENT THIS!
	*/
	onUpdate: function() {
		var record = this.getSelectedRecord();
		if (record) {
			this.switchButton(this.btnAccept, record.get('status'));
		}
	},

/**
	* Changes button appearance
	*/
	switchButton: function(btn, status) {
		btn.setText(_('Respond'));
		btn.setIconCls('a-accept');
		btn.actionType = 'accept';
		btn.disable();

		if (status == 2) {
			btn.enable();
		};

		if (status == 3) {
			btn.setText(_('Cancel response'));
			btn.setIconCls('a-delete');
			btn.actionType = 'cancel';
			btn.enable();
		};
	},

/**
	* Обработчик смены текущей строки грида
	*/
	onGridSelectionChange: function(sm, selections) {
		var record = this.getSelectedRecord();
		this.switchButton(this.btnAccept, record.get('status'));
		this.fireEvent('select', record);
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
	},

/**
	* TODO COMMENT THIS!
	*/
	actionAccept: function(btn) {
		var record = this.getSelectedRecord();
		if (!record) { return; }

		var askMsg = _('Do you really want to send selected prices response?');

		if (btn.actionType == 'cancel') {
			askMsg = _('Do you really want to cancel the response?');
		}
		var me = this;
		Ext.MessageBox.confirm(
			_('Confirmation'),
			askMsg,
			function(buttonId) {
				if (buttonId != 'yes') { return; }
				var status = 3;
				var event = 'accept';
				if (btn.actionType == 'cancel') {
					status = 2;
					event = 'cancel';
				}
				record.set('status', status);
				me.fireEvent(event, record);
			}
		);
	},

/**
	* TODO COMMENT THIS!
	*/
	markEdited: function(idRequest) {
		var result = this.gridStore.queryBy(function(record) {
			return record.get("id_request") == idRequest;
		});

		record = result.first();
		record.set('status', 2);
	},

/**
	* Data selection by id
	* @param {Intager} id Identifier
	*/
	selectById: function(id) {
		// all records
		var records = this.gridStore.getRange();
		// loop throw records
		var len = records.length;
		for (var i = 0; i < len; i++) {
			var record = records[i];
			if (record.getId() == id) {
				this.grid.getSelectionModel().select(i);
				break;
			}
		}
	},

/**
	* Data selection by request id
	* @param {Intager} id Request identifier
	*/
	selectByRequestId: function(id) {
		// all records
		var records = this.gridStore.getRange();
		// loop throw records
		var len = records.length;
		for (var i = 0; i < len; i++) {
			var record = records[i];
			if (record.get('id_request') == id) {
				this.grid.getSelectionModel().select(i);
				break;
			}
		}
	}
});
