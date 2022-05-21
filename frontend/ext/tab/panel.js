/**
 * @class Ext.tab.Panel
 */

C.utils.inherit('Ext.tab.Panel', {
	/**
	 * Получение индекса активной табы
	 * @return Number Индекс
	 */
	getActiveTabIndex: function() {
		var tabIndex = 0;
		this.items.each(function(item, index) {
			if (item.tab.active)
				tabIndex = index;
		});
		return tabIndex;
	},

	/**
	 * Подсчет количества таб в табпанели
	 * @return Number Количество
	 */
	getTabsCount: function() {
		return this.items.getCount();
	},

	/*
	 * Проверка, деактивирована ли таба (по индексу)
	 * @param Number index Индекс табы
	 * @return Boolean Деактивирована ли
	 */
	tabIsDisabled: function(index) {
		var tab = this.items.getAt(index);
		return tab ? tab.isDisabled() : true;
	}
});
