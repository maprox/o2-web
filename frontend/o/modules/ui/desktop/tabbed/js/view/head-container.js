/**
 * Class of application main menu
 * @class O.ui.HeadContainer
 * @extends Ext.panel.Panel
 */
C.define('O.ui.HeadContainer', {
	extend: 'Ext.container.Container',
	alias: 'widget.head-container',

/**
	* Desktop initialization
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			border: false,
			layout: {
				type: 'hbox',
				pack: 'start'
			},
			defaults: {
				xtype: 'container'
			},
			items: [{
				id: 'headerTitle',
				html: '<p>' + VARIABLES['title'] + '</p>',
				width: 46
			}, {
				xtype: 'button',
				id: 'btnSelectModule',
				ui: 'head-module',
				menu: {
					plain: true,
					cls: 'head-menu',
					items: []
				}
			}, {
				flex: 1
			}, {
				id: 'headerNotifications',
				width: 50
			}, {
				id: 'connectionInfo',
				width: 22
			}, {
				xtype: 'button',
				id: 'headerInfo',
				width: 200,
				ui: 'head-module',
				menu: {
					width: 200,
					plain: true,
					id: 'clockUtcMenu',
					cls: 'head-menu',
					items: []
				}
			}, {
				xtype: 'link-container'
			}, {
				width: 10
			}]
		});
		this.callParent(arguments);
		// init variables
		this.btnSelectModule = this.down('#btnSelectModule');
		this.headerInfo = this.down('#headerInfo');
		this.connectionInfo = this.down('#connectionInfo');
	},

/**
	* Returns info template
	* @return {Ext.XTemplate}
	*/
	getInfoTemplate: function() {
		if (!this.infoTemplate) {
			this.infoTemplate = new Ext.XTemplate(
				'<span id="ui_date">{date}</span>',
				'<span id="ui_time">{time} ({utc})</span>'
			);
		}
		return this.infoTemplate;
	},

/**
	 * Returns connection template
	 */
	getConnectionTemplate: function() {
		if (!this.connectionTemplate) {
			this.connectionTemplate = new Ext.XTemplate(
				'<span class="connection-icon {connection}"',
				' data-qtip="{tooltip}"></span>'
			);
		}

		return this.connectionTemplate;
	}
});
