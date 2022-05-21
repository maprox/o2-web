/**
 * Application main viewport
 *
 * @class O.view.Viewport
 * @extend Ext.Panel
 */
Ext.define('O.view.Viewport', {
	extend: 'Ext.Panel',
	alias: 'widget.o-viewport',

/*  Configuration */
	config: {
		fullscreen: true,
		layout: 'fit',
		items: [{
			id: 'desktop',
			xtype: 'otabpanel',
			forcedUi: 'dark',
			tabBar: {
				docked: 'bottom'
			}
		}]
	}
});

// =========================================================================

/**
 * @class Ext.Component
 */
Ext.apply(Ext.Component.prototype, {
/*
	* Set's the default ui to {@link C.cfg.baseUi} for all components
	* @return {String}
	* @protected
	*/
	getUi: function() {
		// value of [this.config.ui] is ignored here
		// we can use something like forcedUi
		return (this.forcedUi) ? this.forcedUi : C.cfg.baseUi;
	}
})