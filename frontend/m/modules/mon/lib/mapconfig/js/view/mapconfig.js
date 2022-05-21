/**
 * Map config panel
 * @class O.app.view.MapConfigPanel
 * @extend C.ui.Panel
 */
Ext.define('O.app.view.MapConfigPanel', {
	extend: 'C.ui.Panel',
	alias: 'widget.mapconfig',

/** Configuration */
	config: {
		modal: true,
		width: 280,
		height: '80%',
		scrollable: true,
		cls: 'mapconfig',
		right: 0,
		left: 0,
		layout: {
			type: 'vbox',
			align: 'stretch'
		}
	},

	/**
	 * @construct
	 */
	initialize: function() {
		// call parent
		this.callParent(arguments);
		this.setItems([{
			itemId: 'configNavigation',
			xtype: 'toolbar',
			docked: 'top',
			title: _('Map config'),
			items: [{
				xtype: 'spacer'
			},{
				itemId: 'btnConfigClose',
				iconCls: 'delete_black2',
				ui: 'plain',
				align: 'right',
				iconMask: true
			}]
		}, {
			xtype: 'togglefield',
			option: 'followselected',
			value: true,
			label: _('Follow selected'),
			labelWidth: '60%'
		}, {
			xtype: 'togglefield',
			option: 'showpath',
			value: true,
			label: _('Show path'),
			labelWidth: '60%'
		}, {
			xtype: 'togglefield',
			option: 'showlabels',
			label: _('Show labels'),
			labelWidth: '60%'
		}]);
		this.fieldFollowSelected = this.down('component[option=followselected]');
		this.fieldShowPath = this.down('component[option=showpath]');
		this.fieldShowLabels = this.down('component[option=showlabels]');
		this.btnConfigClose = this.down('#btnConfigClose');
	}
});