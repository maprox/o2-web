C.define('O.comp.DDPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.ddpanel',

	/**
	 * Model name
	 * @type Ext.grid.Panel
	 */
	model: null,

	/**
	 * Proxy identifier
	 * @type String
	 */
	itemsName: null,

	titleEnabled: 'Enabled',
	titleAvailable: 'Available',
	/**
	 * Конструктор
	 * @constructs
	 * @param {Object} config Конфигурация панели
	 */
	initComponent: function() {
		Ext.apply(this, {
			itemId: this.itemsName + 'DDPanel',
			border: false,
			padding: '10',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			defaults: {
				border: false,
				flex: 1
			},
			items:[this.newGrid({
				title: this.titleEnabled,
				isGridAvailable: false
			}), {
				xtype: 'tbspacer',
				flex: null,
				width: 10
			}, this.newGrid({
				title: this.titleAvailable,
				isGridAvailable: true
			})]
		});
		this.callParent(arguments);
	},

	/**
	 * Создание нового списка
	 * @param {Object} config Конфигурация списка
	 * @return {Ext.grid.Panel} Список
	 */
	newGrid: function(config) {
		var selfType, otherType, storeConfig;
		if (config.isGridAvailable) {
			selfType = 'Available';
			otherType = 'Enabled';
			storeConfig = {
				autoLoad: true,
				listeners: {
					beforeload: this.reloadGrid,
					scope: this
				}
			}
		} else {
			otherType = 'Available';
			selfType = 'Enabled';
			storeConfig = {};
		}

		storeConfig.model = this.model;
		storeConfig.storeId = 'store' + this.itemsName + selfType;
		storeConfig.sorters = [{
			property: (storeConfig.model == 'X.User') ? 'shortname' : 'name'
		}];

		return Ext.create('Ext.grid.Panel', {
			title: config.title,
			itemId: 'grid' + this.itemsName + selfType,
			hideHeaders: true,
			multiSelect: true,
			border: true,
			xtype: 'gridpanel',
			viewConfig: {
				plugins: {
					ptype: 'gridviewdragdrop',
					dragGroup: 'grid' + this.itemsName + selfType,
					dropGroup: 'grid' + this.itemsName + otherType
				},
				listeners: {
					drop: Ext.bind(this.fireEvent, this, ['updated'])
				}
			},
			store: new Ext.data.Store(storeConfig),
			columns: [{
				dataIndex: (storeConfig.model == 'X.User') ?
					'shortname' : 'name',
				flex: 1
			}]
		});
	},

	/**
	 * Загрузка данных в список
	 */
	reloadGrid: function() {
		C.get(this.itemsName, function(rows) {
			var data = [];
			rows.each(function(r) {
				var record = {
					id: r.id,
					name: r.getName()
				};
				data.push(record);
			});
			var storeId = 'store' + this.itemsName + 'Available';
			Ext.StoreMgr.get(storeId).loadData(data);
			this.fireEvent(this.itemsName + '_loaded');
		}, this);
		return false;
	}
});