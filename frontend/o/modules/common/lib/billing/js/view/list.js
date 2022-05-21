/**
 * @class O.lib.billing.List
 * @extends Ext.grid.Panel
 */
C.define('O.lib.billing.List', {
	extend: 'Ext.grid.Panel',

/** Translated fields */
	lngAddBtn: 'Create account',

	/*
	 * Имя модели и алиас для O.manager.Model
	 */
	model: 'Billing_Account',
	managerAlias: 'billing_account',

	initComponent: function() {
		Ext.apply(this, {
			border: false,
			hideHeaders: false,
			/**
				Temporary fix:

					split: false,
					width: 0,

				against

					hidden: true,

				If this panel is hidden there is an error when updating
				record via record.set('balance') or equal.
				Ext.view.Table.onUpdate function in core of ExtJS can not find
				dom element cause it is hidden and throw uncatchable exception

			 */
			split: false,
			width: 0,
			//hidden: true,
			columns: [{
				header: _('Number'),
				dataIndex: 'id',
				flex: 1
			}, {
				header: _('Balance'),
				dataIndex: 'balance',
				flex: 1,
				renderer: Ext.util.Format.ruMoney
			}]
		});
		this.callParent(arguments);
	}
});
