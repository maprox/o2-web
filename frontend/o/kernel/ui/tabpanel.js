/**
 * Base class for application module panel
 * @class O.ui.TabPanel
 * @extends Ext.tab.Panel
 */
Ext.define('O.ui.TabPanel', {
	extend: 'Ext.tab.Panel',
	//mixins: ['C.ui.Panel'],
	alias: 'widget.otabpanel',

	enableTabScroll: true,
	resizeTabs: true,
	layoutOnTabChange: true,
	//border: false,

/**
	* Initialization
	*/
	initComponent: function() {
		if (this.module && this.module instanceof C.ui.Module) {
			Ext.applyIf(this, {
				iconCls: this.module.id,
				title: this.module.textShort,
				tooltip: this.module.textLong
			});
		}
		O.ui.Desktop.on('lock', this.onLockDesktop, this);
		this.callParent(arguments);
		this.on('tabchange', 'onTabChange', this);
	},

/**
	* Fires when desktop is locked or unlocked
	* @param {Boolean} locked
	*/
	onLockDesktop: function(locked) {
		if (!locked && this.waitingPanel) {
			this.setActiveTab(this.waitingPanel);
		}
	},

/**
	* Set active tab panel
	* @param {Object} panel
	*/
	setActiveTab: function(panel) {
		if (!O.ui.Desktop.isLocked()) {
			this.callParent(arguments);
			this.waitingPanel = null;
		} else {
			this.waitingPanel = panel;
		}
	},

/**
	* Fires when user is changing tab
	* @param {Ext.tab.TabPanel} tabPanel The TabPanel
	* @param {Ext.Component} newCard The card that is about to be activated
	* @param {Ext.Component} oldCard The card that is currently active
	*/
	onTabChange: function(tabPanel, newCard, oldCard) {
		if (newCard === oldCard) { return; } // can it be?
		O.manager.History.trace(newCard);
		if (newCard.updateLayout) {
			newCard.updateLayout();
		}
	}
});