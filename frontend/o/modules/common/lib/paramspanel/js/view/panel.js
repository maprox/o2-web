/**
 * @fileOverview Parameters panel
 *
 * @class O.comp.Params
 * @extends Ext.panel.Panel
 */
C.utils.define('O.comp.Params', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.paramspanel',

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [Ext.create('Ext.grid.property.Grid', {
				itemId: 'propgrid',
				border: false,
				customEditors: this.getCustomEditors(),
				propertyNames: this.getPropertyNames(),
				customRenderers: this.getCustomRenderers(),
				source: {}
			})]
		});
		this.callParent(arguments);
	},

/**
	* Returns an object, containing custom editors.
	* An object containing name/value pairs of custom editor type definitions
	* that allow the grid to support additional types of editable fields
	* @return {Object}
	*/
	getCustomEditors: function() {
		return {};
	},

/**
	* Returns an object, containing custom property names.
	* An object containing custom property name/display name pairs.
	* If specified, the display name will be shown in the name column
	* instead of the property name.
	* @return {Object}
	*/
	getPropertyNames: function() {
		return {};
	},

/**
	* Returns an object, containing custom renderers.
	* An object containing name/value pairs of custom
	* renderer type definitions that allow the grid
	* to support custom rendering of fields
	* @return {Object}
	*/
	getCustomRenderers: function() {
		return {};
	}
});