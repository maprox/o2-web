/**
 * Error handling object<br/>
 * Maps the error code with the error message.<br/>
 * @class C.err
 * @singleton
 */
Ext.define('C.err', {
	singleton: true,

/**
	* То же, что и fmtAll, однако на входе один объект
	* @param {Object} error Объект ошибки
	* @returns {String}
	*/
	fmt: function(error) {
		return this.fmtAll([error]);
	},

/**
	* То же, что и fmtFormat, однако на входе массив ошибок
	* и добавляется контейнер для ошибки
	* @param {Array} errorList Объект ошибки
	* @returns {String}
	*/
	fmtAll: function(errorList) {
		if (typeof(errorList) === "undefined") {
			errorList = [{code: 1}];
		}
		if (!Ext.isArray(errorList)) {
			errorList = [{code: 1, params: errorList}];
		}
		var result = "";
		for (var i = 0; i < errorList.length; i++) {
			result += Ext.String.format(EL.fmt, this.fmtFormat(errorList[i]));
		}
		return result;
	},

/**
	* Функция вывода текста ошибки.<br/>
	* На входе передается объект ошибки, у которого
	* должен быть минимум код ошибки <i>code</i>
	* <p><b>Пример использования:</b></p>
	* <pre><code>var s = C.err.fmt({
	* 	code: 0,
	* 	params: ['Параметр']
	* }); // s = 'Неизвестная ошибка: Параметр';
	* </code></pre>
	* @param {Object} error Объект ошибки
	* @returns {String}
	 */
	fmtFormat: function(error) {
		var err = null;
		var arg = null;
		if (Ext.isObject(error.params) && error.params.message) {
			err = {
				id: error.code,
				fmt: error.params.message
			};
		} else {
			if (Ext.isEmpty(error) || Ext.isEmpty(error.code)) {
				err = EL.getByKey(1);
			} else {
				err = EL.getByKey(error.code)
				if (Ext.isEmpty(err)) {
					err = EL.getByKey(0);
					arg = error.code;
				}
			}
			if (Ext.isEmpty(err)) {
				err = {
					id: -1,
					fmt: Ext.String.format(OL.unknownError, arg)
				};
			}
		}
		return Ext.String.format(err.fmt, error.params);
	}
});

// Prevent error dialogs from displaying -which is the window's normal
// behavior- by overriding the default event handler for error events that
// go to the window.
var prevOnerror = window.onerror;

// Override previous handler.
window.onerror = function (msg, url, lineNumber) {
	if (prevOnerror) {
		// Call previous handler.
		return prevOnerror(msg, url, lineNumber);
	}
	// Here we need to check for some errors like 'floating' and
	// for example, reload the page...
	// By now we just let default handler run.
	return false;
}