/**
 * @fileOverview Screen resolution module
 *
 * @class O.ui.module.ScreenResolution
 * @extends C.ui.Module
 */
C.define('O.ui.module.ScreenResolution', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-screenresolution',

/**
	* Module type
	*/
	type: 'link',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'screenresolution',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Screen resolution',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Screen resolution tracking',

/**
	* Minimum sizes for the desktop UI
	* @type Number
	*/
	minWidth: 1000,
	minHeight: 700,

/**
	* Language specific
	*/
	msgViewChange: 'Your browser client size is <b>{0}</b>.<br/>' +
		'It is too small for the desktop UI.<br/>' +
		'Do you wish to reload page with mobile user interface?',

/**
	* Initialization of module.
	*/
	init: function() {
		this.callParent(arguments);
		this.checkChange();
		O.ui.Desktop.getViewport().on('resize', this.checkChange, this);
	},

/**
	* Checks for browser size change
	* If browser size is too small to fit desktop ui, user is asked to
	* change ui to mobile (if he didn't already answer earlier)
	*/
	checkChange: function() {
		if (!this.shouldBeChanged()) { return; }
		// request user confirmation
		return; // no mobile version yet
		O.msg.confirm({
			msg: Ext.String.format(this.msgViewChange, this.getSizeString()),
			fn: function(buttonId) {
				this.userAlreadyAnswered = true;
				if (buttonId != 'yes') {return;}
				C.utils.reload();
			},
			scope: this
		});
	},

/**
	* Check if user already made choice.
	* If no, then checks browser size to fit this.minWidth and this.minHeight
	* @return Boolean
	*/
	shouldBeChanged: function() {
		if (this.userAlreadyAnswered) { return false; }
		var pageSize = C.utils.getPageSize();
		return (pageSize.w < this.minWidth && pageSize.h < this.minHeight);
	},

/**
	* Returns string for current browser size in format WxH
	* @return String
	*/
	getSizeString: function() {
		var pageSize = C.utils.getPageSize();
		return Ext.String.format('{0}x{1}', pageSize.w, pageSize.h);
	}

});