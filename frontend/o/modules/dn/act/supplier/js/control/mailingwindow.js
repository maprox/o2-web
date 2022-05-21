/**
 * @class O.dn.act.supplier.MailingWindow
 */
C.utils.inherit('O.dn.act.supplier.MailingWindow', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.btnSend = this.down('#btnSend');

		if (this.btnSend) {
			this.btnSend.on('click', 'submitForm', this);
		}

		var checkAll = this.down('#checkAll');
		var checkNone = this.down('#checkNone');
		var search = this.down('#supplierListSearch');
		this.subjectField = this.down('#subjectfield');
		this.textField = this.down('#textfield');

		if (this.subjectField) {
			this.subjectField.on('change', 'toggleButton', this);
		}

		if (this.textField) {
			this.textField.on('change', 'toggleButton', this);
		}

		if (this.supplierGrid) {
			this.supplierGrid.on('select', 'toggleButton', this);
			this.supplierGrid.on('deselect', 'toggleButton', this);
		}

		if (checkAll) {
			checkAll.on('click', this.doCheckAll, this);
		}

		if (checkNone) {
			checkNone.on('click', this.doCheckNone, this);
		}

		if (search) {
			search.on({
				specialkey: 'onSearchFieldSpecialKey',
				keyup: 'search',
				scope: this
			});
		}
	},

/**
	* Toggle submit button
	*/
	toggleButton: function() {
		var sm = this.supplierGrid.getSelectionModel();
		this.btnSend.setDisabled(
			(
				Ext.util.Format.stripTags(
					this.textField.getValue()
				).length === 0
					|| this.subjectField.getValue().length === 0
					|| sm.getSelection().length === 0
			)
		);
	},

/**
	* Check all action
	*/
	doCheckAll: function() {
		if (this.supplierGrid) {
			var sm = this.supplierGrid.getSelectionModel();
			if (sm) {
				sm.selectAll(true);
			}
		}
		this.toggleButton();
	},

/**
	* Check none action
	*/
	doCheckNone: function() {
		if (this.supplierGrid) {
			var sm = this.supplierGrid.getSelectionModel();
			if (sm) {
				sm.deselectAll(true);
			}
		}
		this.toggleButton();
	},

/**
	* Stores grid selection
	*/
	storeSelection: function(grid) {
		var sm = grid.getSelectionModel();
		if (!sm) { return; }
		var selection = sm.getSelection();
		if (!this.cachedSelection) {
			this.cachedSelection = selection;
		} else {
			grid.getStore().each(function(item) {
				if (sm.isSelected(item)) {
					if (Ext.Array.indexOf(this.cachedSelection, item) < 0) {
						this.cachedSelection.push(item);
					}
				} else {
					if (Ext.Array.indexOf(this.cachedSelection, item) >= 0) {
						Ext.Array.remove(this.cachedSelection, item);
					}
				}
			}, this);
		}
	},

/**
	* Restores grid selection
	*/
	restoreSelection: function(grid) {
		var sm = grid.getSelectionModel();
		if (!sm) { return; }
		if (this.cachedSelection) {
			sm.select(this.cachedSelection);
		}
	},

/**
	* Search field handler
	* @param {Ext.Component} field
	*/
	search: function(field) {
		var grid = this.supplierGrid;
		if (!grid) { return; }
		this.storeSelection(grid);
		var searchString = field.getValue();
		var regexp = null,
			pattern;
			pattern = Ext.String.escapeRegex(searchString)
				.replace(/\*/g, '.*')
				.replace(/%/g, '.*');
			var columnsCount = grid.columns.length;
		try
		{
			regexp = new RegExp(pattern, 'ig');
			var filter = new Ext.util.Filter({
				filterFn: function(item) {
					// i starts from 1, because the first column
					// of the grid is a selection checkbox
					for (var i = 1; i < columnsCount; i++) {
						var name = item.get(grid.columns[i].dataIndex) + '';
						if (name.match(regexp)) { return true; }
					}
					return false;
				}
			});
			grid.getStore().clearFilter();
			grid.getStore().filter(filter);
			this.restoreSelection(grid);
		}
		catch (e)
		{
			console.error('Error: Illegal regexp: ' + pattern);
			return;
		}
	},

/**
	* If user press 'Enter' we should search
	* @param {Ext.form.Field} field
	* @param {Ext.EventObject} e
	*/
	onSearchFieldSpecialKey: function(field, e) {
		if (e.getKey() == e.ENTER) {
			this.search(field.getValue());
		}
	},

/**
	* Form submission handler
	**/
	submitForm: function() {
		var me = this;
		// Collect data
		var suppliers = [];
		var sm = this.supplierGrid.getSelectionModel();
		var selection = sm.getSelection();

		Ext.Array.each(selection, function(item) {
			suppliers.push(item.get('id_firm_client'));
		});
		var form = this.form.getForm();
		this.btnSend.setDisabled(true);
		if (form.isValid()) {
			form.submit({
				url: '/dn_supplier/mailing',
				params: {
					'suppliers': Ext.JSON.encode(suppliers)
				},
				success: function(form, action) {
					O.msg.info(_('Your message has been queued for delivery'));
					me.destroy();
				},
				failure: function(form) {
					O.msg.error(_('Error. Please, try again later'));
					me.btnSend.setDisabled(false);
				}
			});
		}
	}
});