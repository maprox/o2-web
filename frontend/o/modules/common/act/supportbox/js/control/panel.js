/**
 * @class O.common.act.supportbox.Panel
 */
C.utils.inherit('O.common.act.supportbox.Panel', {
/**
	* Component initiazliation
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.emailField.on('change', 'toggleButton', this);
		this.textareaField.on('change', 'toggleButton', this);
		this.sendButton.on('click', 'submitForm', this);
	},

/**
	* Does browser have cookies enabled (for this site)?
	*/
	hasCookies: function() {
		var testCookieName = 'testcookie';
		if (!Ext.isDefined(navigator.cookieEnabled)) {
			setCookie(testCookieName, '1');
			return getCookie(testCookieName) === '1' ? '1' : '0';
		}
		return navigator.cookieEnabled ? '1' : '0';
	},

/**
	* Gather browser features
	*/
	 getBrowserFeatures: function() {
		var browserFeatures = {},
			i,
			mimeType,
			pluginMap = {
				// RIA
				java: 'application/x-java-vm',
				gears: 'application/x-googlegears',
				sliverlight: 'application/x-silverlight',

				// interactive multimedia
				flash: 'application/x-shockwave-flash',
				shockwave: 'application/x-director',

				// document types
				pdf: 'application/pdf',

				// media players
				quicktime: 'video/quicktime',
				realplayer: 'audio/x-pn-realaudio-plugin',
				wma: 'application/x-mplayer2'
			};

		// general plugin detection
		if (navigator.mimeTypes && navigator.mimeTypes.length) {
			for (i in pluginMap) {
				if (Object.prototype.hasOwnProperty.call(pluginMap, i)) {
					mimeType = navigator.mimeTypes[pluginMap[i]];
					browserFeatures[i] = (mimeType && mimeType.enabledPlugin) ? '1' : '0';
				}
			}
		}

		// Safari and Opera
		// IE6/IE7 navigator.javaEnabled can't be aliased, so test directly
		if (typeof navigator.javaEnabled !== 'unknown' &&
				Ext.isDefined(navigator.javaEnabled) &&
				navigator.javaEnabled()) {
			browserFeatures.java = '1';
		}

		// Firefox
		if (Ext.isFunction(window.GearsFactory)) {
			browserFeatures.gears = '1';
		}

		return browserFeatures;
	},

/**
	* Toggle submit button
	*/
	toggleButton: function() {
		if (this.showemail === true) {
			this.sendButton.setDisabled(
				(this.textareaField.getValue().length === 0
					|| this.emailField.getValue().length === 0)
				|| !this.getForm().isValid()
			);
		} else {
			this.sendButton.setDisabled(
				this.textareaField.getValue().length === 0
			)
		}
	},

/**
	* Form submission handler
	**/
	submitForm: function() {
		// Collect user data
		var data = {
			url: window.location.href,
			screen: screen.width + 'x' + screen.height,
			useragent: navigator.userAgent,
			cookie: this.hasCookies(),
			features: this.getBrowserFeatures()
		};

		var me = this;
		var form = this.getForm();
		this.sendButton.setDisabled(true);
		if (form.isValid()) {
			// ExtJS bug?
			// http://www.sencha.com/forum/showthread.php?259814-Error-on-submitting-a-form&p=954611
			/*form.submit({
				url: '/supportbox/submit',
				params: {
					'data': Ext.JSON.encode(data)
				}
			});*/

			Ext.Ajax.request({
				url: '/supportbox/submit',
				method: 'POST',
				params: {
					'data': Ext.JSON.encode(data),
					'email': this.emailField.getValue(),
					'message': this.textareaField.getValue()
				}
			});

			// sometimes lie can be helpful
			me.fireEvent('message_sent');
			O.msg.info(_('Your message has been sent'));
		}
	}
});
