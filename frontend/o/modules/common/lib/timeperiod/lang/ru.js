/**
 *
 * RU
 *
 */
C.utils.inherit('O.timeperiod', {

	yearNumeral: ['год', 'года', 'лет'],
	monthNumeral: ['месяц', 'месяца', 'месяцев'],
	dayNumeral: ['день', 'дня', 'дней'],
	hourNumeral: ['час', 'часа', 'часов'],
	minuteNumeral: ['минуту', 'минуты', 'минут'],
	secondsNumeral: ['секунду', 'секунды', 'секунд'],

	/**
	 * Добавляет к числу слово в нужной форме
	 * @param {int} num - входное число
	 * @param {string[]} value - массив форм слова
	 * @return {string}
	 */
	getNumeral: function(num, values) {
		if (num == 0) return '';
		var result = '';
		var l_digit = num % 10;
		switch (l_digit) {
			case 1:
				result = values[0];
				break;
			case 2:
			case 3:
			case 4:
				result = values[1];
				break;
			default:
				result = values[2];
				break;
		}
		if (num > 10 && num < 20) {
			result = values[2];
		}
		return num + ' ' + result + ' ';
	}
});