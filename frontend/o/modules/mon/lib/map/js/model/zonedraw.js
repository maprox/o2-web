/**
 * Geofence drawing functionality
 * ===============================
 *
 * Description goes here
 *
 * @class O.lib.map.ZoneDraw
 * @extends Ext.Base
 */

Ext.define('O.lib.map.ZoneDraw', {
	extend: 'Ext.Base',

	onAfterInit: function() {
		this.on('engineLoad', function(){
			this.getEngine().on({
				pointAdded: this.pointAdded,
				scope: this
			});
		});
	},

	/**
	 * Движок сообщил об окончании рисования геозоны
	 */
	pointAdded: function(params) {
		if (!this.isLoaded()) { return; }
		this.fireEvent('pointAdded', params);
	},

	/**
	 * Начало рисования заданного примитива
	 * @param {string} primitive - название примитива
	 */
	startDrawing: function(primitive) {
		var engine = this.getEngine();
		if (!engine) { return; }
		engine.checkResize();
		engine.startDrawing(primitive);
	},

	/**
	 * Выход из режима рисования
	 */
	stopDrawing: function() {
		var engine = this.getEngine();
		if (!engine) { return; }
		engine.stopDrawing();
	},


	/**
	 * Изменение типа рисуемого примитива
	 * @param {string} primitive - название примитива
	 */
	changeDrawingPrimitive: function (primitive) {
		var engine = this.getEngine();
		if (!engine) { return; }
		engine.stopDrawing();
		engine.checkResize();
		engine.startDrawing(primitive);
	},

	/**
	 * Смена цвета рисуемой геозоны
	 */
	changeDrawingColor: function(color) {
		var engine = this.getEngine();
		if (!engine) { return; }
		engine.changeDrawingColor(color);
	},

	/**
	 * Возвращает массив точек фигуры, находящихся в редакторе
	 */
	getPointsArray: function() {
		if (!this.isLoaded()) { return {}; }
		return this.getEngine().getPointsArray();
	}
});