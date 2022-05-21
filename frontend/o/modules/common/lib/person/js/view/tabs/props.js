/**
 * @class O.common.lib.person.tab.Props
 * @extends C.ui.Panel
 */
C.define('O.common.lib.person.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.common-lib-person-tab-props',

	hiddenElements: {},
	allowBlank: {},
/**
	* @constructor
	*/
	initComponent: function() {

		// Create emails editor
		this.emailsEditor = Ext.widget('common-simplegrid', {
			alias: 'email',
			prop: 'address',
			vtype: 'email'
		});

		// Create phones editor
		this.phonesEditor = Ext.widget('common-simplegrid', {
			alias: 'phone',
			prop: 'number'
		});

		// No photo avatar url
		this.noPhotoUrl =  STATIC_PATH + '/img/no-photo-worker.png';

		// Profile photo store
		this.photoStore = Ext.create('Ext.data.Store', {
			id: 'photoSore',
			fields: ['src'],
			data: [{
				src: this.noPhotoUrl
			}]
		});

		// plupload browse files button id
		this.browseButtonId = this.prefix ? this.prefix.split('.')[0]
			+ '-upload-photo' : 'upload-photo';

		// x_person/attachment/{id}
		// Profile photo tpl
		var photoTpl = new Ext.XTemplate(
			'<tpl for=".">',
				'<div',
				' data-qtip="',
				_('Change photo'),
				'" class="photo-wrap">',
				'<img src="{src}" class="profile-photo" id="',
					this.browseButtonId,
				'" />',
				'</div>',
			'</tpl>'
		);

		// Profile photo view
		this.photoView = Ext.create('Ext.view.View', {
			style: {
				'float': 'left'
			},
			store: this.photoStore,
			tpl: photoTpl,
			itemSelector: 'div.photo-wrap', // needed for itemclick event
			emptyText: 'no photo'
		});

		Ext.apply(this, {
			title: _('Personal data'),
			itemId: 'personaldata',
			autoScroll: true,
			layout: 'anchor',
			items: [{
				border: false,
				height: 720,
				anchor: '100%',
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				defaults: {
					border: false,
					bodyPadding: 10,
					layout: 'anchor',
					flex: 1
				},
				items: [{
					items: [{
						xtype: 'panel',
						border: false,
						layout: 'hbox',
						defaults: {
							xtype: 'textfield',
							labelAlign: 'top'
						},
						items: [{
							fieldLabel: _('Last name'),
							name: this.prefix + 'lastname',
							allowBlank: false || this.allowBlank['lastname'],
							flex: 1
						}, {
							xtype: 'tbspacer',
							width: 6
						}, {
							fieldLabel: _('First name'),
							name: this.prefix + 'firstname',
							flex: 1
						}, {
							xtype: 'tbspacer',
							width: 6
						}, {
							fieldLabel: _('Middle name'),
							name: this.prefix + 'secondname',
							flex: 1
						}, {
							xtype: 'tbspacer',
							width: 6
						}, {
							fieldLabel: _('Gender'),
							xtype: 'combobox',
							width: 90,
							name: this.prefix + 'gender',
							editable: false,
							store : [[0, _('Male')], [1, _('Female')]]
						}]
					}, {
						xtype: 'fieldcontainer',
						layout: 'hbox',
						items: [{
							xtype: 'fieldset',
							flex: 1,
							title: _('E-mail'),
							items: [
								this.emailsEditor
							]
						}, {
							xtype: 'tbspacer',
							width: 6
						}, {
							xtype: 'fieldset',
							flex: 1,
							title: _('Phone numbers'),
							items: [
								this.phonesEditor
							]
						}]
					}, {
						labelAlign: 'top',
						xtype: 'textarea',
						fieldLabel: _('Note'),
						height: 100,
						anchor: '100%',
						name: this.prefix + 'note'
					}]
				}, {
					items: [this.photoView, {
						xtype: 'fieldset',
						itemId: 'panelpassport',
						hidden: this.hiddenElements['panelpassport'],
						title: _('Passport'),
						collapsible: true,
						defaults: {
							labelAlign: 'top',
							anchor: '100%',
							xtype: 'textfield'
						},
						items: [{
							fieldLabel: _('Number'),
							name: this.prefix + 'passport.num'
						}, {
							xtype: 'fieldcontainer',
							fieldLabel: _('Issue date and issuer name'),
							layout: 'hbox',
							items: [{
								xtype: 'datefield',
								format: O.format.Date,
								altFormats: 'c',
								width: 100,
								name: this.prefix + 'passport.issue_dt'
							}, {
								xtype: 'tbspacer',
								width: 6
							}, {
								xtype: 'textfield',
								name: this.prefix + 'passport.issuer',
								flex: 1
							}]
						}, {
							xtype: 'fieldcontainer',
							labelAlign: 'top',
							fieldLabel: _('Date and place of birth'),
							layout: 'hbox',
							items: [{
								xtype: 'datefield',
								format: O.format.Date,
								width: 100,
								name: this.prefix + 'birth_dt'
							}, {
								xtype: 'tbspacer',
								width: 6
							}, {
								xtype: 'textfield',
								name: this.prefix + 'birth_place',
								flex: 1
							}]
						}, {
							labelAlign: 'top',
							fieldLabel: _('Residental address'),
							name: this.prefix + 'residential_address'
						}]
					}, {
						xtype: 'fieldset',
						itemId: 'paneldriverlicense',
						hidden: this.hiddenElements['paneldriverlicense'],
						title: _('Driver license'),
						collapsible: true,
						defaults: {
							labelAlign: 'top',
							anchor: '100%',
							xtype: 'textfield'
						},
						items: [{
							fieldLabel: _('Number'),
							name: this.prefix + 'driver_license.num'
						}, /*{
							xtype: 'fieldcontainer',
							fieldLabel: _('Issue date and issuer name'),
							layout: 'hbox',
							items: [{
								xtype: 'datefield',
								format: O.format.Date,
								altFormats: 'c',
								width: 100,
								name: 'driver_license.issue_dt'
							}, {
								xtype: 'tbspacer',
								width: 6
							}, {
								xtype: 'textfield',
								name: 'driver_license.issuer',
								flex: 1
							}]
						}, */{
							xtype: 'fieldcontainer',
							fieldLabel: _('Category'),
							labelAlign: 'left',
							layout: 'hbox',
							anchor: null,
							width: 300,
							defaults: {
								xtype: 'checkbox',
								flex: 1,
								inputValue: '1',
								uncheckedValue: '0'
							},
							items: [{
								boxLabel: 'A',
								name: this.prefix + 'driver_license.has_category_a'
							}, {
								boxLabel: 'B',
								name: this.prefix + 'driver_license.has_category_b'
							}, {
								boxLabel: 'C',
								name: this.prefix + 'driver_license.has_category_c'
							}, {
								boxLabel: 'D',
								name: this.prefix + 'driver_license.has_category_d'
							}, {
								boxLabel: 'E',
								name: this.prefix + 'driver_license.has_category_e'
							}]
						}]
					}]
				}/*, {
					flex: 1
				}*/]
			}]
		});
		this.callParent(arguments);
		this.panelPassport = this.down('#panelpassport');
		this.panelDriverlicense = this.down('#paneldriverlicense');
	}
});
