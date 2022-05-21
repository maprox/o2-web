/**
 * Класс панели настроек уведомлений<br/>
 * @class O.comp.settings.notification.Base
 * @extends O.comp.SettingsPanel
 */
C.define('O.comp.settings.notification.Base', {
	extend: 'O.comp.SettingsGrid',
	itemId: 'notification',

	idSetting: 'notification',

/** Language specific */
	title: 'Notification settings',
	tabTip: 'Editing means of notification',

	colActive: 'Active',
	colType: 'Notification type',
	colAddress: 'Address',
	colInformation: 'Information',
	colMedium: 'Medium',
	colHigh: 'High',
	colCritical: 'Critical',

	msgCreate: 'New notification means',
	msgEdit: 'Edit notification means',
	msgDelete: 'Delete notification means',
	msgConfirmation: 'Confirmation',
	msgAskDelete: 'Do you really want to delete selected notification means?',

	msgUnknownType: 'Incorrect messaging type',
	msgIncorrectEmail: 'Incorrect email',
	msgIncorrectPhone: 'Incorrect phone',

/**
	* Included panels
	**/
	includedPanels: [],

/**
	* @construct
	*/
	initComponent: function() {

		var me = this;

		this.allTypes = C.getStore('x_notification_setting_type');
		this.typesStore = C.getStore('x_notification_setting_type');

		this.buttonCreate = Ext.create('Ext.Action', {
			iconCls: 'n-create',
			text: me.msgCreate,
			handler: Ext.bind(me.actionCreate, me)
		});

		this.buttonEdit = Ext.create('Ext.Action', {
			iconCls: 'n-edit',
			text: me.msgEdit,
			disabled: true,
			handler: Ext.bind(me.actionEdit, me)
		});

		this.buttonDelete = Ext.create('Ext.Action', {
			iconCls: 'n-delete',
			text: me.msgDelete,
			disabled: true,
			handler: Ext.bind(me.actionDelete, me)
		});

		this.noticeForm = Ext.create('O.comp.settings.notice.Base');

		// notice form
		this.relayEvents(this.noticeForm, ['clientvalidation']);

		this.includedPanels.push(this.noticeForm);

		Ext.apply(this, {
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{
				xtype: 'grid',
				store: C.getStore('x_notification_setting'),
				border: false,
				flex: 1,
				columns: [{
					xtype: 'checkcolumn',
					text: this.colActive,
					dataIndex: 'active',
					flex: 1,
					editor: {
						xtype: 'checkbox',
						cls: 'x-grid-checkheader-editor'
					}
				}, {
					text: this.colType,
					dataIndex: 'id_type',
					flex: 2,
					renderer: function(value) {
						var record = me.allTypes.getById(value);

						if (Ext.isEmpty(record)) {
							return '';
						}

						return record.get('name');
					},
					editor: {
						allowBlank: false,
						xtype: 'combo',
						store: this.typesStore,
						displayField: 'name',
						valueField: 'id',
						queryMode: 'local',
						triggerAction: 'all',
						editable: false,
						forceSelection: true,
						listeners: {
							change: {
								fn: function(form, value) {
									var field = this.ownerCt.down('textfield[name="address"]');
									field.currentType = value;
									field.validate();
								}
							}
						}
					}
				}, {
					text: this.colAddress,
					dataIndex: 'address',
					flex: 4,
					editor: {
						validator: me.validateAddress,
						unknownValidator: me.msgUnknownType,
						validatorTypes: {
							1: {
								fn: Ext.form.field.VTypes.email,
								msg: me.msgIncorrectEmail
							},
							2: {
								fn: Ext.form.field.VTypes.phone,
								msg: me.msgIncorrectPhone
							},
							3: {
								fn: function() {return true;}
							},
							4: {
								fn: function() {return true;}
							}
						}
					}
				}, {
					xtype: 'checkcolumn',
					text: this.colInformation,
					dataIndex: 'information',
					flex: 1,
					editor: {
						xtype: 'checkbox',
						cls: 'x-grid-checkheader-editor'
					}
				}, {
					xtype: 'checkcolumn',
					text: this.colMedium,
					dataIndex: 'medium',
					flex: 1,
					editor: {
						xtype: 'checkbox',
						cls: 'x-grid-checkheader-editor'
					}
				}, {
					xtype: 'checkcolumn',
					text: this.colHigh,
					dataIndex: 'high',
					flex: 1,
					editor: {
						xtype: 'checkbox',
						cls: 'x-grid-checkheader-editor'
					}
				}, {
					xtype: 'checkcolumn',
					text: this.colCritical,
					dataIndex: 'critical',
					flex: 1,
					editor: {
						xtype: 'checkbox',
						cls: 'x-grid-checkheader-editor'
					}
				}],
				dockedItems: [{
					xtype: 'toolbar',
					items: [
						this.buttonCreate,
						this.buttonEdit,
						this.buttonDelete
					]
				}],
				selType: 'rowmodel',
				plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
					pluginId: 'editor',
					errorSummary: false,
					clicksToEdit: 2,
					autoCancel: false
				})]
			}, {
				// notice settings
				xtype: 'panel',
				title: _('Notice settings'),
				border: false,
				flex: 1,
				items: [this.noticeForm]
			}]
		});

		this.callParent(arguments);

		this.checkTypeField();

		this.getGrid().on({
			select: this.checkSelection,
			scope: this
		});

		this.getEditor().on({
			edit: this.checkSelection,
			canceledit: this.checkSelection,
			beforeedit: this.checkSelectionEdit,
			scope: this
		});

		this.getEditor().on({
			canceledit: me.removeIfNew,
			scope: this
		});

		this.getGridStore().on({
			update: this.checkTypeField,
			remove: this.checkTypeField,
			add: this.checkTypeField,
			scope: this
		});

		this.getGrid().on({
			select: this.checkTypeField,
			scope: this
		});
	},

	actionCreate: function() {
		var record = Ext.create('X.Notification.Setting');

		this.gridStore.add(record);
		this.editor.startEdit(record, this.grid.columns[1]);
		this.checkSelectionEdit();
	},

	actionDelete: function() {
		var sm = this.getGrid().getSelectionModel();
		if (sm.hasSelection()) {
			var record = sm.getSelection()[0];

			this.editor.cancelEdit();
			this.gridStore.remove(record);
			this.checkSelection();
		}
	},

	actionEdit: function() {
		var sm = this.getGrid().getSelectionModel();
		if (sm.hasSelection()) {
			var record = sm.getSelection()[0];

			this.editor.cancelEdit();
			this.editor.startEdit(record, 2);
			this.checkSelectionEdit();
		}
	},

	checkSelection: function() {
		var sm = this.getGrid().getSelectionModel();
		if (sm.hasSelection()) {
			this.buttonEdit.enable();
			this.buttonDelete.enable();
		} else {
			this.buttonEdit.disable();
			this.buttonDelete.disable();
		}

		this.buttonCreate.enable();
	},

	checkSelectionEdit: function() {
		this.buttonDelete.enable();
		this.buttonEdit.disable();
		this.buttonCreate.disable();
	},

	isValid: function() {
		var valid = true,
			singleTypes = {};
		this.getGridStore().each(function(record) {

			var idType = record.get('id_type');
			var type = this.allTypes.getById(idType);

			if (Ext.isEmpty(type)) {
				valid = false;
				return;
			}

			if (type.get('single')) {
				if (singleTypes[idType] == undefined) {
					singleTypes[idType] = true;
				} else {
					valid = false;
				}
			}
		}, this);
		return valid;
	},

	checkTypeField: function() {

		var data = this.allTypes.getRange();

		this.typesStore.removeAll();
		this.typesStore.loadData(data);

		var selected = this.getGrid().getSelectionModel().getSelection();
		var usedType = 0;

		if (selected[0] != undefined) {
			usedType = selected[0].get('id_type');
		}

		this.typesStore.each(function(item) {
			if (!item || (item.get('single') == false)) {
				return;
			}

			var id = item.get('id');

			if (this.getGridStore().find('id_type', id) != -1 &&
				id != usedType) {

				this.typesStore.remove(item);
			}
		}, this);
	},

	validateAddress: function(value) {
		var typeField
			= this.ownerCt.editingPlugin.editor.getForm().findField('id_type');

		this.currentType = typeField.getValue();

		//var record = this.ownerCt.editingPlugin.context.record;
		//if (record.get('id_type')) {
		//	this.currentType = record.get('id_type');
		//}

		var type = this.currentType;

		var	validator = this.initialConfig.validatorTypes[type],
			unknown = this.initialConfig.unknownValidator;

		if (validator == undefined) {
			return unknown;
		}

		if (!validator.fn(value)) {
			return validator.msg;
		}

		return true;
	},

	removeIfNew: function() {
		var sm = this.getGrid().getSelectionModel();
		if (sm.hasSelection) {
			var record = sm.getSelection()[0];
			if (record && record.get('id_type') == 0) {
				this.getGridStore().remove(record);
				this.checkSelection();
			}
		}
	}
});

Ext.data.StoreMgr.add('notification.base', {
	type: O.comp.settings.notification.Base,
	accessible: function() {
		return true;
	}
});
