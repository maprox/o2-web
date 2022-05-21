/**
 * Class of the user option
 * @class O.mon.model.Device
 * @extends O.model.Object
 */
C.define('O.model.Option', {
	extend: 'O.model.Object',

	value: null,
	type: null,

	config: {
		allowNull: true
	},

/**
	* @constructs
	*/
	constructor: function() {
		this.callParent(arguments);
		this.id = arguments[0].id; // sencha touch bug fix
		this.castValue();
	},

/**
	* Do not cast this.id field to an integer
	* @return {String}
	*/
	getId: function() {
		return this.id;
	},

/**
	* Cast value to a type
	*/
	castValue: function() {
		var et = Ext.data.Types;
		var converter = null;
		switch (this.type) {
			case 'string' : converter = et.STRING.convert;  break;
			case 'int'    : converter = et.INT.convert;     break;
			case 'float'  : converter = et.FLOAT.convert;   break;
			case 'data'   : converter = et.DATE.convert;    break;
			case 'boolean': converter = et.BOOLEAN.convert; break;
		}
		if (converter) {
			this.value = converter.call(this, this.value);
		}
	}
});
