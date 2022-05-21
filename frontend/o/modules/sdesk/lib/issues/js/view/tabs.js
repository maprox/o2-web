/**
 * @class O.sdesk.lib.issues.EditorPanel
 * @extends O.comp.ModelsTabs
 */
C.define('O.sdesk.lib.issues.EditorPanel', {
	// TODO: Наследование от несуществующего класса. Перевести на табпанель или новый модель-лист
	extend: 'O.comp.ModelsTabs',
	alias: 'widget.sdesk-issue-editorpanel',

/**
	* Tabs creation
	*/
	createTabs: function() {
		this.tabProps = Ext.create('O.sdesk.lib.issues.TabProps', {
			parent: this,
			title: _('Properties'),
			iconCls: 'issue_props'
		});
		return [
			this.tabProps
		];
	}
});