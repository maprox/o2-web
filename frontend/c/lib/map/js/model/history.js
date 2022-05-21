/**
 * Device adding and manipulating functionality
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.History
 * @extends Ext.Base
 */

Ext.define('C.lib.map.History', {
	extend: 'C.lib.map.Packet',

	pathStyle: {
		strokeColor: '#0033FF',
		strokeOpacity: 0.6,
		strokeWidth: 2,
		graphicZIndex: 440
	},
	/*playerStyle: {
		strokeColor: '#000000',
		strokeOpacity: 0.95,
		strokeWidth: 2,
		graphicZIndex: 500
	},*/
	trackStyle: {
		strokeOpacity: 0.95,
		strokeColor: '#00FF00',
		fillOpacity: 0.5,
		strokeWidth: 3,
		graphicZIndex: 440
	},
	sensorsTrackStyle: {
		strokeOpacity: 0.95,
		strokeColor: '#000000',
		fillOpacity: 0.5,
		strokeWidth: 12,
		graphicZIndex: 439
	},
	stoppingStyle: {
		strokeColor: '#000000',
		strokeWidth: 4,
		strokeOpacity: 0.5,
		fillColor: '#ffffff',
		fillOpacity: 0.3,
		graphicZIndex: 420
	},
	sensorPointStyle: {
		fillOpacity: 0.3,
		fontColor: '#FFFFFF',
		fontFamily: "sans-serif",
		fontWeight: "bold",
		strokeWidth: 1.5,
		pointRadius: 11,
		graphicZIndex: 445
	},

	VECHILE_ZINDEX: 51000,
	MOVING_ZINDEX: 50000,
	MOVE_ICONS_ANGLE: 10,

	/**
	 * @protected
	 * @cfg Ext.util.MixedCollection
	 */
	stoppings: null,

	/**
	 * @protected
	 * @cfg Ext.util.MixedCollection
	 */
	tracks: null,

	/**
	 * @protected
	 * @cfg Ext.util.MixedCollection
	 */
	path: null,

	/**
	 * Метод, возвращающий указатель на список остановок.
	 * При необходимости объект списка создается
	 * @returns Ext.util.MixedCollection
	 * @protected
	 */
	getStoppings: function() {
		if (!this.stoppings) {
			this.stoppings = new Ext.util.MixedCollection();
		}
		return this.stoppings;
	},

	/**
	 * Toggle drawing history path
	 */
	clearStoppings: function() {
		this.getStoppings().each(function(stopping){
			if (stopping.info) {
				stopping.info.destroy();
			}
			if (stopping.circle) {
				stopping.circle.destroy();
			}
		});
		this.getStoppings().clear();
	},

	/**
	 * Метод, возвращающий указатель на список треков.
	 * При необходимости объект списка создается
	 * @returns Ext.util.MixedCollection
	 * @protected
	 */
	getTracks: function() {
		if (!this.tracks) {
			this.tracks = new Ext.util.MixedCollection();
		}
		return this.tracks;
	},


	/**
	 * Returns pointer on sensor tracks
	 * @returns Ext.util.MixedCollection
	 * @protected
	 */
	getSensorTracks: function() {
		if (!this.sensorTracks) {
			this.sensorTracks = new Ext.util.MixedCollection();
		}
		return this.sensorTracks;
	},

	/**
	 * Removes track arrows if they exist
	 * @param trackArrows
	 */
	removeTrackArrows: function(trackArrows) {
		if (!trackArrows) { return; }
		for (var i = 0; i < trackArrows.length; i++) {
			this.removePathArrow(trackArrows[i]);
		}
	},

	/**
	 * Toggle drawing history path
	 */
	clearTracks: function() {
		this.getTracks().each(function(track) {
			this.removeTrackArrows(track.arrows);
			if (track.start) {
				track.start.destroy();
			}
			if (track.finish) {
				track.finish.destroy();
			}
			track.destroy();
		}, this);
		this.getTracks().clear();
	},

	/**
	 * Clears sensor tracks
	 * TODO: merge with clearTracks function?
	 */
	clearSensorTracks: function() {
		this.getSensorTracks().each(function(track) {
			this.removeTrackArrows(track.arrows);
			if (track.start) {
				track.start.destroy();
			}
			if (track.finish) {
				track.finish.destroy();
			}
			track.destroy();
		}, this);
		this.getSensorTracks().clear();
	},

	/**
	 * Метод, возвращающий указатель на путь машины за период.
	 * При необходимости объект списка создается
	 * @returns Ext.util.MixedCollection
	 * @protected
	 */
	getPath: function() {
		if (!this.path) {
			this.path = new Ext.util.MixedCollection();
		}
		return this.path;
	},

	/**
	 * Toggle drawing history path
	 */
	clearPath: function() {
		this.getPath().each(function(path){
			path.destroy();
		});
		this.getPath().clear();
	},

	/**
	 * Clears data for history tracks
	 */
	clearHistroryData: function() {
		if (!this.isLoaded()) { return; }
		this.clearBaloon();
		this.clearPath();
		this.clearTracks();
		this.clearStoppings();
	},

	/**
	 * Clears arrow, checks for sos packet
	 * @param arrow
	 */
	removePathArrow: function(arrow) {
		if (!arrow) { return; }
		if (arrow.getPacket) {
			var packet = arrow.getPacket();
			if (packet) {
				Ext.Array.remove(this.displayedSosPackets, packet.id);
			}
		}
		arrow.destroy();
	},

	/**
	 * Метод обновления данных
	 * @param {Boolean} isZoomEvent If true, then do not use bounds
	 */
	onMapUpdate: function(isZoomEvent) {
		if (!isZoomEvent) { return; }

		this.getTracks().each(function(track) {
			if (track.points && track.color) {
				this.removeTrackArrows(track.arrows);
				track.arrows = this.drawArrows(track.points, track.color);
			}
		}, this);

		// Sensor tracks
		this.getSensorTracks().each(function(track) {
			if (track.points && track.color) {
				this.removeTrackArrows(track.arrows);
				track.arrows = this.drawSensorPoints(track.points, track.color);
			}
		}, this);
	},

	/**
	 * Отрисовка трека устройства для истории поездок
	 */
	drawHistoryPath: function(device, tracks) {
		if (!this.isLoaded()) { return; }

		this.getPath().addAll(this.drawPathHistory(tracks));
		if (this.showHistoryPath) {
			this.getPath().each(function(path){
				path.show();
			});
		}
		var points = [];
		for (var i = 0; i < tracks.length; i++) {
			points = points.concat(tracks[i].points);
		}
		this.getEngine().zoomToPoints(points, true);
	},

/**
	 * Draw track for tracksplayer
	 * @param device
	 * @param time
	 * @param points
	 *
	 * @deprecated
	 */
	drawPlayerTrack: function(device, time, points) {
		// Clear old track
		//if (this.playerTrack) {
		//	this.playerTrack.destroy();
		//}
		// Draw track with new points in it
		//this.playerTrack = this.getEngine().addLine(points, this.playerStyle)
		//this.playerTrack.show();

		return null;
	},

/**
	* Draw device current position
	* @param device
	* @param packet
	*/
	drawPlayerDevice: function(device, packet) {
		if (!packet) {
			return;
		}

		if (this.playerDevice) {
			this.playerDevice.destroy();
		}

		this.playerDevice = this.getEngine().addMarker({
			packet: packet,
			img: device.imagealias,
			isDevice: true,
			zindex: this.VECHILE_ZINDEX
		});

		if (this.movementArrow) {
			// Destroy movement arrow
			this.movementArrow.destroy();
		}
		// Draw movement arrow
		var anglePart = Math.round(packet.azimuth / this.MOVE_ICONS_ANGLE);
		//Чтобы не выйти за пределы массива
		if (anglePart > this.MOVEMENT_ICONS - 1) {
			anglePart = anglePart % this.MOVEMENT_ICONS;
		}
		var alias = anglePart * this.MOVE_ICONS_ANGLE;

		var image = (packet.isSos()) ? 'sos_packet' :
			this.getEngine().getMovementIcon(alias, '008800');

		this.movementArrow = this.getEngine().addMarker({
			packet: packet,
			img: image,
			zindex: this.MOVING_ZINDEX
		});

		if (this.followSelected)  {
			// Center map on device
			this.getEngine().moveToPoints([packet]);
		}
	},

/**
	 * Clear player device from the map
	 */
	clearPlayerDevice: function() {
		if (this.playerDevice) {
			this.playerDevice.destroy();
		}
	},

/**
	 * Clear movement arrow
	 */
	clearMovementArrow: function() {
		if (this.movementArrow) {
			this.movementArrow.destroy();
		}
	},

	/**
	 * Depends on condition draw sensors tracks below all seleted tracks
	 * @param Sensors
	 * @param Tracks
	 */
	drawSensors: function(sensors, tracks) {
		var me = this;

		// Clear existing sensor tracks
		this.clearSensorTracks();

		if (!sensors || !sensors.length) {
			return;
		}

		// Let's draw
		for (var sensorIndex = 0;
			 sensorIndex < sensors.length;
			 sensorIndex++) {
			var sensor = sensors[sensorIndex];
			for (var i = 0; i < tracks.length; i++) {
				var track = tracks[i];

				// Skip sleep tracks
				if (track.isSleep()) {
					return true;
				}

				// Divide track on subtracks
				var subTrack = [];

				// Color of subtracks for this track
				// Darkier by 50%
				var color = C.utils.colorLuminance(track.get('color'), -0.5);
				color = color.substring(1, color.length);

				// Track length
				var trackLength = track.packets.length;
				for (var index = 0; index < trackLength; index++) {
					var packet = track.packets[index];
					var packetPass = false;
					// Check if packet have sensor with given conditions
					for (var j = 0; j < packet.sensor.length; j++) {
						var packetSensor = packet.sensor[j];
						if (me.checkPacketSensor(packetSensor, sensor)) {
							// Add packet
							subTrack.push(packet);
							packetPass = true;

							// Stop iteration
							break;
						}
					}

					// Draw subtrack if ready
					if ((!packetPass || (index == trackLength - 1))
						&& subTrack.length)
					{
						// Draw collected packets
						me.getSensorTracks().add(
							me.drawSensorsTrack(subTrack, color, sensorIndex)
						);
						// Start new subtrrack
						subTrack = [];
					}
				}
			}
		}
	},

	/**
	 * Check if packet sensor satisfies conditions
	 * @param Type packetSensor Packet sensor
	 * @param Type sensorSetting Sensor conditions
	 */
	checkPacketSensor: function(packetSensor, sensorSetting) {
		if (packetSensor.id_device_sensor !== sensorSetting.get('id_sensor')) {
			return false;
		}
		// Packet sensor value
		var value = packetSensor.val_conv !== null ? packetSensor.val_conv
			: packetSensor.val;

		// If sensor is digital (only on or off values)
		if (sensorSetting.get('is_digital')) {
			// If 'On'
			if (sensorSetting.get('condition') == '1'
				&& value !== '0')
			{
				return true;
			}

			// if 'off'
			if (sensorSetting.get('condition') == '0'
				&& value === '0')
			{
				return true;
			}

		} else {
			if (sensorSetting.get('condition') === '=') {
				if (+value == +sensorSetting.get('value')) {
					return true;
				}
			}

			if (sensorSetting.get('condition') === '<>') {
				if (+value != +sensorSetting.get('value')) {
					return true;
				}
			}

			if (sensorSetting.get('condition') === '>') {
				if (+value > +sensorSetting.get('value')) {
					return true;
				}
			}

			if (sensorSetting.get('condition') === '<') {
				if (+value < +sensorSetting.get('value')) {
					return true;
				}
			}
		}

		return false;
	},

	/**
	 * Draws a number of tracks for track history
	 * @param {object[]} tracks Track objects array (points and colors)
	 * @param {boolean} setCenter Move or not map center
	 * @param {object} lastItem Last selected track to zoom on it
	 */
	drawSelectedTracks: function (tracks, setCenter, lastItem) {
		this.resetControls();
		this.clearStoppings();
		this.clearTracks();

		var stoppings = [];
		for (var i = 0; i < tracks.length; i++) {
			var track = tracks[i];
			var color = track.get('color');
			var points = track.packets;
			if (!track.isSleep()) {
				this.getTracks().add(
					this.drawSelectedTrack(points, color, setCenter));
			} else {
				stoppings.push(track);
			}
		}

		this.getStoppings().addAll(this.drawStoppings(stoppings));

		//Zoom on last selected track if it's necessary
		if (lastItem) {
			if (lastItem.packets && lastItem.packets.length) {
				this.getEngine().zoomToPoints(lastItem.packets);
			} else {
				this.getEngine().moveToPoints([lastItem.get('start_point')]);
			}
		}
	},

	/**
	 * Draws a single track for track history
	 * @param {O.mon.model.Packet[]} points track points array
	 * @param {string} color Track color
	 * @param {boolean} setCenter Move or not map center
	 */
	drawSelectedTrack: function (points, color, setCenter) {
		if (!this.isLoaded()) { return this.getEngine().getDummy(); }

		if (setCenter === undefined) {
			setCenter = true;
		}

		var track = this.drawTrackLine(points, color);

		if (setCenter) {
			this.getEngine().moveToPoints(points);
		}

		//start and end of track markers
		track.finish = this.addPacketPoint(points[points.length - 1],
			'marker_finish/' + color);
		track.start = this.addPacketPoint(points[0], 'marker_start/' + color);
		return track;
	},

	/**
	 * Draws a single track for track history
	 * @param {O.mon.model.Packet[]} points track points array
	 * @param {string} color Track color
	 */
	drawTrackLine: function (points, color) {
		if (!this.isLoaded()) { return this.getEngine().getDummy(); }

		var engine = this.getEngine();
		var style = Ext.clone(this.trackStyle);
		if (color !== undefined) {
			style.strokeColor = '#' + color;
		}

		var track = engine.addLine(points, style);
		track.show();

		track.points = points;
		track.color = color;
		track.arrows = this.drawArrows(points, color);
		return track;
	},

	/**
	 * Draws sensor track using thicker line below normal track
	 * @param {O.mon.model.Packet[]} points track points array
	 * @param {string} color Track color
	 * @param {number} sensorIndex
	 */
	drawSensorsTrack: function(points, color, sensorIndex) {
		var engine = this.getEngine();
		var style = Ext.clone(this.sensorsTrackStyle);
		if (color !== undefined) {
			style.strokeColor = '#' + color;
		}

		// If sensor tracks is more tnan one
		// Experemental
		/*if (sensorIndex > 0) {
			style.strokeWidth = style.strokeWidth + sensorIndex * 3;
			var rcolor = '#'
				+ (0x1000000
				+ (Math.random()) * 0xffffff).toString(16).substr(1,6);
			style.strokeColor = rcolor;
			var lum = sensorIndex % 2 ? 0.5 : -0.5;
				//= C.utils.colorLuminance(style.strokeColor, lum);
			style.graphicZIndex = style.graphicZIndex - sensorIndex;
		}*/

		var track = engine.addLine(points, style);
		track.show();

		track.points = points;
		track.color = color;
		track.arrows = this.drawSensorPoints(points, color);

		return track;
	},

	/**
	 * Обновление трека истории поездок
	 */
	drawPathHistory: function(tracks) {
		var lines = [];
		for (var i = 0; i < tracks.length; i++) {
			lines.push(this.getEngine().addLine(tracks[i].points, this.pathStyle));
		}
		return lines;
	},

	/**
	 * Toggle drawing history path
	 */
	toggleHistoryPath: function(show) {
		this.showHistoryPath = show;
		this.getPath().each(function(path){
			if (show) {
				path.show();
			} else {
				path.hide();
			}
		});
	},

	/**
	 * Returns whether first packet should be filtered or not
	 * First packet should always be drawn for track
	 * @return {Boolean}
	 */
	filterFirstPacket: function() {
		return false;
	}
});

