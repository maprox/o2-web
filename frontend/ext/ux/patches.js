/**
 * @class Ext.Component
 * Sencha Touch unfication
 */
C.utils.inherit('Ext.Component', {
	initComponent: function() {
		this.initialize();
		this.callOverridden(arguments);
	},
	initialize: Ext.emptyFn
});

if (Ext.getVersion().isLessThan('4.2.1')) {

	/**
	 * [4.2] Stateful grid store sorter error in debug mode
	 * http://www.sencha.com/forum/showthread.php?261524-Stateful-grid-store-sorter-with-only-sorterFn-error-on-applyState-in-debug-mode
	 *//*
	Ext.define('Override_Ext.util.Sorter', {
		override: 'Ext.util.Sorter',
		serialize: function() {
			return {
				root: this.root,
				property: this.property,
				direction: this.direction,
				sorterFn: this.sorterFn
			};
		}
	});*/

} else
if (Ext.getVersion().isLessThan('4.2.2')) {

	/**
	 * [4.2] Tooltip width error
	 * http://www.sencha.com/forum/showthread.php?260106-Tooltips-on-forms-and-grid-are-not-resizing-to-the-size-of-the-text/page3#24
	 */
	delete Ext.tip.Tip.prototype.minWidth;

	if (Ext.isIE10) {
		Ext.supports.Direct2DBug = true;
	}

	/**
	 * "[4.2] grid RowExpander without enableLocking : colspan problem
	 * http://www.sencha.com/forum/showthread.php?260545-grid-RowExpander-without-enableLocking-colspan-problem
	 */
	Ext.define('Override_Ext.grid.plugin.RowExpander', {
		override: 'Ext.grid.plugin.RowExpander',
		getRowBodyFeatureData: function(record, idx, rowValues) {
			var me = this
			me.self.prototype.setupRowData.apply(me, arguments);
			// If we are lockable, the expander column is moved into
			// the locked side, so we don't have to span it
			/*if (!me.grid.ownerLockable) {
				rowValues.rowBodyColspan = rowValues.rowBodyColspan - 1;
			}*/
			rowValues.rowBody = me.getRowBodyContents(record);
			rowValues.rowBodyCls = me.recordsExpanded[record.internalId] ? '' : me.rowBodyHiddenCls;
		}
	});

	Ext.define('Override_Ext.grid.RowEditor', {
		override: 'Ext.grid.RowEditor',
		addFieldsForColumn: function(column, initial) {
			var me = this,
				i,
				length, field;

			if (Ext.isArray(column)) {
				for (i = 0, length = column.length; i < length; i++) {
					me.addFieldsForColumn(column[i], initial);
				}
				return;
			}

			if (column.getEditor) {

				// Get a default display field if necessary
				field = column.getEditor(null, {
					xtype: 'displayfield',
					// Override Field's implementation so that the default display fields will not return values. This is done because
					// the display field will pick up column renderers from the grid.
					getModelData: function() {
						return null;
					}
				});

				// BEGIN override
				me.mon(field, 'change', me.onFieldChange, me);
				// END override

				if (column.align === 'right') {
					field.fieldStyle = 'text-align:right';
				}

				if (column.xtype === 'actioncolumn') {
					field.fieldCls += ' ' + Ext.baseCSSPrefix + 'form-action-col-field'
				}

				if (me.isVisible() && me.context) {
					if (field.is('displayfield')) {
						me.renderColumnData(field, me.context.record, column);
					} else {
						field.suspendEvents();
						field.setValue(me.context.record.get(column.dataIndex));
						field.resumeEvents();
					}
				}
				if (column.hidden) {
					me.onColumnHide(column);
				} else if (column.rendered && !initial) {
					// Setting after initial render
					me.onColumnShow(column);
				}
			}
		}
	});

	Ext.define('Override_Ext.data.AbstractStore', {
		override: 'Ext.data.AbstractStore',

		/**
		* @private
		* Normalizes an array of sorter objects, ensuring that they are all Ext.util.Sorter instances
		* @param {Object[]} sorters The sorters array
		* @return {Ext.util.Sorter[]} Array of Ext.util.Sorter objects
		*/
		decodeSorters: function(sorters) {
			if (!Ext.isArray(sorters)) {
				if (sorters === undefined) {
					sorters = [];
				} else {
					sorters = [sorters];
				}
			}

			var length = sorters.length,
				Sorter = Ext.util.Sorter,
				fields = this.model ? this.model.prototype.fields : null,
				field,
				config, i;

			for (i = 0; i < length; i++) {
				config = sorters[i];

				if (!(config instanceof Sorter)) {
					if (Ext.isString(config)) {
						config = {
							property: config
						};
					}

					Ext.applyIf(config, {
						root     : this.sortRoot,
						direction: "ASC"
					});

					//support for 3.x style sorters where a function can be defined as 'fn'
					if (config.fn) {
						config.sorterFn = config.fn;
					}

					//support a function to be passed as a sorter definition
					if (typeof config == 'function') {
						config = {
							sorterFn: config
						};
					}

					// ensure sortType gets pushed on if necessary
					if (fields && !config.transform) {
						field = fields.get(config.property);
						config.transform = field && field.sortType !== Ext.identityFn ? field.sortType : undefined;
					}

					// Patch starts here
					if (config.property === undefined && config.sorterFn === undefined) {
						console.debug("A Sorter requires either a property or a sorter function");
						continue;
					}


					sorters[i] = new Ext.util.Sorter(config);
				}
			}

			return sorters;
		}
	});

	Ext.define('Override_Ext.view.Table', {
		override: 'Ext.view.Table',
		/*
			Temporary fix for bug in ExtJS 4.2.1. See: sencha.com/forum/showthread.php?264657-Exception-When-Selecting-First-Grid-Row
		*/
		getRowStyleTableElOriginal: Ext.view.Table.prototype.getRowStyleTableEl,
		getRowStyleTableEl: function() {
			var el = this.getRowStyleTableElOriginal.apply(this, arguments);
			if (!el) {
				el = {
					addCls: Ext.emptyFn,
					removeCls: Ext.emptyFn,
					tagName: {}
				}
			}
			return el;
		}
	});
}