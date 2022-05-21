/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Map state object
 * @class M.act.map.State
 */
Ext.define('M.act.map.State', {
	singleton: true,

	data: {
		center: {
			get: function() {
				return this.getBaseLayer().getProp('center');
			},
			set: function(value) {
				this.getBaseLayer().setProvidedState('center', value);
				this.getBaseLayer().setProp('center', value);
			}
		},
		zoom: {
			get: function() {
				return this.getBaseLayer().getProp('zoom');
			},
			set: function(value) {
				this.getBaseLayer().setProvidedState('zoom', value);
				this.getBaseLayer().setProp('zoom', value);
			}
		},
		layer: {
			get: function() {
				return this.getBaseLayer().getProp('layer');
			},
			set: function(value) {
				this.getBaseLayer().setProp('layer', value);
			}
		},
		selecteddevice: {
			get: function() {
				return this.getObjectsGroupsList().getSelectedDevices();
			},
			set: function(value) {
				this.getBaseLayer().doOnLoad(Ext.bind(function() {
					this.getObjectsGroupsList().selectDevice(value)
				}, this));
			}
		},
		selectedgeofence: {
			get: function() {
				return this.getObjectsGroupsList().getSelectedGeofences();
			},
			set: function(value) {
				this.getBaseLayer().doOnLoad(Ext.bind(function() {
					this.getObjectsGroupsList().selectGeofence(value);
				}, this));
			}
		},
		checkeddevices: {
			get: function() {
				return this.getObjectsGroupsList().getCheckedDevices();
			},
			set: function(value) {
				this.getObjectsGroupsList().checkDevices(value);
			}
		},
		checkedgeofences: {
			get: function() {
				return this.getObjectsGroupsList().getCheckedGeofences();
			},
			set: function(value) {
				this.getObjectsGroupsList().checkGeofences(value);
			}
		},
		config: {
			get: function() {
				return this.getMapConfig().getOptions();
			},
			set: function(value) {
				this.getMapConfig().setOptions(value);
				this.onOptionChange(this.getMapConfig().getOptions());
			}
		},
		windows: {
			get: function() {
				var x = {
					info: !this.getDeviceInfoOverlay().getHidden(),
					objects: !this.getObjectsGroupsList().getHidden()
				};

				return x;
			},
			set: function(value) {
				var container = this.getContainer();
				// I hate myself
				var activeItem = O.ui.Desktop.getViewport()
					.down('tabpanel').getActiveItem();
				if (activeItem
					&& typeof(activeItem) == 'object'
					&& Ext.ComponentQuery.is(activeItem, '#map')
				) {
					if (value.info) {
						var btnInfo = this.getBtnInfo(),
							btnInfoItem = btnInfo.down('button');
						btnInfo.setPressedButtons(btnInfoItem);
						this.onBtnInfoTap(container, btnInfoItem, true);
					}
					if (value.objects) {
						var btnObjects = this.getBtnObjects(),
							btnObjectsItem = btnObjects.down('button');
						btnObjects.setPressedButtons(btnObjectsItem);
						this.onBtnObjectsToggle(container, btnObjectsItem, true);
					}
				}
			}
		}

	},

/**
	* Event binding shortcut
	* @param {Ext.util.Observable} owner
	* @param {String} eventName
	* @return {Function}
	*/
	bindEvent: function(owner, eventName) {
		return Ext.bind(owner.fireEvent, owner, [
			O.manager.State.getEventName(eventName)]);
	},

/**
	* State initialization
	* @param {Object} owner
	*/
	init: function(owner) {
		var me = this;
		me.owner = owner;
		me.owner.state = me.data;
		C.utils.wait(function() {
			return owner.getBaseLayer() && owner.getBaseLayer().getEngine()
				&& owner.getBaseLayer().getEngine().isLoaded();
		}, {
			sleepTime: 200,
			attempts: 100,
			callback: function() {
				// baselayer state (zoom level, map center, current layer)
				owner.getBaseLayer().on({
					layerswitched: me.bindEvent(owner, 'layer'),
					moveend: me.bindEvent(owner, 'center'),
					zoomend: me.bindEvent(owner, 'zoom')
				});

				// windows positions
				var l = {
					show: me.bindEvent(owner, 'windows'),
					hide: me.bindEvent(owner, 'windows')
				};
				owner.getDeviceInfoOverlay().on(l);
				owner.getObjectsGroupsList().on(l);

				// selected and checked objects
				var oms = O.manager.State;
				owner.getObjectsGroupsList().on({
					selectionchange: function() {
						owner.fireEvent(oms.getEventName('selecteddevice'));
						owner.fireEvent(oms.getEventName('selectedgeofence'));
					},
					checkchange: function() {
						owner.fireEvent(oms.getEventName('checkeddevices'));
						owner.fireEvent(oms.getEventName('checkedgeofences'));
					}
				});

				// map configuration
				owner.getMapConfig().on({
					change: me.bindEvent(owner, 'config')
				});

				O.manager.State.watch(owner);
			}
		});
	}

});
