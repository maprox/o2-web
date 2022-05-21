/**
 * @class M.app.view.trackhistory.List
 */
C.utils.inherit('M.app.view.trackhistory.List', {

	/**
	 * @param {String}
	 * Last selected records id
	 * Needed to avoid duplicate firing
	 */
	lastSelectedId: null,

	/**
	 * @construct
	 */
	initialize: function() {
		this.callParent(arguments);
		// close button handler
		this.btnClose = this.down('button[action=close]');
		if (this.btnClose) {
			this.btnClose.on('tap', this.onBtnCloseTap, this);
		}

		this.list.on('selectionchange', 'onSelect', this);
	},

	/**
	 * Close button tap handler.
	 * Fires "hide" event and hides this panel
	 * @private
	 */
	onBtnCloseTap: function() {
		this.hide();
		this.fireEvent('close', this);
	},

	/**
	 * Relay track selection.
	 * Gathers data and fires "selectionchange" event
	 * @private
	 */
	onSelect: function(list, records) {
		var record = records[0];
		if (record && record.getId() != this.lastSelectedId) {
			this.lastSelectedId = record.getId();
			this.fireEvent('selectionchange', record);
		}
	},


	/**
	 * Loads tracks into store
	 * @param {Mon.Track[]} tracks
	 */
	load: function(tracks) {
		if (!Ext.isEmpty(tracks)) {
			tracks = tracks.getRange();
		}
		this.store.setData(tracks);
	},

	setEmptyTextNoDevice: function() {
		this.list.setEmptyText(_('No device chosen'));
	},

	setEmptyTextNoTracks: function() {
		this.list.setEmptyText(_('No tracks for selected period'));
	}
});