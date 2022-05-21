/**
 *
 * @class O.act.panel.dn.SupplierList
 */
C.utils.inherit('O.act.panel.dn.SupplierList', {

/**
	 * @event select
	 * Fires when supplier is selected
	 * @param {O.act.panel.dn.SupplierList} this
	 * @param {Number} supplierId Identifier of a supplier
	 * @param {modelSupplierAccount} record Store record
	 */
/**
	 * @event beforeaction
	 * Fires before an action on supplier is executed
	 * @param {O.act.panel.dn.SupplierList} this
	 * @param {Strign} action Name of an action
	 *    Possible values are 'activated', 'removed'
	 * @param {Number} supplierId Identifier of a supplier
	 */
/**
	 * @event afteraction
	 * Fires when an action on supplier was finished
	 * @param {O.act.panel.dn.SupplierList} this
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
		this.on('afterrender', 'onAfterRender', this);
		this.grid.on('select', 'onRowSelect', this);
		this.btnActivate.setHandler(this.onClickBtnActivate, this);
		this.btnRemove.setHandler(this.onClickBtnRemove, this);
		this.btnRestore.setHandler(this.onClickBtnRestore, this);
		this.btnTrashed.on('toggle', 'onToggleBtnTrashed', this);
		this.on({
			beforeaction: function() {this.lock();},
			afteraction: function() {this.unlock();},
			scope: this
		});
		if (!this.loadTrashed) {
			this.gridStore.filter(this.filterFn);
		}
		var exportButtons = this.query('component[action=export-suppliers]');
		if (exportButtons && exportButtons.length) {
			Ext.each(exportButtons, function(btn) {
				btn.setHandler(this.printSuppliersList, this);
			}, this);
		}

		var exportElmaBtn = this.query('component[action=export-suppliers-elma]');
		if (exportElmaBtn) {
			exportElmaBtn[0].setHandler(this.exportSuppliersElma, this);
		}

		if (this.btnMailing) {
			this.btnMailing.on('click', this.showMailingWindow, this);
		}
	},

/**
	* Show mailing window
	*/
	showMailingWindow: function() {
		if (this.mailingWindow) {
			this.mailingWindow.destroy();
		}
		this.mailingWindow = Ext.widget('dn_supplier_mailingwindow');
		this.mailingWindow.show();
		this.mailingWindow.doCheckAll();
	},

/**
	*
	*/
	onToggleBtnTrashed: function() {
		var me = this;
		this.loadTrashed = !this.loadTrashed;
		if(this.loadTrashed) {
			this.gridStore.clearFilter();
		} else {
			this.gridStore.filter({
				filterFn: me.filterFn
			});
		}
	},

/**
	*
	*/
	filterFn: function(r) {
		return r.get('state') != 3;
	},

/**
	* After render actions
	* @protected
	*/
	onAfterRender: function() {
		this.gridStore.load();
		this.uiRepaint();
	},

/**
	* Repaints ui according to record data
	* @param {Ext.data.Model} record The selected record
	*/
	uiRepaint: function(record) {
		if (!record) {
			// if no account is selected, let's disable action buttons
			this.btnActivate.setVisible(false);
			this.btnRestore.setVisible(false);
			this.btnRemove.setVisible(false);
			return;
		}
		var status = record.get('state'),
			isDeleted = status == this.STATUS_TRASHED,
			isInactive = status === this.STATUS_INACTIVE,
			isDisabled = status === this.STATUS_DISABLED,
			isActive = status === this.STATUS_ACTIVE;
		this.btnRemove.setVisible(!isDeleted);
		this.btnRestore.setVisible(isDeleted);

		// Switch activate btn functionality
		this.btnActivate.setVisible(false);
		if (isActive) {
			this.btnActivate.setVisible(true);
			this.btnActivate.setText(_('Disable'));
			this.btnActivate.setIconCls('btn_dn_supplier_disable');
			this.btnActivate.actionType = 'disable';
		}

		if (isDisabled) {
			this.btnActivate.setVisible(true);
			this.btnActivate.setText(_('Enable'));
			this.btnActivate.setIconCls('btn_dn_supplier_activate');
			this.btnActivate.actionType = 'enable';
		}

		if (isInactive) {
			this.btnActivate.setVisible(true);
			this.btnActivate.setText(_('Activate'));
			this.btnActivate.setIconCls('btn_dn_supplier_activate');
			this.btnActivate.actionType = 'activate';
		}

	},

/**
	* Fired after a record is selected
	* @param {Ext.selection.RowModel} sm Selection model
	* @param {Ext.data.Model} record The selected record
	*/
	onRowSelect: function(sm, record) {
		this.uiRepaint(record);
		this.fireEvent('select', this, record.get('id_firm_client'), record);
	},

/**
	* Retuns selected record
	* @return {Ext.data.Model} The selected record | null if no selection
	*/
	getSelectedRecord: function() {
		return this.grid.getSelectionModel().getLastSelected();
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
					this.gridStore.load({
						callback: function(records, operation, success) {
							if (success) {
								var record = this.gridStore.findRecord(
									'id_firm_client', supplierId);
								var sm = this.grid.getSelectionModel();
								if (record) {
									sm.select(record);
								}
								this.uiRepaint(record);
								O.msg.info(_(this.lngActionDone[actionName]));
							}
							this.fireEvent('afteraction',
								this, actionName, supplierId, success);
						},
						scope: this
					});
				} else {
					this.fireEvent('afteraction',
						this, actionName, supplierId, false);
				}
			},
			scope: this
		});
	},

/**
	* Handler of clicking on button 'Activate'
	*/
	onClickBtnActivate: function() {
		var record = this.getSelectedRecord();
		if (!record) {return;}

		var action = this.btnActivate.actionType;
		var msg = '';
		if (action == 'activate') {
			msg = _('Are you sure you want to activate selected supplier?');
		}
		if (action == 'disable') {
			msg = _('Are you sure you want to disable selected supplier?');
		}
		if (action == 'enable') {
			msg = _('Are you sure you want to enable selected supplier?');
		}

		// request user confirmation
		O.msg.confirm({
			msg: msg,
			fn: function(buttonId) {
				if (buttonId != 'yes') {return;}
				this.processAction(action, record.get('id_firm_client'));
			},
			scope: this
		});
	},

/**
	* Handler of clicking on button 'Remove'
	*/
	onClickBtnRemove: function() {
		var record = this.getSelectedRecord();
		if (!record) {return;}
		// request user confirmation
		O.msg.confirm({
			msg: this.lngAskRemove,
			fn: function(buttonId) {
				if (buttonId != 'yes') {return;}
				this.processAction('remove', record.get('id_firm_client'));
			},
			scope: this
		});
	},

/**
	* Handler of clicking on button 'Remove'
	*/
	onClickBtnRestore: function() {
		var record = this.getSelectedRecord();
		if (!record) {return;}
		// request user confirmation
		O.msg.confirm({
			msg: this.lngAskRestore,
			fn: function(buttonId) {
				if (buttonId != 'yes') {return;}
				this.processAction('restore', record.get('id_firm_client'));
			},
			scope: this
		});
	},

/**
	* Exports supplier list
	* @param {Ext.Component} cmp
	*/
	printSuppliersList: function(cmp) {
		window.open(Ext.String.format("/reports/export?data={0}",
			escape(Ext.encode({
				report: '/reports/observer/docsnet/firmcard_1',
				format: cmp.outputFormat,
				params: {
					firmid: C.getSetting('f.id')
				}
			})))
		);
	},

/**
	* Export suppliers in XLS elma format
	*/
	exportSuppliersElma: function(cmp) {
		window.open("/reports/downloadxlselma");
	}

});