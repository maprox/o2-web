C.utils.inherit('O.lib.billing.tab.Info', {
	msgAskDelete: 'Вы уверены, что желаете удалить выбранный счет на оплату?'
});

C.utils.inherit('O.lib.billing.tab.Invoice', {
	msgAskDelete: 'Do you realy want to delete selected billing invoice?'
});

_({
	invoiceStatus1: 'Created',
	invoiceStatus2: 'Awaiting payment',
	invoiceStatus3: 'Paid',
	'Account refill': 'Payment of the account',
	invoiceNum: ' with invoice №'
});

C.utils.inherit('O.window.PendingPayment', {
	title: 'Pending payment',
	pendingPaymentTpl: '<table class="payment_window"><tr>'+
			'<th>Payment № {id}</th>'+
			'<th>Payment date</th>'+
			'<th>Payment type</th>'+
			'<th>Money</th>'+
		'</tr><tr>'+
			'<td>Details: </td>'+
			'<td>{sdt}</td>'+
			'<td>{payment_name}</td>'+
			'<td>{amount}</td>'+
		'</tr><tr>'+
			'<td>Refill total: </td>'+
			'<td></td>'+
			'<td></td>'+
			'<td>{amount}</td>'+
	'</tr></table>',
	lngBtnPendingCancel: 'Cancel',
	lngBtnPendingDo: 'Start payment',
	paymentErrorAlert: 'Payment type not implemented yet'
});

C.utils.inherit('O.window.EditAccountLimit', {
	title: 'Edit account limit',

	lngBtnCancel: 'Cancel',
	lngBtnDo: 'Change limit',
	lngNewAccountLimit: 'New limit sum',
	lngNewAccountLimitDate: 'New limit expires',
	lngNewAccountLimitPermanent: 'Make new limit permanent'
});

C.utils.inherit('O.window.EditAccountTariff', {
	title: 'Edit account tariff',

	lngBtnCancel: 'Cancel',
	lngBtnDo: 'Change tariff',
	lngNewAccountTariff: 'New tariff'
});

C.utils.inherit('O.window.EditAccountBalance', {
	title: 'Edit account balance',

	lngBtnCancel: 'Cancel',
	lngBtnDo: 'Change balance',
	lngCurrentBalance: 'Current balance',
	lngChangeBalance: 'Change value',
	lngMethod: 'Payment method',
	lngNote: 'Note'
});
