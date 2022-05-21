/**
 * Service desk issues list
 * @class O.sdesk.issues.Panel
 * @extends C.ui.Panel
 */
C.define('O.sdesk.issues.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.sdesk-issues-panel',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				stateful: true,
				innerStateId: 'main',
				xtype: 'sdesk_issues_list'
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					iconCls: 'issue-create',
					text: _('Create issue'),
					action: 'create'
				}, {
					iconCls: 'issue-edit',
					text: _('Edit'),
					hidden: true,
					action: 'edit'
				}, {
					iconCls: 'issue-delete',
					text: _('Delete'),
					hidden: true,
					action: 'delete'
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.list = this.down('sdesk_issues_list');
		this.btnCreate = this.down('button[action=create]');
		this.btnEdit = this.down('button[action=edit]');
		this.btnDelete = this.down('button[action=delete]');
	}
});