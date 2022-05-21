/**
 * @class O.mon.lib.device.tab.Commands
 */
C.utils.inherit('O.mon.lib.device.tab.Commands', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callParent(arguments);

		this.on('recordload', 'onRecordLoad', this);
		this.btnCreateCmd.on('click', 'onCreateCmd', this);
		this.comboCommandType.on('change', 'onCommandTypeChange', this);
		this.btnSendCommand.on('click', 'onSendCommand', this);
		this.btnCancel.on('click', 'onCancelClick', this);
		this.commandsStore.on('datachanged', 'onDataChanged', this);

		this.deleteTemplateColumn.on('click', this.onDeleteTemplate, this);

		this.btnCreateTemplate.on('click', this.onCreateTemplate, this);
		this.btnSaveTemplate.on('click', this.onSaveTemplate, this);

		this.templatesGrid.on('selectionchange',
			this.onTemplateSelection, this);

		this.templatesGrid.on('edit', this.onTemplatesGridEdit, this);

		this.paramsForm.on('dirtychange', this.onParamsDirty, this);
		this.paramsForm.on('validitychange', this.onParamsValidity, this);

		this.radioAuto.on('change', this.onTransportChange, this);
		this.radioTcp.on('change', this.onTransportChange, this);
		this.radioSms.on('change', this.onTransportChange, this);

		this.commandTemplateStore.on('load', this.onTemplateStoreLoad, this);

		// Bind mon_device_command update
		C.bind('mon_device_command', this);
		// Bind mon_device_command_template
		C.bind('mon_device_command_template', this);
	},

/**
	 * On templates grid edit
	 */
	onTemplatesGridEdit: function(editor, e) {
		// Commit record
		e.record.commit();

		this.processTemplateUpdate(e.record);
	},

/**
	 * On transport radio change
	 * @param radio
	 * @param newValue
	 * @param OldValue
	 */
	onTransportChange: function(radio, newValue, oldValue) {
		this.maybeDisableSaveBtn();
	},

/**
	 * On params form dirty change
	 */
	onParamsDirty: function(form, dirty) {
		this.maybeDisableSaveBtn();
	},

/**
	 * On params validity change
	 */
	onParamsValidity: function(form, valid) {
		this.maybeDisableSaveBtn();
	},

/**
	 * Dsiable on enable save btn depends on validity and dirty
	 */
	maybeDisableSaveBtn: function() {
		if (!this.paramsForm.isValid()) {
			this.btnSaveTemplate.disable();
			return;
		}

		this.btnSaveTemplate.setDisabled(!this.paramsForm.isDirty()
			&& !this.isTransportDirty());
	},

/**
	 * Is transport dirty
	 */
	isTransportDirty: function() {
		return this.radioAuto.isDirty() || this.radioTcp.isDirty()
			|| this.radioSms.isDirty();
	},

/**
	 * Reset transport radios original value
	 */
	resetTransportOriginalValue: function() {
		this.radioAuto.resetOriginalValue();
		this.radioTcp.resetOriginalValue();
		this.radioSms.resetOriginalValue();
	},

/**
	 * Updates template
	 * @param record
	 */
	processTemplateUpdate: function(record) {
		var me = this;
		me.setLoading(true);
		var data = record.getData();
		O.manager.Model.set('mon_device_command_template', data,
			function(success, opts) {

				if (success) {
				}
				me.setLoading(false);
		}, this);
	},

/**
	 * On save template
	 */
	onSaveTemplate: function() {
		// TODO: maybe use processTemplateUpdate with callback ?
		var me = this;
		this.setLoading(true);

		this.btnSaveTemplate.disable();

		// Params form data
		var paramsData = this.getCommandParams();

		// Get selected template id
		var template = this.getSelectedTemplate();

		// Get transport
		var form = this.getForm();
		var formValues = form.getValues();
		var transport = formValues.transport;

		var data = {
			'id': template.get('id'),
			'params': Ext.JSON.encode(
				paramsData
			),
			'transport': transport
		}

		O.manager.Model.set('mon_device_command_template', data,
			function(success, opts) {
				me.setLoading(false);
				if (success) {
					// Set reselect flag
					// Template will be reselected after store reloads
					me.needReselect = true;
				}
		}, this);
	},

/**
	 * On create new template
	 */
	onCreateTemplate: function() {
		// Prompt name
		this.promptCreateTemplate();
	},

/**
	 * Prompt create template
	 */
	promptCreateTemplate: function() {
		var me = this;
		Ext.MessageBox.prompt(
			_('Create new command template'),
			_('Template name'),
			function(answer, name) {
				if (answer == 'ok') {
					me.processCreateTemplate(name);
				}
			}
		);
	},

/**
	 * Make actual save template request
	 * @param name
	 */
	processCreateTemplate: function(name) {
		var me = this;
		this.setLoading(true);
		var device = this.getSelectedRecord();

		var type = this.comboCommandType.getValue();

		// Params form data
		var paramsData = this.getCommandParams();

		var data = {
			'id_device': device.get('id'),
			'name': name,
			'id_command_type': type,
			'params': Ext.JSON.encode(
				paramsData
			)
		}

		// Get transport
		var form = this.getForm();
		var formValues = form.getValues();
		var transport = formValues.transport;

		if (transport) {
			data.transport = transport;
		}

		O.manager.Model.add('mon_device_command_template', data,
			function(success, opts) {
				me.setLoading(false);
				if (success) {
					// Notify and select added or no select
				}
		}, this);
	},

/**
	 * Make actual save template request
	 * @param name
	 * @deprecated
	 */
	deprecated_processCreateTemplate: function(name) {
		var me = this;
		this.setLoading(true);
		var device = this.getSelectedRecord();

		var type = this.comboCommandType.getValue();

		// Params form data
		var paramsData = this.getCommandParams();

		// Params for backend
		var params = [];

		// Iterate params
		var selectedTypeId = this.comboCommandType.getValue();
		var selectedType = this.commandTypeStore.getById(selectedTypeId);
		Ext.Array.each(selectedType.get('params'), function(param) {
			params.push({
				id_device_command_type_param: param.id,
				value: paramsData[param.name]
			});
		});

		var data = {
			'id_device': device.get('id'),
			'name': name,
			'id_command_type': type,
			'params': Ext.JSON.encode(
				params
			)
		}

		O.manager.Model.add('mon_device_command_template', data,
			function(success, opts) {
				me.setLoading(false);
				if (success) {
				}
		}, this);
	},

/**
	 * Delete template
	 */
	onDeleteTemplate: function(grid, rowIndex, colIndex, item, e, record) {
		var me = this;

		O.msg.confirm({
			msg: _('Do you really want to remove command template?'),
			fn: function(choice) {
				if (choice === 'yes') {
					me.processRemoveTemplate(record);
				}
			},
			scope: this
		});
	},


/**
	 * Process remove template request
	 */
	processRemoveTemplate: function(record) {
		var me = this;

		if (!record) {
			return;
		}

		me.setLoading(true);

		var data = {
			id: record.get('id')
		}

		O.manager.Model.remove('mon_device_command_template', data,
			function(success) {
				me.setLoading(false);
				if (success) {
					O.msg.info({
						msg: _('Command template removed successfully')
					});

					me.commandTemplateStore.load();
				}
		}, this);
	},

/**
	 * Returns selected template
	 */
	getSelectedTemplate: function() {
		var selection = this.templatesGrid.getSelectionModel().getSelection();
		if (!selection.length) {
			return null;
		}

		return selection[0];
	},

/**
	* On template slection change
	* @param grid
	* @param selection
	*/
	onTemplateSelection: function(grid, selection) {
		if (!selection.length) {

			// Clear selected template
			this.selectedTemplate = null;

			// Hide and show btns
			this.btnSaveTemplate.hide();
			this.btnCreateTemplate.show();

			return;
		}

		var template = selection[0];

		// Store selected template
		this.selectedTempale = template;

		// Hide and show btns
		this.btnSaveTemplate.show();
		this.btnCreateTemplate.hide();

		// Load template data
		this.loadTemplateData(template);
	},

/**
	* Loads template data
	* @param template
	*/
	loadTemplateData: function(template) {
		var commandType = template.get('id_command_type');
		// This indicates not manual seletion
		this.noTemplateDeselect = true;

		// Select command type
		this.comboCommandType.setValue(0);
		this.comboCommandType.select(commandType);
		// Reset flag
		this.noTemplateDeselect = false;

		// Select transport
		var transport = template.get('transport');
		if (transport === 'sms') {
			this.radioSms.setValue(true);
		}
		if (transport === 'tcp') {
			this.radioTcp.setValue(true);
		}

		this.resetTransportOriginalValue();

		// Fill params form with template data
		var paramsJson = template.get('params');

		if (!paramsJson) {
			return;
		}

		var params = Ext.JSON.decode(paramsJson);

		for (var paramName in params) {
			var field = this.paramsForm.getForm().findField(paramName);

			field.setValue(params[paramName]);
			field.resetOriginalValue();
		}

		// deprecated
		/*for (var i = 0; i < params.length; i++) {
			var param = params[i];
			var field = this.paramsForm.getForm().findField(param.name);
			field.setValue(param.value);
		}*/
	},

	/**
	 * On data changed
	 */
	onDataChanged: function() {
		// Save last store id
		if (!this.lastItemId && this.commandsStore.first()) {
			this.lastItemId = this.commandsStore.first().get('id');
		}
	},

/**
	* Record loading handler
	* @param cmp
	* @param record
	*/
	onRecordLoad: function(cmp, record) {
		// Check if another record selected
		var firstTime = true;
		if (this.lastLoadedRecord
				&& record.getId() == this.lastLoadedRecord.getId())
		{
			firstTime = false;
		}

		// If protocol changed
		if (this.lastLoadedRecord && record.get('protocol')
			!== this.lastProtocol)
		{
			this.resetAll();
			this.loadCommandTypes();
		}

		// Save last loaded record and protocol
		this.lastLoadedRecord = record;
		this.lastProtocol = record.get('protocol');

		if (firstTime) {
			// Reset All
			this.resetAll();
			// Load Command types
			this.loadCommandTypes();

			// Load commands
			this.commandsStore.getProxy().extraParams = {
				'$filter': 'id_device EQ ' + record.get('id'),
				'$joined': 1,
				'$showtotalcount': 1
			};

			this.commandsStore.loadPage(1);

			// Load commands templates
			this.setTemplatesGridVisible(false);
			this.commandTemplateStore.getProxy().extraParams = {
				'$filter': 'id_device EQ ' + record.get('id'),
				'$joined': 1,
				'$showtotalcount': 1
			};
			this.commandTemplateStore.load();
		}

		// Enable create command button
		this.btnCreateCmd.enable();
		this.btnCreateCmd.setTooltip(null);

		// Disable create command button
		// Check record status
		if (record.get('state') !== C.cfg.RECORD_IS_ENABLED) {
			this.btnCreateCmd.disable();
			this.btnCreateCmd.setTooltip(
				_('You must enable device first'));
		}

		// Check if available commands exists
		if (!this.commandTypeStore.getAt(0)) {
			this.btnCreateCmd.disable();
			this.btnCreateCmd.setTooltip(
				_('No commands available for selected protocol'));
		}

		// Check if IMEI specified
		if (!record.get('identifier')) {
			this.btnCreateCmd.disable();
			this.btnCreateCmd.setTooltip(_('IMEI should be specified'));
		}
	},

/**
	 * On template store load
	 * @param store
	 * @param records
	 */
	onTemplateStoreLoad: function(store, records) {
		if (records && records.length) {
			this.setTemplatesGridVisible(true);
		} else {
			this.setTemplatesGridVisible(false);
		}
	},

/**
	 * Hide or shows templates grid
	 */
	setTemplatesGridVisible: function(visible) {
		if (!C.userHasRight('mon_device_command_template')) {
			visible = false;
		}
		this.templatesGrid.setVisible(visible);
	},

/**
	* Loads command types
	*/
	loadCommandTypes: function() {
		var me = this;
		this.commandTypeStore.filter({
			filterFn: function(item) {
				var selected = me.getSelectedRecord();
				var protocol = selected.get('protocol');
				return Ext.Array.contains(item.get('protocols'), protocol);
			}
		});

		// Select first command type
		if (this.commandTypeStore.getAt(0)) {
			this.comboCommandType.select(this.commandTypeStore.getAt(0));
		} else {
			// Disable create command button
			this.btnCreateCmd.disable();
			this.btnCreateCmd.setTooltip(
				_('No commands available for selected protocol'));
		}
	},

/**
	 * On mon_device_command update
	 */
	onUpdateMon_device_command: function(data) {
		var item = data[0];
		var itemId = item.id;

		var selected = this.getSelectedRecord();
		if (!selected) {
			return;
		}

		// If another device selected do nothing
		if (item.id_device !== selected.get('id')) {
			return;
		}

		// Check if item exists on page
		var currentItem = this.commandsStore.getById(itemId);
		if (currentItem) {
			this.reloadPage = this.commandsStore.currentPage;
		}

		// If entry deleted
		if (item.state === C.cfg.RECORD_IS_TRASHED) {
			this.reloadPage = this.commandsStore.currentPage;
		}

		// If new entry added
		if (item.id > this.lastItemId) {
			this.reloadPage = this.commandsStore.currentPage;
			this.lastItemId = item.id;
		}

		// Reload if needed
		this.maybeReloadPage();
	},

/**
	 * On mon_device_command_template_update
	 */
	onUpdateMon_device_command_template: function(data) {
		var item = data[0];
		var itemId = item.id;

		var selected = this.getSelectedRecord();
		if (!selected) {
			return;
		}

		// If another device selected do nothing
		if (item.id_device !== selected.get('id')) {
			return;
		}

		// Reload template store
		this.commandTemplateStore.load({
			scope: this,
			callback: function(records, operation, success) {
				// Reselect template if needed
				if (!this.needReselect) {
					return;
				}
				this.needReselect = false;

				var selection = this.getSelectedTemplate();
				selection
					= this.templatesGrid.store.getById(selection.get('id'));

				if (!selection) {
					return;
				}
				this.templatesGrid.getSelectionModel().deselectAll();
				this.templatesGrid.getSelectionModel().select(
					selection);
			}
		});
	},

/**
	 * Maybe reload commands grid page
	 */
	maybeReloadPage: function() {
		if (this.forceReloadPage) {
			var page = this.forceReloadPage;
			this.forceReloadPage = null;
			this.commandsStore.loadPage(page);

			return;
		}

		if (this.reloadPage) {
			this.commandsStore.loadPage(this.reloadPage);
			this.reloadPage = null;
		}
	},

/**
	 * Returns current command params
	 */
	getCommandParams: function() {
		// Collect params
		var params = {};

		var paramsValues = this.paramsForm.form.getFieldValues();

		// Get available params
		// little spike-nail because of datetime field
		var availableParams = [];
		var selectedTypeId = this.comboCommandType.getValue();
		var selectedType = this.commandTypeStore.getById(selectedTypeId);
		Ext.Array.each(selectedType.get('params'), function(param) {
			availableParams.push(param.name);
		});

		Ext.Object.each(paramsValues, function(key, value) {
			if (!Ext.Array.contains(availableParams, key)) {
				return true; // continue
			}
			// Send only not empty values
			if (value !== undefined && value !== null && value !== '') {
				params[key] = value;
			}
		}, this);

		return params;
	},

/**
	 * On send command
	 */
	onSendCommand: function() {
		var me = this;
		var selected = this.getSelectedRecord();

		me.setLoading(true);

		// Go on page 1 after next update comes
		this.forceReloadPage = 1;

		var form = this.getForm();
		var formValues = form.getValues();
		var transport = formValues.transport;

		var params = this.getCommandParams();

		// Get command name
		var commandType = this.commandTypeStore.getById(
			this.comboCommandType.getValue());

		var data = {
			id_device: selected.get('id'),
			command: commandType.get('name'),
			transport: transport,
			params: Ext.JSON.encode(params)
		}

		// Check if template selected
		// and form is not dirty
		var template = this.getSelectedTemplate();
		if (template && !this.paramsForm.isDirty()) {
			data.id_command_template = template.get('id');
		}

		Ext.Ajax.request({
			url: '/mon_device_command/send',
			method: 'post',
			params: data,
			scope: this,
			success: function(response) {
				var answer = Ext.JSON.decode(response.responseText);

				if (answer.success) {
					O.msg.info(_('Command has been sent'));
				} else {
					O.msg.error(_('Error'));
				}

				me.setLoading(false);
			}
		});
	},

/**
	 * On command type change
	 * @param combo
	 * @param val
	*/
	onCommandTypeChange: function(combo, val) {
		// Deselect all templates
		if (!this.noTemplateDeselect) {
			this.templatesGrid.getSelectionModel().deselectAll();
		}

		// Remove all previously created fields
		if (this.paramsForm.items.length) {
			this.paramsForm.removeAll();
		}

		// Get command type
		var commandType = this.commandTypeStore.getById(val);
		if (!commandType) {
			return;
		}

		var params = commandType.get('params');
		var noParams = false;
		if (!params || !params.length) {
			this.paramsForm.hide();
			noParams = true;
		} else {
			this.paramsForm.show();
		}

		if (!noParams) {
			// Create params fields
			for (var i = 0; i < params.length; i++) {
				var field = this.getParamField(params[i]);
				this.paramsForm.add(field);
				field.validate();
			}

			// Fire dirty change
			this.paramsForm.getForm().fireEvent('dirtychange',
				this.paramsForm.getForm(), this.paramsForm.isDirty());
		}

		// Select transport auto
		this.radioAuto.setValue(true);
		this.resetTransportOriginalValue();

		// Disable unavailable transports
		this.radioTcp.disable();
		this.radioSms.disable();
		var transports = commandType.get('transports');
		for (var j = 0; j < transports.length; j++) {
			var transport = transports[j];
			if (transport.name == 'tcp') {
				this.radioTcp.enable();
			}
			if (transport.name == 'sms') {
				this.radioSms.enable();
			}
		}
	},

/**
	 * Returns param field
	 * @param param
	 */
	getParamField: function(param) {

		var infoString = param.info;

		if (!infoString) {
			// Something probably wrong
			return null;
		}

		var info = Ext.JSON.decode(infoString);
		var type = info.type;

		if (!type) {
			return null;
		}

		var paramType = Ext.createByAlias(
			'widget.mon-lib-command-param-' + type,
		{
			params: param
		});

		return paramType.getField();
	},

/**
	 * On create command button click
	 */
	onCreateCmd: function() {
		// Toggle display command send panel
		this.panelCommandSend.toggleCollapse();
	},

/**
	 * On cancel button click
	 */
	onCancelClick: function() {
		// Hide command send form and reset it
		this.panelCommandSend.collapse();
	},

/**
	 * Reset all to initial state
	 */
	resetAll: function() {
		this.btnCreateCmd.enable();
		this.btnCreateCmd.setTooltip(null);

		this.lastItemId = null;
		this.reloadPage = null;

		// Hide command send panel
		// This condition is important
		// if url request is not like #mon-device/commands
		// for some reason after calling collapse when tab loads
		// we will never be able to expand it
		if (!this.getCollapsed()) {
			this.panelCommandSend.collapse();
		}

		// Reset params form
		this.paramsForm.getForm().reset();

		// Set default transport auto
		this.radioAuto.setValue(true);
		this.resetTransportOriginalValue();
	},

/**
	* Returns formated time string
	*/
	convertTime: function(time) {
		if (typeof(time) == 'object') {
			return Ext.util.Format.date(
				time.pg_utc(C.getSetting('p.utc_value')),
				O.format.Timestamp);
		} else {
			return Ext.util.Format.date(
				new Date().pg_fmt(time).pg_utc(C.getSetting('p.utc_value')),
				O.format.Timestamp);
		}
	},

	//
	// TODO: is there another solution to make simple tab?
	//

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		this.selectedRecord = record;
		this.fireEvent('recordload', this, record, noReset);
	},

/**
	* Applies changes to tab fields
	* @param {Object} changes
	*/
	setFieldValues: function(changes) {
		return true;
	},

	/**
	* Find a specific {@link Ext.form.field.Field} in this tab by id or name.
	* @param {String} id The value to search for (specify either a
	* {@link Ext.Component#id id} or
	* {@link Ext.form.field.Field#getName name or hiddenName}).
	* @return {Ext.form.field.Field} The first matching field, or
	*   `null` if none was found.
	*/
	findField: function(fieldName) {
		return null;
	},

	/**
	* Retrieves the fields in the form as a set of key/value pairs, using
	* their {@link Ext.form.field.Field#getModelData getModelData()} method
	* to collect the values. If multiple fields return values under the same
	* name those values will be combined into an Array.
	* This is similar to {@link #getValues} except that this method collects
	* type-specific data values (e.g. Date objects for date fields) while
	* getValues returns only String values for submission.
	* @param {Boolean} dirtyOnly (optional) If true, only fields that are
	*     dirty will be included in the result. Defaults to false.
	* @return {Object}
	*/
	getFieldValues: function(dirtyOnly) {
		return {};
	},

	/**
	* Returns true if current tab data has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		return false;
	},

	/**
	* Returns true if current tab data is valid
	* @return {Boolean}
	*/
	isValid: function() {
		return true;
	},

	/**
	* Resets form data
	*/
	reset: function() {
		return;
	},

	/**
	* Clears data
	*/
	clear: function() {
		return;
	}
});