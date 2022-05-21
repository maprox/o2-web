/**
 *
 * @class O.lib.ObjectAccessList
 * @extends C.ui.Panel
 */
C.utils.define('O.lib.FirmSearch', {
	extend: 'Ext.window.Window',
	alias: 'widget.firmsearch',

	title: 'Search for organization',
	lngBtnAdd: 'Add',
	lngBtnCancel: 'Cancel',
	lngFirmName: 'Firm name',
	lngFirmINN: 'Firm nalog number',
	lngBtnSearch: 'Search',
	lngFirmNameColumn: 'Firm name',
	lngFirmINNColumn: 'Firm nalog number',
/**
	* Component initialization
	*/
	initComponent: function() {
		//Форма для поиска
		this.accTypeForm = Ext.create('Ext.form.Panel', {
			border: 0,
			height: 110,
			region: 'north',
			frame: true,
			defaults: {
				anchor: '100%'
			},
			bodyPadding: 5,
			items: [{
				xtype: 'textfield',
				name: 'firmname',
				itemId: 'sFirmName',
				fieldLabel: this.lngFirmName
			}, {
				xtype: 'textfield',
				name: 'firminn',
				itemId: 'sFirmINN',
				fieldLabel: this.lngFirmINN
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [{
					xtype: 'tbseparator'
				}, {
					xtype: 'button',
					iconCls: 'users_list_search',
					itemId: 'btnSearch',
					text: this.lngBtnSearch
				}]
			}]
		});
		//Хранилище списка организаций - результатов поиска
		this.firmsStore = Ext.create('Ext.data.Store', {
			fields: [
				{ name: 'name', type: 'string' },
				{ name: 'firmid', type: 'int'},
				{ name: 'inn', type: 'string'}
			],
			proxy: {
				type: 'ajax',
				url: '/x_firm/search',
				reader: {
					type: 'json',
					root: 'data'
				}
			},
			autoLoad: false
		});

		Ext.apply(this, {
			layout: 'border',
			width: 700,
			height: 400,
			modal: true,
			items: [
				this.accTypeForm,
				{
					region: 'center',
					xtype: 'grid',
					itemId: 'firmsList',
					layout: 'fit',
					border: 0,
					store: this.firmsStore,
					columns: [
						{ header: this.lngFirmNameColumn, dataIndex: 'name', width: 300 },
						{ header: this.lngFirmINNColumn, dataIndex: 'inn', width: 300}
					]
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [{
					xtype: 'tbseparator'
				}, {
					xtype: 'button',
					iconCls: 'users_list_add',
					disabled: true,
					text: this.lngBtnAdd,
					itemId: 'btnAdd'
				}, {
					xtype: 'button',
					iconCls: 'users_list_cancel',
					text: this.lngBtnCancel,
					itemId: 'btnCancel'
				}]
			}]
		});
		this.callParent(arguments);
		this.addEvents('firmAdded');
	}

});