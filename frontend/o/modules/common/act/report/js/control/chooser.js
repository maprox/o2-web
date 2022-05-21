/**
 * @class O.common.act.report.Chooser
 */
C.utils.inherit('O.common.act.report.Chooser', {

/**
	* Cached data list for quick access
	* @type Ext.util.MixedCollection
	*/
	lookup: null,

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.reportsList.on('selectionchange', 'onSelectionChange', this);
		this.relayEvents(this.reportsList, [
			'selectionchange',
			'select',
			'deselect'
		]);
		C.bind('x_report', this);
		C.get('x_report', this.onUpdateX_report, this);
	},

/**
	* Executes when x_report list is updated
	* @return {Array|Number}
	*/
	onUpdateX_report: function() {
		// load reports list
		// TODO Need serious refactoring!
		var reportStore = this.reportStore;
		var isAdmin = C.manager.Auth.hasRight('superadmin');
		C.get('x_report', function() {
			reportStore.clearFilter();
			reportStore.filterBy(function(record) {
				return !record.get('invisible') || (
					isAdmin && (record.get('identifier') == 'statistics'));
			});
		});
	},

/**
	* Returns selected report identifier
	* @return {Array|Number}
	*/
	getSelectedReport: function() {
		// AVAILABLE REPORT

		/*var selectedItems = this.reportsList.getSelectedItems();
		if (selectedItems.length > 0) {
			return selectedItems[0];
		}*/

		var selected = this.reportsList.getSelectionModel().getSelection()[0];
		if (selected) {
			return selected.get('id');
		}
		return null;
	},

/**
	* Изменение выбора отчета
	* @param {O.lib.abstract.GroupsList} list
	* @param {Number[]} items Array of object identifiers
	*/
	onSelectionChange: function(list, selected) {
		this.fireEvent('selectionChanged', selected);
		return;
	}

/**
	* Нажатие на кнопку "Сформировать"
	*/
	/*showReport: function() {
		var sm = this.grid.getSelectionModel();
		var selections = sm.getSelection();
		if (!Ext.isEmpty(selections)) {
			var reportRecord = selections[0];
			var reportId = reportRecord.getId();
			var params = this.params.getValues();
			this.fireEvent('requestreport', reportId, params);
		}
	},*/

/**
	* Обновление данных
	* @param {Number[]} list Список идентификаторов объектов
	*/
	/*setData: function(list) {
		C.get('x_report', function(reports, success) {
			if (!success) { return; }
			this.lookup.clear();
			var data = reports.getByKeys(list);
			this.lookup.addAll(data);
			this.gridStore.loadData(data);
		}, this);
	}*/
});