/**
 * A simple list item to show a picture, name and cuteness value of a kitten, from the
 * {@link Example.store.Kittens} store.
 */
Ext.define('M.lib.deviceinfo.TemplateListItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype : 'templatelistitem',

    config: {
		/**
		* A custom cls for each item
		*/
		cls: 'template-list-item',

		/**
		* setup the dataMap. each property is a method in 'this' class, and then
		* inside that config, it will call the method you pass with the value you
		* want, form the record
		*/
		dataMap: {
			getName: {
				setHtml: 'name'
			},

			getStatus: {
				setHtml: 'status'
			},

			getButton: {
				setValue: 'status',
				setText: 'button_text',
				setDisabled: 'button_disabled'
			}
		},

		/**
		* @cfg {Boolean/Object/Ext.Component} name
		* The component used to show an image. It is an Ext.Component, so we
		* just want to add a cls so we can style it, and add some flex so it
		* looks good.
		*/
		name: {
			cls: 'template-name',
			flex: 1
		},

		status: {
			cls: 'template-status',
			flex: 1
		},

		/**
		* @cfg {Boolean/Object/Ext.slider.Slider} slider
		* The slider component to show the cuteness of the kitten. We just want to
		* add some flex to make it look good.
		*/
		button: {
			flex: 2
		}

		/**
			* We give it a hbox layout so the items are horizontally displayed, and then
			* give it an align of center so they are vertically centered.
			*/
		//layout: {
			// type: 'hbox',
			// align: 'center'
		//}
    },

/**
	* Called when you set the {@link #name} configuration.
	*
	* Uses Ext.factory to return a proper instance using the configuration passed, the
	* default component, and the existing instance (if it exists).
	*
	* This should *never* be called manually. It will be called when you call {@link #setName}.
	* @private
	*/
	applyName: function(config) {
		return Ext.factory(config, Ext.Component, this.getName());
	},

/**
	 * Apply status
	 */
	applyStatus: function(config) {
        return Ext.factory(config, Ext.Component, this.getStatus());
    },


	/**
	* Called when you set the {@link #name} configuration, and is passed both the new value
	* (from applyName) and the old value.
	*
	* This should *never* be called manually. It will be called when you call {@link #setName}.
	* @private
	*/
	updateName: function(newName, oldName) {
		if (newName) {
			this.add(newName);
		}

		if (oldName) {
			this.remove(oldName);
		}
	},

/**
	* Update status
	*/
	updateStatus: function(newName, oldName) {
		if (newName) {
			this.add(newName);
		}

		if (oldName) {
			this.remove(oldName);
		}
    },

/**
	* Called when you set the {@link #slider} configuration.
	*
	* Uses Ext.factory to return a proper instance using the configuration passed, the
	* default component, and the existing instance (if it exists).
	*
	* This should *never* be called manually. It will be called when you call {@link #setSlider}.
	* @private
	*/
	applyButton: function(config) {
		return Ext.factory(config, Ext.Button, this.getButton());
	},

/**
	* Called when you set the {@link #slider} configuration, and is passed both the new value
	* (from applySlider) and the old value.
	*
	* This should *never* be called manually. It will be called when you call {@link #setSlider}.
	* @private
	*/
	updateButton: function(newButton, oldButton) {
		if (newButton) {
			newButton.on('tap', this.onCommandButtonTap, this);
			this.add(newButton);
		}

		if (oldButton) {
			this.remove(oldButton);
		}
	},

/**
	 * On command button tap
	 */
	onCommandButtonTap: function(button, e) {
		var record = this.getRecord();
		this.onSendCommand(button, record);
	},

/**
	 * Command send handler
	 */
	onSendCommand: function(btn, record) {
		var me = this;

		btn.disable();
		btn.setText(_('Sent'));

		// Send
		var data = {
			id_device: record.get('id_device'),
			command: record.get('id_command_type$name'),
			transport: null,
			id_command_template: record.get('id'),
			params: record.get('params')
		}

		Ext.Ajax.request({
			url: '/mon_device_command/send',
			method: 'post',
			params: data,
			scope: this,
			success: function(response) {
				var answer = Ext.JSON.decode(response.responseText);

				/*if (answer.success) {
					O.msg.info(_('Command has been sent'));
				} else {
					O.msg.error(_('Error'));
				}*/
			}
		});
	}
});
