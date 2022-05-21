/**
 *
 * EN
 *
 * There is no need in this file.
 * Keep it here for further translations.
 *
 */
C.utils.inherit('O.timeperiod', {
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
	}
});