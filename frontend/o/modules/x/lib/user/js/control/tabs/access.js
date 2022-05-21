C.inherit('O.common.lib.usereditor.tab.Access', {
/** Translated fields */
	lngAdminTitle: 'Administrator',
	lngAdminText: 'Administrator description',
	lngManagerTitle: 'Manager',
	lngManagerText: 'Manager description',
	lngUserTitle: 'User',
	lngUserText: 'User description',

/** Props */
	bodyPadding: 15,
	autoScroll: true,
	defferedLoad: true,

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.rightLevels = [];
	},

/**
	* Загрузка полномочий пользователя
	* @param {Object} record Выбранная запись
	*/
	selectRecord: function(record) {
		var me = this;
		this.callParent(arguments);
		me.setLoading(true);
		C.get('x_package', function(packages) {
			var data = [];
			var inactive = [];
			this.resetPackages();
			/*packages.each(function(p) {
				if (Ext.Array.indexOf(record.get('package'), p.id) > -1) {
					data.push(p);
				} else {
					inactive.push(p);
				}
			});*/
			packages.each(function(p) {
				if (p.available) {
					data.push(p);
				} else {
					inactive.push(p);
				}
			});
			// Disable counting inactive packages
			this.addPackages(data, false,
				function() {
					this.addPackages(inactive, true,
						function() {
							this.selectRightLevels(record.get('right_level'));
							this.fireEvent('defferedload');
							me.setLoading(false);
						},
						this
					)
				},
			this);
		}, this);
	},

/**
	* Сброс панелей доступа
	*/
	resetPackages: function() {
		this.rightLevels = [];
		this.removeAll();
	},

/**
	* Добавления панели доступа для комплекта
	* @param Object[] packages Массив комплектов пользователя
	* @param Boolean hidden Добавлять как спрятанные
	*/
	addPackages: function(packages, hidden, callback, scope) {
		var me = this;
		C.get('x_right_level', function(rightLevels) {
			var items = [];
			// массив филдсетов
			// обход комплектов пользователя
			for (var i = 0, lp = packages.length; i < lp; i++) {
				// массив чекбоксов и подписей
				var fieldSetItems = [];
				// обход уровней доступа
				rightLevels.each(function(rl) {
					// если в комплекте есть такой уровень доступа,
					// то добавляем чекбокс и подпись
					if (Ext.Array.indexOf(packages[i].right_level, rl.id) > -1) {
						// чекбокс
						fieldSetItems.push({
							boxLabel: rl.name,
							itemId: 'access_' + rl.id,
							inputValue: '1',
							handler: function() {
								me.fireEvent('dirtychange');
							}
						});
						// подпись
						fieldSetItems.push({
							html: rl.description,
							padding: 7,
							xtype: 'component'
						});
						if (Ext.Array.indexOf(me.rightLevels, rl.id) < 0) {
							me.rightLevels.push(rl.id);
						}
					}
				});
				// добавляем филдсет комплекта в массив филдсетов
				items.push(Ext.create('Ext.form.FieldSet', {
					title: packages[i].name,
					hidden: hidden,
					collapsible: true,
					items: [{
						xtype: 'fieldcontainer',
						defaultType: 'checkboxfield',
						defaults: {
							width: 400
						},
						layout: 'anchor',
						items: fieldSetItems
					}]
				}));
			}
			// добавляем массив филдсетов в окно
			this.add(items);

			// Apply callback
			if (callback) {
				callback.apply(scope);
			}

		}, this);
	},

/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		if (!record) { return; }

		record.beginEdit();
		record.set(this.getFieldValues());
		record.endEdit();
	},

/**
	 * Получение массива идентификаторов выбранных уровней доступа
	 * @param {Boolean} dirtyOnly (optional) If true, only fields that are
	 *     dirty will be included in the result. Defaults to false.
	 * @return Mixed[] Массив идентификаторов
	 */
	getFieldValues: function(dirtyOnly) {
		var rightLevels = [];
		for (var i = 0, l = this.rightLevels.length; i < l; i++) {
			if (this.down('#access_' + this.rightLevels[i]).getValue()) {
				rightLevels.push(this.rightLevels[i]);
			}
		}

		var record = this.getSelectedRecord();
		if (!record) {
			return {};
		}

		if (dirtyOnly && record && (!Ext.isArray(record.get('right_level')) ||
			rightLevels.equals(record.get('right_level'), true))) {

			return {};
		}

		return {right_level: rightLevels};
	},

/**
	* COMMENT THIS
	*/
	selectRightLevels: function(rightLevels) {
		if (!rightLevels) { return; }
		for (var i = 0, l = this.rightLevels.length; i < l; i++) {
			var active = Ext.Array.indexOf(rightLevels, this.rightLevels[i]) > -1;
			this.down('#access_' + this.rightLevels[i]).setValue(active);
		}
	},

/**
	* Returns true if current tab data has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		return !C.utils.isEmptyObject(this.getFieldValues(true));
	},

/**
	* Resets form data
	*/
	reset: function() {
		if (!this.getSelectedRecord()) {
			this.resetPackages();
		} else {
			this.selectRecord(this.getSelectedRecord());
		}
	}
});
