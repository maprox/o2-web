/**
 * @class Ext.ux.form.field.Address
 * @extends Ext.form.FieldSet
 */
Ext.define('Ext.ux.form.field.Address', {
	extend:'Ext.form.FieldSet',
	alias: 'widget.addressfield',

	addressId: null,

	initComponent: function() {
		var me = this;
		Ext.apply(this, {
			layout: 'anchor',
			padding: '0px',
			// Свойство border у fieldset-ов есть,
			// но оно почему-то бодро игнорируется
			style: 'border: none;',
			margin: '0px',
			items: [{
				xtype: 'numberfield',
				currentId: null,
				fieldLabel: this.fieldLabel,
				name: this.name,
				anchor: '93%',
				style: {
					'float': 'left'
				},
				allowBlank: true,
				readOnly: true,
				fieldStyle: 'opacity: 0.4;',
				processRawValue: function(value) {
					return this.currentId;
				},
				valueToRaw: function(value) {
					if (value) {
						this.currentId = value;
						var record = C.getStore("a_address").getById(value);
						if (record) {
							return record.get("fullname");
						} else {
							return '';
						}
					}
					return value;
				},
				getErrors: function(value) {
					return [];
				},
				getAddressId: function() {
					return this.currentId;
				},
				disableButton: function() {
					me.disableButton();
				},
				enableButton: function() {
					me.enableButton();
				}
			}, {
				xtype: 'button',
				text: '<img src="'+STATIC_PATH+'/img/edit.png" />',
				anchor: '7%',
				padding: '2px',
				handler: this.editAddress,
				scope: this
			}]
		});
		this.callParent(arguments);

		this.viewField = this.down('field[name=' + this.name + ']');
		this.button = this.down('button');
	},

/**
	* Create address editor window
	*/
	editAddress: function() {
		var window = Ext.create('O.lib.window.AddressEditor', {
			addressId: this.viewField.getAddressId()
		});

		// address window saved event handler
		window.on('saved', function(data) {
			C.getStore('a_address').addItem({id: data.id_address,
				fullname: data.fullname});
			this.viewField.setValue(data.id_address);
		}, this);
	},

/**
	* Disables editing button
	*/
	disableButton: function() {
		this.button.disable();
	},

/**
	* Enables editing button
	*/
	enableButton: function() {
		this.button.enable();
	}
});
