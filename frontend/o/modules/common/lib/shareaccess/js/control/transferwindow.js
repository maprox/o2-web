/**
 * @class O.common.lib.shareaccess.TransferWindow
 */
C.utils.inherit('O.common.lib.shareaccess.TransferWindow', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);

		this.btnTransfer = this.down('#btnTransfer');
		this.btnCancel = this.down('#btnCancel');
		this.firmsList = this.down('#firmsList');
		this.checkboxShare = this.down('#checkboxShare');

		if (this.firmsList) {
			this.firmsList.on('selectionchange', this.onSelectionChange, this);
			this.firmsList.getStore().sort([{
				direction: 'ASC',
				property: 'firmname',
				root: 'data'
			}]);
		}

		if (this.btnTransfer) {
			this.btnTransfer.on('click', this.onTransfer, this);
		}

		if (this.btnCancel) {
			this.btnCancel.on('click', this.onCancel, this);
		}
	},

/**
	 * On selection change
	 */
	onSelectionChange: function(selectionModel, selected) {
		if (selected.length) {
			this.btnTransfer.enable();
		} else {
			this.btnTransfer.disable();
		}
	},

/**
	 * On cancel
	 */
	onCancel: function() {
		// Destroy this window
		this.destroy();
	},

/**
	 * On share
	 */
	onTransfer: function() {
		var firm = this.firmsList.getSelectedRecord();
		var me = this;
		this.setLoading(true);

		var data = {
			id: this.selectedObject.getId(),
			'$moveToFirm': {
				id_firm: firm.get('id'),
				share: +this.checkboxShare.getValue()
			}
		}

		O.manager.Model.set(this.managerAlias, data,
			function(success, object) {
				if (success) {
					O.msg.info(_('Object has been transfered'));
					me.destroy();
				} else {
					O.msg.error(_('Server error'));
				}
				// Disable loading
				this.setLoading(false);
			},
			this
		);


		return;

		// Old method, deprecated
		/*Ext.Ajax.request({
			url: '/x_firm/transferobject',
			method: 'PUT',
			params: {
				id_object: this.selectedObject.getId(),
				alias: this.managerAlias,
				id_firm: firm.get('id'),
				share: +this.checkboxShare.getValue()
			},
			success: function(response, opt) {
				var answer = C.utils.getJSON(response.responseText);

				if (answer.success) {
					O.msg.info(_('Object has been transfered'));
					me.destroy();
				} else {
					O.msg.error(_('Server error'));
				}
				me.setLoading(false);
			}
		});*/
	}
});