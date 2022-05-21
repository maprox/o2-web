/**
 * Schedule panel
 * @class O.comp.Schedule
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.comp.Schedule', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.schedule',

/** Props */
	iconCls: 'schedule',
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

/**
	* Включать ли изображение загрузки
	*/
	setLoadingable: true,

/**
	* Идентификатор расписания
	* @type {Integer}
	*/
	scheduleId: null,

/**
	* Не оповещать о изменении полей
	* @type {Boolean}
	*/
	noFire: false,

/**
	* Объект "слушателей"
	* @type {Object}
	*/
	listenersObj: null,

/**
	* @constructor
	*/
	initComponent: function() {
		var schedule = this;

		this.listenersObj = {
			change: function() {
				if (!schedule.noFire) {
					schedule.fireEvent('changed');
				}
			}
		};

		this.items = [];
		this.items.push({
			border: false,
			bodyPadding: 5,
			width: 260,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			defaults: {
				border: false,
				bodyPadding: 5
			},
			items: [{
				html: _('Daily schedule')
			}, {
				layout: {
					type: 'hbox'
				},
				defaults: {
					border: false
				},
				items: [{
					html: _('Active from'),
					bodyPadding: '4 4 0 0'
				}, {
					xtype: 'timefield',
					format: 'H:i',
					increment: 60,
					width: 68,
					name: 'schedule.from',
					itemId: 'fieldFrom',
					listeners: schedule.listenersObj
				}, {
					html: _('to'),
					bodyPadding: '4'
				}, {
					xtype: 'timefield',
					format: 'H:i',
					increment: 60,
					width: 68,
					name: 'schedule.to',
					itemId: 'fieldTo',
					listeners: schedule.listenersObj
				}]
			}, {
				html: _('Active all day')
			}, {
				html: _('Inactive all day')
			}]
		});

		var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
			startDay = Ext.picker.Date.prototype.startDay,
			i = startDay;
		for (; i < days.length; i++) {
			this.items.push(this.dayPanel(
				Ext.Date.getShortDayName(i), days[i]));
		}
		for (i = 0; i < startDay; i++) {
			this.items.push(
				this.dayPanel(Ext.Date.getShortDayName(i), days[i]));
		}

		Ext.apply(this, {
			itemId: 'schedule',
			title: _('Schedule')
		});

		this.callParent(arguments);
		//this.addEvents('changed');
	},

/**
	* Создание панели для дней недели
	* @param {string} title День недели
	* @param {string} name Имя для радиобоксов
	* @return {Ext.panel.Panel} Панель дня недели
	*/
	dayPanel: function(title, name) {
		return {
			width: 50,
			bodyPadding: 5,
			border: false,
			layout: {
				type: 'vbox',
				align: 'center'
			},
			defaults: {
				border: false,
				xtype: 'radiofield'
			},
			items: [{
				xtype: 'panel',
				html: title,
				bodyPadding: 8
			}, {
				inputValue: 2,
				name: 'schedule.' + name,
				itemId: name + '2',
				listeners: this.listenersObj
			}, {
				name: 'schedule.' + name,
				inputValue: 1,
				itemId: name + '1',
				listeners: this.listenersObj
			}, {
				name: 'schedule.' + name,
				inputValue: 0,
				itemId: name + '0',
				listeners: this.listenersObj
			}]
		};
	}
});