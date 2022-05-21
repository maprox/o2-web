/**
 * @class O.lib.ObjectAccessList
 * @extends C.ui.Panel
 */
C.utils.inherit('O.lib.UserSearch', {
/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.down('#btnAdd').setHandler(this.addUser, this);
		this.down('#btnCancel').setHandler(this.cancel, this);
		this.accTypeForm.down('#btnSearch').setHandler(this.search, this);
		this.usersList = this.down('#usersList');
		this.usersList.on('selectionchange', this.onUserSelected, this);
		this.usersList.on('itemdblclick', this.addUser, this);
		//Уже добавленный пользователи, не включаются в результаты поиска
		this.addedUsers = [];
	},

	onEsc: Ext.emptyFn,

	/**
	 * Обработчик события "В списке выбран пользователь"
	 */
	onUserSelected: function() {
		if (this.usersList.getSelectionModel().selected.getCount() != 1) {
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
	setAddedUsers: function(users) {
		this.addedUsers = users;
	},

	/**
	 * Обработчик кнопки "Добавить"
	 */
	addUser: function() {
		this.fireEvent('userAdded', 
			this.usersList.getSelectionModel().selected.getAt(0)
		);
		this.hide();
		this.usersStore.remove(
			this.usersList.getSelectionModel().selected.getAt(0));
	},

	/**
	 * Обработчик кнопки "Отмена"
	 */
	cancel: function() {
		this.usersStore.removeAll();
		this.hide();
	},

	/**
	 * Поиск пользователя по введенным в форму данным
	 */
	search: function() {
		this.usersStore.load({
			scope: this,
			params: {
				firstname: this.accTypeForm.down('#sFirstName').getValue(),
				secondname: this.accTypeForm.down('#sSecondName').getValue(),
				lastname: this.accTypeForm.down('#sLastName').getValue(),
				firmname: this.accTypeForm.down('#sFirmName').getValue()
			},
			callback: function() {
				//Удаляем уже добавленных пользователей
				var items = [];
				this.usersStore.each(function(user){
					if (Ext.Array.contains(this.addedUsers, user.get('userid'))) {
						items.push(user);
					}
				}, this);
				Ext.each(items, function(item) {
					this.usersStore.remove(item);
				}, this);
			}
		});
	}
});