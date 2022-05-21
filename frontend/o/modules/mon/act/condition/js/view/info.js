/**
 * @class O.mon.act.condition.Info
 * @extends Ext.panel.Panel
 */
C.define('O.mon.act.condition.Info', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.mon-condition-info',

	/**
	 * Component initialization
	 */
	initComponent: function() {

		Ext.apply(this, {
			title: _('Information'),
			items: [{
				xtype: 'header',
				itemId: 'name',
				width: '100%',
				cls: 'condition-item-name'
			}, {
				xtype: 'grid',
				itemId: 'state',
				columns: [{
					dataIndex: 'name',
					fixed: false,
					sortable: false,
					menuDisabled: true,
					flex: 1
				}, {
					dataIndex: 'value',
					fixed: false,
					sortable: false,
					menuDisabled: true,
					flex: 1
				}],
				store: new O.mon.condition.StateStore(),
				hideHeaders: true
			}, {
				xtype: 'grid',
				itemId: 'error',
				title: 'Ошибки',
				columns: [{
					fixed: false,
					sortable: false,
					menuDisabled: true,
					dataIndex: 'code',
					flex: 1
				}, {
					fixed: false,
					sortable: false,
					menuDisabled: true,
					dataIndex: 'text',
					flex: 5,
					renderer: function(value){
						return display = '<span style="white-space:normal">' + value + '</span>';
					}
				}],
				store: new O.mon.condition.ErrorStore(),
				hideHeaders: true
			}]
		});

		this.callParent(arguments);

		this.name = this.down('#name');
		this.state = this.down('#state');
		this.error = this.down('#error');
	}
});