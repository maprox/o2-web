/**
 * Tariff list
 * @class O.common.act.tariff.List
 * @extends O.common.lib.modelslist.List
 */
C.define('O.common.act.tariff.List', {
	extend: 'O.common.lib.modelslist.List',
	alias: 'widget.common-tariff-list',

/**
	* True to show edit button
	* @type {Boolean}
	*/
	showOnOffButton: false,

/**
	* True to show edit button
	* @type {Boolean}
	*/
	showCopyButton: true
});