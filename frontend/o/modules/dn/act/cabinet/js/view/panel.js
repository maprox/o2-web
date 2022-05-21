/**
 *
 * Supplier personal cabinet
 * @class O.comp.dn.Cabinet
 * @extends C.ui.Panel
 */
C.define('O.comp.dn.Cabinet', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_dn_cabinet',

/** Translated fields */
	lngDocuments: 'Documents',
	lngRequisites: 'Requisites',
	lngContacts: 'Contact information',
	lngOffers: 'Offers',
	lngPriceRequests: 'Price requests',
	lngNews: 'News',
	lngNoDocs: 'No documents',
	lngOfferNum: 'Offer ',
	lngSdt: 'Created',
	lngEdt: 'Sended',
	lngNotSended: 'Not sended',
	lngNoOffers: 'You have not added any offer.'
		+ '<br /><a href="#dn_offer/new">Create new</a>',
	lngDownload: 'Download',
	lngInDevelopment: 'In development',

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;
		Ext.apply(this, {
			autoScroll: true,
			layout: 'column',
			bodyPadding: 10,
			items: [{
				columnWidth: .5,
				border: false,
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					bodyPadding: 5,
					collapsible: true,
					titleCollapse: true,
					border: false
				},
				items: [{
					xtype: 'panel',
					title: this.lngDocuments,
					items: [{
						itemId: 'docs',
						xtype: 'dataview',
						tpl: Ext.create('Ext.XTemplate', [
							'<tpl for=".">',
								'<div class="doc_wrap" id="{id}">',
									'<a href="/dn_doc/download/?id={id}" class="doc_item" title="' + this.lngDownload + '" target="_blank">',
										'<div class="doc_item_name">{name}</div>',
										'<div class="doc_item_file">{file} ({size})</div>',
									'</a>',
								'</div>',
							'</tpl>'
						]),
						store: C.getStore('dn_doc'),
						itemSelector: 'div.doc_wrap',
						deferEmptyText: false,
						emptyText: '<div class="no_items">' + this.lngNoDocs + '</div>'
					}]
				}, {
					xtype: 'panel',
					title: this.lngOffers,
					items: [{
						itemId: 'offers',
						xtype: 'dataview',
						tpl: new Ext.XTemplate(
							'<tpl for=".">',
								'<div class="offer_wrap" id="{id}">',
									'<a href="#dn_offer/id:{id}" class="offer_item',
										'<tpl if="edt==0">',
											' offer_not_sended',
										'</tpl>',
									'">',
										'<div class="offer_item_name">',
											'<tpl if="this.isLast(edt)">',
												'<b>',
											'</tpl>',
													this.lngOfferNum + '{num}',
											'<tpl if="this.isLast(edt)">',
												'</b>',
											'</tpl>',
										'</div>',
										'<div class="offer_item_dt">',
											this.lngSdt + ': {sdt}',
										'</div>',
											'<div class="offer_item_dt">',
												this.lngEdt + ': ',
												'<tpl if="edt">',
													'{edt}',
												'</tpl>',
												'<tpl if="edt==0">',
													this.lngNotSended,
												'</tpl>',
											'</div>',
									'</a>',
								'</div>',
							'</tpl>',
							{
								isLast: function(edt) {
									var offers =
										C.get('dn_offer').getRange(),
										last = '';
									for (var i = 0, l = offers.length; i < l;
										i++) {
										if (offers[i].edt
											&& offers[i].edt > last) {
											last = offers[i].edt;
										}
									}
									return last && edt == last;
								}
							}
						),
						store: C.getStore('dn_offer'),
						itemSelector: 'div.offer_wrap',
						deferEmptyText: false,
						emptyText: '<div class="no_items">' + this.lngNoOffers + '</div>'
					}]
				}/*, {
					title: this.lngPriceRequests,
					html: this.lngInDevelopment
				}, {
					title: this.lngNews,
					html: this.lngInDevelopment
				}*/]
			}, { // splitter
				width: 10,
				border: false,
				html: '&nbsp;'
			}, {
				columnWidth: .5,
				border: false,
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					border: false
				},
				items: [{
					xtype: 'component',
					itemId: 'welcome',
					padding: 5,
					html: ''
				}, {
					xtype: 'panel',
					title: this.lngContacts,
					bodyPadding: 5,
					titleCollapse: true,
					collapsible: true,
					items: [{
						xtype: 'form',
						itemId: 'contactsform',
						width: 500,
						border: false,
						items: [{
							defaults: {
								width: 420 // TODO Change this to anchor!
							},
							xtype: 'personcontacts'
						}]
					}]
				}, {
					xtype: 'panel',
					title: this.lngRequisites,
					bodyPadding: 5,
					titleCollapse: true,
					collapsible: true,
					items: [{
						xtype: 'form',
						itemId: 'requisitesform',
						width: 500,
						border: false,
						items: [{
							defaults: {
								width: 420 // TODO Change this to anchor!
							},
							xtype: 'companyrequisites',
							readonly: true,
							showFillInLinks: true
						}]
					}]
				}]
			}]
		});
		this.callParent(arguments);
		this.requisitesFormPanel = this.down('#requisitesform');
		this.companyRequisites = this.down('companyrequisites');
		this.on({
			afterrender: this.loadWelcome,
			scope: this
		});
	},

	loadWelcome: function() {
		this.down('#welcome').update(
			'<iframe style="overflow:auto;width:100%;"' +
			'frameborder="0" src="/x_firm/welcome/?firm=' +
			C.getSetting('f.id_parent') + '"></iframe>');
	}
});
