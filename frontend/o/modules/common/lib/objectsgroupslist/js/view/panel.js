/**
 *
 * @class O.lib.ObjectsGroupsList
 * @extends C.ui.Panel
 */
C.define('O.lib.ObjectsGroupsList', {
	extend: 'C.ui.Panel',
	alias: 'widget.objectsgroupslist',

	title: null,
	msgSearch: 'Search for',
	msgFind: 'Find',

/**
	* Allow selecting of multiple objects (defaults to true)
	* @type {Boolean}
	*/
	multiSelectObjects: true,
	multiSelectGroups: false,
	showSelectAllObjects: true,

/**
	* An array of class names of panels, for wich multiSelect field value
	* whould be of !this.multiSelect
	* @type {Array}
	*/
	reverseSelectionModeFor: null,

/**
	* Panels list
	* @type String[]
	*/
	panels: [
		'O.ui.groups.Devices',
		'O.ui.groups.Zones',
		'O.ui.groups.Vehicles'
	],

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			stateful: true,
			stateId: 'objectsgroupslist',
			stateEvents: ['checkchange', 'select'],
			items: [{
				xtype: 'otabpanel',
				border: false,
				items: this.getItems(),
				deferredRender: false
			}]
		});
		this.callParent(arguments);
	},

/**
	* Returns config array with child panels
	*/
	getItems: function() {
		return [];
	}

});
