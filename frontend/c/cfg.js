/**
 * Configuration options
 * @class C.cfg
 * @singleton
 */
Ext.define('C.cfg', {
	singleton: true,

/**
	* Debug flag
	* @type Boolean
	*/
	debug: ISDEBUG || false,

/**
	* Disable updating data from server (only in development)
	* @type Boolean
	*/
	disablePingServer: false,

/**
	* History token and param delimiters
	*/
	history: {
		tokenDelimiter: '/',
		paramDelimiter: ':'
	},

/**
	 * unit delimiter
	 */
	unitDelimiter: '|',

/**
	 * Proxies that should be loded right after boot
	 */
	initialProxies: {
		'/': ['n_work', 'mon_packet'],
		'/admin/': ['n_work']
	},

/**
	* Urls configuration
	*/
	url: {
		login: '/auth/login',
		register: '/register/submit',
		registerConfirm: '/register/finish'
	},

/**
	* Socket.io settings
	*/
	socketIo: {
		url: NODE_PATH,
		client: {
			'reconnection delay': 500,
			'reconnection limit': 10000,
			'max reconnection attempts': 'Infinity',
			'secure': location.protocol == 'https:'
		}
	},

/**
	* How many times try to wait answer from backend if no response.
	* @type Number
	*/
	loaderWaitCount: 30,

/**
	* Timeout in seconds for waiting answer from ajax request
	* @type Number
	*/
	ajaxRequestTimeout: 300000, // 5 min

/**
	* Timeout in seconds for waiting answer from loader
	* @type Number
	*/
	loaderRequestTimeout: 300000, // 5 min

/**
	* Timeout in seconds for waiting answer from report server
	* @type Number
	*/
	reportRequestTimeout: 300000, // 5 min

/**
	* HTTP state provider state update time (in milliseconds)
	* @type Number
	*/
	stateUpdateTime: 1000,

/**
	 * Path to a device images
	 * @type String
	 */
	pathIcons: STATIC_PATH + '/img/icons/',

/**
	* DB date format
	* @type String
	*/
	dbFormatDate: "c",

/**
	* Element identifier from wich event messages whould be shown
	* @type String
	*/
	msgAnimElementId: 'header',

/**
	* Delay (in miliseconds) before hiding notify box
	* @type {Number}
	*/
	defaultNotifyBoxDelay: 5000,

/**
	* Default page size for paginators
	* @type {Number}
	*/
	defaultPageSize: 40,

/**
	* Default max count of entities must be infinite
	* @type {Number}
	*/
	defaultMaxCountOfEntities: -1,

/**
	* Base ui for all components (mobile version)
	* - light
	* - dark
	* @type {String}
	*/
	baseUi: 'dark',

/**
	* New field postfix
	*/
	newFieldPostfix: '$new',

/*
	* Record database state constants
	* @type {Number}
	*/
	RECORD_IS_WAITING_FOR_APPROVAL: 0,
	RECORD_IS_ENABLED: 1,
	RECORD_IS_DISABLED: 2,
	RECORD_IS_TRASHED: 3,

/*
	* Record database state constants
	* @type {Number}
	*/
	STATUS_CREATED: 0,
	STATUS_STARTED: 1,
	STATUS_CLOSED: 2,

/*
	* Command status constants
	* @type {Number}
	*/
	STATUS_SENT: 1,
	STATUS_DELIVERED: 2,
	STATUS_ERROR: 3,

/*
	* Access statuses
	* @type {Number}
	*/
	STATUS_ACTIVE: 1,
	STATUS_PENDING: 2,
	STATUS_REJECTED: 3,

/**
	* Aliases for right types
	* @type Object
	*/
	rightTypes: {
		READ: 1,
		WRITE: 2,
		CREATE: 4
	},

/**
	* Packet types
	*/
	packetType: {
		DEFAULT: 0,
		SOS: 1,
		STATIC_POINT: 2
	},

/**
	* Packets configuration
	*/
	packets: {
	/**
		* Max distance between two packets from same group, in meters
		*/
		maxDistance: 10000,

	/**
		* Max time between two packets from same group, in seconds
		*/
		maxTimeBetween: 1800,

	/**
		* Max displayed tracks for one device
		*/
		maxTracks: 100,

	/**
		* Minimum distance, needed to consider group as a track, in meters
		*/
		minTrackLength: 500,

	/**
		* Minimum distance, pointing out that device have moved
		*/
		movingDistance: 3
	},

/**
	* Devices configuration
	*/
	device: {
	/**
		* Default move frequence of packets
		*/
		freqMove: 60,

	/**
		* Default idle frequence of packets
		*/
		freqIdle: 600,

	/**
		* Bad connection gap, used to measure if device still connected
		*/
		badConnectionGap: 1800
	},

/**
	* Map configuration
	*/
	maps: {
		engine: 'openlayers',
		settings: {
			imgPath: STATIC_PATH + '/controls/',
			animatedPan: false
		},
		yandex: {
			markers: {
				WAREHOUSE: 'default#storehouseIcon',
				FACTORY: 'default#factoryIcon'
			},
			url: location.protocol + '//api-maps.yandex.ru/2.0/'
				+ '?load=package.full,regions,geoObject.OverlayFactory,'
				+	'geometry.pixel.Polygon&lang=ru-RU'
		},
		openlayers : {
			url: STATIC_PATH + '/openlayers/OpenLayers-' +
				LIB_VERSIONS.openlayers + '/OpenLayers' +
				(false/*USERAGENT_INFO['deviceType'] === 'mobile' */?
					'.mobile.js' : '.js')
		},
		osm: {
			tileUrl: location.protocol + "//osm.maprox.net/${z}/${x}/${y}.png",
			enableTileUrl: (location.protocol == 'https:')
		},
		google: {
			url: location.protocol +
				'//maps.google.com/maps/api/js?v=3.7&sensor=false',
			url2: location.protocol +
				'//maps.gstatic.com/intl/ru_ALL/mapfiles/api-3/7/17/main.js'
		},
		bing: {
			apiKey: 'Aj7ZKc0Od0bTn7sDQPPB2lLiUB9YZNnR' +
					'cLLq1uCx3pdlRgi4CEYpvRf1bu-EasC2'
		}
	},

/**
	* Track configuration
	*/
	track: {
		colors: [
			'00ff00', 'ff0000', '0000ff', 'ffff00', '00ffff',
			'ff00ff', 'cc0066', '6699ff', 'ff33ff', 'ff6600',
			'666600', 'a52a2a', '008800'
		],
		maxStoppingsForMassToggle: 30
	}
});

C.cfg.maps.load = [
//	C.cfg.maps.google.url,
//	C.cfg.maps.google.url2,
	C.cfg.maps.yandex.url,
	C.cfg.maps.openlayers.url
];
