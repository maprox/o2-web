/**
   @copyright  2012, Maprox LLC <http://maprox.net>

   @author     Alexander Lyapko <sunsay@maprox.net>
   @author     Anton Grinin <agrinin@maprox.net>
   @author     Konstantin Pakshaev <kpakshaev@maprox.net>
*/

/**
 * @class O.sdesk.lib.issues.EditorWindow
 * @extends O.ui.window.ModelEditor
 */
C.define('O.sdesk.lib.issues.EditorWindow', {
	extend: 'O.ui.window.ModelEditor',
	alias: 'widget.sdesk_issue_editorwindow',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Issue editor'),
			panelAlias: 'sdesk-issue-editorpanel',
			modelAlias: 'Sdesk.Issue'
		});
		this.callParent(arguments);
	}
});