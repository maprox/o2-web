/**
 * @class Ext.tab.Panel
 */

C.utils.inherit('Ext.selection.CheckboxModel', {
	onRowMouseDown: function(view, record, item, index, e) {

		view.el.focus();
		var me = this,
			checker = e.getTarget('.' + Ext.baseCSSPrefix + 'grid-cell'),
			mode;

		if (!me.allowRightMouseSelection(e)) {
			return;
		}

		// checkOnly set, but we didn't click on a checker.
		if (me.checkOnly && !checker) {
			return;
		}

		if (checker) {
			mode = me.getSelectionMode();
			// dont change the mode if its single otherwise
			// we would get multiple selection
			if (mode !== 'SINGLE') {
				me.setSelectionMode('SIMPLE');
			}
			me.selectWithEvent(record, e);
			me.setSelectionMode(mode);
		} else {
			me.selectWithEvent(record, e);
		}
	}
});