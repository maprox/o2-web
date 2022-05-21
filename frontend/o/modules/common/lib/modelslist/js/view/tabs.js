/**
 * @class O.common.lib.modelslist.Tabs
 * @extends C.ui.Panel
 */
C.define('O.common.lib.modelslist.Tabs', {
	extend: 'C.ui.Panel',
	alias: 'widget.common-lib-modelslist-tabs',

	model: 'undefined-model',
	managerAlias: 'undefined-manager-alias',
	managerIsJoined: false,

/**
	* Tabs aliases
	* @type String[]
	*/
	tabsAliases: null,

/**
	* Individual tabs config objects
	* @type Object[]
	*/
	tabsParams: {},

/*  Configuration */
	disabled: true,
	hiddenToolbar: false,
	layout: {
		type: 'fit',
		align: 'stretch'
	},

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'otabpanel',
				itemId: 'tabspanel',
				items: this.createTabs()
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				defaults: {
					xtype: 'button',
					disabled: true
				},
				items: [{
					itemId: 'msgReadonly',
					xtype: 'tbitem',
					cls: 'readonly-message',
					html: _('This record is readonly for you.') + '<br/>' +
						_('You could not save your changes, so don\'t do them.')
				}, {
					itemId: 'btnSave',
					text: _('Save'),
					iconCls: 'save'
				}, {
					itemId: 'btnReset',
					text: _('Reset'),
					iconCls: 'modelseditor_reset'
				}],
				hidden: this.hiddenToolbar
			}]
		});
		this.callParent(arguments);
		// save component links
		this.tabs = this.down('#tabspanel');
		this.msgReadonly = this.down('#msgReadonly');
		this.btnSave = this.down('#btnSave');
		this.btnReset = this.down('#btnReset');
	}
});
