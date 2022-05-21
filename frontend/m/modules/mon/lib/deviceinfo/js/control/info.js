/**
 * @class M.lib.deviceinfo.InfoPanel
 */
C.utils.inherit('M.lib.deviceinfo.InfoPanel', {
	// TODO: move image carousel to separate component?

	/**
	 * Preload images count
	 * Should be more than 2
	 */
	preloadCount: 3,

	/**
	 * Carousel loading in progress flag
	 */
	carouselLoading: false,

	/**
	 * Current loading direction
	 * @private
	 */
	carouselLoadingDirection: 'back',

	/**
	 * Last carousel item index
	 */
	lastCarouselIndex: 1,

	/**
	 * All loaded images records storage
	 */
	carouselImages: [],

	/**
	 * @construct
	 * @override
	 */
	initialize: function() {
		// call overridden
		this.callParent(arguments);
		C.bind('mon_packet', this);

		// Painted
		this.on('painted', this.onPainted ,this);

		// image carousel
		this.imageCarousel = Ext.create('Ext.Carousel', {
			xtype: 'carousel',
			itemId: 'imagecarousel',
			cls: 'photo-viewer-carousel',
			//indicator: false, // TODO: everything broken when false
			hidden: true,
			items: [{
				html: ''
			}]
		});

		this.imageCarousel.on('activeitemchange',
			this.onCarouselActiveItemChange, this);

		// Not implemented
		/*this.imageCarousel.element.on({
			doubletap: function(e , node, options, eOpts) {
				var transformDetails = { scale: 5, angle: 0 };
				me.imageCarousel.element.setStyle(
					'-webkit-transform',
					'scaleX(' + transformDetails.scale
					+ ') scaleY(' + transformDetails.scale
					+ ') rotate(' + transformDetails.angle + 'deg)');
			}
		});*/

		// Close button
		this.closeButton = new Ext.Button({
			text: _('Close'),
			ui: 'normal',
			top: 10,
			right: 10,
			cls: 'photo-viewer-done-button'
		});

		this.closeButton.on('tap', this.onCloseButtonTap, this);

		// Image panel
		this.imagePanel = Ext.create('Ext.Panel', {
			id: 'photo-viewer',
			fullscreen: true,
			cls: 'photo-viewer-panel',
			layout:'fit',
			items: [this.imageCarousel, this.closeButton]
		});

		// Images overlay
		this.imagesOverlay = Ext.Viewport.add(
			this.imagePanel
		);

		// Image store
		this.imageStore = C.getStore('mon_device_image', {
			model: 'Mon.DeviceImage',
			remoteFilter: true,
			remoteSort: true,
			sorters: [{
				property: 'time',
				direction: 'DESC'
			}],
			proxy: {
				type: 'ajax',
				url: '/mon_device_image',
				reader: {
					type: 'json',
					rootProperty: 'data',
					totalProperty: 'count'
				}
			},
			autoLoad: false
		});

		// Store load
		this.imageStore.on('load', this.onImageStoreLoad, this);
	},

/**
	* Close button tap handler
	*/
	onCloseButtonTap: function() {
		Ext.Viewport.setActiveItem(0);
	},

/**
	* Carousel item change
	*/
	onCarouselActiveItemChange: function(carousel, item, oldValue, eOpts) {
		var activeItemIndex = carousel.getActiveIndex();

		var galleryTotal = carousel.getInnerItems() ?
			carousel.getInnerItems().length : 0;

		// Move back
		if (activeItemIndex > this.lastCarouselIndex) {
			this.carouselMoveBack(activeItemIndex, galleryTotal);
		}

		// Move forward
		if (activeItemIndex < this.lastCarouselIndex) {
			this.carouselMoveForward(activeItemIndex, galleryTotal);
		}

		this.lastCarouselIndex = activeItemIndex;
	},

/**
	* Carousel move forward
	* @param Integer activeItemIndex Active item intex
	* @param Integer total Total items in carousel
	*/
	carouselMoveForward: function(activeItemIndex, total) {
		// Check if first item is active
		if (activeItemIndex === 0 && !this.carouselLoading
			&& this.carouselImages.length)
		{
			// Set loading mode to forward
			this.carouselLoadingDirection = 'forward';
			this.carouselLoading = true;

			this.loadImages('GT', this.carouselImages[0].raw.time);
		}
	},

/**
	* Carousel moveback handler
	* @param Integer activeItemIndex Active item intex
	* @param Integer total Total items in carousel
	*/
	carouselMoveBack: function(activeItemIndex, total) {
		// Process last but one
		this.carouselMaybeProcessLastButOne(activeItemIndex, total);
	},

/**
	* Process last but one item
	* @param Integer activeItemIndex Active item intex
	* @param Integer total Total items in carousel
	*/
	carouselMaybeProcessLastButOne: function(activeItemIndex, total) {
		// If processing last but one, preloadCount should be more than 2
		if (activeItemIndex + 2 === total && this.carouselLoading === false) {

			this.carouselLoadingDirection = 'back';

			// Set carousel loading
			this.carouselLoading = true;

			// Load data and put in in carousel
			this.loadImages(
				'LT',
				// TODO: why raw? Where is normal record fields?
				this.carouselImages[this.carouselImages.length - 1].raw.time
			);
		}
	},

/**
	* Loads images
	* @param String Direction GT or LT
	* @param String time Time to start from
	*/
	loadImages: function(direction, time) {
		if (!direction) {
			direction = 'LT';
		}
		if (!time) {
			time = Ext.Date.format(
				O.manager.Model.getServerTime(),
				'Y-m-d H:i:s'
			);
		}

		// Setup sorters
		if (direction === 'GT') {
			this.imageStore.setSorters([new Ext.util.Sorter({
				property: 'time',
				direction: 'ASC'
			})]);
		}
		if (direction === 'LT') {
			this.imageStore.setSorters([new Ext.util.Sorter({
				property: 'time',
				direction: 'DESC'
			})]);
		}

		// Setup extraparams
		this.imageStore.getProxy().setExtraParams({
			'$joined': 1,
			'$showtotalcount': 1,
			'$filter': 'id_device EQ ' + this.deviceId
				+ ' AND time ' + direction + ' "'
				+ time
				+ '"',
			'limit': this.preloadCount
		});

		// Load data
		this.imageStore.load();
	},

/**
	* On image store load
	* @param Type store
	* @param Type records
	*/
	onImageStoreLoad: function(store, records) {
		var me = this;

		// Reverse iteration
		var reverse = false;
		/*if (me.carouselLoadingDirection === 'forward') {
			reverse	= true;
		}*/

		// Add items to carousel and items storage
		Ext.Array.each(records, function(image) {
			var item = {
				style:
					'background-image: url(/mon_device_image/'
					+ image.get('id') + '/draw/large);',
				cls: 'photo-viewer-image'
			};

			// Back direction
			if (me.carouselLoadingDirection === 'back') {
				// Add item to carousel
				me.imageCarousel.add([item]);
				// Add item to all items
				me.carouselImages.push(image);
			}

			// Forward direction
			if (me.carouselLoadingDirection === 'forward') {
				// Add item to carousel
				me.imageCarousel.insert(2, item);
			}
		}, this, reverse);

		// What item to select after loading the new data
		var moveCarouselTo = this.lastCarouselIndex;

		// Move next flag
		// If true carousel will be moved to next item
		var moveNext = false;

		// If moving forward
		if (me.carouselLoadingDirection === 'forward') {
			// Add new images to storage
			if (records.length) {
				this.carouselImages = Ext.Array.merge(
					records.reverse(),
					this.carouselImages
				);
			}

			// Count where to move carousel
			var shift = records.length;
			moveCarouselTo = this.lastCarouselIndex + shift;
			// If we are on 0 card (empty placeholder)
			// and no new entries was loaded
			// just move next
			if (this.lastCarouselIndex === 0 && !records.length) {
				moveNext = true
			}
		}

		// Move carousel
		if (moveNext) {
			this.imageCarousel.next();
		} else {
			this.imageCarousel.setActiveItem(moveCarouselTo);
		}

		// Display carousel
		this.imageCarousel.show();

		// Set carousel loading flag to false
		this.carouselLoading = false;
	},

/**
	* On painted
	*/
	onPainted: function() {
		this.bindLastimageEvents();
	},

/**
	* Bind last image events
	*/
	bindLastimageEvents: function() {
		var lastimage = Ext.get('lastimage');
		if (lastimage) {
			lastimage.on({
				tap: 'onLastimageTap',
				scope: this
			});
		}
	},

/**
	* Last image tap
	*/
	onLastimageTap: function() {
		// Reset settings
		this.imageCarousel.removeAll();
		this.imageCarousel.add({
			html: ''
		});
		this.carouselImages = [];
		this.carouselLoadingDirection = 'back';
		this.lastCarouselIndex = 1;

		// Load image store
		//this.loadImages('LT', '2012-08-07 05:27:36'); //Temp test
		this.loadImages();

		// Display gallery
		Ext.Viewport.setActiveItem(this.imagesOverlay);
	},

/**
	* Sets device instance (or device identifier)
	* for displaying information about it
	* @param {O.mon.model.Device/Number} device
	*/
	setDevice: function(device) {
		var id = null;
		if (Ext.isNumber(device)) {
			id = device;
		}
		if (device instanceof O.mon.model.Device) {
			id = device.getId();
		}
		if (id && (id !== this.deviceId)) {
			this.deviceId = device;

			this.reload();
		}
	},

/**
	* Reloads information for current device
	* @private
	*/
	reload: function() {
		if (!this.deviceId) { return; }
		C.get('mon_device', function(devices, success) {
			if (!success) { return; }
			var device = devices.get(this.deviceId);
			if (device) {
				var packet = device.getLastPacket();
				if (packet) {
					this.showPacketInfo(packet);
				}
			}
			//this.setUpdateDisabled(false);
		}, this);
	},

/**
	* Displays packet information
	* @param {O.mon.model.Packet} packet
	*/
	showPacketInfo: function(packet) {
		if (packet) {
			this.updateHtml(this.getTpl().apply(packet));
		} else {
			this.updateHtml(_('No data'));
		}

		// Bind last image events
		this.bindLastimageEvents();
	},

/**
	* If value = true, then it disables updating information about device,
	* if value = false, then the updating of information is enabled back
	* @param {Boolean} value
	*//*
	setUpdateDisabled: function(value) {
		this.isUpdateDisabled = value;
	},*/

/**
	* Updating packets
	* @param {Array} data
	* @param {String} type
	*/
	onUpdateMon_packet: function(data, type) {
		if (this.isUpdateDisabled) { return; }
		if (Ext.isEmpty(data)) { return; }
		for (var i = 0; i < data.length; i++) {
			if (this.deviceId === data[i].id_device) {
				this.reload();
				return;
			}
		};
	}
});
