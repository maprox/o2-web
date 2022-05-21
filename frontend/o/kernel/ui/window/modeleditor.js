/**
   @copyright  2012, Maprox LLC <http://maprox.net>

   @author     Alexander Lyapko <sunsay@maprox.net>
   @author     Anton Grinin <agrinin@maprox.net>
   @author     Konstantin Pakshaev <kpakshaev@maprox.net>
*/

/**
 * @class O.ui.window.ModelEditor
 * @extends O.ui.Window
 */
Ext.define('O.ui.window.ModelEditor', {
	extend: 'O.ui.Window',

/*  Configuration */
	layout: 'fit',
	modal: true,

/**
	* @constructor
	*/
	initComponent: function() {
		if (this.panelAlias) {
			Ext.apply(this, {
				items: [{
					xtype: this.panelAlias
				}]
			});
		}
		this.callParent(arguments);
		this.editorPanel = this.down(this.panelAlias);
		if (this.editorPanel) {
			this.editorPanel.enable();
		}
	},

/**
	* Shows window with specified record
	* @param {Ext.data.Model} record
	*/
	execute: function(record) {
		if (record) {
			// lot's load record
			this.load(record);
		} else {
			// let's create record
			this.load(Ext.create(this.modelAlias, {id: 0}));
		}
		this.show();
	},

/**
	* Loads data from record into container
	* @param {Ext.data.Model} record
	*/
	load: function(record) {
		// 
	},

/**
	* Clears the fields data of window panel.
	* Used during creation of model object (to clear previous data)
	*/
	resetFields: Ext.emptyFn
});