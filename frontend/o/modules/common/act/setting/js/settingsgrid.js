/**
 *
 * Settings grid class
 * @class O.comp.SettingsPanel
 * @extends Ext.form.FormPanel
 */
C.define('O.comp.SettingsGrid', {
	extend: 'Ext.panel.Panel',
	mixins: ['C.ui.Panel'],

	border: false,
	autoScroll: true,

/**
	* Флаг загрузки данных
	* @type Boolean
	*/
	isLoaded: true,

	idSetting: null,

	deletedRecords: [],

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		this.callParent(arguments);

		this.addEvents('clientvalidation');

		var validate = function() {
			this.fireEvent('clientvalidation', this);
		}

		this.getGridStore().on({
			remove: this.preserveRecord,
			scope: this
		});

		this.getGridStore().on({
			update: validate,
			remove: validate,
			add: validate,
			scope: this
		});
	},

/**
	* Функция, которая возвращает измененные пользователем настройки<br/>
	* Может быть переопредела в потомках, при необходимости
	* @protected
	*/
	getChangedData: function() {
		var updated = this.getGridStore().getUpdatedRecords(),
			created = this.getGridStore().getNewRecords(),
			deleted = this.deletedRecords;

		var changed = {
			id: this.idSetting,
			updated: [],
			created: [],
			deleted: []
		}

		var haveData = false;

		Ext.each(updated, function(record) {
			if(record.data.toArray == undefined) {
				changed.updated.push(record.data);
			} else {
				changed.updated.push(record.data.toArray());
			}

			haveData = true;
		});

		Ext.each(created, function(record) {
			var data = record.data,
				uid = C.utils.generateUid();
			data.uid = uid;
			record.uid = uid;
			changed.created.push(data);

			haveData = true;
		});

		Ext.each(deleted, function(item) {
			if(item.record.data.toArray == undefined) {
				changed.deleted.push(item.record.data);
			} else {
				changed.deleted.push(item.record.data.toArray());
			}

			haveData = true;
		});

		if (!haveData) {
			return [];
		}
		return changed;
	},

	applyData: function(data) {
		if (!data[this.idSetting])  {
			return;
		}

		data = data[this.idSetting];

		this.getGridStore().each(function(record) {
			if (record.dirty) {
				record.commit();
			}

			if(!record.get('id')) {
			//if (record.phantom) {
				var id = data.create[record.uid];
				record.data.id = id;
				//record.phantom = false;
			//}
			}
		}, this);

		this.deletedRecords = [];
		this.fireEvent('clientvalidation', this);
	},

/**
	* Sets default data
	*/
	setDefaultData: function() {
		var removeRecords = [];
		this.getGridStore().each(function(record) {
			if (!record.get('id')) {
				removeRecords.push(record);
			}
		}, this);
		this.getGridStore().remove(removeRecords);

		this.getGridStore().each(function(record) {
			record.reject();
		}, this);

		Ext.each(this.deletedRecords, function(item) {
			this.getGridStore().insert(item.index, item.record);
		}, this);

		this.deletedRecords = [];
		this.fireEvent('clientvalidation', this);

		// Included panels
		if (this.includedPanels && this.includedPanels.length) {
			Ext.Array.each(this.includedPanels, function(p) {
				p.setDefaultData();
			});
		}
	},

/**
	* Have changes
	*/
	haveDirty: function() {

		var changed = this.getGridStore().getUpdatedRecords().length +
			this.getGridStore().getNewRecords().length +
			this.deletedRecords.length;

		return changed > 0;
	},

	isValid: function() {
		return true;
	},

	preserveRecord: function(store, record, index) {
		record.reject();

		if (record.get('id')) {

			this.deletedRecords.push({
				record: record,
				index: index
			});
		}
	},

	getGrid: function() {
		if (this.grid == undefined) {
			this.grid = this.down('gridpanel');
		}

		return this.grid;
	},

	getGridStore: function() {
		if (this.gridStore == undefined) {
			this.gridStore = this.getGrid().getStore();
		}

		return this.gridStore;
	},

	getEditor: function() {
		if (this.editor == undefined) {
			this.editor = this.getGrid().getPlugin('editor');
		}

		return this.editor;
	},

/**
	* Returns error list for errors popup. Stub.
	* @return {Object[]}
	*/
	getErrors: function() {
		return [];
	}
});
