/**
 *
 * @class O.common.formerrors.Panel
 */
C.utils.inherit('O.common.formerrors.Panel', {
/**
	* Returns error list
	* @return array
	*/
	getErrorsList: function() {
		if (!this.errorsList) {
			this.errorsList = {};
		}
		return this.errorsList;
	},

/**
	 * Добавляет форму в список наблюдения
	 * @param {Object} form
	 */
	registerForm: function(form) {
		if (typeof form.isValid != 'function' ||
			typeof form.getErrors != 'function') {
			console.warn('Form does not have required ' +
				'functions for error reporting:' + form.$className);
			return;
		}
		form.on('fielderrorchange', 'doUpdate', this);
	},

/**
	* Handler for this button
	*/
	handler: function() {
		var tip = this.getTip();
		if (tip.isVisible()) {
			tip.hide();
		} else {
			tip.show();
		}
	},

/**
	 * Field error change action
	 * @param {Ext.form.Panel} form
	 * @param {Ext.form.Field} field
	 * @param {String} message
	 */
	doUpdate: function(form, field, message) {
		var errorsList = this.getErrorsList();
		if (!errorsList) { return; }

		errorsList[field.getId()] = {
			form: form,
			field: field,
			message: message
		};

		var errors = [];
		Ext.iterate(errorsList, function(fieldId, data) {
			if (!data.message) { return; }
			var f = data.field;
			var formLink = O.manager.History.getLink(data.form);
			var fieldLabel = f.getFieldLabel();
			if (fieldLabel) {
				errors.push({
					label: fieldLabel,
					link: formLink + '/focus:[name=' + f.getName() + ']',
					error: data.message
				});
			}
		});

		var tip = this.getTip();
		tip.update(errors);

		// Update CSS class and tooltip content
		if (errors.length) {
			this.show();
		} else {
			this.hideTip();
			this.hide();
		}

	},

/**
	 * Возвращает объект всплывающей подсказки
	 * @return {O.common.formerrors.Tip}
	 */
	getTip: function() {

		if (!this.tip) {
			this.tip = Ext.widget('formerrors_tip', {
				target: this.el
			});
		}
		return this.tip;
	},

/**
	 * Прячет поп-ап с ошибками
	 */
	hideTip: function() {
		if (!this.rendered) { return; }
		var tip = this.getTip();
		if (tip) {
			tip.hide();
		}
	}
});