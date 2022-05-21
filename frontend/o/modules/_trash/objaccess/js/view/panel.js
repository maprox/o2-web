/**
 *
 * @class O.lib.ObjectAccessList
 * @extends C.ui.Panel
 */
C.utils.define('O.lib.ObjectAccessList', {
	extend: 'C.ui.Panel',
	alias: 'widget.objectaccesslist',

	lngBtnSave: 'Save',
	lngBtnReset: 'Reset',
	lngBtnAdd: 'Grant access...',
	lngBtnRemove: 'Take away access',
	lngAccType: 'Access type',
	lngAccList: 'Firms with allowed access',
	lngAccessDenied: 'Shared access denied',
	lngDescrAccessDenied: 'Access denied to all users from another firms',
	lngAccessSelected: 'Allow access for users from selected firms',
	lngDescrAccessSelected: 'Access will be granted for users from firms ' +
		'which is in the right listbox',
	lngAccessAll: 'Accessible for all users',
	lngDescrAccessAll: 'All registered users have access',
	lngFirmNameColumn: 'Firm name',
	lngFirmINNColumn: 'Firm nalog number',
	lngSavingError: 'An error has occured during access rules saving.',
	lngSavingOk: 'Access rules successfully saved',
	lngLoadingError: 'n error has occured during access rules loading.',

/**
	* Component initialization
	*/
	initComponent: function() {
		/**
	 * Показывать ли кнопки "Сохранить" и сброс
	 */
		if (this.showSaveButton === undefined) {
			this.showSaveButton = true;
		}
		this.accTypeForm = Ext.create('Ext.form.Panel', {
			border: 0,
			bodyPadding: 5,
			items: [{
				xtype: 'radiofield',
				name: 'kindradio',
				itemId: 'rAccessDenied',
				checked: true,
				boxLabel: this.lngAccessDenied
			}, {
				xtype: 'displayfield',
				value: this.lngDescrAccessDenied,
				fieldCls: 'access-type-condition'
			}, {
				xtype: 'radiofield',
				name: 'kindradio',
				itemId: 'rAccessSelected',
				boxLabel: this.lngAccessSelected
			}, {
				xtype: 'displayfield',
				value: this.lngDescrAccessSelected,
				fieldCls: 'access-type-condition'
			}, {
				xtype: 'radiofield',
				name: 'kindradio',
				itemId: 'rAccessAll',
				hidden: true,
				boxLabel: this.lngAccessAll
			}, {
				xtype: 'displayfield',
				value: this.lngDescrAccessAll,
				hidden: true,
				fieldCls: 'access-type-condition'
			}]
		});

		this.firmsStore = Ext.create('Ext.data.Store', {
			fields: [
				{ name: 'name', type: 'string' },
				{ name: 'firmid', type: 'int'},
				{ name: 'inn', type: 'string' }
			],
			proxy: {
				type: 'memory'
			}
		});

		var	dockedItems = [{
			hidden: !this.showSaveButton,
			xtype: 'toolbar',
			items: [{
				xtype: 'button',
				itemId: 'btnSave',
				iconCls: 'access-list-save',
				text: this.lngBtnSave
			}, {
				xtype: 'button',
				itemId: 'btnReset',
				iconCls: 'access-list-reset',
				text: this.lngBtnReset
			}]
		}];

		Ext.apply(this, {
			layout: 'fit',
			title: this.title || _('Access'),
			iconCls: 'obj-access-list',
			items: [{
				xtype: 'panel',
				layout: 'border',
				items: [{
					xtype: 'panel',
					region: 'west',
					border: false,
					//title: this.lngAccType,
					items: [
						this.accTypeForm
					],
					width: 200
				}, {
					xtype: 'grid',
					store: this.firmsStore,
					columns: [
						{ header: this.lngFirmNameColumn, dataIndex: 'name', width: 200 },
						{ header: this.lngFirmINNColumn, dataIndex: 'inn', width: 200}
					],
					itemId: 'accessList',
					region: 'center',
					//border: false,
					//title: this.lngAccList,
					dockedItems: [{
						xtype: 'toolbar',
						items: [{
							xtype: 'button',
							itemId: 'btnGrantAccess',
							text: this.lngBtnAdd
						}, {
							xtype: 'button',
							itemId: 'btnRemoveAccess',
							disabled: true,
							text: this.lngBtnRemove
						}]
					}],
					disabled: true
				}]
			}],
			dockedItems: dockedItems
		});
		this.callParent(arguments);
	}

});