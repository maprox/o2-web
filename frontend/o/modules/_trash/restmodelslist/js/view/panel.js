/**
 * Rest editor panel view
 * @class O.restmodellist.Panel
 * @extends O.act.ModelsEditor
 */

C.define('O.restmodellist.Panel', {
	extend: 'O.act.ModelsEditor',
	alias: 'widget.act_restmodeleditor',

	/**
	 * Классы для создания списка и области вкладок
	 */
	tabsClass: 'O.restmodellist.Tabs',
	listClass: 'O.restmodellist.List',

/**
	 * Имя модели и алиас для O.manager.Model
	 */
	model: '',
	managerAlias: '',

/**
	 * Builds base list and tabs
	 * @return {Ext.Component[]}
	 */
	getBaseItems: function() {
		// панель списка устройств
		this.list = Ext.create(this.listClass, {
			model: this.model,
			managerAlias: this.managerAlias,
			region: 'west',
			split: true,
			width: 300
		});

		// табпанель настройки устройства
		this.tabs = Ext.create(this.tabsClass, {
			model: this.model,
			managerAlias: this.managerAlias,
			region: 'center'
		});

		return [
			this.list,
			this.tabs
		];
	}
});
