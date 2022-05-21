/**
 * Service desk issue object
 * @class O.sdesk.model.Issue
 * @extends O.model.Object
 */
C.define('O.sdesk.model.Issue', {
	extend: 'O.model.Object'
});

C.define('Sdesk.Issue', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'num', type: 'int'},
			{name: 'description', type: 'string'},
			{name: 'id_client_firm', type: 'int'},
			{name: 'id_contact_person', type: 'int'},
			{name: 'id_issue_type', type: 'int'},
			{name: 'id_service', type: 'int'},
			{name: 'id_priority', type: 'int'},
			{name: 'deadline_dt', type: 'date', dateFormat: 'c'},
			{name: 'id_responsible_user', type: 'int'},
			{name: 'id_source', type: 'int'},
			{name: 'source_raw_data', type: 'string'},
			{name: 'create_id_user', type: 'int'},
			{name: 'create_dt', type: 'date', dateFormat: 'c'},
			{name: 'close_id_user', type: 'int'},
			{name: 'close_dt', type: 'date', dateFormat: 'c'},
			{name: 'state', type: 'int'},

			{name: 'clientfirm', type: 'string'},
			{name: 'contactperson', type: 'string'},
			{name: 'issuetype', type: 'string'},
			{name: 'statename', type: 'string'},
			{name: 'statetype', type: 'int'},
			{name: 'servicename', type: 'string'},
			{name: 'priorityname', type: 'string'},
			{name: 'priorityposition', type: 'int'},
			{name: 'priorityposition_display', type: 'string',
				convert: function(value, record) {
					return record.get('priorityname');
				}},
			{name: 'source', type: 'string'},
			{name: 'sourcename', type: 'string'},
			{name: 'createusername', type: 'string'},
			{name: 'attachments_count', type: 'int'},
			{name: 'closeusername', type: 'string'}
		]
	}
});
