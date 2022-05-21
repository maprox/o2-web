/*!
 * Sencha Touch Library 2.0
 *
 * Russian translation
 * By sunsay (utf-8 encoding)
 * 2011
 */
/**
 * @class Ext.Date
 */

C.utils.inherit('Ext.Date', {
	dayNames: ["Воскресенье",
		"Понедельник", "Вторник", "Среда", "Четверг", "Пятница",
		"Суббота"
	],
	monthNames: [
		        "Январь", "Февраль",
		"Март", "Апрель", "Май",
		"Июнь", "Июль", "Август",
		"Сентябрь", "Октябрь", "Ноябрь",
		"Декабрь"
	],
	shortMonthNames: [
		       "Янв", "Фев",
		"Мар", "Апр", "Май",
		"Июн", "Июл", "Авг",
		"Сен", "Окт", "Ноя",
		"Дек"
	],
	monthNumbers: {
		          'Янв': 0, 'Фев': 1,
		'Мар': 2, 'Апр': 3, 'Май': 4,
		'Июн': 5, 'Июл': 6, 'Авг': 7,
		'Сен': 8, 'Окт': 9, 'Ноя': 10,
		'Дек': 11
	},
	defaultFormat: 'd.m.Y'
});

/**
 * @class Ext.picker.Date
 */

C.utils.inherit('Ext.picker.Date', {
	constructor: function() {
		this.config = Ext.apply(this.config, {
			dayText: 'День',
			monthText: 'Месяц',
			yearText: 'Год'
		});
		this.setSlotOrder(['day', 'month', 'year']);
		this.callOverridden(arguments);
	}
});

/**
 * @class Ext.picker.Picker
 */

C.utils.inherit('Ext.picker.Picker', {
	constructor: function() {
		this.config = Ext.apply(this.config, {
			doneButton: _('Done'),
			cancelButton: _('Cancel')
		});
		this.callOverridden(arguments);
	}
});

/**
 * @class Ext.NestedList
 */
C.utils.inherit('Ext.NestedList', {
	constructor: function() {
		this.config = Ext.apply(this.config, {
			backText: _('Back'),
			loadingText: _('Loading') + '...',
			emptyText: 'Нет элементов для отображения.'
		});
		this.callOverridden(arguments);
	}
});

C.utils.inherit('Ext.DataView', {
	constructor: function() {
		this.callOverridden(arguments);
		this.setLoadingText(_('Loading') + '...');
	}
});
