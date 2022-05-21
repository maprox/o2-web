/**
 * @class O.sdesk.lib.issues.TabProps
 * @extends C.ui.Panel
 */
C.define('O.sdesk.lib.issues.TabProps', {
	extend: 'Ext.form.FormPanel',
	mixins: ['C.ui.Panel'],
	alias: 'widget.sdesk-issues-tab-props',

	bodyPadding: 10,

/**
	* @constructor
	*/
	initComponent: function() {
		this.readonly = true;
		var defaultType = (this.readonly) ? 'displayfield' : 'textfield';

		Ext.apply(this, {
			uniqueId: Math.random(),
			defaultType: defaultType,
			fieldDefaults: {
				labelAlign: 'top',
				msgTarget: 'side',
				anchor: '100%'
			},
			items: [{
				fieldLabel: _('Description'),
				xtype: 'textarea',
				height: 100,
				name: 'description'
			}, {
				fieldLabel: _('Priority'),
				xtype: 'combobox',
				name: 'id_priority',
				store: C.getStore('sdesk_priority', {
					sorters: [{
						property: 'position',
						direction: 'ASC'
					}]
				}),
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id'
			}, {
				fieldLabel: _('Service'),
				xtype: 'combobox',
				name: 'id_service',
				store: C.getStore('sdesk_service', {
					sorters: [{
						property: 'name',
						direction: 'ASC'
					}]
				}),
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id'
			}, {
				fieldLabel: _('Issue type'),
				xtype: 'combobox',
				name: 'id_issue_type',
				store: C.getStore('sdesk_service', {
					sorters: [{
						property: 'name',
						direction: 'ASC'
					}]
				}),
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id'
			}]
		});
		this.callParent(arguments);
	}
});
