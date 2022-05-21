/**
 * Base window
 * @class O.ui.Window
 * @extends Ext.window.Window
 */
Ext.define('O.ui.Window', {
	extend: 'Ext.window.Window',

/*  Configuration */
	constrain: true,
	border: false,
	width: 600,
	height: 400,
	minWidth: 200,
	minHeight: 100,
	maximizable: false,
	closeAction: 'hide', // (hide | destroy)
	iconCls: 'w_baseicon',

	resizeOnShow: true,

/**
	* Инициализация окна (настройка методов)
	* @constructs
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.on({
			show: this.doOnShow,
			hide: this.doOnHide,
			scope: this
		});
	},

/**
	* Executes when window is shown
	* @protected
	*/
	doOnShow: function() {
		if (this.resizeOnShow) {
			this.resizeWindow();
		}
	},

/**
	* Executes when window is hiding
	* @protected
	*/
	doOnHide: function() {
		// ...
	},

/**
	* Resizes window to screen
	*/
	resizeWindow: function() {
		var b = Ext.getBody();
		var bw = b.getWidth();
		var bh = b.getHeight();
		var margin = 0.1; // 10%
		var size = {
			width: bw - (bw * margin),
			height: bh - (bh * margin)
		};
		var x = (bw - size.width) * 0.5;
		var y = (bh - size.height) * 0.5;
		this.setPagePosition(x, y);
		this.setSize(size);
	}

});
