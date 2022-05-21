/**
 * RU
 *
 * Common translations used in more then one module of the application
 */
/**
 * @class O.format
 */
Ext.define('O.format', {
	singleton: true,

	Date: 'd.m.Y',
	DateShort: 'd.m',
	Time: 'H:i:s',
	TimeShort: 'H:i'
}, function() {
	// some other preparations
	this.Timestamp = this.Date + ' ' + this.Time;
	// ext format
	if (Ext.util && Ext.util.Format) {
		Ext.util.Format.defaultDateFormat = this.Date;
	}
});

/**
 * Declination words function
 * Example:<br/>
 *<code><pre>p = {
 *	v1: 'слово',
 *	v2: 'слова',
 *	v5: 'слов'
 *}</pre></code>
 * @param {Number} n Number for declination
 * @param {Object} p Object with variants of declination
 * @return {String}
 */
ru_plural = function(n, p) {
	n = n % 100;
	var n1 = n % 10;
	if (n > 10 && n < 20) { return p.v5; }
	if (n1 > 1 && n1 < 5) { return p.v2; }
	if (n1 == 1) { return p.v1; }
	return p.v5;
};

plural = function(n, word) {
	var plurals = {
		day: [
			'день',
			'дня',
			'дней'
		],
		hour: [
			'час',
			'часа',
			'часов'
		],
		minute: [
			'минута',
			'минуты',
			'минут'
		]
	};

	if (!plurals[word]) {
		return _(word);
	}

	return ru_plural(n, {
		v1: plurals[word][0], v2: plurals[word][1], v5: plurals[word][2]
	});
}

_({
	'Access': 'Доступ',
	'Add': 'Добавить',
	'Address': 'Адрес',
	'Back': 'Назад',
	'Balance': 'Баланс',
	'Done': 'Готово',
	'Cancel': 'Отмена',
	'Code': 'Код',
	'Change': 'Изменить',
	'Confirmation': 'Подтверждение',
	'Copy': 'Копировать',
	'Cost': 'Стоимость',
	'Create': 'Создать',
	'Date': 'Дата',
	'Delete': 'Удалить',
	'Description': 'Описание',
	'Disable': 'Отключить',
	'Disabled': 'Отключено',
	'Edit': 'Редактировать',
	'Enable': 'Включить',
	'Enabled': 'Включено',
	'Exit': 'Выход',
	'Export': 'Экспорт',
	'Information': 'Информация',
	'Loading': 'Загрузка',
	'Logout': 'Выход',
	'Map': 'Карта',
	'Name': 'Наименование',
	'Note': 'Примечание',
	'No data': 'Нет данных',
	'Number': 'Номер',
	'Price': 'Цена',
	'Print': 'Печать',
	'Properties': 'Свойства',
	'Region': 'Регион',
	'Remove': 'Удалить',
	'Required': 'Обязательно',
	'Reset': 'Сбросить',
	'Reset changes': 'Сбросить изменения',
	'Save': 'Сохранить',
	'Save changes': 'Сохранить изменения',
	'Search': 'Поиск',
	'Send': 'Отправить',
	'Settings': 'Настройки',
	'Time': 'Время',
	'Undefined': 'Не определено',
	'Unknown': 'Не известно',
	'km': 'км',
	'Please fill all the requisites fields in settings. <br> It is required for handling your accounting info.':
		'Пожалуйста, заполните все поля реквизитов вашей фирмы в настройках. <br /> Это необходимо для предоставления для вас документов отчетности.'
});

C.utils.inherit('C.utils', {
	fmtSpeedArray: ['{0} км/ч', '{0} м/с', '{0} м/ч'],
	fmtOdometerArray: ['{0} км', '{0} м', '{0} миль'],
	fmtVolumeArray: ['{0} л']
});

C.utils.inherit('Ext.form.field.VTypes', {
	loginText: 'Уже существует или менее 4 символов',
	uidText: 'Уже существует или менее 8 символов'
}, true);

Ext.apply(Ext.util.Format, {
	currencyAtEnd: true,
	currencySign: '',
	decimalSeparator: ',',
	thousandSeparator: ' ',

/**
	* Format a number as RU currency
	* @param {Number/String} value The numeric value to format
	* @return {String} The formatted currency string
	*/
	ruMoney: function(v) {
		return Ext.util.Format.currency(v, ' руб.');
	},

	/**
	 * Simple format for a file size (xxx bytes, xxx KB, xxx MB)
	 * Since
	 * @param {Number/String} size The numeric value to format
	 * @return {String} The formatted file size
	 */
	fileSize : function(size) {
		if (size < 1024) {
			return size + ' ' + ru_plural(size, {
				v1: 'байт',
				v2: 'байта',
				v5: 'байт'
			});
		} else if (size < 1048576) {
			return (Math.round(((size * 10) / 1024)) / 10) + " КБ";
		} else {
			return (Math.round(((size * 10) / 1048576)) / 10) + " МБ";
		}
	}
});