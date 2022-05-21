/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
C.define('O.comp.DeviceEvents', {
	extend: 'O.common.lib.events.Panel',
	alias: 'widget.eventsinfo',

/**
	* TODO: COMMENT THIS
	*/
	enableEvents: function() {
		this.callParent(arguments);
		this.on('resize', function(){
			this.doLayout();
		});
	},

/**
	* Get store
	*/
	getStore: function() {
		return Ext.create('EventDeviceStore');
	},

/**
	* TODO: COMMENT THIS
	*/
	addGrid: function() {
		this.store = Ext.create('EventDeviceStore');
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'gridpanel',
				store: this.store,
				layout: 'fit',
				autoHeight: true,
				columnLines: false,
				columns: [{
					header: this.evColumnDate,
					dataIndex: 'dt',
					width: 150,
					xtype: 'datecolumn',
					format: O.format.Timestamp
				}, {
					header: this.evColumnEventText,
					dataIndex: 'eventtext',
					sortable: false,
					flex: 1
				}],
				viewConfig: {
					emptyText: '<span class="emptyGrid">' +
						_('No events for the selected period') + '</span>'
				},
				trackMouseOver: false,
				enableColumnResize: false
			}],
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: this.store,
				dock: 'bottom',
				displayInfo: true
			}]
		});
	}
})
