/**
 * Msg Panel
 * @class
 * @override
 */
Ext.define('O.app.view.MsgPanelControl', {
	override: 'O.app.view.MsgPanel',

	/**
	 * @construct
	 * @override
	 */
	initialize: function() {
		// call overridden
		this.callParent(arguments);
		this.list.on({
			itemtap: this.onListItemTap,
			scope: this
		});
		this.store.on({
			add: this.sort,
			scope: this
		});
		this.sort();
	},

	sort: function() {
		this.store.sort('dt', 'DESC');
	},

	onListItemTap: function(list, index) {
		var data = this.store.getAt(index).data;
		if (data) {
			this.store.removeAt(index);
			// без сортировки позже неправильно считает индексы
			this.sort();
			Ext.Ajax.request({
				url: '/n_work/remove',
				params: {
					data: Ext.JSON.encode({
						id: data.id
					})
				}
			});
			// переход на вкладку карты
			if (data.packetid) {
				O.ui.Desktop.callModule('map', {showwork: data});
			}
			this.fireEvent('removed', this.count());
		}
	},

	count: function() {
		return this.store.count();
	}
});