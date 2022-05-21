/*
 * @class O.mon.act.map.Drivers
 */
C.define('O.mon.act.map.Drivers', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.mapdrivers',

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {

		this.driversStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name', 'sdt', 'edt'],
			sorters: [{
				property: 'sdt',
				direction: 'DESC'
			}]
		});

		// Thumb template
		var thumbTpl = new Ext.XTemplate(
			'<div class="driver-thumbs">',
			'<tpl for=".">',
				'<div class="data">',
					'<a href="/mon_vehicle/attachment/{id}"',
					'title="{name}" target="_blank">',
						'{[this.convertName(values.name)]}',
					'</a>',
				'</div>',
			'</tpl>',
			'<div style="clear: both"> </div>',
			'</div>',
			{
				convertName: function(name) {
					var maxLen = 40;
					var append = '';
					if (name.length > maxLen) {
						append = '...';
					}
					return name.substring(0, maxLen) + append;
				}
			}
		);

		Ext.apply(this, {
			title: _('Drivers'),
			iconCls: 'drivers_ico',
			layout: 'fit',
			border: false,
			items: [{
				xtype: 'dataview',
				store: this.driversStore,
				tpl: thumbTpl,
				itemSelector: 'div.driver-thumb',
				emptyText: '<span class="emptyGrid drivers">' +
					_('No drivers assigned') +
				'</span>',
				deferEmptyText: false
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'button',
					itemId: 'driverAssign',
					iconCls: 'btn-driver-assign',
					text: _('Assign...')
				}, {
					xtype: 'button',
					itemId: 'driverDismiss',
					iconCls: 'btn-driver-dismiss',
					text: _('Dismiss')
				}, {
					xtype: 'button',
					itemId: 'driverDelete',
					iconCls: 'btn-driver-delete',
					text: _('Delete')
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
	}
})
