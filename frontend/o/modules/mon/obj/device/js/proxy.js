/**
 * @class O.mon.proxy.Device
 * @extends O.proxy.Custom
 */
Ext.define('O.mon.proxy.Device', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_device',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Devices'),

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: true, // Cant't be false

/**
	* Ext.data.Model name of a record in a proxy store
	* @type String
	*/
	model: 'Mon.Device',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Extra parameters
	* @type Object
	*/
	extraParams: {
		'$getaccesslist': 1
	},

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Default sorters for getStore
	* @type: Object[]
	*/
	defaultSorters: [
		/*{
			sorterFn: function(o1, o2) {
				if (o1.get('id') == 0 || o1.get('id') == null) {
					return -1;
				}

				if (o2.get('id') == 0 || o2.get('id') == null) {
					return 1;
				}

				return 0;
			}
		},*/
		{
			property: 'name', direction: 'ASC',
			transform: function(val) {
				if (val) {
					return val.toLowerCase();
				}
			}
		}
	],

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.Device
}, function() {
	this.prototype.superclass.register(this);
});