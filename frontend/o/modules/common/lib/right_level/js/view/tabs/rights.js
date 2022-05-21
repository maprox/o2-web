/**
 * Access level editor tab rights
 * @class O.common.lib.right_level.tab.Rights
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.common.lib.right_level.tab.Rights', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.common-lib-right_level-tab-rights',

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Rights'),
			itemId: 'rights',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			defaults: {
				hideHeaders: true,
				flex: 1,
				columns: [{
					dataIndex: 'name',
					flex: 1
				}]
			},
			items: [{
				xtype: 'gridpanel',
				itemId: 'included',
				title: _('Included rights'),
				multiSelect: true,
				viewConfig: {
					plugins: {
						ptype: 'gridviewdragdrop',
						dragGroup: 'accessLevelRightIncluded',
						dropGroup: 'accessLevelRightAvaiable'
					}
				},
				store: C.getStore('x_right', {
					sorters: [{property: 'name'}]
				})
			}, {
				xtype: 'tbspacer',
				flex: null,
				width: 10
			}, {
				xtype: 'gridpanel',
				itemId: 'available',
				title: _('Available rights'),
				multiSelect: true,
				viewConfig: {
					plugins: {
						ptype: 'gridviewdragdrop',
						dragGroup: 'accessLevelRightAvaiable',
						dropGroup: 'accessLevelRightIncluded'
					}
				},
				store: C.getStore('x_right', {
					sorters: [{property: 'name'}]
				})
			}]
		});
		this.callParent(arguments);
		// init variables
		this.gridIncluded = this.down('#included');
		this.gridAvailable = this.down('#available');
	}
});
