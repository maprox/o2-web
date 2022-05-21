/**
 * @fileOverview Main application page
 */
/**
 * @class O.app
 * @singleton
 */
Ext.application({
	name: 'O.app',
	controllers: ['Desktop'],

/**
	* Auto creation of the viewport
	*/
	//autoCreateViewport: false,

/**
	* Counter of background loading
	* @type Number
	*/
	loadCounter: 0,

/**
	* Counter of socket connection attempts
	* @type Number
	*/
	socketConnectCounter: 0,

/**
	* Number of boot loads
	*/
	bootLoadedCounter: 0,

/**
	* If application is terminated
	*/
	terminated: false,

/**
	* Application entry point.
	*/
	launch: function() {
		var me = this;
		console.debug('launch');

		// assign app functions
		O.app.terminate = Ext.bind(this.terminate, this);
		O.app.getController = Ext.bind(this.getController, this);

		// State provider initialization
		if (C.cfg.stateProviderAlias === 'http') {
			this.initStateProvider();
		}

		O.manager.Model.init();

		var proxies = [];
		var preloadProxies = [];
		var subscribeProxies = [];
		Ext.each(O.manager.Model.getProxies(), function(proxy) {
			var proxyObj = {
				id: proxy.id,
				needPreload: proxy.needPreload
			};

			if (proxy.extraParams) {
				proxyObj.extraParams = proxy.extraParams;
			}

			proxies.push(proxyObj);

			// Check subscribe restrictions
			if (proxy.subscribeModules && proxy.subscribeModules.length) {
				for (var i = 0; i < proxy.subscribeModules.length; i++) {
					var module = proxy.subscribeModules[i];

					if (O.ui.Desktop.hasModule(module)) {
						// Add proxy
						subscribeProxies.push(proxyObj);
						break;
					}
				}
			} else {
				subscribeProxies.push(proxyObj);
			}

			// Preload proxies
			if (proxy.needPreload) {
				preloadProxies.push(proxyObj);
			}
		}, this);
		if (proxies.length == 0) {
			this.afterLoad();
			return;
		}
		Ext.Ajax.timeout = C.cfg.ajaxRequestTimeout;

		// Connect to node.js server
		var socket = null;
		try
		{
			socket = io.connect(C.cfg.socketIo.url, C.cfg.socketIo.client);
		}
		catch (e)
		{
			console.error('socket.io connection error', e)
		}

		if (socket) {
			// When successfully connected
			socket.on('connect', function() {
				// Set isBootLoaded flag to false
				O.manager.Model.isBootLoaded = false;
				me.socketConnectCounter++;
				// Subscribe to updates
				socket.emit('subscribe', {
					session: O.manager.Model.getLastSession(),
					proxies: subscribeProxies
				});
				console.debug('Socket connected: emit "subscribe"');
			});

			// On socket disconenct
			socket.on('disconnect', function() {
				console.debug('Socket disconnect');
				// Update connection status
				O.ui.Desktop.updateConnectionStatus(false);
				// Set isBootLoaded flag to false,
				// so if boot is processing again (connection appeared)
				// socket response handler will add messages to queue
				O.manager.Model.isBootLoaded = false;
			});

			// On reconnection attempt
			socket.on('reconnecting', function() {
				console.debug('Socket reconnecting');
			});

			// When nodejs accepts subscribe (authorization) request
			socket.on('subscribed', function() {
				console.debug('Successfully subscribed');

				// Update connection status
				if (me.bootLoadedCounter >= 1) {
					O.ui.Desktop.updateConnectionStatus(true);
				}

				// Starting boot load
				me.processBoot(proxies, preloadProxies);
			});

			// Update comes
			socket.on('update', function(update) {
				console.debug('U:', update);
				O.manager.Model.onSocketResponse(update);
			});

			// socket.io sends sync event every minute
			socket.on('sync', function(data) {
				console.debug('sync', data);
				if (!data.date) {
					return;
				}

				if (!O.manager.Model.isBootLoaded) {
					return;
				}

				//var date = new Date(data.date);
				var date = new Date().pg_fmt(data.date);
				//var date = new Date(data.date).pg_utc(
				//	C.getSetting('p.utc_value'), true);

				O.manager.Model.actualServerTime = date;
			});

			// Terminate signal
			socket.on('terminate', function(params) {
				console.debug('Terminate signal', params);

				// If terminated already
				if (me.terminated) {
					return;
				}

				// If refresh
				if (params.refresh) {
					window.location.reload(true);
				}

				me.terminate(params.code, params.params);
			});
		}
	},

	/**
	 * Process boot request
	 * @param proxies
	 * @param preloadProxies
	 */
	processBoot: function(proxies, preloadProxies) {
		console.debug('Process boot');
		var app = this,
			me = this;

		Ext.Ajax.request({
			url: '/loader/boot',
			method: 'POST',
			params: {
				page: window.location.pathname,
				proxies: Ext.JSON.encode(proxies)
			},
			success: function(response) {
				var answer = Ext.JSON.decode(response.responseText);
				if (answer.success) {
					console.debug('Boot data received');
					// Boot loaded counter
					me.bootLoadedCounter++;

					// First boot
					if (me.bootLoadedCounter === 1) {
						console.debug('First boot');
						// Save server time
						O.manager.Model.initialServerTime = answer.server_time;
						O.manager.Model.actualServerTime =
							new Date().pg_fmt(answer.server_time);


						var len = preloadProxies.length;
						app.loadCounter = len;
						for (var i = 0; i < len; i++) {
							var proxyId = preloadProxies[i].id;
							var proxy = O.manager.Model.getProxy(proxyId);
							var packet = {
								success: true,
								data: answer.data[proxyId]
							};
							proxy.isFresh = true;
							console.debug('Update proxy ' + proxyId);
							proxy.update(packet);

							app.updateSplashInfo(proxy);
						}

						// After all loaded
						app.afterLoad();
					}

					// If not first boot
					if (me.bootLoadedCounter > 1) {
						console.debug('Reboot');
						// Call response processing if this is not first boot
						O.manager.Model.processSocketResponse(answer);
						// Process queue
						//O.manager.Model.processQueue();
						this.loadInitialData(app.afterReboot, app);
					}
				}
			},
			scope: this
		});
	},

/**
	 * Updates splash information
	 */
	updateSplashInfo: function(proxy) {
		var sp_info = Ext.fly("splash_info");
		if (sp_info) {
			sp_info.update(proxy.preloadText);
		}
		this.loadCounter -= 1;
	},

/**
	* Initializing the application after load
	* of the necessary libraries and data
	*/
	afterLoad: function() {
		console.debug('afterLoad: All proxies updated');
		var me = this;
		// Initialize the state provider
		console.debug('afterLoad: this.initStateProvider()');
		this.initStateProvider();
		// If not first boot
		if (me.bootLoadedCounter > 1) {
			console.debug('afterLoad: not first boot - exit');
			return;
		}
		console.debug('afterLoad: O.ui.Desktop.init()');
		O.ui.Desktop.init();
		console.debug('afterLoad: O.manager.History.init()');
		O.manager.History.init();
		console.debug('afterLoad: O.manager.Model.start()');


		// Let's hide the splash screen
		var sp = Ext.fly("splash");
		if (sp) {
			sp.destroy();
			console.debug('Splash screen removed');
		}

		// Update connection status
		O.ui.Desktop.updateConnectionStatus(true);

		// Create hints
		this.createHints();

		// Start loading initial data
		this.loadInitialData(this.afterInitialDataLoad, this);
	},

/**
	 * Create hints for user
	 */
	createHints: function() {
		console.debug('Create hints');
		// Create hints
		this.createMonDeviceHints();
	},

/**
	 * Display mon_device related hints
	 */
	createMonDeviceHints: function() {
		if (!C.userHasRight('mon_device', C.manager.Auth.$CAN_WRITE)) {
			return;
		}

		var devices = C.getStore('mon_device');
		if (devices.getCount()) {
			return;
		}

		var msg = _('Please go to the admin panel and add new device');
		if (!O.ui.Desktop.hasModule('map')) {
			msg = _('Please add new device');
		}

		O.msg.info({
			msgKey: 'hint_add_new_device',
			msg: msg,
			delay: 0
		});
	},

/**
	 * Loads some initial data - packets, works etc.
	 * @param callback
	 * @param scope
	 */
	loadInitialData: function(callback, scope) {
		console.debug('Request initial data');

		var page = window.location.pathname.replace(/\/$/, "") + '/';

		var proxyAliases = C.cfg.initialProxies[page];

		if (!proxyAliases) {
			console.debug('No initial proxies, apply callback')
			callback.apply(scope);
		}

		var initialProxies = [];
		Ext.Array.each(proxyAliases, function(alias) {
			var proxy = O.manager.Model.getProxy(alias);
			if (proxy) {
				initialProxies.push(proxy);
			}
		});

		var proxies = [];
		Ext.each(initialProxies, function(proxy) {
			var proxyObj = {
				id: proxy.id,
				needPreload: proxy.needPreload
			};

			if (proxy.extraParams) {
				proxyObj.extraParams = proxy.extraParams;
			}

			proxies.push(proxyObj);
		}, this);

		console.debug('Proxies for initial data', proxies);

		Ext.Ajax.request({
			url: '/loader/initial',
			method: 'POST',
			params: {
				page: page,
				proxies: Ext.JSON.encode(proxies)
			},
			success: function(response) {
				var answer = Ext.JSON.decode(response.responseText);
				if (answer.success) {
					console.debug('Initial data received')
					// Process initial data
					O.manager.Model.processSocketResponse(answer);
				}

				// Apply callback
				if (callback) {
					console.debug('Apply callback')
					callback.apply(scope);
				}
			},
			scope: this
		});
	},

/**
	 * After intitial data load
	 */
	afterInitialDataLoad: function() {
		console.debug('afterInitialDataLoad')
		O.manager.Model.start();
		O.manager.Model.processQueue();

		this.fireEvent('loaded');
		if (O.app.onLoaded) {
			Ext.each(O.app.onLoaded, function(params){
				params.fn.apply(params.scope);
			});
		}
	},

/**
	 * After reboot actions
	 */
	afterReboot: function() {
		console.debug('After reboot');
		O.manager.Model.processQueue();
	},

/**
	* State provider initialization
	*/
	initStateProvider: function() {
		if (!Ext || !Ext.state ||! Ext.state.Manager) {
			return;
		}
		var stateProvider = null;
		if (Ext.supports.LocalStorage) {
			stateProvider = Ext.create('Ext.state.LocalStorageProvider', {
				prefix: C.getSetting('p.login') + '_'
			})
		} else {
			stateProvider = Ext.create('Ext.state.CookieProvider', {
				prefix: C.getSetting('p.login') + '_'
			});
		}
		if (stateProvider) {
			Ext.state.Manager.setProvider(stateProvider);
		}
	},

/**
	* Terminate application
	* @param {Integer} code Код причины
	*/
	terminate: function(code, params) {
		this.terminated = true;
		O.ui.Desktop.terminate(code, params);
	}
});
