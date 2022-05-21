/**
 *
 * @class O.act.panel.dn.SupplierInfo
 */
C.utils.inherit('O.act.panel.dn.SupplierInfo', {
/**
	 * @event beforeaction
	 * Fires before an action on supplier is executed
	 * @param {O.act.panel.dn.SupplierInfo} this
	 * @param {Strign} action Name of an action
	 *    Possible values are 'activated', 'removed'
	 * @param {Number} supplierId Identifier of a supplier
	 */
/**
	 * @event afteraction
	 * Fires when an action on supplier was finished
	 * @param {O.act.panel.dn.SupplierInfo} this
	 * @param {Strign} action Name of an action
	 *    Possible values are 'activated', 'removed'
	 * @param {Number} supplierId Identifier of a supplier
	 * @param {Boolean} success False if error occured
	 */

/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on({
			afterrender: this.onAfterRender,
			beforeaction: this.lock,
			afteraction: this.unlock,
			scope: this
		});
		if (this.btnPrintRequisites) {
			this.btnPrintRequisites.setHandler(this.printCompanyCard, this);
		}
		this.btnResetPassword.setHandler(this.onClickBtnResetPassword, this);
	},

/**
	* After render actions
	* @protected
	*/
	onAfterRender: function() {
		//this.setSupplier();
	},

/**
	* Loads data for a supplier
	* @param {Array} data Form data
	*/
	load: function(data, record) {
		this.firmId = data['id'];
		if (this.btnPrintRequisites) {
			this.btnPrintRequisites.setDisabled(!this.firmId);
		}
		this.formPanel.getForm().setValues(data);
		if (this.phoneStore) {
			if(data['phone'] == undefined) {
				data['phone'] = [{note: _('Phone is not specified')}];
			}
			this.phoneStore.loadData(data['phone']);
		}
		if (this.emailStore) {
			if(data['email'] == undefined) {
				data['email'] = [{note: _('Email is not specified')}];
			}
			this.emailStore.loadData(data['email']);
		}
		this.btnResetPassword.setVisible(record.get('state') == 1);
	},

/**
	* Opens a new window with a pdf report "Company card" in it
	*/
	printCompanyCard: function() {
		window.open(Ext.String.format("/reports/export?data={0}",
			escape(Ext.encode({
				report: '/reports/observer/docsnet/firmcard',
				format: 'PDF',
				params: {
					firmid: this.firmId
				}
			})))
		);
	},

/**
	* Handler of clicking on button 'ResetPassword'
	*/
	onClickBtnResetPassword: function() {
		// request user confirmation
		O.msg.confirm({
			msg: _('Do you want reset password for this supplier?'),
			fn: function(buttonId) {
				if (buttonId != 'yes') {return;}
				this.processAction('resetpassword', this.firmId);
			},
			scope: this
		});
	},

/**
	* Sends an AJAX request to the server
	* @param {String} actionName Name of an action
	* @param {Number} supplierId Identifier of a supplier
	*/
	processAction: function(actionName, supplierId) {
		this.fireEvent('beforeaction', this, actionName, supplierId);
		Ext.Ajax.request({
			url: '/dn_supplier/action',
			params: {
				data: Ext.JSON.encode({
					action: actionName,
					supplier: supplierId
				})
			},
			callback: function(opts, success, response) {
				// server response
				var answer = C.utils.getJSON(response.responseText, opts);
				if (answer.success) {
					O.msg.info(_('The password has been reset'));
					this.fireEvent('afteraction',
								this, actionName, supplierId, success);
				} else {
					this.fireEvent('afteraction',
						this, actionName, supplierId, false);
				}
			},
			scope: this
		});
	}
});
