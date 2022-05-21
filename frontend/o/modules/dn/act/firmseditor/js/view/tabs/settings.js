C.define('O.comp.FirmsTabSettings', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.act-firmseditor-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		var padding = 10;
		this.workerStore = C.getStore('x_user');
		Ext.apply(this, {
			bodyPadding: padding,
			layout: 'anchor',
			autoScroll: true,
			defaultType: 'textfield',
			items: [{
				xtype: 'fieldset',
				title: _('Contract'),
				defaults: {
					labelAlign: 'top',
					flex: 1
				},
				layout: 'hbox',
				items: [{
					xtype: 'textfield',
					name: this.prefix + 'contract.num',
					fieldLabel: _('Number')
				}, {
					xtype: 'tbspacer',
					width: padding,
					flex: null
				}, {
					xtype: 'datefield',
					format: O.format.Date,
					name: this.prefix + 'contract.dt',
					fieldLabel: _('Date')
				}]
			}, {
				name: this.prefix + 'disable_reason',
				fieldLabel: _('Disabling reason')
			}, {
				xtype: 'combobox',
				name: this.prefix + 'id_manager',
				itemId: 'managerCombobox',
				fieldLabel: _('Manager'),
				valueField: 'id',
				displayField: 'shortname',
				queryMode: 'local',
				editable: false,
				store: this.workerStore,
				triggerAction: 'all',
				lastQuery: ''
			}]
		});
		this.callParent(arguments);
	}
});
