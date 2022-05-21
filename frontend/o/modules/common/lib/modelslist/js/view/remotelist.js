/**
 *
 * @class O.common.lib.modelslist.RemoteList
 * @extends O.common.lib.modelslist.List
 */

C.define('O.common.lib.modelslist.RemoteList', {
	extend: 'O.common.lib.modelslist.List',
	alias: 'widget.common-lib-modelslist-remotelist',

/**
	* Set true to enable loading of store data after render.
	* Defaults to true
	* @type {Boolean}
	*/
	autoLoadStore: false,

/**
	* Display show deleted button
	* @type {Boolean}
	*/
	enableShowDeleted: false,

/*  Properties */
	hideHeaders: false
});