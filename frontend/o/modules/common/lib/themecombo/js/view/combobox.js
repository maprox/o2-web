/**
 * Theme chooser combobox
 * @class O.common.lib.themecombo.ComboBox
 * @extends Ext.form.field.ComboBox
 */
C.define('O.common.lib.themecombo.ComboBox', {
	extend: 'Ext.form.field.ComboBox',
	alias: 'widget.themecombo',

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			store: Ext.create('Ext.data.Store', {
				fields: ['id', 'name'],
				data: [
					{id: 'default', name: _('Default')},
					{id: 'bright', name: _('Bright')},
					{id: 'gray', name: _('Gray')},
					{id: 'gray-flat', name: _('Flat gray')},
					{id: 'neptune', name: _('Neptune')},
					{id: 'neptune-glosav', name: _('Neptune GLOSAV')}
				],
				proxy: {
					type: 'memory'
				}
			}),
			queryMode: 'local',
			valueField: 'id',
			displayField: 'name',
			forceSelection: true,
			editable: false,
			fieldLabel: _('Select theme')
		});
		this.callParent(arguments);
	}//,

/**
	* Apply theme identifier
	* @param {String} id Theme id
	*//*
	setValue: function(value) {
		this.callParent(arguments);
		value = Ext.Array.from(value);
		var themeId = 'default';
		if (!Ext.isEmpty(value)) {
			record = value[0];
			if (!record || !record.isModel) {
				themeId = record;
			} else {
				themeId = record.get('id');
			}
		}
		C.utils.setTheme(themeId);
	}*/
});