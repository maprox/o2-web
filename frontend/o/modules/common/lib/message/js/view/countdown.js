/**
 * Abstract display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Notify
 * @extends C.lib.message.Abstract
 */
C.utils.inherit('C.lib.message.Countdown', {
/*
	* Static properties
	*/
	statics: {
/**
		* Store for keeping popup messages
		* @type {Ext.data.Store}
		*/
		store: Ext.create('Ext.data.Store', {
			fields: ['item'],
			proxy: {
				type: 'memory'
			}
		})
	},

/**
	* Identifier of hider div element
	* @type {String}
	*/
	hiderDivId: 'notifications-hider-div',

/**
	* @param {Ext.Element} element
	* Dom element associated with message
	*/
	element: null,

/**
	* If true countdown will be stoped
	*/
	stopCountdown: false,

/**
	* Displays message
	*/
	doDisplay: function() {
		var container = this.getItemsContainer();
		//container.update(this.getNotifyBox());
		var tpl = new Ext.XTemplate(this.getNotifyBox());
		tpl.overwrite(this.getItemsContainer().el);

		if (!this.stopCountdown) {
			Ext.defer(this.doDisplay, 1000, this);
		}
	},

/**
	* Returns container for notify box
	* @return Ext.Element
	*/
	getItemsContainer: function() {
		return Ext.ComponentManager.get('headerNotifications');
	},

/**
	* Removes message, on click
	*/
	doRemove: function() {
	},

/**
	* Removes message, on timeout
	*/
	removeGhost: function() {
		this.removeNode();
		this.fireRemoved();
	},

/**
	* Removes node from dom
	*/
	removeNode: function() {
		if (this.element && this.element.dom) {
			Ext.removeNode(this.element.dom);
			this.element.remove();
		}
		// remove from store
		var store = this.statics().store;
		store.remove(this.storeRecord);
		this.updateHider(store.getCount());
	},

/**
	* Fires 'removed' event, if msgKey was provided
	*/
	fireRemoved: function() {
		if (this.msgKey) {
			this.fireEvent('removed', this.msgKey);
		}
	},

/**
	* Hides message from sight
	*/
	doHide: function() {
		if (this.element && this.element.dom) {
			this.element.stopAnimation();
			// Если анимация была на удаление элемента,
			// то ее остановка может привести к тому что элемента больше нет
			// Поэтому надо снова проверить наличие элемента -
			// может прятать уже больше нечего
			if (this.element.dom) {
				this.element.addCls('display-none');
				this.element.setStyle('display', 'none');
				this.element.hide();
			}
		}
	},

/**
	* Shows message
	*/
	doShow: function() {
		if (this.element && this.element.dom) {
			this.element.show();
			this.element.removeCls('display-none');
			this.element.setStyle('display', 'block');
		}
	},

/**
	* Returns a HTML representation of message box
	* @param {Object} config Config object
	* @return {String} HTML code
	* @private
	*/
	getNotifyBox: function() {
		var params = this.msg;

		var timeleft =
			new Date().pg_fmt(this.time).getTime()
			+ (params.timeleft * 1000) - new Date().toUtc().getTime();
		timeleft = Math.ceil(timeleft / 1000);

		var sec = timeleft % 60;
		var min = (timeleft - sec) / 60;

		if (sec > 0) {
			sec--;
		} else if (min > 0) {
			sec = 59;
			min--;
		}

		// If time is up
		if (sec <= 0 && min <= 0) {
			// Stop countdown
			this.stopCountdown = true;
			O.app.terminate(params.terminate_params.code,
				params.terminate_params.params);
		}

		if (sec < 10) {
			sec = '0' + sec;
		}

		var tip = _('Time left until the end of the work');
		return '<span id = "ui_countdown" data-qtip="' + tip + '">'
			+ min + ':' + sec + '</span>';
	},

/**
	* Updates hider with cnt items
	* @param {Number} messagesCount
	*/
	updateHider: function(messagesCount) {
		var hider = Ext.get(this.hiderDivId);
		if (!hider || !hider.isVisible()) {
			if (messagesCount > 1) {
				hider = this.getHider();
				hider.show();
			}
		} else {
			if (messagesCount < 2) {
				hider.slideOut('t', {
					callback: function() {
						// remove hider totally
						if (hider && hider.dom) {
							hider.stopAnimation();
							hider.remove();
						}
					}
				});
			}
		}
		if (hider) {
			this.getHiderTemplate().overwrite(hider, {count: messagesCount});
		}
		return hider;
	},

/**
	* Returns hider inner data template
	* @return Ext.XTemplate
	*/
	getHiderTemplate: function() {
		if (!this.hiderTpl) {
			this.hiderTpl = new Ext.XTemplate(
				'<span class="text">',
					_('Clear All'),
				'</span>',
				'<span class="count">',
					'({count})',
				'</span>', {
					disableFormats: true
				}
			);
		}
		return this.hiderTpl;
	},

/**
	* Returns hider element
	* @return {String} HTML code
	* @private
	*/
	getHider: function() {
		var hider = Ext.get(this.hiderDivId);
		if (!hider) {
			hider = Ext.core.DomHelper.append(this.getNotifyContainer(), {
				tag: 'div',
				id: this.hiderDivId,
				cls: 'item hider'
			}, true);
			hider.setVisibilityMode(Ext.Element.DISPLAY);
			hider.on('click', this.clearAll, this);
			hider.slideIn('t');
		}
		return hider;
	},

/**
	* Clears all messages
	*/
	clearAll: function() {
		this.getNotifyContainer().fadeOut({
			remove: true
		});
		var list = [];
		var store = this.statics().store;
		store.each(function (record) {
			var item = record.get('item');
			if (item && item.msgKey) {
				this.fireEvent('removed', item.msgKey);
				list.push(item.msgKey);
			}
		}, this);
		store.removeAll();
		Ext.Ajax.request({
			url: '/n_work/remove',
			params: {
				data: Ext.JSON.encode({
					id: list
				})
			}
		});
	}

});
