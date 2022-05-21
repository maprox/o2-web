/**
 * Fix for rowediting and collapsed fieldsed
 * @class Ext.form.FieldSet
 */
C.utils.inherit('Ext.form.FieldSet', {
	/**
	* @private
	* Collapse or expand the fieldset.
	*/
	setExpanded: function(expanded) {
		var me = this,
			checkboxCmp = me.checkboxCmp,
			operation = expanded ? 'expand' : 'collapse';

		if (!me.rendered || me.fireEvent('before' + operation, me) !== false) {
			expanded = !!expanded;

			if (checkboxCmp) {
				checkboxCmp.setValue(expanded);
			}

			if (expanded) {
				me.removeCls(me.baseCls + '-collapsed');
			} else {
				me.addCls(me.baseCls + '-collapsed');
			}
			me.collapsed = !expanded;
			if (expanded) {
				delete me.getHierarchyState().collapsed;
			} else {
				me.getHierarchyState().collapsed = true;
			}
			if (me.rendered) {
				// say explicitly we are not root because when we have a fixed/configured height
				// our ownerLayout would say we are root and so would not have it's height
				// updated since it's not included in the layout cycle
				me.updateLayout({ isRoot: false });
				me.fireEvent(operation, me);
			}
		}
		return me;
	}
});