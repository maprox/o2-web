/**
 * @class O.common.lib.person.tab.Props
 */
C.utils.inherit('O.common.lib.person.tab.Props', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.relayEvents(this.emailsEditor, ['changed', 'dirtychange']);
		this.relayEvents(this.phonesEditor, ['changed', 'dirtychange']);

		// On record load handler
		this.on('recordload', function(tab, record, noReset) {
			// Nothing was edited at current time
			if(!noReset) {
				if (this.prefix) {
					this.emailsEditor.setData(Ext.clone(
						record.get(this.prefix.split('.')[0]).email || []
					));
					this.phonesEditor.setData(Ext.clone(
						record.get(this.prefix.split('.')[0]).phone || []
					));
				} else {
					this.emailsEditor.setData(Ext.clone(record.get('email')));
					this.phonesEditor.setData(Ext.clone(record.get('phone')));
				}
			}
		});

		this.on('recordload', this.onRecordLoad, this);

		this.photoView.on('beforeitemclick', this.onBeforePhotoClick, this);

		this.photoView.on('refresh', this.photoViewRefresh, this);
	},

/**
	* Record loading handler
	*/
	onRecordLoad: function(cmp, record) {
		if (this.panelPassport) { this.panelPassport.collapse(); }
		if (this.panelDriverlicense) { this.panelDriverlicense.collapse(); }
		if (!record) { return; }

		if (!C.utils.isEmptyObject(record.get('passport'))) {
			if (this.panelPassport) { this.panelPassport.expand(); }
		}
		if (!C.utils.isEmptyObject(record.get('driver_license'))) {
			if (this.panelDriverlicense) { this.panelDriverlicense.expand(); }
		}

		// Load and display profile photo
		this.loadPhoto();
	},

/**
	 * On photo click
	 */
	onBeforePhotoClick: function() {
		// Prevent view's item selection
		return false;
	},

/**
	 * Loads profile photo
	 */
	loadPhoto: function() {
		// Load no photo
		this.loadNoPhoto();

		var record = this.getSelectedRecord();
		var photoId = this.getPhotoId();
		if (record && photoId) {
			this.photoStore.loadData([{
				src: 'x_person/attachment/' + photoId
			}]);
		}
	},

/**
	 * On photo view refresh
	 */
	photoViewRefresh: function() {
		//Init uplaoder
		this.initUploader();
	},

/**
	 * Returns attachment id
	 * @return Integer
	 */
	getPhotoId: function() {
		var attachments = this.getAttachments();
		if (!attachments || !attachments.length) {
			return null;
		}

		return attachments[0].id_x_attachment;
	},

/**
	 * Returns x_person attachments
	 * @return Array
	 */
	getAttachments: function() {
		var record = this.getSelectedRecord();

		if (!record) {
			return null;
		}

		if (this.prefix) {
			//var key = this.prefix.replace(/\./g, '');
			return record.get('person').attachments;
		}

		return record.get('attachments');
	},

/**
	 * Inialize plupload
	 */
	initUploader: function() {
		var me = this;

		me.photoView.setLoading(false);

		var record = this.getSelectedRecord();

		if (this.uploader) {
			this.uploader.destroy();
		}

		if (!record) {
			return;
		}

		// Get id entity
		var id_entity = this.getIdEntity();

		this.uploader = new plupload.Uploader({
			url: '/x_person/upload/',
			runtimes: 'html5,flash,html4',
			browse_button: this.browseButtonId,
			max_file_size: UPLOAD_CONSTRAINTS.x_person.max_file_size,
			flash_swf_url: 'static' + '/plupload.flash.swf' ,
			filters: [
				{title: "Image files", extensions: "jpg,jpeg,gif,png"},
			],
			multipart_params: {
				id_entity: id_entity
			}
			// Frontend resize
			//resize: {width : 256, height : 256, quality : 100}
		});

		// Error handler
		this.uploader.bind('Error', function(up, params) {
			me.photoView.setLoading(false);
			O.msg.warning(_(params.message));
		});

		// File uploaded handler
		this.uploader.bind('FileUploaded', function(up, file, response) {
			if (!response.response) {
				return;
			}

			var answer = Ext.JSON.decode(response.response);
			// If error
			if (answer.success === false) {
				// Clear the uploader queue
				up.splice();

				// Display error
				me.photoView.setLoading(false);
				O.msg.warning(answer.message);
			}
		});

		this.uploader.bind('QueueChanged', function(up) {
			// Start upload when queue changed
			up.start();

			me.photoView.setLoading(true);
		});

		// Init
		this.uploader.init();
	},

/**
	 * Returns id entity
	 * @return Integer
	 */
	getIdEntity: function() {
		var selected = this.getSelectedRecord();
		if (!selected) {
			return null;
		}
		if (this.prefix) {
			return selected.get('id_person');
		}
		return selected.get('id');
	},

/**
	 * Displays no photo avatar
	 */
	loadNoPhoto: function() {
		this.photoStore.removeAll();

		this.photoStore.loadData([{
			src: this.noPhotoUrl
		}]);
	},

/**
	* Updates record
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		this.callParent(arguments);
		if (!record) { return; }

		// Updating emails
		if (this.emailsEditor.isDirty()) {

			if (this.prefix) {
				record['data'][this.prefix.split('.')[0]]['email']
					= this.emailsEditor.getData();
				if (!record['modified'][this.prefix.split('.')[0]]) {
					record['modified'][this.prefix.split('.')[0]] = {};
				}
				record['modified'][this.prefix.split('.')[0]]['email']
					= this.emailsEditor.getData();
			} else {
				record.set('email', this.emailsEditor.getData());
			}
		}

		// Updating phones
		var newPhones = [];
		if (this.phonesEditor.isDirty()) {
			if (this.prefix) {
				record['data'][this.prefix.split('.')[0]]['phone']
					= this.phonesEditor.getData();
				if (!record['modified'][this.prefix.split('.')[0]]) {
					record['modified'][this.prefix.split('.')[0]] = {};
				}
				record['modified'][this.prefix.split('.')[0]]['phone']
					= this.phonesEditor.getData();
			} else {
				record.set('phone',  this.phonesEditor.getData());
			}
		}
	},

/**
	* Returns true if current tab has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		return (
			this.getForm().isDirty() ||
			this.emailsEditor.isDirty() ||
			this.phonesEditor.isDirty() ||
			this.emailsEditor.isNewEntryDirty() ||
			this.phonesEditor.isNewEntryDirty()
		);
	},

/**
	* Resets data
	*/
	reset: function() {
		this.callParent(arguments);

		// Get selected record
		var record = this.getSelectedRecord();


		if (this.prefix) {
			this.emailsEditor.setData(Ext.clone(
				record.get(this.prefix.split('.')[0]).email || []
			));
			this.phonesEditor.setData(Ext.clone(
				record.get(this.prefix.split('.')[0]).phone || []
			));
		} else {
			this.emailsEditor.setData(Ext.clone(record.get('email')));
			this.phonesEditor.setData(Ext.clone(record.get('phone')));
		}

		this.fireEvent('dirtychange');
	},

/**
	 * Checks if tab valid for user notifying
	 */
	isValidForNotify: function() {
		return !!(this.emailsEditor.getData().length !== 0);
	}
});
