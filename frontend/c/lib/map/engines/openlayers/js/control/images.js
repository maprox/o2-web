/**
 * OpenLayers maps image agent
 *
 * @class M.lib.map_engines.openlayers.Images
 * @singleton
 */

Ext.ns('C.lib.map.openlayers');
C.lib.map.openlayers.Images = function() {
	/**
	 * Список созданных изображений openlayers.maps.MarkerImage
	 * @type Ext.util.MixedCollection
	 * @private
	 */
	var imageList = new Ext.util.MixedCollection();

	/**
	 * Список настроек изображений
	 * @type Ext.util.MixedCollection
	 * @private
	 */
	var iconConfigs = new Ext.util.MixedCollection();

	// -----------------------------------------
	/**
	 * Скорая
	 */
	iconConfigs.add('ambulance', {
		image: {w: 32, h: 32},
		shadow: {w: 48, h: 32},
		shape: {
			type: 'poly',
			coord: [
				26,  7, 31,  8, 31,  9, 31, 10, 31, 11, 31, 12,
				31, 13, 31, 14, 31, 15, 31, 16, 31, 17, 31, 18,
				31, 19, 31, 20, 31, 21, 31, 22, 29, 23, 27, 24,
				24, 25, 21, 26, 19, 27, 16, 28, 14, 29, 11, 30,
				 8, 30,  4, 29,  1, 28,  0, 27,  0, 26,  0, 25,
				 0, 24,  0, 23,  1, 22,  0, 21,  0, 20,  0, 19,
				 2, 18,  4, 17,  6, 16,  7, 15,  8, 14,  9, 13,
				10, 12, 10, 11, 10, 10, 12,  9, 16,  8, 20,  7
			]
		}
	});

	iconConfigs.add('yellowlorry', {
		image: {w: 32, h: 32},
		shadow: {w: 48, h: 32},
		shape: {
			type: 'poly',
			coord: [
				23,  3, 30,  4, 31,  5, 31,  6, 31,  7, 31,  8, 31,
				 9, 31, 10, 31, 11, 31, 12, 31, 13, 31, 14, 31, 15,
				31, 16, 31, 17, 31, 18, 31, 19, 30, 20, 31, 21, 31,
				22, 30, 23, 28, 24, 26, 25, 24, 26, 22, 27, 19, 28,
				17, 29, 15, 30, 15, 30, 10, 29,  6, 28,  2, 27,  2,
				26,  3, 25,  0, 24,  0, 23,  0, 22,  0, 21,  0, 20,
				 0, 19,  0, 18,  0, 17,  0, 16,  1, 15,  1, 14,  1,
				13,  2, 12,  3, 11,  7, 10,  8,  9,  8,  8,  8,  7,
				 9,  6, 12,  5, 16,  4, 20,  3
			]
		}
	});

	iconConfigs.add('cargrey', {
		image: {w: 32, h: 32},
		shadow: {w: 48, h: 32},
		shape: {
			type: 'poly',
			coord: [
				23, 11, 25, 12, 29, 13, 30, 14, 30, 15, 30, 16, 30, 17,
				30, 18, 30, 19, 31, 20, 31, 21, 29, 22, 26, 23, 22, 24,
				19, 25, 15, 26, 12, 27,  8, 27,  5, 26,  2, 25,  0, 24,
				 0, 23,  0, 22,  0, 21,  0, 20,  0, 19,  1, 18,  3, 17,
				 6, 16,  8, 15,  9, 14, 10, 13, 12, 12, 15, 11
			]
		}
	});

	iconConfigs.add('car1', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('firetruck', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('atv', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('helicopter', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('mixer', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('moto1', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('taxi', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('policecar', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('scania', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('schoolbus', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('ship1', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('train1', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('latitude1', {
		image: {w: 32, h: 32},
		offset: {x: 0, y: -13}
	});

	iconConfigs.add('boat', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('boat2', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('boat4', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('bike1', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('person1', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('person3', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('person4', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('person5', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('plane1', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('plane2', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('marker_01', {
		image: {w: 16, h: 16}
	});

	iconConfigs.add('marker_02', {
		image: {w: 16, h: 16}
	});

	iconConfigs.add('camera01', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('camera02', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('camera03', {
		image: {w: 32, h: 32}
	});

	iconConfigs.add('status_moving', {
		image: {w: 16, h: 16}
	});

	iconConfigs.add('status_stopped', {
		image: {w: 16, h: 16}
	});

	iconConfigs.add('status_sleep', {
		image: {w: 16, h: 16}
	});

	iconConfigs.add('status_lost', {
		image: {w: 16, h: 16},
		offset: {x: 6, y: -10}
	});

	iconConfigs.add('status_satellites', {
		image: {w: 16, h: 16},
		offset: {x: 6, y: -10}
	});

	iconConfigs.add('arrow_blink', {
		image: {w: 15, h: 13},
		offset: {x: -10, y: 0},
		file_name: 'arrow_blink/arrow_blink.gif'
	});

	iconConfigs.add('sos_packet', {
		image: {w: 16, h: 16},
		file_name: 'sos_packet/exclamation.png'
	});

	iconConfigs.add('warehouse_icon', {
		image: {w: 26, h: 26},
		offset: {x: 3, y: -13}
	});


/**
	* Device moving direction icons
	*/
	var DEGREE_STEP = 10;
	var ICONS_COUNT = 36;
	var DEVICE_ICON_SIZE = 24;
	var colors = C.cfg.track.colors;
	for (var j = 0; j < colors.length; j++) {
		iconConfigs.add('marker_start/' + colors[j], {
			image: {w: 28, h: 28},
			file_name: 'marker_start/' + colors[j] + '.png'
		});
		iconConfigs.add('marker_finish/' + colors[j], {
			image: {w: 28, h: 42},
			offset: {x: 0, y: -21},
			file_name: 'marker_finish/' + colors[j] + '.png'
		});
		for (var i = 0; i < ICONS_COUNT; i++) {
			var ox = Math.round(Math.sin(i * DEGREE_STEP * Math.PI / 180) *
				DEVICE_ICON_SIZE);
			var oy = -Math.round(Math.cos(i * DEGREE_STEP * Math.PI / 180) *
				DEVICE_ICON_SIZE);
			var alias = 'arrow_move/' + colors[j] + '/' + (i * DEGREE_STEP);
			iconConfigs.add(alias, {
				image: {w: 24, h: 24},
				offset: {x: ox, y: oy},
				file_name: alias + '.png'
			});
			var alias2 = 'arrow_move/' + colors[j] + '/s' + (i * DEGREE_STEP);
			iconConfigs.add(alias2, {
				image: {w: 24, h: 24},
				file_name: alias + '.png'
			});
		}
	}
	// -----------------------------------------

	return {
/**
		* Returns an identifier of appropriate icon
		* @param {int} angle Azimuth value
		* @param {string} color Icon color
		*/
		getMovementIcon: function(angle, color) {
			return 'arrow_move/' + color + '/' + angle;
		},

		/**
		 * Применяет настройки картинки для маркера.
		 * Для этого у маркера ищется параметр obs_imageId, который
		 * указывает на имя картинки
		 * @param {Object} cfg Настройки маркера
		 * @return {Object} Измененные настройки
		 */
		apply: function(cfg) {
			// проверим переданный параметр
			if (Ext.isEmpty(cfg)) { return cfg; }
			if (Ext.isEmpty(cfg.obs_imageId)) { return cfg; }
			var id = cfg.obs_imageId;
			if (id === 'default') { return cfg; }
			// поищем в списке уже созданных
			return Ext.apply(cfg, {
				icon: this.getImage(id, 'image'),
				shadow: this.getImage(id, 'shadow'),
				shape: this.getShape(id)
			});
		},

/**
		* Возвращает объект изображения для отображения на OSM-карте
		* @param {String} name Идентификатор изображения
		* @param {String} file Имя файла изображения
		* @param {object} offsetI - Смещение по x и по y
		* @return {google.maps.MarkerImage}
		*/
		getImage: function(id, offsetI) {
			var file = 'image';
			var alias = id + '_' + file;
			// пробуем найти картинку в уже созданных
			var img = imageList.get(alias);
			if (img) { return img.clone(); }
			var c = iconConfigs.get(id);
			if (!c) { return null; }
			if (!c[file]) { return null; }
			//Рассчитываем смещение картинки
			var deltaX = 0;
			var deltaY = 0;
			if (typeof(c.offset) !== 'undefined') {
				deltaX = c.offset.x;
				deltaY = c.offset.y;
			}
			//создадим картинку
			var path = C.cfg.pathIcons + id + '/';
			var size = new OpenLayers.Size(c[file].w, c[file].h);
			offsetI = (offsetI === undefined) ? {x: 0, y: 0} : offsetI;
			var offset =
				new OpenLayers.Pixel(-(size.w/2) + deltaX + offsetI.x,
					-(size.h/2) + deltaY + offsetI.y);
			if (typeof(c.file_name) !== 'undefined') {
				file = c.file_name;
				path = C.cfg.pathIcons;
			}
			else {
				file = file + '.png';
			}
			var icon = new OpenLayers.Icon(path + file, size, offset);
			imageList.add(alias, icon);
			return icon;
		}
	};
}();
