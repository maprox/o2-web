/**
 * @class O.ux.grid.plugin.RowExpander
 * @extends Ext.grid.plugin.RowExpander
 * Plugin (ptype = 'o-rowexpander') that adds the ability to have
 * a Column in a grid which enables a second row body which expands/contracts.
 * The expand/contract behavior is configurable to react
 * on clicking of the column, double click of the row,
 * and/or hitting enter while a row is selected.
 *
 * @ptype o-rowexpander
 */
Ext.define('O.ux.grid.plugin.RowExpander', {
	extend: 'Ext.grid.plugin.RowExpander',
	alias: 'plugin.o-rowexpander',

/**
	* @cfg {Boolean} expandOnClick
	* <tt>true</tt> to toggle a row between expanded/collapsed when clicked
	* (defaults to <tt>false</tt>).
	*/
	expandOnClick: false,

/**
	* Function wich determine if record is expandable
	* @param {Object} record
	* @return {Boolean}
	*/
	expandable: function(record) {
		return true;
	},

/**
	* Binds itemclick event in addition to standard events
	* @param {Ext.view.View} view
	*/
	bindView: function(view) {
		this.callOverridden(arguments);
		if (this.expandOnClick) {
			view.on('itemclick', this.onDblClick, this);
		}
	},

/**
	* Toogles row
	* @param {Number} rowIdx
	* @param {Ext.data.Record} record
	*/
	toggleRow: function(rowIdx, record) {
		if (!this.expandable(record)) { return; }
		this.callOverridden(arguments);
	},

/**
	* Returns header configuration
	*/
	getHeaderConfig: function() {
		var me = this;

		return {
			width: 24,
			lockable: false,
			sortable: false,
			resizable: false,
			draggable: false,
			hideable: false,
			menuDisabled: true,
			tdCls: Ext.baseCSSPrefix + 'grid-cell-special',
			renderer: function(value, metadata, record) {
				// Only has to span 2 rows if it is not in a lockable grid.
				if (!me.grid.ownerLockable) {
					metadata.tdAttr += ' rowspan="2"';
				}
				if (me.hideExpanderIcon || !me.expandable(record)) {
					return '';
				}
				return '<div class="' + Ext.baseCSSPrefix +
					'grid-row-expander">&#160;</div>';
			},
			processEvent: function(type, view, cell, rowIndex, cellIndex, e, record) {
				//if (type == "mousedown" && e.getTarget('.x-grid-row-expander')) {
				if (type == "mousedown" &&
						e.getTarget('.x-grid-row-expander') &&
						!me.expandOnClick) {

					me.toggleRow(rowIndex, record);
					return me.selectRowOnExpand;
				}
			}
		};
	}

});

