/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Button menu
 * @class M.kernel.ui.ButtonMenu
 * @extend Ext.Button
 */
Ext.define('M.kernel.ui.ButtonMenu', {
	extend: 'Ext.Button',
	alias: 'widget.buttonmenu',

	config: {
/**
		* @cfg {Array/Object} items
		* The child items to add to the button menu.
		* This is an array of Ext.Buttons configurations or instances.
		* @accessor
		*/
		items: null,
		iconMask: true,
		ui: 'plain'
	},

/**
	* @contruct
	*/
	initialize: function() {
		// call parent
		this.callParent(arguments);
		this.initEventDispatcher();
		this.on('tap', this.onTap, this);
	},

/**
	* Initialization of an event dispatcher for hiding
	* menupanel if user clicked (taped) elsewhere.
	* @private
	*/
	initEventDispatcher: function() {
		var menuPanel = this.getMenuPanel();
		var isVisible = !this.getMenuPanel().getHidden();
		var eventDispatcher = this.getEventDispatcher();
		if (eventDispatcher) {
			eventDispatcher.addListener('element', '*', '*', function(a) {
				if (a.type === 'mousedown' || a.type === 'touchstart') {
					isVisible = !menuPanel.getHidden()
				}
				if (a.type === 'mouseup' || a.type === 'touchend') {
					if (isVisible && isVisible !== menuPanel.getHidden()) {
						menuPanel.hide();
					}
				}
			});
		}
	},

/**
	* Returns menu panel instance
	* @return {Ext.Panel}
	* @protected
	*/
	getMenuPanel: function() {
		if (!this.menuPanel) {
			var items = [];
			Ext.each(this.getItems(), function(item) {
				items.push(Ext.apply({
					listeners: {
						tap: this.onMenuButtonTap,
						scope: this
					}
				}, item));
			}, this);
			// define components of menu
			this.menuPanel = Ext.widget('uipanel', {
				layout: 'vbox',
				ui: 'dark',
				cls: 'menupanel',
				hidden: true,
				defaults: {
					xtype: 'button',
					ui: 'action',
					iconMask: true,
					iconAlign: 'right'
				},
				items: items
			});
		}
		return this.menuPanel;
	},

/**
	* Tap handler
	* @private
	*/
	onTap: function() {
		var menuPanel = this.getMenuPanel();
		if (menuPanel.getHidden()) {
			menuPanel.showBy(this);
		} else {
			menuPanel.hide();
		}
	},

/**
	* Handler for button tap in the menu
	* @private
	*/
	onMenuButtonTap: function(button) {
		this.getMenuPanel().hide();
		this.fireEvent('itemtap', this, button);
	}

});
