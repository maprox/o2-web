/**
 * Track history controller
 * @class O.app.controller.TrackHistory
 * @extend Ext.app.Controller
 */
Ext.define('O.app.controller.TrackHistory', {
	extend: 'Ext.app.Controller',
	views: ['TrackHistory'],

	config: {
		refs: {
			container: '#tracks',
			periodToolbar: '#tracks #periodchooser',
			btnObjects: '#tracks #periodchooser #groupsbutton',
			baseLayer: '#tracks #baselayer',
			btnTracks: '#tracks #periodchooser #tracksbutton',
			objectsGroupsList: {
				selector: '#tracks_objectsgroupslist',
				id: 'tracks_objectsgroupslist',
				xtype: 'objectsgroupslist',
				autoCreate: true,
				multiSelectDevices: false
			},
			tracksList: {
				selector: '#tracks_listoftracks',
				autoCreate: true,
				id: 'tracks_listoftracks',
				xtype: 'listoftracks'
			}
		},
		control: {
			btnObjects: {
				toggle: 'onBtnObjectsToggle'
			},
			btnTracks: {
				toggle: 'onBtnTracksToggle'
			},
			periodToolbar: {
				load: 'onLoadPeriod'
			},
			objectsGroupsList: {
				selectionchange: 'onSelectionChange',
				checkchange: 'onCheckChange',
				afterload: 'onListAfterLoad',
				close: 'onGroupsListClose'
			},
			tracksList: {
				selectionchange: 'onTrackChange',
				close: 'onTracksListClose'
			}
		}
	},

/**
	* Controller initialization
	* @construct
	*/
	init: function() {
		/*
		Ext.Viewport.on({
			orientationchange: this.onOrientationChange,
			resize: this.onResize,
			scope: this
		});*/
	},

/**
	* Objects button toggles its state
	* @param {Ext.Component} container
	* @param {Ext.Component} button
	* @param {Boolean} pressed
	* @private
	*/
	onBtnObjectsToggle: function(container, button, pressed) {
		var container = this.getContainer();
		var overlay = this.getObjectsGroupsList();
		if (pressed) {
			overlay.showInContainer(container, button);
		} else {
			overlay.hide();
		}
	},

	/**
	 * Tracks button toggles its state
	 * @param {Ext.Component} container
	 * @param {Ext.Component} button
	 * @param {Boolean} pressed
	 * @private
	 */
	onBtnTracksToggle: function(container, button, pressed) {
		var container = this.getContainer();
		var overlay = this.getTracksList();
		if (pressed) {
			overlay.showInContainer(container, button);
		} else {
			overlay.hide();
		}
	},

/**
	* Fires when objectsgroupslist is hidden via close button
	* @private
	*/
	onGroupsListClose: function() {
		this.getBtnObjects().unpressAll();
	},

	/**
	 * Fires when objectsgroupslist is hidden via close button
	 * @private
	 */
	onTracksListClose: function() {
		this.getBtnTracks().unpressAll();
	},

	/**
	 * Display track
	 * @param {Mon.Track} track
	 */
	onTrackChange: function(track) {
		if (!track.packetsLoaded && !track.isSleep()) {
			this.getContainer().lock();
			track.getPackets(function(){
				this.onTrackChange(track);
			}, function(){
				this.getContainer().unlock();
			}, this);
		} else {
			// TODO: костыль из-за того что движок заточен под десктопную версию
			if (!track.get('start_point') && !Ext.isEmpty(track.get('track'))) {
				var coord = Ext.create('O.mon.model.Coord');
				coord.longitude = track.get('track')[0].lng;
				coord.latitude = track.get('track')[0].lat;
				track.set('start_point', coord);
			}

			this.getBaseLayer().drawSelectedTracks([track], true, track);
			this.getContainer().unlock();
		}
	},

/**
	* Loading of period
	* @param {Object} period
	* @param {Function} resultCallback
	*/
	onLoadPeriod: function(period, resultCallback) {
		var device = this.getObjectsGroupsList().getSelectedDevices();

		if (!device) {
			this.getTracksList().setEmptyTextNoDevice();
			this.getTracksList().load([]);
			resultCallback(true);
			return;
		}

		this.getContainer().lock();
		C.get('mon_track', this.onLoad, this,
			{'$filter': 'sdt ge ' + C.utils.fmtUtcDate(period.sdt) +
				' and edt le ' + C.utils.fmtUtcDate(period.edt) +
				' and id_device eq ' + device}
		);
		resultCallback(true);
	},

/**
	* Обработать событие "Выбран элемент истории поездок"
	*/
	onTrackItemSelect: function(selection) {
		var last_item = null;
		if (this.lastSelected) {
			Ext.each(selection, function(item){
				if (!Ext.Array.contains(this.lastSelected, item)) {
					last_item = item;
				}
			}, this);
		}
		this.lastSelected = selection;
		this.mapBaseLayer.drawSelectedTracks(selection, true, last_item);
	},

/**
	* Очистка списка пакетов и истории поездок, выдача сообщения об отсутствии
	* даных
	*/
	displayEmptyTracks: function() {
		this.getContainer().unlock();
		this.getTracksList().setEmptyTextNoTracks();
		this.getTracksList().load([]);
		M.msg.info(_('No tracks for selected period'));
	},

/**
	* Draw packets on a baselayer
	* @param {Object[]} tracks
	* @param {Object} period
	*/
	onLoad: function(tracks, period) {
		var layer = this.getBaseLayer();
		layer.clearHistroryData();

		if (tracks.length == 0) {
			this.displayEmptyTracks();
			return;
		}
		var lastTrack = tracks.last();
		if (lastTrack.type == Mon.Track._SLEEP &&
			lastTrack.track.length == 0) {

			tracks.remove(lastTrack);
		}

		var container = this.getContainer();
		var list = this.getTracksList();
		list.load(tracks);
		this.getBtnTracks().pressAll();
		list.showInContainer(container, this.getBtnTracks());
		container.unlock();
	},

/**
	* Fires when data is loaded into grouped list
	* @param {O.lib.abstract.GroupsList} list
	* @param {Object} data Loaded data
	*/
	onListAfterLoad: function(list, data) {
		list.doDefaultSelection();
	},

/**
	* Object check change event handler
	* @param {O.lib.abstract.GroupsList} list
	*/
	onCheckChange: function(list) {
		//console.log('check');
		this.onStateChange(list, false);
	},

/**
	* Object selection event handler
	* @param {Object} list List of objects
	*/
	onSelectionChange: function(list) {
		//console.log('selection');
		this.onStateChange(list, true);
	},

/**
	* Object state change event handler
	* @param {Object} list List of objects
	* @param {Boolean} selectionChange have selection changed or not
	*/
	onStateChange: function(list, selectionChange) {
		var layer = this.getBaseLayer();

		if (!layer) { return; }
		if (!layer.isLoaded()) { return; }

		var id = list.getSelectedObjectId();

		if (selectionChange) {
			if (!id || typeof(id) !== 'number') { return; }
		}

		layer.resetControls();

		var alias = list.config.itemAlias;

		var ids = Ext.Array.clone(list.getCheckedObjects());
		if (selectionChange) {
			if (!Ext.Array.contains(ids, id)) {
				ids.push(id);
			}
			layer.setSelectedObject(alias, id);
		}

		// adding selected object to an ids array
		if (id && Ext.Array.indexOf(ids, id) < 0) {
			ids.push(id);
		}

		switch (alias) {
			case 'mon_device':
				layer.setDevices([id], false);
				this.getPeriodToolbar().reload(true);
				break;
			case 'mon_geofence':
				layer.setZones(ids);
				break;
		}
	}
});
