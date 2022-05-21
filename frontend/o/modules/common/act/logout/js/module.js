/**
 * @fileOverview Logout module
 *
 * @class O.ui.module.Logout
 * @extends C.ui.Module
 */
C.define('O.ui.module.Logout', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-logout',

/**
	* Module type
	*/
	type: 'link',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'logout',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Logout'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Session shutdown',

/** Text fields */
	msgAskLogout: 'Do you realy want to<br/>close current session?',

/**
	* Initialization of module.
	* Adding link to a link container
	*/
	init: function() {
		this.callParent(arguments);
		var searchResult = Ext.ComponentQuery.query('link-container');
		if (searchResult.length) {
			searchResult[0].addLink(this);
		}
	},

/**
	* Module handler
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	activate: function(params) {
		var forceLogout = false;
		var code = 0;
		if (params && Ext.isArray(params) && params.length > 0) {
			forceLogout = (params[0].name.toLowerCase() === 'forced');
			code = params[0].code;
			if (forceLogout) {
				if (code) {
					if (code == 4011) {
						var ip = params[0].ip;
						var dt = params[0].dt;
					}
					if (code == 4012) {
						var nt = params[0].nexttime;
					}
					if (code == 4052) {
						//var contactUserId = params[0].contactUserId;
						var contactStr = Ext.Object.toQueryString({
							'contact_str': params[0].contactStr
						});
					}
					var url = '/logout/?r=' + code;
					if (ip) {
						url += '&ip=' + ip;
					}

					if (dt) {
						var utc = C.getSetting('p.utc_value', null, true);

						if (utc) {
							dt = Ext.util.Format.date(
								Ext.Date.parse(dt, 'Y-m-d H:i:s')
								.pg_utc(utc),
								O.format.Timestamp
							);
						} else {
							dt = Ext.Date.format(
								new Date(),
								O.format.Date + ' ' + O.format.TimeShort
							);
						}
						url += '&dt=' + dt;
					}

					if (nt) {
						 url += '&nt=' + nt;
					}

					if (contactStr) {
						url += '&' + contactStr;
					}

					document.location.href = url;
				}
				return;
			};
		}
		// запрашиваем у пользователя разрешение на выход
		O.msg.confirm({
			msg: this.msgAskLogout,
			fn: function(buttonId) {
				if (buttonId != 'yes') { return; }
				document.location = '/logout';
			},
			scope: this
		});
	}
});
