/**
 *
 * @class O.lib.ObjectAccessList
 * @extends C.ui.Panel
 */
C.utils.inherit('O.lib.FirmSearch', {
/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.down('#btnAdd').setHandler(this.addFirm, this);
		this.down('#btnCancel').setHandler(this.cancel, this);
		this.accTypeForm.down('#btnSearch').setHandler(this.search, this);
		this.firmsList = this.down('#firmsList');
		this.firmsList.on('selectionchange', this.onFirmSelected, this);
		this.firmsList.on('itemdblclick', this.addFirm, this);
		//Уже добавленный пользователи, не включаются в результаты поиска
		this.addedFirms = [];
	},

	onEsc: Ext.emptyFn,

	/**
	 * Обработчик события "В списке выбран пользователь"
	 */
	onFirmSelected: function() {
		if (this.firmsList.getSelectionModel().selected.getCount() != 1) {
			this.down('#btnAdd').disable();
		}
		else {
			this.down('#btnAdd').enable();
		}
	},

	/**
	 * Установить список уже добавленных пользователей
	 * @param {int[]} users - массив ID пользователей
	 */
	setAddedFirms: function(firms) {
		this.addedFirms = firms;
	},

	/**
	 * Обработчик кнопки "Добавить"
	 */
	addFirm: function() {
		this.fireEvent('firmAdded', 
			this.firmsList.getSelectionModel().selected.getAt(0)
		);
		this.hide();
		this.firmsStore.remove(
			this.firmsList.getSelectionModel().selected.getAt(0));
	},

	/**
	 * Обработчик кнопки "Отмена"
	 */
	cancel: function() {
		this.firmsStore.removeAll();
		this.hide();
	},

	/**
	 * Поиск фирмы по введенным в форму данным
	 */
	search: function() {
		this.firmsStore.load({
			scope: this,
			params: {
				firmname: this.accTypeForm.down('#sFirmName').getValue(),
				inn: this.accTypeForm.down('#sFirmINN').getValue()
			},
			callback: function() {
				//Удаляем уже добавленных пользователей
				var items = [];
				this.firmsStore.each(function(firm){
					if (Ext.Array.contains(this.addedFirms, firm.get('name'))) {
						items.push(firm);
					}
				}, this);
				Ext.each(items, function(item) {
					this.firmsStore.remove(item);
				}, this);
			}
		});
	}
});