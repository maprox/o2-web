/*
 * @class O.comp.CoordsWindow
 * @extends Ext.window.Window
 */
C.define('O.mon.lib.packetinfo.CoordsWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.coordswindow',

/**
	* @constructor
	*/
	initComponent: function() {

		var form = Ext.widget('form', {
			bodyPadding: 10,
			preventHeader: true,
			border: false,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			defaults: {
				labelAlign: 'top',
				border: false
			},
			items: [{
				xtype: 'textfield',
				regex: this.getCoordRegex(),
				itemId: 'latitude',
				value: this.latitude || '',
				allowBlank: false,
				minLength: 1,
				fieldLabel: _('Latitude'),
				name: 'lat'
			}, {
				xtype: 'textfield',
				regex: this.getCoordRegex(),
				itemId: 'longitude',
				value: this.longitude || '',
				allowBlank: false,
				minLength: 1,
				fieldLabel: _('Longitude'),
				name: 'lon'
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [{
					xtype: 'tbfill'
				}, {
					itemId: 'btnSet',
					disabled: true,
					formBind: true,
					xtype: 'button',
					text: _('Save coordinates')
				}, {
					itemId: 'btnCancel',
					disabled: false,
					xtype: 'button',
					text: _('Cancel')
				}]
			}]
		});
		this.form = form;

		Ext.apply(this, {
			title: _('Set coordinates'),
			width: 370,
			border: false,
			resizable: true,
			modal: true,
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'panel',
				layout: 'fit',
				flex: 2,
				items: [form]
			}]
		});

		this.callParent(arguments);
	},

/**
	* Returns coord regex
	*/
	getCoordRegex: function() {
		return /^-?\d{1,3}[.]\d+$/i;
	}
});