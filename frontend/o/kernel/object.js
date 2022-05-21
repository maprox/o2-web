/**
 * Class definition of base object in database
 * @class O.model.Object
 * @extends Ext.util.Observable
 */
Ext.define('O.model.Object', {
	extend: 'Ext.util.Observable',

/**
	* Object identifier
	* @type Number
	* @protected
	*/
	id: 0,

/**
	* Object name
	* @type String
	* @protected
	*/
	name: '',

/**
	* Model class
	* @type String
	*/
	model: null,

/**
	* If this object is editable for current user this flag is set to true
	* @type Boolean
	*/
	iseditable: false,

/**
	* @constructs
	*/
	constructor: function(config) {
		Ext.apply(this, config);
		this.id = parseInt(this.id); // преобразуем в целое число
		this.callParent(arguments);
	},

/**
	* Returns object identifier
	* @returns Number
	*/
	getId: function() {
		return parseInt(this.id);
	},

/**
	* Returns object name
	* @returns String
	*/
	getName: function() {
		return this.name;
	},

/**
	* Updates internal model with new data
	* @param {Object} data New data
	* @return {Boolean} success flag of operation
	*/
	set: function(data) {
		// проверяем передан ли идентификатор изменяемого объекта
		// и совпадает ли он с идентификатор данного объекта
		if (!data || typeof(data.id) == "undefined") { return false; }
		// let's cast data.id into a number
		var numId = parseInt(data.id);
		if (numId == data.id) {
			data.id = numId;
		}
		if (typeof(data.id) == "undefined" || (data.id !== this.getId())) {
			return false;
		}
		// проверка на изменение имени объекта
		if (Ext.isString(data.name)) {
			this.name = data.name;
		}
		// TODO проверка на всё остальное нужна. Это убрать:
		Ext.apply(this, data);
		return true;
	},

/**
	* Функция, возвращающая JSON-представление объекта ввиде строки
	* <b>NOTE</b> Необходимо добавить фигурные скобки для полной картины
	* @returns String
	*/
	toString: function() {
		return Ext.String.format('"id":"{0}", "name":"{1}", "iseditable":{2}',
			this.getId(),
			this.getName(),
			this.iseditable
		);
	},

/**
	* Функция проверки идентичности данного объекта объекту obj
	* @param {O.model.Object} obj Объект, с которым мы сравниваем "себя"
	* @returns Boolean
	*/
	isEqualTo: function(obj) {
		if (!(obj instanceof O.model.Object)) { return false; }
		return (
			(obj.getId() === this.getId()) &&
			(obj.getName() === this.getName())
		);
	},

/**
	* Makes a copy of this object
	* @param {Number} id New object id
	* @returns {O.model.Object} Copy of an object
	*/
	clone: function(id) {
		var copy = new O.model.Object(this);
		copy.id = id;
		return copy;
	},

/**
	* Strips functions and superclass, prepares model for sending
	* @returns {Object}
	*/
	toArray: function() {
		var ret = {};

		for (key in this) {
			if (key[0] != '$' &&
				typeof this[key] != 'function' &&
				typeof this[key] != 'object' &&
				typeof this[key] != 'array') {

				ret[key] = this[key];
			}
		}

		return ret;
	},

/**
	* Returns model record
	* @return {EXt.data.Model}
	*/
	getRecord: function() {
		if (!this.model) {
			console.warn('Please, specify "this.model" value for ' +
				this.$className);
		}
		return (this.model) ? Ext.create(this.model, this) : null;
	}
});
