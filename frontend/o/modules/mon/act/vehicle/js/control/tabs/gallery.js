/**
 * @class O.mon.vehicle.tab.Gallery
 */
C.utils.inherit('O.mon.vehicle.tab.Gallery', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callParent(arguments);

		this.on('recordload', this.onRecordLoad, this);

		this.removePhotoBtn = this.down('#removePhoto');
		this.removePhotoBtn.on('click', this.onRemovePhoto, this);

		// Upload panel settings
		this.uploadPanel = this.down('#uploadpanel');
		this.uploadPanel.on({
			uploadsuccess: this.onUploadSuccess,
			scope: this
		});

		// Upload panel settings
		this.uploadPanel.url = '/mon_vehicle/upload/';
		this.uploadPanel.max_file_size
			= UPLOAD_CONSTRAINTS.mon_vehicle.max_file_size;

		// Photo selection
		var sm = this.thumbsView.getSelectionModel();
		sm.on('selectionchange', this.onSelectionChange, this);

		this.thumbsView.on('refresh', this.onViewRefresh, this);
	},

/**
	 * On view refresh
	 */
	onViewRefresh: function() {
		var elements = this.thumbsView.all.elements;

		// Add load event to all images
		for (var i = 0; i < elements.length; i++) {
			Ext.get(elements[i]).child('img').on(
				'load', this.onImgLoad, this);
		}
	},

/**
	 * Img load event handler
	 */
	onImgLoad: function(e, el) {
		// Remove loading gif
		var thumb = Ext.get(el).parent();
		thumb.removeCls('loading');
	},

/**
	* Record loading handler
	*/
	onRecordLoad: function(cmp, record, noReset, firstTime) {
		// Set upload params
		this.uploadPanel.multipart_params.id_entity = record.get('id');
		if (firstTime) {
			// Clear upload queue
			this.uploadPanel.onDeleteAll();
		}

		// Load vehicle images to the store
		this.loadPhotos();
	},

/**
	 * On upload success
	 */
	onUploadSuccess: function() {
	},

/**
	 * Loads photos
	 */
	loadPhotos: function() {
		var record = this.getSelectedRecord();
		var attachments = record.get('attachments');
		this.attachmentStore.loadData(attachments);
	},

/**
	* Updates record
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		this.callParent(arguments);
	},

/**
	 * On selection change
	 * @param sm
	 * @param selected
	 */
	onSelectionChange: function(sm, selected) {
		if (selected.length) {
			this.removePhotoBtn.enable();
		} else {
			this.removePhotoBtn.disable();
		}
	},

/**
	 * Remove photo
	 */
	onRemovePhoto: function() {
		var me = this;
		var selection = this.thumbsView.getSelectionModel().getSelection();

		if (!selection.length) {
			return;
		}

		var selected = selection[0];

		var data = {
			id: selected.get('id'),
			state: C.cfg.RECORD_IS_TRASHED
		};

		this.setLoading(true);
		Ext.Ajax.request({
			url: '/mon_vehicle/editattachment',
			method: 'post',
			params: {
				data: Ext.JSON.encode(data)
			},
			scope: this,
			success: function(response) {
				var answer = Ext.JSON.decode(response.responseText);

				if (answer.success) {
					O.msg.info(_('Photo has been removed'));
				} else {
					O.msg.error(_('Error'));
				}

				me.setLoading(false);
			}
		});
	}
});
