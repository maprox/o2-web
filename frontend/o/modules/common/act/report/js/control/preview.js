/**
 * @class O.reports.Preview
 */
C.utils.inherit('O.common.act.report.Preview', {
/**
	* Данные текущего сформированного отчета
	* @type Object
	*/
	lastInput: null,

/**
	* @constructs
	* @param {Object} config Configuration object
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		// добавим события, которые
		// будет генерировать компонент
		this.addEvents(
			/**
			 * @event beforeload
			 * Событие, вызываемое непосредственно перед отправкой запроса
			 * получения отчета на сервер
			 * @param {Object} input Объект, вида {reportId:N, params:[{}]}
			 */
			'beforeload',
			/**
			 * @event afterload
			 * Событие, вызываемое после получения ответа
			 * с сервера
			 */
			'afterload'
		);
	},

/**
	* Returns a function wich should handle export in supplied format
	* @param {String} format Report format alias
	*/
	exportHandler: function(format) {
		return Ext.bind(this.exportReport, this, [format]);
	},

/**
	* Отображение отчета
	* @param {Number} reportId Идентификатор выбранного отчета
	* @param {Object} values Входные параметры отчета
	*/
	showReport: function(reportId, values) {
		// получаем список отчетов, доступных пользователю
		C.get('x_report', function(reports) {
			if (Ext.isEmpty(reports)) { return; }
			// получаем объект отчета
			var report = reports.get(reportId);
			if (Ext.isEmpty(report)) return;
			// запрашиваем отчет
			this.requestReport({
				id: reportId,
				report: report.remote_path,
				format: 'HTMLEmbedded',
				params: values
			});
		}, this);
	},

/**
	* Функция экспорта текущего отчета в определенный формат
	* @param {String} format
	*/
	exportReport: function(format) {
		if (Ext.isEmpty(this.lastInput)) { return; }
		var input = {
			report: this.lastInput.report,
			format: format,
			params: this.lastInput.params
		};
		window.open(Ext.String.format("/reports/export?data={0}",
			escape(Ext.encode(input))));
	},

/**
	* Запрос отчета у сервера
	* @param {Object} input Параметры отчета
	* @protected
	*/
	requestReport: function(input) {
		this.fireEvent('beforeload', input);
		Ext.Ajax.request({
			url: 'reports/show',
			params: {data: Ext.encode(input)},
			callback: function(opts, success, response) {
				// ошибка 500 будет перехвачена менеджером
				if (!success) {
					this.fireEvent('afterload', false, input);
					return;
				}
				// парсим то, что прислали
				var packet = Ext.decode(response.responseText);
				this.fireEvent('afterload', packet.success, input, packet);
				if (!packet.success) {
					this.onLoadError(packet, opts);
					return;
				}
				this.printReport(packet.data, input);
			},
			timeout: C.cfg.reportRequestTimeout,
			scope: this
		});
	},

/**
	* Сообщение об ошибке загрузки данных
	* @param {Object} packet Объект ответа сервера
	* @param {Object} opts Опции, переданные на сервер при запросе
	* @protected
	*/
	onLoadError: function(packet, opts) {
		this.getToolbar().disable();
		var errors = [{code: 20, params: this.loadErrorMessage}];
		if (Ext.isArray(packet.errors) && !Ext.isEmpty(packet.errors)) {
			errors = packet.errors;
		}
		O.msg.error(C.err.fmtAll(errors));
	},

/**
	* Отображение отчета
	* @param {Object} data
	* @private
	*/
	printReport: function(data, input) {
		this.getToolbar().enable();
		this.update(Base64.decode(data));
		this.lastInput = C.utils.clone(input);
	}
});