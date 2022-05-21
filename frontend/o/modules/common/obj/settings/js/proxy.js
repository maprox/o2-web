/**
 *
 * Роутер списка настроек
 * @class O.proxy.Setting
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Setting', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор
	* @type String
	*/
	id: 'settings',

/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Settings',
	needPreload: true,

	/**
	 * Returns only settings that are used as firm requisites
	 */
	isRequisitesFilled: function() {
		var requiredFields = ['f.name', 'f.addresslegal', 'f.addressactual',
			'f.directorlastname', 'f.directorfirstname', 'f.directorsecondname',
			'f.inn', 'f.kpp', 'f.ogrn', 'f.bankname', 'f.bik', 'f.bankaccount',
			'f.bankcorrespondentaccount', 'f.okpo', 'f.okved', /*'f.signatory',
			'f.post'*/];
		var settings = this.get();

		// Individual are not required to fill them
		var option = settings.get('f.individual');
		if (option && option.value) {
			return true;
		}

		var filled = true;
		Ext.each(requiredFields, function(field){
			var option = settings.get(field);
			if (option && !option.value) {
				filled = false;
			}

			return filled;
		});
		return filled;
	},

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Option
}, function() {
	this.prototype.superclass.register(this);
});