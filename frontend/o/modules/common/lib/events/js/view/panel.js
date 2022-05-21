/**
 *
 * @class O.common.lib.events.Panel
 * @extends Ext.panel.Panel
 */
C.utils.define('O.common.lib.events.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.common-lib-events-panel',

/**
	* @event loaded
	* Завершение загрузки событий
	* @param {Date} sdt Начало периода
	* @param {Date} edt Конец периода
	* @param {Object} data Загруженный массив данных
	*/
	border: false,

/**
	* Текущий период отображения событий
	* Является JSON-объектом из двух полей: {sdt: Date, edt: Date}
	* @type Object
	* @private
	*/
	period: null,

	evColumnEventText: 'Event text',
	evEmpty: 'No events for chosen period',

/**
	* Get store
	*/
	getStore: function() {
		return 'storeEvents';
	},
/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		var me = this;
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'gridpanel',
				store: me.getStore(),
				layout: 'fit',
				cls: 'wrappedgrid',
				border: false,
				columnLines: false,
				columns: [{
					header: _('Date'),
					dataIndex: 'dt',
					width: 150,
					fixed: true,
					xtype: 'datecolumn',
					format: O.format.Timestamp
				}, {
					header: this.evColumnEventText,
					dataIndex: 'eventtext',
					sortable: false,
					flex: 1
				}],
				viewConfig: {
					emptyText: this.evEmpty
				},
				trackMouseOver: false,
				//disableSelection: true,
				enableColumnResize: false
			}],
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: me.getStore(),
				dock: 'bottom',
				displayInfo: true
			}]
		});
		this.callParent(arguments);
		// init variables
		this.grid = this.down('gridpanel');
	}
});
