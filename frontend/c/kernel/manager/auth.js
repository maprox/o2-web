/**
 * Authentication manager
 * @class C.manager.Auth
 * @singleton
 */
Ext.define('C.manager.Auth', {
	singleton: true,

	// consts
	$CAN_READ: 1,
	$CAN_WRITE: 2,
	$CAN_CREATE: 4,

/**
	* Returns array of current user rights
	* @return Object[]
	* @private
	*/
	getRights: function() {
		return C.getSetting('rights');
	},

/**
	* Checks if current user has right by right's Identifier or Name
	* @param {String/Number} right Name or Identifier of right
	* @param {Number} type Type of right
	* @return Boolean
	*/
	hasRight: function(right, type) {
		if (Ext.isNumber(right)) {
			return this.hasRightById(right, type);
		}
		return this.hasRightByName(right, type);
	},

/**
	* Checks if current user has right by right's Name
	* @param {String} right Name of right
	* @param {Number} type Type of right
	* @return Boolean
	*/
	hasRightByName: function(right, type) {
		var result = false,
			rights = this.getRights();
		for (var i = 0; i < rights.length; i++) {
			var r = rights[i];
			if (r.name.toLowerCase() == right.toLowerCase()) {
				if (type) {
					if (!!(r.type & type)) {
						result = true;
					}
				} else {
					result = true;
				}
			}
		}
		return result;
	},

/**
	* Checks if current user has right by right's Identifier
	* @param {Number} right Identifier of right
	* @param {Number} type Type of right
	* @return Boolean
	*/
	hasRightById: function(right, type) {
		var result = false,
			rights = this.getRights();
		for (var i = 0; i < rights.length; i++) {
			var r = rights[i];
			if (r.id == right) {
				if (type) {
					if (!!(r.type & type)) {
						result = true;
					}
				} else {
					result = true;
				}
			}
		}
		return result;
	},

/**
	* Сhecks whether the user has not exceeded
	* the allowable limit of objects of specified type (modelAlias)
	* @param {String} modelAlias
	* @param {String} settingAlias
	* @return {Boolean}
	*/
	canCreate: function(modelAlias, settingAlias) {
		var maxAllowedCount = (settingAlias) ?
			maxAllowedCount = C.getSetting(settingAlias) :
			maxAllowedCount = C.getSetting('t.maxcountof' + modelAlias);
		var result = false;
		var items = C.get(modelAlias);
		if (items) {
			result = (items.getCount() < maxAllowedCount);
			// TODO need cleanup store
			//delete store; // or we need to call "C.deleteStore(store)"
		}
		var checkRight = this.hasRight(modelAlias, C.cfg.rightTypes.CREATE);
		return result && checkRight;
	}
});