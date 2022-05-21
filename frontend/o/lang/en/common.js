/**
 */
/**
 * @class O.format
 */
Ext.define('O.format', {
	singleton: true,

	Date: 'm/d/Y',
	DateShort: 'm/d',
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

plural = function(n, word) {
	var plurals = {
		day: [
			'day',
			'days'
		],
		hour: [
			'hour',
			'hours'
		],
		minute: [
			'minute',
			'minutes'
		]
	};

	if (!plurals[word]) {
		return word;
	}

	return n > 1 ? plurals[word][1] : plurals[word][0];
}

Ext.apply(Ext.util.Format, {
/**
	* Format a number as RU currency
	* @param {Number/String} value The numeric value to format
	* @return {String} The formatted currency string
	*/
	ruMoney: function(v) {
		return Ext.util.Format.currency(v, ' rub.', 2, true);
	},

	/**
	 * Simple format for a file size (xxx bytes, xxx KB, xxx MB)
	 * Since
	 * @param {Number/String} size The numeric value to format
	 * @return {String} The formatted file size
	 */
	fileSize: function(size) {
		if (size < 1024) {
			return size + ' byte' + (size > 1 ? 's' : '');
		} else if (size < 1048576) {
			return (Math.round(((size * 10) / 1024)) / 10) + " KB";
		} else {
			return (Math.round(((size * 10) / 1048576)) / 10) + " MB";
		}
	}
});