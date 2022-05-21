/**
 * Abstract group of objects
 * @class O.model.Group
 * @extends O.model.Object
 */
Ext.define('O.model.Group', {
	extend: 'O.model.Object',

/**
	* Owner identifier
	* @type {Number}
	*/
	ownerid: 0,

/**
	* Owner name
	* @type {String}
	*/
	ownername: '',

/**
	* Array of objects identifiers in group
	* @type Number[]
	* @private
	*/
	objects: null,

/**
	* @constructs
	* @param {Object} config Configuration object
	*/
	constructor: function(config) {
		this.callParent(arguments);
		this.objects = [];
		this.setList(config.objects);
	},

/**
	* Returns count of objects in group
	* @returns {Number}
	*/
	count: function() {
		return this.objects.length;
	},

/**
	* Функция перебора всех объектов в группе и вызова
	* функции <i>fn</i> для каждого.
	* @param {Function} fn Функция, вызываемая для каждого объекта
	* @param {Object} scope [опц.] Область видимости вызова
	* @returns {O.model.Group} this
	*/
	each: function(fn, scope) {
		Ext.each(this.objects, function(id) {
			return fn.call(scope || this, id, this);
		});
		return this;
	},

/**
	* Добавление объекта в группу
	* @param {Number} objectId Object identifier
	*/
	add: function(objectId) {
		var id = parseInt(objectId);
		if (this.objects.indexOf(id) < 0)
			this.objects.push(id);
	},

/**
	* Updates the objects list
	* @param {Number[]} objects Array of object identifiers
	*/
	setList: function(list) {
		if (list && Ext.isArray(list)) {
			this.objects = list;
			this.objects.toNumbers();
		}
	},

/**
	* Updates internal model with new data
	* @param {Object} data New data
	* @return {Boolean} success flag of operation
	*/
	set: function(data) {
		var result = this.callParent(arguments);
		if (result) {
			this.setList(data.objects);
		}
		return result;
	},

/**
	* Функция, возвращающая JSON-представление объекта ввиде строки
	* <b>NOTE</b> Необходимо добавить фигурные скобки для полной картины
	* @return {String}
	*/
	toString: function() {
		return
			this.callParent(arguments) +
			Ext.String.format(
				', "ownerid":"{0}", "ownername":"{1}"',
				this.ownerid,
				this.ownername
			);
	}

});
