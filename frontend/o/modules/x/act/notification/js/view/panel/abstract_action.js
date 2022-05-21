/**
 * @class O.x.act.notification.tab.Actions
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.act.notification.panel.AbstractAction', {
	extend: 'Ext.form.Panel',
	alias: 'widget.x-notification-panel-abstract-action',

	/**
	 * Match activate_state column
	 */
	statePostfix: 1,

	/**
	 * Maps title to alias
	 */
	titlesMap: {
		'undefined_alias': 'undefined title'
	},

	/**
	* Returns an array of notification types aliases, on wich
	* this param panel is visible during initialization of "Params" tab
	* @return String[]
	*/
	getNotificationTypes: function() {
		return [
			'undefined_notification_type'
		];
	},

	/**
	 * Applies window title depends on alias
	 */
	applyTitle: function(alias) {
		this.setTitle('');
		if (!alias) {
			return;
		}

		if (this.titlesMap[alias]) {
			this.setTitle(_(this.titlesMap[alias]));
		}
	},

/**
	* @constructor
	*/
	initComponent: function() {
		this.paramPanelPrefix = 'x-notification-action-';
		Ext.apply(this, {
			title: '',
			//iconCls: 'notification-actions',
			itemId: 'action-panels-panel-' + this.statePostfix,
			//bodyPadding: 20,
			autoScroll: true,
			layout: 'anchor',
			defaults: {
				anchor: '100%',
				margin: '0 0 10 0',
				labelAlign: 'top'
			},
			items: [{
				xtype: 'panel',
				border: false,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: [{
					layout: 'anchor',
					border: false,
					defaults: {
						labelAlign: 'top',
						anchor: '100%'
					},
					flex: 1,
					items: [{
						xtype: 'textarea',
						name: 'message_' + this.statePostfix,
						fieldLabel: _('Message ' + this.statePostfix),
						height: 116
					}]
				}, {
					xtype: 'tbspacer',
					width: 10
				}, {
					layout: 'anchor',
					border: false,
					defaults: {
						labelAlign: 'top',
						anchor: '100%'
					},
					flex: 1,
					items: [{
						xtype: 'gridpanel',
						itemId: 'tags-grid',
						border: false,
						store: Ext.getStore('store-x_notification_alias'),
						columns: {
							defaults: {
								menuDisabled: true,
								sortable: false
							}, items: [{
								header: _('Alias'),
								dataIndex: 'alias',
								width: 150
							}, {
								header: _('Description'),
								dataIndex: 'description',
								flex: 1
							}]
						}
					}]
				}]
			}, {
				xtype: this.paramPanelPrefix + 'email'
			}, {
				xtype: this.paramPanelPrefix + 'sms'
			}, {
				xtype: this.paramPanelPrefix + 'telegram'
			}, {
				xtype: this.paramPanelPrefix + 'user'
			}, {
				xtype: this.paramPanelPrefix + 'groupadd'
			}, {
				xtype: this.paramPanelPrefix + 'groupremove'
			}, {
				xtype: this.paramPanelPrefix + 'url'
			}]
		});
		this.callParent(arguments);
		// init variables
		this.actionPanels = this.query(
			'component[destiny=x-notification-action]');
		this.tagsGrid = this.down('#tags-grid');
	}
});
