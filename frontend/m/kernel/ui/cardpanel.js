/**
 * Panel with card layout and top docked toolbar for selecting cards
 * @class M.kernel.ui.CardPanel
 * @extend C.ui.Panel
 */
Ext.define('M.kernel.ui.CardPanel', {
	extend: 'C.ui.Panel',
	alias: 'widget.ocardpanel',

/**
	* @event close
	* Fires after the close button was pressed, and panel has been hidden
	* @param {M.lib.objectsgroupslist.Panel} this
	*/

	config: {
		layout: {
			type: 'card',
			animation: {
				type: 'slide',
				direction: 'left'
			}
		},
		/**
		 * Hide close button from the top toolbar
		 * @type Boolean
		 */
		hideCloseButton: false
	},

/**
	* @construct
	*/
	initialize: function() {
		// call parent
		this.callOverridden(arguments);
		// define components of module
		this.mapItems = {};
		this.getItems().each(function(item) {
			this.mapItems[item.config.itemAlias] = item;
		}, this);
		// add navigation bar
		this.setItems([{
			itemId: 'navigationBar',
			xtype: 'toolbar',
			//ui: 'neutral',
			docked: 'top',
			items: [{
				xtype: 'segmentedbutton',
				action: 'tabs',
				items: this.getNavigationItems()
			}]
		}]);
		this.navigationBar = this.down('#navigationBar');
		if (this.navigationBar && !this.getHideCloseButton()) {
			this.navigationBar.add([{
				xtype: 'spacer'
			}, {
				xtype: 'button',
				iconCls: 'delete',
				ui: 'plain',
				action: 'close',
				iconMask: true,
				hidden: this.getHideCloseButton()
			}]);
		}
		// close button handler
		this.btnClose = this.down('button[action=close]');
		if (this.btnClose) {
			this.btnClose.on('tap', this.onBtnCloseTap, this);
		}
		this.tabButtons = this.down('segmentedbutton[action=tabs]');
		if (this.tabButtons) {
			this.tabButtons.on('toggle', this.onTabToggle, this);
		}
		// self event handling
		this.on({
			painted: 'onPainted',
			scope: this
		});
	},

/**
	* Fires after the component is painted
	*/
	onPainted: function() {
		this.syncTabs();
	},

/**
	* Synchronizes the current active item and tab buttons
	* @private
	*/
	syncTabs: function() {
		var item = this.getActiveItem();
		if (!item) { return; }
		var btn = this.down('button[action=' + item.config.itemAlias + ']');
		if (btn && this.tabButtons) {
			this.tabButtons.setPressedButtons([btn]);
		}
	},

/**
	* Close button tap handler.
	* Fires "hide" event and hides this panel
	* @private
	*/
	onBtnCloseTap: function() {
		this.hide();
		this.fireEvent('close', this);
	},

/**
	* Returns navigation buttons for card items
	* @return {Object[]}
	*/
	getNavigationItems: function() {
		var buttons = [];
		var items = this.getItems();
		if (items.length) {
			items.each(function(item) {
				var config = item.config;
				buttons.push({
					action: config.itemAlias,
					text: config.title,
					iconCls: config.iconCls,
					iconAlign: config.iconAlign
				});
			}, this);
		}
		return buttons;
	},

/**
	* Handler of tab changing
	* @param {Ext.SegmentedButton} owner
	* @param {Ext.Button} button
	* @param {Boolean} pressed
	* @private
	*/
	onTabToggle: function(owner, button, pressed) {
		this.setActiveTab(button.config.action);
	},

/**
	* Returns item instance by its itemAlias
	* @param {String} itemAlias
	* @return {Ext.Component/Null}
	*/
	getItemByItemAlias: function(itemAlias) {
		return this.mapItems[itemAlias];
	},

/**
	* Open panel by its proxy itemAlias
	* @param {String} itemAlias
	*/
	setActiveTab: function(itemAlias) {
		var panel = this.getItemByItemAlias(itemAlias);
		if (!panel) { return; }
		// set animation direction
		var isNext = (
			this.getItemIndexByItemAlias(itemAlias) >
			this.getItemIndex(this.getActiveItem())
		);
		this.getLayout().setAnimation({
			type: 'slide',
			direction: (isNext) ? 'left' : 'right'
		});
		// change active tab
		this.setActiveItem(panel);
		this.syncTabs();
	},

/**
	* Returns an index of the item by instance.<br/>
	* Item must have field "itemAlias", wich used as a parameter
	* to #getItemIndexByItemAlias method
	* @param {Ext.Panel} panel
	* @return {Number} Index of a panel, or -1 if not found
	*/
	getItemIndex: function(panel) {
		return this.getItemIndexByItemAlias(panel.config.itemAlias);
	},

/**
	* Returns an index of the item by its itemAlias
	* @param {String} itemAlias
	* @return {Number} Index of an item, or -1 if not found
	*/
	getItemIndexByItemAlias: function(itemAlias) {
		if (!itemAlias) { return null; }
		var index = -1;
		for (var mapItemAlias in this.mapItems) {
			if (this.mapItems.hasOwnProperty(mapItemAlias)) {
				index++;
				if (itemAlias === mapItemAlias) {
					return index;
				}
			}
		}
		return -1;
	},

/**
	* Return an item instance by its index in the container
	* @param {Number} index
	* @return {Ext.Component}
	*/
	getItemByIndex: function(index) {
		var cnt = -1;
		for (var mapItemAlias in this.mapItems) {
			if (this.mapItems.hasOwnProperty(mapItemAlias)) {
				cnt++;
				if (cnt === index) {
					return this.mapItems[mapItemAlias];
				}
			}
		}
		return null;
	},

/**
	* Showing/hiding of close button in the tabpanel tabbar
	* @param {Boolean} value
	*/
	applyHideCloseButton: function(value) {
		if (this.btnClose) {
			this.btnClose.setHidden(value);
		}
		return value;
	}
});