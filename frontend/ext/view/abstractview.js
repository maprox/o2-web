/**
 * Issue #1264 <http://vcs.maprox.net/issues/1264>
 * @class Ext.view.AbstractView
 */
C.utils.inherit('Ext.view.AbstractView', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.on({
			beforerefresh: function() { this.saveScrollState(); },
			refresh: function() { this.restoreScrollState(); },
			scope: this
		});
	}
});