/**
 *
 * EN
 *
 * There is no need in this file.
 * Keep it here for further translations.
 *
 */
C.utils.inherit('O.ui.module.dn.Supplier', {
	textShort: 'Suppliers',
	textLong: 'List of firm suppliers'
});

C.utils.inherit('O.act.panel.dn.SupplierList', {
	title: 'Suppliers list',
	colRegDate: 'Registration',
	colCompanyName: 'Company',
	colStatus: 'Status',
	lngEmptyGrid: 'No accounts found',
	lngAskRemove: 'Are you shure you want to delete selected supplier?',
	lngAskRestore: 'Are you shure you want to restore selected supplier?',
	lngAskActivate: 'Are you shure you want to activate selected supplier?',
	lngBtnActivate: 'Activate',
	lngBtnTrashed: 'Show trashed',
	lngBtnRestore: 'Restore',
	lngBtnRemove: 'Remove'
});

C.utils.inherit('O.act.panel.dn.SupplierInfo', {
	title: 'Requisites',
	lngPrintRequisites: 'Print company card',
	lngDetails: 'Details',
	lngContacts: 'Contacts',
	lngName: 'Name',
	lngWorkPhone: 'Work phone',
	lngMobilePhone: 'Mobile phone',
	lngEmail: 'E-mail'
});

C.utils.inherit('O.act.panel.dn.SupplierDocs', {
	title: 'Documents',
	lngName: 'Name',
	lngFile: 'File',
	lngBtnUpload: 'Upload',
	lngBtnDownload: 'Download',
	lngBtnSelect: 'Select',
	lngBtnRemove: 'Remove',
	lngColDate: 'Date',
	lngColName: 'Name',
	lngColFile: 'File',
	lngWaitMsg: 'Please wait...',
	lngMsgUploaded: 'Document successfully uploaded',
	lngMsgRemoveTitle: 'Remove document?',
	lngMsgRemoveText: 'You really want to remove document?',
	lngMsgRemoved: 'Document successfully removed'
});

C.utils.inherit('modelSupplierAccount', {
	lngStatusWaitingForApproval: 'Waiting',
	lngStatusWorking: 'Working',
	lngStatusTrashed: 'Trashed'
})