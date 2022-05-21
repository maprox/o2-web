/**
 * @fileOverview Панель параметра отчета типа "Зона"
 *
 * @class O.reports.ZonePanel
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.reports.ZonePanel', {
	initComponent: function() {
		this.callOverridden(arguments);
		this.addEvents('validityChange');
		/*this.down('groupslist_objects').down('gridpanel').on('selectionchange',
			this.onSelectionChange, this);*/
		this.on('checkchange', this.onCheckChange, this);
	},

	/*
	 * При изменении выбранных зон
	 */
	/*onSelectionChange: function() {
		this.fireEvent('validityChange');
	},*/

	/*
	 * При изменении выбранных зон
	 */
	onCheckChange: function() {
		this.fireEvent('validityChange');
	},

	/*
	 * Анализируем валидность компонента
	 */
	isValid: function() {
		/*var selected = this.down('groupslist_objects').down('gridpanel').
			getSelectionModel().getSelection();*/
		var selected = this.getSelectedItems();
		return (selected.length > 0);
	},

	/**
	 * Возвращает выбранные зоны
	 * @return {Object}
	 */
	getValue: function() {
		if (this.paramName === undefined) return null;
		/*var selected = this.down('groupslist_objects').down('gridpanel').
			getSelectionModel().getSelection();
		//Формируем массив ID устройств
		var resultArray = [];
		Ext.each(selected, function(item){
			resultArray.push(item.data.id);
		}, this);*/
		var groups = this.getSelectedGroups();
		var objects = this.getSelectedObjects();
		//var resultArray = this.getSelectedItems();
		return [{
			paramName: 'x_group_mon_geofence',
			paramValue: groups
		}, {
			paramName: 'mon_geofence',
			paramValue: objects
		}]
	}
});