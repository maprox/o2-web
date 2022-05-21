/**
 * @fileOverview Прокси для прямой работы с сервер-сайдом
 */
/**
 * @class O.proxy.Ajax
 * @extends Ext.data.proxy.Ajax
 */
Ext.define('O.proxy.Ajax', {
	extend: 'Ext.data.proxy.Ajax',

	statics: {
		defaults: {
			type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
			reader: {
				type: 'json',
				successProperty: 'success',
				root: 'data'
			},
			writer: {
				type: 'json',
				writeAllFields: true,
				root: 'data'
			}
		},

		merge: function (array1, array2) {
			for (var key in array2) {
				if (array1[key] && typeof array1[key] === 'object') {
					array1[key] = this.merge(array1[key], array2[key]);
				} else {
					array1[key] = array2[key];
				}
			}

			return array1;
		},

		get: function (apiBase, apiPrefix, config) {
			config = config || {};
			apiPrefix = apiPrefix || '';

			var defaults = Ext.clone(this.defaults);
			defaults.api = {
				read: '/'+apiBase+'/'+apiPrefix+'load',
				create: '/'+apiBase+'/'+apiPrefix+'create',
				update: '/'+apiBase+'/'+apiPrefix+'update',
				destroy: '/'+apiBase+'/'+apiPrefix+'destroy'
			};

			var params = this.merge(defaults, config);
			return params;
		}
	}
});
