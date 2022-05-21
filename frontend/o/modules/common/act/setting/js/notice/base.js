/**
 * Класс панели настроек авторизации (смена пароля)<br/>
 * @class O.comp.settings.auth.Base
 * @extends O.comp.SettingsPanel
 */
C.define('O.comp.settings.notice.Base', {
	extend: 'O.comp.SettingsPanel',
	itemId: 'notice',

	initComponent: function() {
		var store = Ext.getStore('store-x_notification_importance');
		store.insert(0, {
			id: 0, name: _("Don't notify")
		});

		// конфигурация
		Ext.apply(this, {
			border: false,
			header: false,
			labelWidth: 100,
			defaultType: 'combobox',

			defaults: {
				width: 330,
				labelAlign: 'top',
				queryMode: 'local',
				editable: false,
				forceSelection: true,
				displayField: 'name',
				valueField: 'id',
				store: store
			},
			items: [{
				fieldLabel: _('Reaching payment threshold'),
				name: 'balance_limit',
				hidden: !C.userHasRight('billing_manager')
			}, {
				fieldLabel: _('Monthly acts sending'),
				name: 'monthly_act',
				hidden: !C.userHasRight('billing_manager')
			}, {
				fieldLabel: _('Changes of the account balance'),
				name: 'balance_change',
				hidden: !C.userHasRight('billing_manager')
			}]
		});
		this.callParent(arguments);
	},

/**
	* Returns user settings collection
	* @param {Function} fn - Callback function
	* @param {Object} scope - Callback function scope
	*/
	getSettings: function(fn, scope) {
		var me = this;

		C.get('x_notice', function(records, success) {
			// Load data
			var settings = new Ext.util.MixedCollection();
			records.each(function(record) {
				settings.add({
					id: record.alias,
					value: (record.id_importance || 0)
				});
			});

			fn.call(scope, settings, success);
		});

	},

/**
	 * Apply data
	 * @param {Array} data
	 */
	applyData: function(data) {
		if (data) {
			O.manager.Model.getProxy('x_notice').setDirty();
		}
		this.callParent(arguments);
	},

/**
	 * Get changed data
	 */
	getChangedData: function() {
		var data = this.callParent(arguments);
		return {id: 'x_notice', updated: data};
	}
});

Ext.data.StoreMgr.add('notice.base', {
	type: O.comp.settings.auth.Base,
	accessible: function() {
		return true;
	}
});
