/**
 * Registration form
 * @class O.register.BaseForm
 * @extends Ext.form.FormPanel
 */
C.utils.inherit('O.register.BaseForm', {

	sendUrl: C.cfg.url.register,

/**
	* Registration data submit
	*/
	submit: function() {
		var panel = Ext.getCmp('registerPanel'),
			form = panel.down('#registerForm'),
			items = form.getForm(),
			data = form.getSubmitValues(items);

		if (items.isValid()) {
			// посылаем AJAX запрос
			Ext.Ajax.on('beforerequest', function() {
				// анимация загрузки
				panel.setLoading(true);
			});

			Ext.Ajax.request({
				url: form.sendUrl,
				params: data,
				scope: this,
				callback: function(opts, success, response) {
					// объект ответа серверного скрипта
					var answer = C.utils.getJSON(response.responseText, opts);
					// снимаем анимацию загрузки
					panel.setLoading(false);
					// если данные введены верно...
					if (!answer.error) {
						// Выполняем заданное действие
						form.successAction(data);
					} else {
						// Пока на каждом этапе может быть только одна ошибка
						panel.displayError(form.errorMessage);
					}
				}
			});
		} else {
			// ошибка заполнения полей
			var msg = C.err.fmt({code: 4010});
			panel.displayError(msg);
		}
	},

/**
	* Registration data gather
	*/
	getSubmitValues: function(items) {
		return items.getFieldValues();
	}
});
