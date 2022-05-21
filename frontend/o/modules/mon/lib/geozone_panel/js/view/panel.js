/**
 *
 * @class O.comp.GeozonePanel
 * @extends Ext.form.Panel
 */
C.define('O.comp.GeozonePanel', {
	extend: 'Ext.form.Panel',
	alias: 'widget.geozonepanel',

	preventHeader: true,
	minWidth: 300,
	minHeight: 200,

	centerLat: 0.0,
	centerLon: 0.0,

/** Language specific */
	msgHelp: 'Draw geozone in the map below. ' +
		'Make points with double click and move points with mouse. ' +
		'You can drag center of each line to make more vertex.',

/*
	* Show/hide save and cancel buttons
	* @type Boolean
	*/
	showButtons: true,

/**
	* False to allow save geofence without coordinates
	* @type Boolean
	*/
	notEmptyPoints: false,

/**
	* @constructs
	*/
	initComponent: function() {
		var padding = 10;
		Ext.apply(this, {
			cls: 'map-geozone-panel',
			bodyPadding: padding,
			autoHeight: true,
			defaults: {
				labelAlign: 'top',
				anchor: '100%'
			},
			layout: {
				type: 'vbox',
				align: 'stretch'  // Child items are stretched to full width
			},
			items: [{
				xtype: 'textfield',
				itemId: 'fieldName',
				fieldLabel: _('Name'),
				name: 'name',
				allowBlank: false
			}, {
				xtype: 'cpicker',
				itemId: 'fieldColor',
				fieldLabel: _('Color'),
				name: 'color'
			}, {
				xtype: 'textarea',
				itemId: 'fieldAddress',
				fieldLabel: _('Address'),
				name: 'address'
			}, {
				xtype: 'textarea',
				itemId: 'fieldNote',
				fieldLabel: _('Note'),
				name: 'note'
			}, {
				xtype: 'fieldcontainer',
				fieldLabel: _('Area type'),
				defaultType: 'radiofield',
				layout: 'hbox',
				defaults: {
					flex: 1,
					name: 'id_type'
				},
				items: [{
					boxLabel: _('Polygon'),
					inputValue: O.mon.model.Geofence.TYPE_POLYGON,
					checked: true,
					itemId: 'radio_polygon'
				}, {
					boxLabel: _('Circle'),
					inputValue: O.mon.model.Geofence.TYPE_CIRCLE,
					itemId: 'radio_circle'
				}]
			}, {
				border: false,
				html: this.msgHelp,
				cls: 'tiptext',
				padding: padding
			}]
		});

		if (this.showButtons) {
			Ext.apply(this, {
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'bottom',
					items: [{
						xtype: 'button',
						text: _('Save'),
						disabled: true,
						iconCls: 'btn-save',
						itemId: 'btnSave'
					}, {
						xtype: 'button',
						text: _('Cancel'),
						iconCls: 'btn-cancel',
						itemId: 'btnCancel'
					}]
				}]
			});
		}

		this.callParent(arguments);

		// init variables
		this.btnSave = this.down('#btnSave');
		this.btnCancel = this.down('#btnCancel');
		this.fieldName = this.down('#fieldName');
		this.fieldColor = this.down('#fieldColor');
		this.rbGeofenceTypeCircle = this.down('#radio_circle');
		this.rbGeofenceTypePolygon = this.down('#radio_polygon');
	}
});