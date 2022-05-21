/**
 * Region chooser panel
 * @class O.lib.panel.RegionChooser
 * @extends C.ui.Panel
 */
C.define('O.lib.panel.RegionChooser', {
	extend: 'C.ui.Panel',
	alias: 'widget.regionchooser',

/**
	* Multiselection of objects
	* @type {Boolean}
	*/
	multiSelect: true,

/**
	* If true, shows objects panel
	* @type {Boolean}
	*/
	showListPanel: true,

/**
	* True to show panel titles
	* @type {Boolean}
	*/
	showPanelTitles: true,

/**
	* Automatically loads engine after render
	* @type {Boolean}
	*/
	loadEngineOnRender: true,

/**
	* Clear selection if clicked on already selected region
	* @type {Boolean}
	*/
	clearSelectionIfClickedOnSelected: true,

/**
	* Visual configuration
	*/
	border: false,

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'border',
			items: [{
				itemId: 'map',
				region: 'center',
				title: this.showPanelTitles ? _('Regions map') : null
			}, {
				itemId: 'list',
				region: 'west',
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				defaults: {
					xtype: 'groupslist_objects',
					showSelectAll: false,
					border: false,
					flex: 1
				},
				split: true,
				hidden: true,
				width: 250,
				items: [{
					itemId: 'objectslist',
					title: this.showPanelTitles ? _('Objects list') : null
				}, {
					itemId: 'regionslist',
					title: this.showPanelTitles ? _('Regions list') : null,
					flex: 2
				}]
			}]
		});
		this.callParent(arguments);
		this.panelMap = this.down('#map');
		this.panelList = this.down('#list');
		this.panelListObjects = this.down('#objectslist');
		this.panelListRegions = this.down('#regionslist');
	}
});