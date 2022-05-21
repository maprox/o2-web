C.define('O.comp.FirmsTabTariffs', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.act-firmseditor-tab-tariffs',

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;

		Ext.apply(this, {
			store: Ext.create('Ext.data.Store', {
				storeId: 'firmTariffsEnabledStore',
				model: 'FirmTariffEnabled',
				data: [],
				sorters: ['name']
			}),
			hideHeaders: true,
			columns: [{
				xtype: 'checkcolumn',
				dataIndex: 'enabled',
				width: 28,
				editor: {
					xtype: 'checkbox',
					cls: 'x-grid-checkheader-editor'
				},
				listeners: {
					checkchange: function() {
						me.parent.changed();
					}
				}
			}, {
				dataIndex: 'name',
				flex: 1
			}, {
				dataIndex: 'individual',
				flex: 1,
				renderer: function(val) {
					return val ? _('Individual') : '';
				}
			}]
		});

		this.callParent(arguments);
	},

/**
	* Загрузка тарифов
	* @param Object record Объект записи фирмы
	*/
	loadTariffs: function(record) {
		C.get('tariffs', function(tariffs) {
			var data = [];
			tariffs.each(function(t) {
				data.push({
					id: t.id,
					name: t.name,
					enabled: Ext.Array.indexOf(record.data.tariffs, t.id) > -1,
					individual: t.individual
				});
			});
			Ext.getStore('firmTariffsEnabledStore').loadData(data);
		});
	},

/**
	* Получение массива идентификаторов возможных тарифов
	* @return Number[] Массив идентификаторов возможных тарифов
	*/
	getTariffs: function() {
		var data = [];
		var tariffs = Ext.getStore('firmTariffsEnabledStore').getRange();
		for (var i = 0, l = tariffs.length; i < l; i++)
			if (tariffs[i].data.enabled)
				data.push(tariffs[i].data.id);
		return data;
	}
});
