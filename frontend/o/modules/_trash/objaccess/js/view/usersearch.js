/**
 * @class O.lib.ObjectAccessList
 * @extends C.ui.Panel
 */
C.utils.define('O.lib.UserSearch', {
	extend: 'Ext.window.Window',
	alias: 'widget.usersearch',

	title: 'Search for user',
	lngBtnAdd: 'Add',
	lngBtnCancel: 'Cancel',
	lngFirstName: 'First name',
	lngSecondName: 'Second name',
	lngLastName: 'Last name',
	lngFirmName: 'Firm name',
	lngBtnSearch: 'Search',
	lngUserNameColumn: 'User name',
	lngUserFirmColumn: 'User firm',
/**
	* Component initialization
	*/
	initComponent: function() {
		//Форма для поиска
		this.accTypeForm = Ext.create('Ext.form.Panel', {
			border: 0,
			height: 150,
			region: 'north',
			frame: true,
			defaults: {
				anchor: '100%'
			},
			bodyPadding: 5,
			items: [{
				xtype: 'textfield',
				name: 'firstname',
				itemId: 'sFirstName',
				fieldLabel: this.lngFirstName
			}, {
				xtype: 'textfield',
				name: 'lastname',
				itemId: 'sLastName',
				fieldLabel: this.lngSecondName
			}, {
				xtype: 'textfield',
				name: 'secondname',
				itemId: 'sSecondName',
				fieldLabel: this.lngLastName
			}, {
				xtype: 'textfield',
				name: 'firmname',
				itemId: 'sFirmName',
				fieldLabel: this.lngFirmName
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
		//Хранилище списка пользователей - результатов поиска
		this.usersStore = Ext.create('Ext.data.Store', {
			fields: [
				{ name: 'name', type: 'string' },
				{ name: 'firmname', type: 'string' },
				{ name: 'userid', type: 'int'},
				{ name: 'userfirstname', type: 'int'},
				{ name: 'userlastname', type: 'int'},
				{ name: 'usersecondname', type: 'int'}
			],
			proxy: {
				type: 'ajax',
				url: '/users/search',
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
					itemId: 'usersList',
					layout: 'fit',
					border: 0,
					store: this.usersStore,
					columns: [
						{ header: this.lngUserNameColumn, dataIndex: 'name', width: 300 },
						{ header: this.lngUserFirmColumn, dataIndex: 'firmname', width: 300}
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
		this.addEvents('userAdded');
	}

});