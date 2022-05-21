/**
 * Warehouse manipulating functionality
 * ===============================
 *
 * Description goes here
 *
 * @class O.lib.map.Warehouse
 * @extends Ext.Base
 */

Ext.define('O.lib.map.Warehouse', {
	extend: 'Ext.Base',

	/**
	 * Initialization
	 */
	onAfterInit: function() {
		this.on('engineLoad', function(){
			this.getEngine().on({
				warehouse_moved: this.onWarehouseMoved,
				scope: this
			});
		});
	},

	/**
	 * Добавление маркера, связанного с объектом склада
	 * @param {Number} latitude Ширина координат склада
	 * @param {Number} longitude Долгота координат склада
	 */
	addWarehouse: function(latitude, longitude) {
		if (!this.isLoaded()) { return; }

		this.lastWarehouse = this.getEngine().addMarker({
			latitude: latitude,
			longitude: longitude,
			img: 'warehouse_icon'
		});
		this.getEngine().setCenter(latitude, longitude, false);
		this.startDrag();
	},

	/**
	 * Убирает маркер связанный с объектом склада
	 */
	removeWarehouse: function() {
		if (!this.isLoaded()) { return;	}

		this.endDrag();

		if (this.lastWarehouse) {
			this.lastWarehouse.destroy();
			delete this.lastWarehouse;
		}
	},

	/**
	 * Пробрасываем дальше
	 */
	onWarehouseMoved: function(lat, lon) {
		this.fireEvent('warehousemoved', lat, lon);
	},

	/**
	 * Переключает карту в режим drag
	 */
	startDrag: function() {
		if (!this.isLoaded()) { return; }
		this.getEngine().startDrag();
	},

	/**
	 * Завершает режим drag
	 */
	endDrag: function() {
		if (!this.isLoaded()) { return; }
		this.getEngine().endDrag();
	}
});