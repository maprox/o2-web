/**
 * @class O.common.lib.modelslist.RemoteList
 */
C.utils.inherit('O.common.lib.modelslist.RemoteList', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		// init user interface (show edit button)
		this.btnOnOff.setVisible(false);
		this.btnEdit.setVisible(true);
	},

/**
	* After render handler.
	* Checks if store is already filled in and fires @loaded event
	*/
	onAfterRender: function() {
		this.callParent(arguments);
		this.store.load();
	},

/**
	* Set firm id to work with
	* Adds list filter by id_firm
	*/
	setFirmId: function(firmId) {
		this.firmId = firmId;

		// Add filter
		this.addFilter('$firm', firmId);
	},

/**
	* Returns an editor window
	* @return O.common.lib.modelslist.EditorWindow
	*/
	getEditorWindow: function() {
		if (!this.editorWindow) {
			this.editorWindow = Ext.widget(
				this.managerAlias + '-editorwindow', {
					width: 460,
					firmId: this.firmId
				}
			);
			this.editorWindow.on('create', this.onRecordCreate, this);
		}
		return this.editorWindow;
	},

/**
	* Shows window for creating issue
	* @private
	*/
	addRecord: function() {
		// show editor window
		this.getEditorWindow().execute();
	},

/**
	* Start edit event
	*/
	beforeEdit: function() {
		// show editor window with selected record
		this.getEditorWindow().execute(this.getSelectedRecord());
		// shutdown default roweditor
		return false;
	},

/**
	* Selects created record
	*/
	onRecordCreate: function(cmp, record, data, packet) {
		if (packet && packet.success && packet.data && packet.data.id) {
			this.selectById(packet.data.id);
		}
	},

/**
	* Remotelist add filter
	*/
	addFilter: function(field, value) {
		if (this.store) {
			var proxy = this.store.getProxy();
			proxy.extraParams[field] = value;
		}
	}
});