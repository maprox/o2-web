/**
 * @class O.dn.proxy.WorkerPost
 * @extends O.proxy.Custom
 */
C.define('O.dn.proxy.WorkerPost', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'dn_worker_post',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Firm worker posts'),

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: true,

/**
	* Ext.data.Model name of a record in a proxy store
	* @type String
	*/
	model: 'Dn.WorkerPost',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

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
	type: O.dn.model.WorkerPost
}, function() {
	this.prototype.superclass.register(this);
});