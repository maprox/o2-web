//
// Ext.ux.panel.UploadPanel for ExtJs 4
// Source: http://www.thomatechnik.de/webmaster-tools/extjs-plupload/
// Based on: http://www.sencha.com/forum/showthread.php?98033-Ext.ux.Plupload-Panel-Button-%28file-uploader%29
// Please link to this page if you find this extension usefull
// Version 0.1

//
// Maprox LLC (c) 2012 edition
// Modified by
//    Igor Lesnenko <igor.lesnenko@gmail.com>
//    Alexander Lyapko <sunsay@maprox.net>
// Version 0.2
//

Ext.define('Ext.ux.panel.UploadPanel', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.xuploadpanel',

// Configuration
	title: 'Upload',
	url: '/upload.php',    // URL to your server-side upload-script
	chunk_size: null,      // The chunk-size
	max_file_size: '20mb', // The max. allowed file-size
	unique_names: false,   // Make sure to use only unique-names
	multipart: true,       // Use multipart-uploads

	pluploadPath: 'static', // Path to plupload
	pluploadRuntimes: 'html5,flash,html4',  // All the runtimes you want to use

	multipart_params: {
	},

// Texts (language-dependent)
	texts: {
		status: ['QUEUED', 'UPLOADING', 'UNKNOWN', 'FAILED', 'DONE'],
		DragDropAvailable: 'Drag&Drop files here',
		noDragDropAvailable: 'This Browser doesn\'t support drag&drop.',
		emptyTextTpl: '<div style="color:#808080; margin:0 auto; ' +
			'text-align:center; top:48%; position:relative;">{0}</div>',
		cols: ["File", "Size", "State", "Message"],
		addButtonText: 'add file',
		uploadButtonText: 'upload',
		cancelButtonText: 'cancel',
		deleteButtonText: 'delete',
		deleteUploadedText: 'delete finished',
		deleteAllText: 'delete all',
		deleteSelectedText: 'delete selected',
		progressCurrentFile: 'current file:',
		progressTotal: 'total:',
		statusInvalidSizeText: 'File too big',
		statusInvalidExtensionText: 'invalid file-type'
	},

	// Hack: loaded of the actual file (plupload is sometimes a step ahead)
	loadedFile: 0,

/**
	* @contructor
	*/
	initComponent: function() {
		// List of files
		this.success = [];
		this.failed = [];

		// Model and Store
		if (!Ext.ModelManager.getModel('Plupload')) {
			Ext.define('Plupload', {
				extend: 'Ext.data.Model',
				fields: [
					'id',
					'loaded',
					'name',
					'size',
					'percent',
					'status',
					'msg'
				]
			});
		};

		// Progress-Bar (bottom)
		this.progressBarSingle = new Ext.ProgressBar({
			flex: 1,
			animate: true
		});
		this.progressBarAll = new Ext.ProgressBar({
			flex: 2,
			animate: true
		});

		// Column-Headers
		Ext.apply(this, {
			multiSelect: true,
			viewConfig: {
				deferEmptyText: false // For showing emptyText
			},
			store: {
				type: 'json',
				model: 'Plupload',
				listeners: {
					load: this.onStoreLoad,
					remove: this.onStoreRemove,
					update: this.onStoreUpdate,
					scope: this
				},
				proxy: 'memory'
			},
			columns: [{
				header: _(this.texts.cols[0]),
				flex: 1,
				dataIndex: 'name'
			}, {
				header: _(this.texts.cols[1]),
				flex: 1,
				dataIndex: 'size',
				align: 'right',
				renderer: Ext.util.Format.fileSize
			}, {
				header: _(this.texts.cols[2]),
				flex: 1,
				dataIndex: 'status',
				renderer: this.renderStatus
			}, {
				header: _(this.texts.cols[3]),
				flex: 1,
				dataIndex: 'msg'
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				defaults: {
					xtype: 'button',
					disabled: true,
					scope: this
				},
				items: [{
					text: _(this.texts.addButtonText),
					itemId: 'btnAdd',
					iconCls: this.addButtonCls || 'pluploadAddCls'
				}, {
					text: _(this.texts.uploadButtonText),
					itemId: 'btnUpload',
					iconCls: this.uploadButtonCls || 'pluploadUploadCls'
				}, {
					text: _(this.texts.cancelButtonText),
					itemId: 'btnCancel',
					iconCls: this.cancelButtonCls || 'pluploadCancelCls'
				}, {
					xtype: 'splitbutton',
					text: _(this.texts.deleteButtonText),
					itemId: 'btnDelete',
					iconCls: this.deleteButtonCls || 'pluploadDeleteCls',
					menu: new Ext.menu.Menu({
						items: [{
							text: _(this.texts.deleteUploadedText),
							handler: this.onDeleteUploaded,
							scope: this
						}, '-', {
							text: _(this.texts.deleteAllText),
							handler: this.onDeleteAll,
							scope: this
						}, '-', {
							text: _(this.texts.deleteSelectedText),
							handler: this.deleteSelected,
							scope: this
						}]
					})
				}]
			}, {
				xtype: 'toolbar',
				dock: 'bottom',
				layout: 'hbox',
				style: {
					paddingLeft: '5px'
				},
				defaults: {
					xtype: 'tbtext',
					style: 'text-align:right',
					text: '',
					width:100
				},
				items: [
					_(this.texts.progressCurrentFile),
					this.progressBarSingle,
					{ itemId: 'single' },
					_(this.texts.progressTotal),
					this.progressBarAll,
					{ itemId: 'all' },
					{ itemId: 'speed' },
					{ itemId: 'remaining' }
				]
			}]
		});
		this.callParent(arguments);

		// -----------------------------------------------------------------
		// init local variables
		// -----------------------------------------------------------------

		// store progressbars links
		this.toolbarTextSingle = this.down('#single');
		this.toolbarTextAll = this.down('#all');
		this.toolbarTextSpeed = this.down('#speed');
		this.toolbarTextRemaining = this.down('#remaining');

		// init buttons
		// hack :( - we need to init plupload after add button is rendered
		this.btnAdd = this.down('#btnAdd');
		this.btnAdd.on('afterrender', this.initPlUpload, this);
		this.btnUpload = this.down('#btnUpload');
		this.btnCancel = this.down('#btnCancel');
		this.btnDelete = this.down('#btnDelete');

		// button handlers
		this.btnUpload.setHandler(this.onStart, this);
		this.btnCancel.setHandler(this.onCancel, this);
		this.btnDelete.setHandler(Ext.bind(this.onDeleteAll, this, [true]));
	},

/**
	* Returns percent of loaded data
	* @private
	*/
	renderStatus: function(value, meta, record) {
		var s = _(this.texts.status[value - 1]);
		if (value == 2) {
			s += " " + record.get("percent") + " %";
		}
		return s;
	},

/**
	* Plupload initialization
	*/
	initPlUpload: function() {
		this.uploader = new plupload.Uploader({
			url: this.url,
			runtimes: this.pluploadRuntimes,
			browse_button: this.btnAdd.getEl().dom.id,
			container: this.getEl().dom.id,
			max_file_size: this.max_file_size || '',
			resize: this.resize || '',
			flash_swf_url: this.pluploadPath+'/plupload.flash.swf',
			silverlight_xap_url: this.pluploadPath+'plupload.silverlight.xap',
			filters : this.filters || [],
			chunk_size: this.chunk_size,
			unique_names: this.unique_names,
			multipart: this.multipart,
			multipart_params: this.multipart_params || null,
			drop_element: this.getEl().dom.id,
			required_features: this.required_features || null
		});

		// Events
		Ext.each([
			'Init',
			'ChunkUploaded',
			'FilesAdded',
			'FilesRemoved',
			'FileUploaded',
			'PostInit',
			'QueueChanged',
			'Refresh',
			'StateChanged',
			'UploadFile',
			'UploadProgress',
			'Error'
		], function (v) {
			this.uploader.bind(v, eval("this.Plupload" + v), this);
		}, this);

		// Init Plupload
		this.uploader.init();
	},

/**
	* Deletes selected files from list
	*/
	deleteSelected: function() {
		var selected = this.getView().getSelectionModel().getSelection();
		Ext.each(selected, function(record) {
			if (record) {
				this.remove_file(record.getId());
			}
		}, this);
		return selected.length;
	},

/**
	* Delete button handler
	* @param {Boolean} onlySelected If true, then try to delete only selected
	*    files if there are any
	* @private
	*/
	onDeleteAll: function(onlySelected) {
		if (onlySelected && this.deleteSelected()) {
			return;
		}
		var range = this.store.getRange();
		for (var i = 0; i < range.length; i++) {
			var record = range[i];
			if (record) {
				this.remove_file(record.getId());
			}
		}
	},

/**
	* COMMENT THIS
	* @private
	*/
	onDeleteUploaded: function() {
		this.store.each(function(record) {
			if (record && record.get('status') == 5) {
				this.remove_file(record.getId());
			}
		}, this);
	},

/**
	* COMMENT THIS
	* @private
	*/
	onCancel: function() {
		this.uploader.stop();
		this.updateProgress();
	},

/**
	* COMMENT THIS
	* @private
	*/
	onStart: function() {
		this.fireEvent('beforestart', this);
		if (this.multipart_params) {
			this.uploader.settings.multipart_params = this.multipart_params;
		}
		this.uploader.start();
	},

/**
	* COMMENT THIS
	* @private
	*/
	remove_file: function(id) {
		var fileObj = this.uploader.getFile(id);
		if (fileObj) {
			this.uploader.removeFile(fileObj);
		} else {
			this.store.remove(this.store.getById(id));
		}
	},

/**
	* COMMENT THIS
	*/
	updateStore: function(files) {
		Ext.each(files, function(data) {
			this.updateStoreFile(data);
		}, this);
	},

/**
	* COMMENT THIS
	*/
	updateStoreFile: function(data) {
		data.msg = data.msg || '';
		var record = this.store.getById(data.id);
		if (record) {
			record.set(data);
			record.commit();
		} else {
			this.store.add(data);
		}

	},

/**
	* Fires after files have been loaded into store
	* @protected
	*/
	onStoreLoad: Ext.emptyFn,

/**
	* COMMENT THIS
	*/
	onStoreRemove: function(store, record, operation) {
		if (!store.data.length) {
			this.btnUpload.setDisabled(true);
			this.btnDelete.setDisabled(true);
			this.uploader.total.reset();
		}
		var id = record.get('id');
		Ext.each(this.success, function(v) {
			if (v && v.id == id) {
				Ext.Array.remove(this.success, v);
			}
		}, this);

		Ext.each(this.failed, function(v) {
			if (v && v.id == id) {
				Ext.Array.remove(this.failed, v);
			}
		}, this);
	},

	onStoreUpdate: function (store, record, operation) {
		var canUpload = false;
		if (this.uploader.state != 2) {
			this.store.each(function (record) {
				if (record.get("status") == 1) {
					canUpload = true;
					return false;
				}
			}, this);
		}
		this.btnUpload.setDisabled(!canUpload);
	},

	updateProgress: function(file) {
		var queueProgress = this.uploader.total;

		// All
		var total = queueProgress.size;
		var uploaded = queueProgress.loaded;
		this.toolbarTextAll.setText(
			Ext.util.Format.fileSize(uploaded) + "/" +
			Ext.util.Format.fileSize(total)
		);
		if (total > 0) {
			this.progressBarAll.updateProgress(
				queueProgress.percent / 100,
				queueProgress.percent + " %"
			);
		} else {
			this.progressBarAll.updateProgress(0, ' ');
		}

		// Speed + Remaining
		var speed = queueProgress.bytesPerSec;
		if (speed > 0) {
			var totalSec = parseInt((total-uploaded)/speed);
			var hours = parseInt( totalSec / 3600 ) % 24;
			var minutes = parseInt( totalSec / 60 ) % 60;
			var seconds = totalSec % 60;
			var timeRemaining = result =
				(hours < 10 ? "0" + hours : hours) + ":" +
				(minutes < 10 ? "0" + minutes : minutes) + ":" +
				(seconds  < 10 ? "0" + seconds : seconds);
			this.toolbarTextSpeed.setText(
				Ext.util.Format.fileSize(speed) + '/s');
			this.toolbarTextRemaining.setText(timeRemaining);
		} else {
			this.toolbarTextSpeed.setText('');
			this.toolbarTextRemaining.setText('');
		}

		// Single
		if (!file) {
			this.toolbarTextSingle.setText('');
			this.progressBarSingle.updateProgress(0, ' ');
		} else {
			total = file.size;
			/*

			uploaded = file.loaded;
			// ^ file.loaded sometimes is 1 step ahead, so we can not use it.

			uploaded = 0;
			if (file.percent > 0) {
				uploaded = file.size * file.percent / 100.0;
			}
			// ^ But this solution is imprecise as well
			// since percent is only a hint

			*/

			// So we use this Hack to store the value which is one step back
			uploaded = this.loadedFile;
			this.toolbarTextSingle.setText(
				Ext.util.Format.fileSize(uploaded) + "/" +
				Ext.util.Format.fileSize(total)
			);
			this.progressBarSingle.updateProgress(
				file.percent / 100,
				(file.percent).toFixed(0) + " %"
			);
		}
	},

	PluploadInit: function(uploader, data) {
		this.btnAdd.setDisabled(false);

		if (data.runtime == "flash" ||
			data.runtime == "silverlight" ||
			data.runtime == "html4") {
			this.view.emptyText = _(this.texts.noDragDropAvailable);
		} else {
			this.view.emptyText = _(this.texts.DragDropAvailable);
		}
		this.view.emptyText = Ext.String.format(
			this.texts.emptyTextTpl, this.view.emptyText);
		this.view.refresh();
		this.updateProgress();
	},

	PluploadFilesAdded: function(uploader, files) {
		this.btnDelete.setDisabled(false);
		this.updateStore(files);
		this.updateProgress();
	},

	PluploadFilesRemoved: function(uploader, files) {
		Ext.each(files, function (file) {
			this.store.remove(this.store.getById(file.id));
		}, this);
		this.updateProgress();
	},

	PluploadFileUploaded: function(uploader, file, status) {
		var response = Ext.JSON.decode(status.response);
		if (response.success == true) {
			file.server_error = 0;
			this.success.push(file);
			this.fireEvent('uploadsuccess', response);
		} else {
			if (response.message) {
				file.msg = '<span style="color: red">' +
					response.message + '</span>';
			}
			file.server_error = 1;
			this.failed.push(file);
		}
		this.updateStoreFile(file);
		this.updateProgress(file);
	},

	PluploadChunkUploaded: function() {},

	PluploadPostInit: function() {},

	PluploadQueueChanged: function(uploader) {
		// dirty hack, cause uploader don't updates queue size if
		// we had 2 added files and one was deleted
		Ext.defer(this.updateProgress, 100, this);
	},

	PluploadRefresh: function(uploader) {
		this.updateStore(uploader.files);
		this.updateProgress();
	},

	PluploadStateChanged: function(uploader) {
		if (uploader.state == 2) {
			this.fireEvent('uploadstarted', this);
			this.btnCancel.setDisabled(false);
		} else {
			this.fireEvent('uploadcomplete', this, this.success, this.failed);
			this.btnCancel.setDisabled(true);
		}
	},

	PluploadUploadFile: function() {
		this.loadedFile = 0;
	},

	PluploadUploadProgress: function(uploader, file) {
		// No chance to stop here - we get no response-text
		// from the server. So just continue if something fails here.
		// Will be fixed in next update, says plupload.
		if (file.server_error) {
			file.status = 4;
		}
		this.updateStoreFile(file);
		this.updateProgress(file);
		this.loadedFile = file.loaded;
	},

	PluploadError: function (uploader, data) {
		data.file.status = 4;
		if (data.code == -600) {
			data.file.msg = Ext.String.format(
				'<span style="color: red">{0}</span>',
				_(this.texts.statusInvalidSizeText)
			);
		} else if (data.code == -700) {
			data.file.msg = Ext.String.format(
				'<span style="color: red">{0}</span>',
				_(this.texts.statusInvalidExtensionText)
			);
		} else {
			data.file.msg = Ext.String.format(
				'<span style="color: red">{2} ({0}: {1})</span>',
				data.code, data.details, data.message
			);
		}
		this.updateStoreFile(data.file);
		this.updateProgress();
	}
});