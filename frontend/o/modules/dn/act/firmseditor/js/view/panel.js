/**
 *
 * FirmsEditor panel view
 * @class FirmsEditor
 * @extends C.ui.Panel
 */
C.define('O.act.FirmsEditor', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.act_firmseditor',

	model: 'X.Firm',
	managerAlias: 'x_firm',
	tabsAliases: [
		'x-company-tab-props',
		'x-company-tab-manager',
		'x-company-tab-contacts',
		'x-company-tab-bank',
		'act-firmseditor-tab-settings',
		'act-firmseditor-tab-billing',
		'act-firmseditor-tab-usereditor',
		'act-firmseditor-tab-device'//,
//		'dn-warehouse',
//		'act-firmseditor-tab-tariffs'
	],

	listConfig: {
		columns: [{
			dataIndex: 'company.name',
			flex: 1,
			field: {
				allowBlank: false
			}
		}]
	},

/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.list.gridStore.sort([{
			property : 'firmname',
			direction: 'ASC'
		}]);
	},

/**
	* Returns individual tabs config objects
	* @return Object[]
	*/
	getTabsParams: function() {
		return {
			'x-company-tab-props': {
				prefix: 'company.',
				iconCls: 'firmseditor_props'
			},
			'x-company-tab-manager': {
				prefix: 'company.',
				iconCls: 'firmseditor_manager'
			},
			'x-company-tab-contacts': {
				prefix: 'company.',
				iconCls: 'firmseditor_contacts'
			},
			'x-company-tab-bank': {
				prefix: 'company.',
				iconCls: 'firmseditor_bank'
			},
			'act-firmseditor-tab-settings': {
				iconCls: 'firmseditor_settings',
				title: _('Settings')
			},
			'act-firmseditor-tab-billing': {
				condition: C.userHasRight('module_billing') &&
					C.userHasRight('admin_billing_account'),
				iconCls: 'firmseditor_billing',
				title: _('Billing')
			},
			'act-firmseditor-tab-usereditor': {
				condition: C.userHasRight('admin_user'),
				iconCls: 'firmseditor_users',
				title: _('Users')
			},
			'act-firmseditor-tab-device': {
				condition: C.userHasRight('admin_device'),
				iconCls: 'firmseditor_device',
				title: _('Devices')
			},
			'dn-warehouse': {
				condition: C.userHasRight('Dn.Warehouse.Admin'),
				title: _('Warehouses')
			},
			'act-firmseditor-tab-tariffs': {
				condition: C.userHasRight('admin_tariff'),
				iconCls: 'firmseditor_tariffs',
				title: _('Tariffs')
			}
		};
	}
});
