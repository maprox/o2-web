/*!
 * Ext JS Library 4.0
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
	defaultFormat: O.format.Date
});

/**
 * @class C.utils
 */

C.utils.inherit('C.utils', {
	lngTimeleft: 'Время вашей работы согласно расписанию подходит к концу.'
		+ '<br />Сохраните изменения во избежание потери данных.'
		+ '<br />Ваш сеанс будет завершен через'
});

/**
 * @class Ext.view.DragZone
 */
C.utils.inherit('Ext.view.DragZone', {
	getDragText: function() {
		var count = this.dragData.records.length;
		return Ext.String.format('{0} {1}', count,
			ru_plural(count, {
				v1: 'выбранная строка',
				v2: 'выбранные строки',
				v5: 'выбранных строк'
			})
		);
	}
});

/**
 * @class Ext.view.AbstractView
 */
C.utils.inherit('Ext.view.AbstractView', {
	loadingText: 'Загрузка...'
});

C.utils.inherit('Ext.grid.Lockable', {
	unlockText: 'Открепить',
	lockText: 'Закрепить'
});

/**
 * @class Ext.grid.RowEditor
 */

C.utils.inherit('Ext.grid.RowEditor', {
	saveBtnText: 'Сохранить',
	cancelBtnText: 'Отмена',
	errorsText: 'Ошибки',
	dirtyText: 'Вам необходимо сохранить или отменить сделанные изменения'
});

/**
 * @class Ext.grid.header.Container
 */

C.utils.inherit('Ext.grid.header.Container', {
	sortAscText: 'Сортировать по возрастанию',
	sortDescText: 'Сортировать по убыванию',
	sortClearText: 'Убрать сортировку',
	columnsText: 'Колонки'
});

/**
 * @class Ext.grid.feature.Grouping
 */

C.utils.inherit('Ext.grid.feature.Grouping', {
	groupByText : 'Группировать по этому полю',
	showGroupsText : 'Разбивать на группы'
});

/**
 * @class Ext.picker.Date
 */

C.utils.inherit('Ext.picker.Date', {
	ariaTitle: 'Выбор даты',
	todayText: "Сегодня",
	todayTip: "{0} (Пробел)",
	minText: "Эта дата раньше минимальной даты",
	maxText: "Эта дата позже максимальной даты",
	disabledDaysText: "Откл",
	disabledDatesText: "Откл",
	nextText: 'Следующий месяц (Control+Вправо)',
	prevText: 'Предыдущий месяц (Control+Влево)',
	monthYearText: 'Выбор месяца (Control+Вверх/Вниз для выбора года)',
	startDay: 1,
	monthNames: Ext.Date.monthNames,
	dayNames: Ext.Date.dayNames,
	format: Ext.Date.defaultFormat
});

/**
 * @class Ext.picker.Month
 */

C.utils.inherit('Ext.picker.Month', {
	okText: "&#160;OK&#160;",
	cancelText: "Отмена"
});

/**
 * @class Ext.form.field.Date
 */
C.utils.inherit('Ext.form.field.Date', {
	disabledDaysText: "Недоступно",
	disabledDatesText: "Недоступно",
	minText: "Дата в этом поле должна быть позже {0}",
	maxText: "Дата в этом поле должна быть раньше {0}",
	invalidText: "{0} не являетсяя правильной датой - " +
		"дата должна быть указана в формате {1}",
	format: "d.m.y",
	startDay: 1,
	altFormats: "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});

/**
 * @class Ext.form.field.Text
 */
C.utils.inherit('Ext.form.field.Text', {
	minLengthText: "Минимальная длина этого поля {0}",
	maxLengthText: "Максимальная длина этого поля {0}",
	blankText: "Это поле обязательно для заполнения",
	regexText: "",
	emptyText: null
});

/**
 * @class Ext.form.field.Number
 */
C.utils.inherit('Ext.form.field.Number', {
	minText : "Значение этого поля не может быть меньше {0}",
	maxText : "Значение этого поля не может быть больше {0}",
	nanText : "{0} не является числом"
});

/**
 * @class Ext.form.VTypes
 */
if (C.utils.isset('Ext.form.VTypes')) {
	Ext.apply(Ext.form.VTypes, {
		emailText: 'Это поле должно содержать адрес электронной почты в формате "user@example.com"',
		urlText: 'Это поле должно содержать URL в формате "http:/'+'/www.example.com"',
		alphaText: 'Это поле должно содержать только латинские буквы и символ подчеркивания "_"',
		alphanumText: 'Это поле должно содержать только латинские буквы, цифры и символ подчеркивания "_"',
		passwordText: 'Пароли должны совпадать',
		phoneText: 'Это поле должно содержать правильный номер телефона'
	});
}



/**
 * @class Ext.LoadMask
 */

C.utils.inherit('Ext.LoadMask', {
	msg: "Загрузка..."
});
/*
C.utils.inherit('Ext.grid.GridView', {
	sortAscText: "Сортировать по возрастанию",
	sortDescText: "Сортировать по убыванию",
	lockText: "Закрепить столбец",
	unlockText: "Снять закрепление столбца",
	columnsText: "Столбцы"
});
*/
if (Ext)
{

	if (Ext.grid)
	{

		/**
		 * @class Ext.grid.GroupingView
		 */
		if (Ext.grid.GroupingView) {
			Ext.apply(Ext.grid.GroupingView.prototype, {
				emptyGroupText : '(Пусто)',
				groupByText : 'Группировать по этому полю',
				showGroupsText : 'Отображать по группам'
			});
		}

		/**
		 * @class Ext.grid.PropertyColumnModel
		 */
		if (Ext.grid.PropertyColumnModel) {
			Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
				nameText : "Название",
				valueText : "Значение",
				dateFormat : "d.m.Y"
			});
		}

	}

	/**
	 * @class Ext.TabPanelItem
	 */

	if (Ext.TabPanelItem) {
		Ext.TabPanelItem.prototype.closeText = "Закрыть эту вкладку";
	}

	/**
	 * @class Ext.form.Field
	 */

	if (Ext.form.Field) {
		Ext.form.Field.prototype.invalidText = "Значение в этом поле неверное";
	}

	/**
	 * @class Ext.window.MessageBox
	 */
	C.utils.inherit('Ext.window.MessageBox', {
		buttonText: {
			ok: 'OK',
			yes: 'Да',
			no: 'Нет',
			cancel: 'Отмена'
		},
		titleText: {
			confirm: 'Подтверждение',
			prompt: 'Запрос',
			wait: 'Загрузка...',
			alert: 'Внимание'
		}
	});

	/**
	 * @class Ext.PagingToolbar
	 */
	if (Ext.PagingToolbar) {
		Ext.apply(Ext.PagingToolbar.prototype, {
			beforePageText : "Страница",
			afterPageText : "из {0}",
			firstText : "Первая страница",
			prevText : "Предыдущая страница",
			nextText : "Следующая страница",
			lastText : "Последняя страница",
			refreshText : "Обновить",
			displayMsg : "Отображаются записи с {0} по {1}, всего {2}",
			emptyMsg : 'Нет данных для отображения'
		});
	}

	if (Ext.form)
	{
		/**
		 * @class Ext.form.HtmlEditor
		 */
		if (Ext.form.HtmlEditor) {
			Ext.apply(Ext.form.HtmlEditor.prototype, {
				createLinkText : 'Пожалуйста, введите адрес:',
				buttonTips : {
					bold : {
						title: 'Полужирный (Ctrl+B)',
						text: 'Применение полужирного начертания к выделенному тексту.',
						cls: 'x-html-editor-tip'
					},
					italic : {
						title: 'Курсив (Ctrl+I)',
						text: 'Применение курсивного начертания к выделенному тексту.',
						cls: 'x-html-editor-tip'
					},
					underline : {
						title: 'Подчёркнутый (Ctrl+U)',
						text: 'Подчёркивание выделенного текста.',
						cls: 'x-html-editor-tip'
					},
					increasefontsize : {
						title: 'Увеличить размер',
						text: 'Увеличение размера шрифта.',
						cls: 'x-html-editor-tip'
					},
					decreasefontsize : {
						title: 'Уменьшить размер',
						text: 'Уменьшение размера шрифта.',
						cls: 'x-html-editor-tip'
					},
					backcolor : {
						title: 'Заливка',
						text: 'Изменение цвета фона для выделенного текста или абзаца.',
						cls: 'x-html-editor-tip'
					},
					forecolor : {
						title: 'Цвет текста',
						text: 'Изменение цвета текста.',
						cls: 'x-html-editor-tip'
					},
					justifyleft : {
						title: 'Выровнять текст по левому краю',
						text: 'Выравнивание текста по левому краю.',
						cls: 'x-html-editor-tip'
					},
					justifycenter : {
						title: 'По центру',
						text: 'Выравнивание текста по центру.',
						cls: 'x-html-editor-tip'
					},
					justifyright : {
						title: 'Выровнять текст по правому краю',
						text: 'Выравнивание текста по правому краю.',
						cls: 'x-html-editor-tip'
					},
					insertunorderedlist : {
						title: 'Маркеры',
						text: 'Начать маркированный список.',
						cls: 'x-html-editor-tip'
					},
					insertorderedlist : {
						title: 'Нумерация',
						text: 'Начать нумернованный список.',
						cls: 'x-html-editor-tip'
					},
					createlink : {
						title: 'Вставить гиперссылку',
						text: 'Создание ссылки из выделенного текста.',
						cls: 'x-html-editor-tip'
					},
					sourceedit : {
						title: 'Исходный код',
						text: 'Переключиться на исходный код.',
						cls: 'x-html-editor-tip'
					}
				}
			});
		}

		/**
		 * @class Ext.form.BasicForm
		 */
		if (Ext.form.BasicForm) {
			Ext.form.BasicForm.prototype.waitTitle = "Пожалуйста, подождите...";
		}
	}

	/**
	 * @class Ext.SplitLayoutRegion
	 */
	if (Ext.SplitLayoutRegion) {
		Ext.apply(Ext.SplitLayoutRegion.prototype, {
			splitTip : "Тяните для изменения размера.",
			collapsibleSplitTip: "Тяните для изменения размера. Двойной щелчок спрячет панель."
		});
	}

	if (Ext.layout)
	{

		/**
		 * @class Ext.layout.BorderLayout.SplitRegion
		 */
		if (Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
			Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
				splitTip : "Тяните для изменения размера.",
				collapsibleSplitTip: "Тяните для изменения размера. Двойной щелчок спрячет панель."
			});
		}
	}

}
