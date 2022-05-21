/**
 *
 * EN
 *
 * There is no need in this file.
 * Keep it here for further translations.
 *
 */

C.utils.inherit('O.register.Panel', {
	subTitle: 'Registration window'
});

C.utils.inherit('O.register.MonitoringForm', {
	title: 'Registration into transport monitoring system',
	successMessage: 'Verify email has been sent, check your inbox.',
	errorMessage: 'Email already used',
	lngType: 'Organziation type',
	lngTypeFiz: 'Natural person',
	lngTypeYur: 'Legal personality',
	lngEmail: 'E-mail',
	lngName: 'Name',
	lngFamilyName: 'Family name',
	lngOrganization: 'Organization',
	lngTariff: 'Tariff',
	lngAction: 'Send registration'
});

C.utils.inherit('O.register.SupplyForm', {
	title: 'Registration into procurement management system',
	successMessage: 'Verify email has been sent, check your inbox.',
	errorMessage: 'Email already used',
	lngEmail: 'E-mail',
	lngName: 'Name',
	lngFamilyName: 'Family name',
	lngOrganization: 'Organization',
	lngAction: 'Send registration',
	lngDocs: 'Documents',
	lngCompanyEgryl: 'Extract from EGRYL',
	lngCompanyCharter: 'Copy of charter',
	lngUpload: 'Upload',
	lngUploaded: 'Uploaded file',
	lngWaitMsg: 'Please wait...',
	lngYes: 'Yes'
});

C.utils.inherit('O.register.ConfirmForm', {
	title: 'Finishing registration',
	finishMessage: 'Registration was successful.<br/>' +
		'At the moment your account is not activated.<br/>' +
		'In the near future, our administrator will activate it,<br/>' +
		'and you will receive notification on your e-mail address.',
	errorMessage: 'Login already used',
	lngLogin: 'Login',
	lngPassword: 'Password',
	lngPassword2: 'Repeat Password',
	lngAction: 'Finish Registration'
});
