/**
 * Registration application class
 * @instance Ext.application
 */
Ext.application({
	// Do not remove app name: IE < 8.0 fix
	name: 'O.app',

/**
	* Application entry point
	*/
	launch: function() {
		Ext.widget('desktop');
		// Init supportbox
		var supportbox = Ext.create('O.ui.module.SupportBox', {
			showemail: true
		});
		supportbox.init();
	}
});