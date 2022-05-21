/**
 * @class O.common.act.report.Settings
 */
C.utils.inherit('O.common.act.report.Settings', {
	/*
	 * Перезагрузка панели параметров отчета
	 * @param {O.model.Report} report Отчет для загрузки
	 */
	reload: function(report) {
		this.paramsTab.loadReport(report);
		this.descriptionTab.loadReport(report.identifier);
		this.historyTab.loadReport(report);
		var len = report.params.length;
		var valid = true;
		for (var i = 0; i < len; i++)
			if (Ext.Array.indexOf([
				'bool', 'date', 'float', 'int', 'string', 'simple'],
				report.params[i].type) == -1) {
				valid = false;
				break;
			}
		this.fireEvent('validityChange', valid);
	},

	/*
	 * Очистка списка параметров отчета
	 */
	clear: function() {
		this.paramsTab.clear();
	},

	/*
	 * Получение заполенного списка параметров отчета
	 */
	getValues: function() {
		return this.paramsTab.getValues();
	},

	/*
	 * Инициализация обработчиков событий
	 */
	onAfterRender: function() {
		this.paramsTab.on('validityChange', this.onValidityChange, this);
	},

	/*
	 * Обработчик события "изменилась корректность заполненности параметров"
	 * @param {Bool} valid - Корректно ли заполнены параметры
	 */
	onValidityChange: function(valid) {
		this.fireEvent('validityChange', valid);
	}
});
