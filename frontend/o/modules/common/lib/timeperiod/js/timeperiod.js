/**
 * @fileOverview Вспомогательный класс для форматирования временных периодов
 *
 * @class C.utils
 * @singleton
 */
C.define('O.timeperiod', {
	singleton: true,

	yearNumeral: ['year', 'years'],
	monthNumeral: ['month', 'months'],
	dayNumeral: ['day', 'days'],
	hourNumeral: ['hour', 'hours'],
	minuteNumeral: ['minute', 'minutes'],
	secondsNumeral: ['second', 'seconds'],

	/**
	 * Добавляет к числу слово в нужной форме
	 * @param {int} num - входное число
	 * @param {string[]} value - массив форм слова
	 * @return {string}
	 */
	getNumeral: function(num, values) {
		if (num == 0) return '';
		var result = values[0];
		if (num > 1) result = values[1];
		return num + ' ' + result + ' ';
	},

	/**
	 * Получает длительность временного периода в формате HH:MM:SS
	 * из секунд
	 * @param {int} msec количество секунд
	 */
	getDuration: function(msec) {
		var hours = Math.floor(Math.floor(msec / 60) / 60);
		var minutes = (Math.floor(msec / 60) % 60);
		minutes = (minutes == 60) ? "00" : minutes;
		var seconds = msec % 60;
		return this.formatTwoDigits(hours) + ":" + 
						this.formatTwoDigits(minutes) + ":" +
						this.formatTwoDigits(seconds);
	},

	/**
	 * Добавляет 0 вначале числа из одного знака
	 * @param {int} value
	 * @return {String}
	 */
	formatTwoDigits: function(value) {
		 return (value < 10)? "0" + value: value;
	},

	/**
	 * Форматирует временной интервал (5 часов 6 минут 50 секунд)
	 * @param {int} msec - Длина интервала, милисек.
	 * @param {bool} includeSeconds - включать ли секунды в результат
	 * @return {string}
	 */
	formatPeriod: function(msec, includeSeconds) {
		var daysInMonth = 365.25 / 12,
			ms = msec % 1000,
			seconds = (msec - ms) / 1000,
			s = seconds % 60,
			minutes = (seconds - s) / 60,
			i = minutes % 60,
			hours = (minutes - i) / 60,
			h = hours % 24,
			days = (hours - h) / 24,
			d = Math.floor(days % daysInMonth),
			months = Math.floor((days - d) / daysInMonth),
			m = months % 12,
			years = (months - m) / 12,
			y = years,
			result =
				O.timeperiod.getNumeral(y, O.timeperiod.yearNumeral) +
				O.timeperiod.getNumeral(m, O.timeperiod.monthNumeral) +
				O.timeperiod.getNumeral(d, O.timeperiod.dayNumeral) +
				O.timeperiod.getNumeral(h, O.timeperiod.hourNumeral) +
				O.timeperiod.getNumeral(i, O.timeperiod.minuteNumeral);
		if (includeSeconds) {
			result += O.timeperiod.getNumeral(s, O.timeperiod.secondsNumeral);
		}
		return result;
	}
});