/**
 * Base class for application module panel
 * ===============================
 *
 * Description goes here
 *
 * @class C.ui.Panel
 * @extends Ext.Panel
 */
Ext.define('C.ui.Panel', {
	extend: 'Ext.Panel',
	alias: 'widget.uipanel',

/**
	* Locks panel while loading data
	*/
	lock: Ext.emptyFn,

/**
	* Unlock panel
	*/
	unlock: Ext.emptyFn

});
