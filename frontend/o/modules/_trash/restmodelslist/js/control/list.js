/**
 * Rest editor list
 * @class O.restmodellist.List
 * @extends O.comp.ModelsList
 */

C.define('O.restmodellist.List', {
	extend: 'O.comp.ModelsList',

/**
	* Обработка события редактирования имени записи
	*/
	afterEdit: function(e) {
		// картинка загрузки
		this.setLoading(true);
		// получаем данные редактируемой записи
		var data = this.store.getAt(e.rowIdx).data;
		// если запись новая...
		if (data.id == 0) {
			O.manager.Rest.create(this.managerAlias, data, function(response) {
				O.msg.info(this.lngAddedText);
				this.loadModels(response.data.id);
				this.setLoading(false);
			}, function() {
				this.setLoading(false);
			}, this);
		// если запись не новая...
		} else {
			// ...то нет необходимости передавать остальные поля
			data = {
				id: data.id,
				name: data.name
			}
			O.manager.Rest.update(this.managerAlias, data, function(response) {
				O.msg.info(this.lngRenamedText);
				this.loadModels(response.data.id);
				this.setLoading(false);
			}, function() {
				this.setLoading(false);
			}, this);
		}
	},

/**
	* Обработчик нажатия на кнопку удаления
	*/
	removeRecord: function() {
		var me = this;
		// get data
		var selected = this.getSelectionModel().getSelection();
		var id = selected[0].getId();
		// ask user
		O.msg.confirm({
			msg: this.lngRemoveConfirmText,
			fn: function(buttonId) {
				if (buttonId != 'yes')
					return;
				this.removeCheck(id, Ext.bind(function() {
					// delete
					me.setLoading(true);
					O.manager.Rest.remove(me.managerAlias, id, function(response) {
						O.msg.info(this.lngRemovedText);
						this.fireEvent('removed');
						this.loadModels();
						this.setLoading(false);
					}, function() {
						this.setLoading(false);
					}, me);
				}, this));
			},
			scope: this
		});
	},

/**
	* Обработчик нажатия на кнопку вкл./откл.
	*/
	onOff: function() {
		// определяем выбранную запись
		var selected = this.getSelectionModel().getSelection();
		if (Ext.isEmpty(selected)) return;
		this.setLoading(true);
		var record = selected[0];
		var data = {
			id: record.getId(),
			isenabled: !record.data.isenabled
		};
		O.manager.Rest.update(this.managerAlias, data, function(response) {
			O.msg.info(data.isenabled ? this.lngOnText : this.lngOffText);
			this.loadModels(response.data.id);
			this.setLoading(false);
		}, function() {
			this.setLoading(false);
		}, this);
	}
});
