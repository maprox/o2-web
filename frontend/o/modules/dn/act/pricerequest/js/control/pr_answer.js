/**
 *
 * @class O.dn.act.pricerequest.Answer
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.pricerequest.Answer', {

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.answerList) {
			this.answerList.on({
				select: 'onListSelect',
				scope: this
			});
		}
	},

/**
	* Загрузка данных
	*/
	load: function(id) {
		this.answerList.load(id);
	},

/**
	* Очистка данных
	*/
	clear: function() {
		this.answerList.clear();
	},

/**
	* Fires when record in the list grid is selected,
	* commands view grid to update
	* @record {Object Ext.data.Model}
	*/
	onListSelect: function(record) {

		if (record) {

			this.answerLines.load(record);
			this.answerLines.enable();
		} else {

			this.answerLines.clear();
			this.answerLines.disable();
		}
	},

/**
	* Обработчик смены текущей строки грида
	*/
	onListSelectionChange: function(sm, selections) {
		var record = this.getSelectedRecord();

		this.answerLines.load(record);
	},

/**
	* Возвращает текущую выбранную запись в гриде
	* @return {Object Ext.data.Model}
	*/
	getSelectedRecord: function() {
		var record = null;
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection) {
			record = sm.getSelection()[0];
		}
		return record;
	}
});
