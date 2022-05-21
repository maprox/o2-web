/**
 * Класс панели настроек предприятия<br/>
 * @class O.comp.settings.firm.Base
 * @extends O.comp.SettingsPanel
 */
C.define('O.comp.settings.firm.Base', {
	extend: 'O.comp.SettingsPanel',
	itemId: 'firm',

/**
	* @construct
	*/
	initComponent: function() {
		var w = 600;
		Ext.apply(this, {
			title: _('Company settings'),
			layout: {
				type: 'anchor'
			},
			defaults: {
				width: w,
				collapsible: true,
				defaultType: 'textfield'
			},
			items: [{
				xtype: 'fieldset',
				title: _('Base settings'),
				defaults: {
					anchor: '100%',
					labelWidth: 140,
					queryMode: 'local',
					editable: false,
					triggerAction: 'all'
				},
				items: [{
					xtype: 'iconcombo',
					store: C.getStore('x_lang'),
					valueField: 'id',
					displayField: 'display',
					iconClsField: 'alias',
					name: 'f.lng',
					fieldLabel: _('UI Language')
				}, {
					xtype: 'combobox',
					store: 'store-utc',
					valueField: 'utcid',
					displayField: 'utcname',
					name: 'f.utc',
					itemId: 'futc',
					fieldLabel: _('Time zone')
				}]
			}, {
				xtype: 'fieldset',
				title: _('Requisites'),
				items: [{
					defaults: {
						width: w - 24
					},
					xtype: 'companyrequisites'
				}]
			}]
		});
		this.callParent(arguments);

		this.panelRequisites = this.down('companyrequisites');
		this.panelRequisites.on({
			addresschanged: this.onAddressChanged,
			scope: this
		});

		this.on('enable', this.applyData, this);
	},

/**
	* Fill in the form panel fields
	* @protected
	*/
	applyData: function() {
		this.callParent(arguments);
	}
});

Ext.data.StoreMgr.add('firm.base', {
	type: O.comp.settings.firm.Base,
	accessible: function() {
		return (C.getSetting('f.individual') != 1) &&
			C.userHasRight('module_settings_firm');
	}
});
