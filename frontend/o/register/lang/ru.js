/**
 *
 * RU
 *
 */

C.utils.inherit('O.register.Panel', {
	subTitle: 'Страница регистрации'
});

C.utils.inherit('O.register.MonitoringForm', {
	title: 'Регистрация в систему мониторинга транспорта',
	successMessage: 'Для завершения регистрации, проверьте указанный вами почтовый ящик.',
	errorMessage: 'Такой e-mail уже зарегистрирован в системе',
	lngType: 'Тип организации',
	lngTypeFiz: 'Физическое лицо',
	lngTypeYur: 'Юридическое лицо',
	lngEmail: 'E-mail',
	lngName: 'Имя',
	lngFamilyName: 'Фамилия',
	lngOrganization: 'Организация',
	lngTariff: 'Тариф',
	lngAction: 'Отправить заявку'
});

C.utils.inherit('O.register.SupplyForm', {
	title: 'Регистрация в системе управления закупками',
	successMessage: 'Для завершения регистрации, проверьте указанный вами почтовый ящик.',
	errorMessage: 'Такой e-mail уже зарегистрирован в системе',
	lngEmail: 'E-mail',
	lngName: 'Имя',
	lngFamilyName: 'Фамилия',
	lngWorkPhone: 'Рабочий телефон',
	lngMobilePhone: 'Мобильный телефон',
	lngCompanyInfo: 'Информация об организации',
	lngCompanyName: 'Наименование',
	lngCompanyLegalAddress: 'Юр. адрес',
	lngCompanyLegalAddressEqualsActual: 'Юридический адрес совпадает с фактическим',
	lngCompanyActualAddress: 'Факт. адрес',
	lngCompanyOgrn: 'ОГРН',
	lngCompanyInn: 'ИНН',
	lngCompanyKpp: 'КПП',
	lngCompanyOkved: 'ОКВЭД',
	lngCompanyOkpo: 'ОКПО',
	lngDirector: 'Директор',
	lngDirectorLastName: 'Фамилия',
	lngDirectorFirstName: 'Имя',
	lngDirectorSecondName: 'Отчество',
	lngBankInfo: 'Банковские реквизиты',
	lngBankName: 'Наименование',
	lngBankBik: 'БИК',
	lngBankCurrentAccount: 'Расч./счет',
	lngBankCorrespondentAccount: 'Кор./счет',
	lngAction: 'Отправить заявку',
	lngDocs: 'Документы',
	lngCompanyEgryl: 'Выписка из ЕГРЮЛ',
	lngCompanyCharter: 'Копия устава',
	lngUpload: 'Загрузить',
	lngUploaded: 'Загружено',
	lngWaitMsg: 'Пожалуйста, подождите...',
	lngYes: 'Да'
});

C.utils.inherit('O.register.ConfirmForm', {
	title: 'Завершение регистрации',
	finishMessage: 'Регистрация прошла успешно.<br/>' +
		'На данный момент ваша учетная запись не активна.<br/>' +
		'В ближайшее время наш администратор её активирует,<br/>' +
		'о чем вам придет уведомление на указанный вами при регистрации e-mail адрес.',
	errorMessage: 'Такой логин уже занят',
	lngLogin: 'Логин',
	lngPassword: 'Пароль',
	lngPassword2: 'Повторите пароль',
	lngAction: 'Завершить регистрацию'
});
