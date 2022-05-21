/**
 * Window for editing address
 * @class O.lib.window.AddressEditor
 * @extends Ext.window.Window
 */
C.define('O.lib.window.AddressEditor', {
	extend: 'Ext.window.Window',
	alias: 'window.addresseditor',

	width: 400,
	height: 300,

/**
	* @constructs
	*/
	initComponent: function() {
		this.streetStore = C.getStore('a_street'); // Street store
		this.cityStore = C.getStore('a_city'); // City store
		// Required asterisk
		this.required = '<span style="color:red;font-weight:bold"' +
			 'data-qtip="' + _('Required') + '">*</span>';
		Ext.ComponentMgr.each(function(id, item) {
			if (item.alias == "window.editaddress") {
				item.destroy();
			}
		});
		this.createSelects();
		this.createTextFields();
		this.createButtons();
		Ext.apply(this, {
			title: _('Address editor'),
			layout: {
				type: 'vbox',
				padding: '20px',
				align: 'stretch'
			},
			items: [
				this.countrySelect,
				this.citySelect,
				this.streetSelect,
				this.houseField,
				this.flatField,
				this.floorField,
				this.indexField,
				this.requiredText
			],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				layout: {
					type: 'hbox',
					pack: 'center'
				},
				items: [
					this.saveButton,
					this.cancelButton
				]
			}]
		});
		this.callParent(arguments);
		// init links
	},

/**
	* Creates combobox fields
	*/
	createSelects: function() {

		this.countrySelect = Ext.create('Ext.form.field.ComboBox', {
			labelWidth: 60,
			fieldLabel: _('Country'),
			afterLabelTextTpl: this.required,
			name: 'country',
			store: Ext.create('O.store.address.Country'),
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			invalidCls: '',
			forceSelection: true
		});

		this.citySelect = Ext.create('Ext.form.field.ComboBox', {
			labelWidth: 60,
			fieldLabel: _('City'),
			afterLabelTextTpl: this.required,
			name: 'city',
			store: this.cityStore,
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id_city',
			allowBlank: false,
			invalidCls: ''
		});

		this.streetSelect = Ext.create('Ext.form.field.ComboBox', {
			labelWidth: 60,
			fieldLabel: _('Street'),
			afterLabelTextTpl: this.required,
			store: this.streetStore,
			name: 'street',
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id_street',
			allowBlank: false,
			invalidCls: ''
		});
	},

/**
	* Creates text fields
	*/
	createTextFields: function() {
		this.houseField = Ext.create('Ext.form.field.Text', {
			labelWidth: 60,
			fieldLabel: _('House'),
			afterLabelTextTpl: this.required,
			allowBlank: false,
			invalidCls: '',
			name: 'house'
		});

		this.flatField = Ext.create('Ext.form.field.Text', {
			labelWidth: 60,
			fieldLabel: _('Flat'),
			name: 'flat'
		});

		this.floorField = Ext.create('Ext.form.field.Text', {
			labelWidth: 60,
			fieldLabel: _('Floor'),
			name: 'floor',
			vtype: 'intVal'
		});

		this.indexField = Ext.create('Ext.form.field.Text', {
			labelWidth: 60,
			fieldLabel: _('Index'),
			afterLabelTextTpl: this.required,
			allowBlank: false,
			name: 'index',
			invalidCls: '',
			vtype: 'intVal'
		});

		this.requiredText = Ext.create('Ext.form.field.Display', {
			value: _('Fields marked with (*) are required')
		});
	},

/**
	* Creates action buttons
	*/
	createButtons: function() {
		this.saveButton = Ext.create('Ext.button.Button', {
			text: _('Save'),
			disabled: true
		});
		this.cancelButton = Ext.create('Ext.button.Button', {
			text: _('Cancel')
		});
	}
});
