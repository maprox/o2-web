/**
 *
 * @class O.act.panel.dn.SupplierDocs
 */
C.utils.inherit('O.act.panel.dn.SupplierDocs', {
/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.documentsGrid.on({
			select: this.onGridSelect,
			scope: this
		});

		this.uploadPanel.on({
			uploadsuccess: this.onUploadSuccess,
			scope: this
		});

		this.btnDownload.setHandler(this.onBtnDownloadClick, this);
		this.btnRemove.setHandler(this.onBtnRemoveClick, this);
		this.setSelectedSupplier(null);
		this.store.sort('dt', 'DESC');

		// Upload panel settings
		this.uploadPanel.url = '/dn_doc/upload/';
		this.uploadPanel.max_file_size = UPLOAD_CONSTRAINTS.dn_doc.max_file_size;
	},

/**
	* On supplier selection
	* @param Number selectedSupplierId Supplier firm identifier
	* @param Integer status Supplier firm status
	*/
	setSelectedSupplier: function(selectedSupplierId) {
		this.selectedSupplierId = selectedSupplierId || null;
		this.uploadPanel.multipart_params.id_firm_for = selectedSupplierId;
		this.store.clearFilter();
		this.store.filter('id_firm_for', new RegExp(this.selectedSupplierId));
		this.onGridSelect();

		// Clear upload queue
		this.uploadPanel.onDeleteAll();
	},

/**
	* On document selection
	* @param Object cmp Grid component
	* @param Object record Selected record
	*/
	onGridSelect: function(cmp, record) {
		var hasRecord = record;
		this.selectedDocId = hasRecord ? record.data.id : null;
		this.btnRemove.setDisabled(!hasRecord);
		this.btnDownload.setDisabled(!hasRecord);
	},

/**
	* On remove button click
	*/
	onBtnRemoveClick: function() {
		O.msg.confirm({
			msg: this.lngMsgRemoveText,
			fn: function(buttonId) {
				if (buttonId != 'yes') { return; }
				// картинка загрузки
				this.setLoading(true);
				var data = {
					id: this.selectedDocId,
					id_firm_for: this.selectedSupplierId,
					state: 3
				};
				O.manager.Model.set('dn_doc', data, function(success) {
					if (success) {
						O.msg.info(this.lngMsgRemoved);
						this.setSelectedSupplier(this.selectedSupplierId);
					}
					this.setLoading(false);
				}, this);
			},
			scope: this
		});
	},

/**
	* On download button click
	*/
	onBtnDownloadClick: function() {
		window.location = '/dn_doc/download/?id=' + this.selectedDocId;
	},

/**
	* On upload success
	*/
	onUploadSuccess: function(response) {
		this.store.add(response.data.data);
	}
});