/**
 * Rest editor list
 * @class O.restmodellist.Tabs
 * @extends O.comp.ModelsTabs
 */

C.define('O.restmodellist.Tabs', {
	extend: 'O.comp.ModelsTabs',

/**
	 * Собирает данные для отправки
	 * @return {Mixed[]}
	 */
	getData: function() {
		O.msg.warning(_('getData function must be redefined.'));
		return {};
	},

/**
	* Обработчик нажатия кнопки сохранения
	*/
	saveChanges: function() {
		this.setLoading(true);

		// сборка объекта данных
		var data = this.getData();
		console.log(data);

		// отправка запроса на изменение данных
		O.manager.Rest.update(this.managerAlias, data, function(response) {
			O.msg.info(this.lngSavedText);
			// деактивация кнопок
			this.btnsDisable();
			this.fireEvent('saved');

			this.setLoading(false);
		}, function() {
			O.msg.warning(this.lngFailedText);
			this.setLoading(false);
		}, this);
	}
});
