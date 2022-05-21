/**
 * Base class for application module panel
 * @class M.kernel.ui.TabPanel
 * @extends Ext.tab.Panel
 */
Ext.define('M.kernel.ui.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.otabpanel',

/**
 * @event afteractiveitemchange
 * Fires after animation of changing tab is done
 */

/**
	* Initialization
	*/
	initialize: function() {
		this.callParent(arguments);
		this.on({
			activeitemchange: 'onActiveItemChange',
			afteractiveitemchange: 'onAfterActiveItemChange',
			scope: this
		});
		O.ui.Desktop.on('lock', 'onLockDesktop', this);
	},

/**
	* Fires when desktop is locked or unlocked
	* @param {Boolean} locked
	*/
	onLockDesktop: function(locked) {
		if (!locked && this.waitingPanel) {
			// Dirty hacks
			var index = this.getCardIndex(this.waitingPanel);
			this.setActiveItem(-1);
			this.setActiveItem(index);
		}
	},

/**
	* Return index of a spectified card
	* @param {Ext.Component} card The card, wich number we need to determine
	* @return {Number}
	*/
	getCardIndex: function(card) {
		if (!card) { return -1; }
		return this.innerItems.indexOf(card);
	},

/**
	* Returns direction of an animation according to new card position
	* @param {Ext.Component} newCard The card that is about to be activated
	* @param {Ext.Component} oldCard The card that is currently active
	* @return String
	*  - left
	*  - right
	*/
	getAnimationDirection: function(newCard, oldCard) {
		return this.getCardIndex(newCard) > this.getCardIndex(oldCard)
			? 'left' : 'right';
	},

/**
	* Fires before user is changing tab
	* @param {Ext.tab.TabPanel} tabPanel The TabPanel
	* @param {Ext.Component} newCard The card that is about to be activated
	* @param {Ext.Component} oldCard The card that is currently active
	*/
	onActiveItemChange: function(tabPanel, newCard, oldCard) {
		var me = this;
		if (O.ui.Desktop.isLocked()) {
			this.waitingPanel = newCard;
			return false;
		}
		if (!oldCard) {
			this.getLayout().setAnimation({
				type: 'slide',
				duration: 0
			});
		} else {
			this.getLayout().setAnimation({
				type: 'slide',
				duration: 300,
				direction: this.getAnimationDirection(newCard, oldCard)
			});
		}
		var animation = this.getLayout().getAnimation();
		if (animation) {
			animation.on('animationend', function() {
				me.fireEvent('afteractiveitemchange',
					tabPanel, newCard, oldCard);
			});
		}
		//O.manager.History.trace(newCard);
		if (newCard.updateLayout) {
			newCard.updateLayout();
		}

		if (oldCard) {
			// check if the animation is not ended yet
			var hidingCards = this.getHidingCards();
			hidingCards.add(oldCard);
			if (hidingCards.getCount() == 1) {
				this.hideOverlays(oldCard);
			}
		}
		this.waitingPanel = null;
	},

/**
	* Fires after tab is changed
	* @param {Ext.tab.TabPanel} tabPanel The TabPanel
	* @param {Ext.Component} newCard The card that is activated
	* @param {Ext.Component} oldCard The card that was active before
	*/
	onAfterActiveItemChange: function(tabPanel, newCard, oldCard) {
		// check if the animation is not ended yet
		var hidingCards = this.getHidingCards();
		hidingCards.remove(oldCard);
		if (hidingCards.getCount() == 0) {
			this.showOverlays(newCard);
		}
	},

/**
	* Returns overlays object (creates if necessary)
	* @return {Object}
	*/
	getOverlaysObject: function() {
		if (!this.overlays) {
			this.overlays = {};
		}
		return this.overlays;
	},

/**
	* Returns an array of hiding cards
	* @return Ext.util.MixedCollection
	*/
	getHidingCards: function() {
		if (!this.hidingCard) {
			this.hidingCard = new Ext.util.MixedCollection();
		}
		return this.hidingCard;
	},

/**
	* Displays hidden overlays of a specified card
	* @param {Ext.Component} card
	*/
	showOverlays: function(card) {
		if (!card || !card.id) { return; }
		var overlays = this.getOverlaysObject()[card.id];
		if (!overlays) { return; }
		Ext.each(overlays, function(overlay) {
			if (overlay.__wasVisible) {
				overlay.showInContainer(
					overlay.__containerPanel,
					overlay.__wasAlignTo
				);
			}
		}, this);
	},

/**
	* Hiding the card overlays
	* @param {Ext.Component} card The card
	*/
	hideOverlays: function(card) {
		if (!card || !card.id) { return; }
		var overlays = this.getOverlaysObject()[card.id];
		if (!overlays) { return; }
		Ext.each(overlays, function(overlay) {
			overlay.__wasVisible = !overlay.isHidden();
			overlay.hide();
		}, this);
	}
});
