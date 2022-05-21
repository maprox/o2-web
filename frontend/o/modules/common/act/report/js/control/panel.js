/**
 * @class O.common.act.report.Panel
 */
C.utils.inherit('O.common.act.report.Panel', {
/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		var reportsPanel = this;
		this.callOverridden(arguments);
		if (this.reports) {
			this.reports.on('selectionChanged', 'selectionChanged', this);
		}
		if (this.btnGenerate) {
			this.btnGenerate.setHandler(this.onGenerateClick, this);
		}
		if (this.params) {
			this.params.on({
				validityChange: 'onValidityChange',
				reportLoaded: 'reportLoaded',
				paramsloaded: function() {
					Ext.defer(function() {
						reportsPanel.setLoading(false);
					}, 200);
				},
				scope: this
			});
		}
		if (this.preview) {
			this.preview.on({
				beforeload: 'onReportBeforeLoad',
				afterload: 'onReportAfterLoad',
				scope: this
			});
		}
	},

/**
	* TODO COMMENT THIS
	*/
	reportLoaded: function() {
		this.unlock();
	},

/**
	* TODO COMMENT THIS
	* @private
	*/
	onValidityChange: function(/*valid*/) {
		if (this.btnGenerate === undefined) return;
		var valid = this.down('#reportssettings').paramsTab.checkValid();
		if (valid) {
			this.btnGenerate.enable();
		} else {
			this.btnGenerate.disable();
		}
	},

	/*
	 * Load report params
	 * @param {Number} selected Report identifier
	 */
	selectionChanged: function(selected) {
		if (Ext.isEmpty(selected)) { return; }
		if (!selected) { return; }
		this.lock();
		this.params.reload(selected[0].getData());
		this.unlock();
		/*C.get('reports', function(reports) {
			this.unlock();
			var selReports = reports.getByKeys(selected);
			if (Ext.isEmpty(selReports)) {
				this.params.clear();
			} else {
				this.params.reload(selReports[0]);
			}
		}, this);*/
	},

/**
	* Generate selected report
	*/
	onGenerateClick: function() {
		var reportId = this.reports.getSelectedReport();
		if (reportId) {
			this.preview.showReport(reportId, this.params.getValues());
		}
	},

/**
	* Выбор пакетов документов
	* @param {Number[]} list Массив идентификаторов пакетов
	* @private
	*/
	/*onSelectPackets: function(list) {
		C.get('groupreports', function(packets) {
			var data = [];
			Ext.each(packets.getByKeys(list), function(packet) {
				data = data.concat(packet.objects);
			});
			this.reports.setData(data);
		}, this);
	},*/

/**
	* Запрос на отображение отчета в окне просмотра
	* @param {Number} reportId Идентификатор выбранного отчета
	* @param {Object} values Входные параметры отчета
	* @private
	*/
	onRequestReport: function(reportId, values) {
		this.preview.showReport(reportId, values);
	},

/**
	* Функция, вызываемая перед запросом отчета с сервера
	* @param {Object} data Входные данные
	* @private
	*/
	onReportBeforeLoad: function(data) {
		this.lock();
	},

/**
	* Получение данных от сервера
	* @param {Boolean} success Флаг успешности операции
	* @param {Object} data Входные данные
	* @param {Object} packet Пакет данных (undefined, если ошибка 500)
	* @private
	*/
	onReportAfterLoad: function(success, data, packet) {
		this.down('#history').loadReport(null, true);
		this.unlock();
	}
});