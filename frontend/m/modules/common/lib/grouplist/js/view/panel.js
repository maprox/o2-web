/**
 * Abstract groups list
 * @class M.lib.grouplist.Panel
 * @exentds C.ui.Panel
 */
Ext.define('M.lib.grouplist.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.grouplist',

/*  Configuration */
	config: {
		layout: 'fit',
		cls: 'groupslist',
		/**
		 * Allow multiple selection of objects
		 * @type Boolean
		 */
		multiSelectObjects: true
	},

	/**
	 * @construct
	 */
	initialize: function() {
		var me = this;
		var tplIf = '<tpl if="this.isInactive(values)"> inactive</tpl>';
		this.setItems([{
			itemId: 'cards',
			layout: {
				type: 'card',
				animation: {
					type: 'slide',
					direction: 'left'
				}
			},
			items: [{
				xtype: 'list',
				itemId: 'listGroups',
				mode: 'SINGLE',
				cls: 'list-groups',
				itemTpl: '<div class="group">' +
						'{name} <span>({count})</span>' +
					'</div>'
			}, {
				xtype: 'panel',
				layout: 'fit',
				items: [{
					xtype: 'toolbar',
					itemId: 'toolbarObjects',
					docked: 'top',
					items: [{
						itemId: 'btnBack',
						ui: 'back',
						text: _('Back')
					}/*, {
						xtype: 'spacer'
					}, {
						itemId: 'buttonMenuCheck',
						xtype: 'buttonmenu',
						iconCls: 'check_dotted',
						hidden: !this.getMultiSelectObjects(),
						items: [{
							itemId: 'btnCheckAll',
							action: 'check',
							iconCls: 'check2',
							text: _('Check all')
						}, {
							itemId: 'btnUncheckAll',
							action: 'uncheck',
							//iconCls: 'empty1',
							text: _('Uncheck all')
						}]
					}*/]
				}, {
					xtype: 'list',
					itemId: 'listObjects',
					mode: this.getMultiSelectObjects() ? 'MULTI' : 'SINGLE',
					cls: 'checkbox-list',
					itemTpl: new Ext.XTemplate(
						'<div class="item' + tplIf + '">{name}</div>',
						{
							isInactive: function(values) {
								var isInactive =
									(values.state !== C.cfg.RECORD_IS_ENABLED);
								if (me.config.itemAlias == 'mon_device') {
									isInactive = isInactive
										|| !values.lastpacket;
								}
								return isInactive
							}
						}
					)
				}]
			}]
		}, {
			xtype: 'toolbar',
			docked: 'bottom',
			items: [{
				xtype: 'searchfield',
				itemId: 'fieldSearch',
				flex: 1
			}]
		}]);
		// call parent
		this.callParent(arguments);

		// define components of module
		this.cards = this.down('#cards');
		this.listGroups = this.down('#listGroups');
		this.listObjects = this.down('#listObjects');
		this.btnBack = this.down('#btnBack');
		this.toolbarObjects = this.down('#toolbarObjects');
		this.fieldSearch = this.down('#fieldSearch');
		this.btnCheckMenu = this.down('#buttonMenuCheck');
	}
});
