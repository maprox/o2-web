/**
 *
 * Notification object
 * @class O.model.Notification
 * @extends O.model.Object
 */
C.define('O.model.Notification', {
	extend: 'O.model.Object'
});

C.define('Notification', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'owner', type: 'int'},
			{name: 'actionemail', type: 'bool'},
			{name: 'actionevent', type: 'bool'},
			{name: 'actionme', type: 'bool'},
			{name: 'actionpopup', type: 'bool'},
			{name: 'actionsms', type: 'bool'},
			{name: 'differentmessageforemail', type: 'bool'},
			{name: 'differentmessageforpopup', type: 'bool'},
			{name: 'differentmessageforsms', type: 'bool'},
			{name: 'email_message_in', type: 'string'},
			{name: 'email_message_on', type: 'string'},
			{name: 'email_message_out', type: 'string'},
			{name: 'id_notification_type', type: 'int'},
			{name: 'id_schedule', type: 'int'},
			{name: 'id_user', type: 'int'},
			{name: 'importance', type: 'int'},
			{name: 'importance_name', type: 'string'},
			{name: 'iseditable', type: 'bool'},
			{name: 'message_in', type: 'string'},
			{name: 'message_on', type: 'string'},
			{name: 'message_out', type: 'string'},
			{name: 'messagecommonin', type: 'string'},
			{name: 'messagecommonon', type: 'string'},
			{name: 'messagecommonout', type: 'string'},
			{name: 'messageemailin', type: 'string'},
			{name: 'messageemailon', type: 'string'},
			{name: 'messageemailout', type: 'string'},
			{name: 'messagepopupin', type: 'string'},
			{name: 'messagepopupon', type: 'string'},
			{name: 'messagepopupout', type: 'string'},
			{name: 'messagesmsin', type: 'string'},
			{name: 'messagesmson', type: 'string'},
			{name: 'messagesmsout', type: 'string'},
			{name: 'objparams'},
			{name: 'valparams'},
			{name: 'schedule', type: 'object'},
			{name: 'popup_message_in', type: 'string'},
			{name: 'popup_message_on', type: 'string'},
			{name: 'popup_message_out', type: 'string'},
			{name: 'sms_message_in', type: 'string'},
			{name: 'sms_message_on', type: 'string'},
			{name: 'sms_message_out', type: 'string'},
			{name: 'state', type: 'int'},
			{name: 'type_identifier', type: 'string'},
			{name: 'typeidentifier', type: 'string'}
		]
	}
});
