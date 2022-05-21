/**
 * @class O.mon.proxy.Fuel
 * @extends O.proxy.Custom
 */
C.define('O.n.proxy.Work', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'n_work',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Works'),

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: false,

/**
	* Ext.data.Model name of a record in a proxy store
	* @type String
	*/
	model: 'N.Work',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.n.model.Work,

/**
	* Обновление данных в коллекции
	* @param Object[] data Массив записей
	*/
	updateCollection: function(data) {
		this.callParent(arguments);
		if (C.isMobile()) { return; }
		for (var i = 0, l = data.length; i < l; i++) {

			// If state 3 remove existing popup
			if (data[i].state == C.cfg.RECORD_IS_TRASHED) {
				var popup = O.msg.getOpenedByKey(data[i].id);
				if (!popup) {
					// Already removed
					continue;
				}

				// Remove popup
				popup.hide();
				popup.removeNode();
				popup.fireRemoved();

				continue;
			}

			if (O.msg.getOpenedByKey(data[i].id)) {
				continue;
			}

			var params = Ext.JSON.decode(data[i].params);

			// If confirm popup
			if (params && params.type && params.type === 'share_confirm') {
				O.msg.shareConfirm({
					params: params,
					msg: '',
					msgKey: data[i].id
				});

				continue;
			}

			// If timeleft start countdown
			if (params && params.timeleft) {
				O.msg.countdown({
					msg: params,
					msgKey: data[i].id,
					time: data[i].dt
				});

				continue;
			}

			// Unpaid message
			if (params && params.unpaid) {
				O.msg.event({
					msg: data[i].message,
					msgKey: data[i].id
				});

				continue;
			}

			if (data[i].message) {
				var noDisplay = !O.ui.Desktop.hasModule('map');

				if (params && params.broadcast) {
					noDisplay = false;
				}

				if (noDisplay) {
					continue;
				}

				O.msg.event({
					msg: data[i].message,
					msgKey: data[i].id,
					callback: Ext.bind(this.onPopupClick, this, [data[i]])
				});
			}
		}
	},

/**
	* Обработчик клика по всплывающему окну уведомления
	* @param Object work Объект work
	*/
	onPopupClick: function(work) {
		Ext.Ajax.request({
			url: '/n_work/remove',
			params: {
				data: Ext.JSON.encode({
					id: work.id
				})
			}
		});
		// переход на вкладку карты
		O.ui.Desktop.callModule('map', {showwork: work});
	}
}, function() {
	this.prototype.superclass.register(this);
});