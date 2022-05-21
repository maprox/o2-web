/**
 * @class O.lib.prodsupply.offer.List
 * @extends Ext.grid.Panel
 */
C.define('O.lib.prodsupply.offer.List', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.dnofferlist',

/** Translated fields */
	lngSendConfirmText: 'Do you really want to send offer?',
	lngRemoveConfirmText: 'Do you really want to remove offer?',
	lngAddedText: 'Offer created successfully',
	lngSendedText: 'Offer sended successfully',
	lngRemovedText: 'Offer removed successfully',

/**
	* @constructor
	*/
	initComponent: function() {
		var cols = [{
			header: _('Date'),
			dataIndex: 'sdt',
			flex: 1,
			renderer: function(value) {
				return Ext.Date.format(
					new Date().pg_fmt(value)
						.pg_utc(C.getSetting('p.utc_value')),
					O.format.Date + ' ' + O.format.TimeShort
				)
			}
		}, {
			header: _('Number'),
			dataIndex: 'num',
			width: 50
		}];
		var userIsManager = C.userHasRight('admin_dn_offer');
		if (userIsManager) {
			cols.push({
				header: _('Supplier'),
				dataIndex: 'firm_name',
				flex: 1
			});
		}

		Ext.apply(this, {
			store: C.getStore('dn_offer'),
			columns: cols,
			viewConfig: {
				getRowClass: function(record/*, index*/) {
					if (record.data.state == 2) {
						return 'is_disabled';
					}
				}
			},
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				defaults: {
					xtype: 'button',
					disabled: true
				},
				items: [{
					itemId: 'btnAdd',
					text: _('Add'),
					iconCls: 'offers_add',
					disabled: false
				}, {
					itemId: 'btnCopy',
					text: _('Copy'),
					iconCls: 'offers_copy',
					hidden: true
				}, {
					itemId: 'btnSend',
					text: _('Send'),
					iconCls: 'offers_send'
				}, {
					xtype: 'tbfill'
				}, {
					itemId: 'btnRemove',
					text: _('Remove'),
					iconCls: 'offers_recyclebin'
				}]
			}]
		});

		this.callParent(arguments);
		// init component links
		this.btnAdd = this.down('#btnAdd'),
		this.btnCopy = this.down('#btnCopy'),
		this.btnSend = this.down('#btnSend'),
		this.btnRemove = this.down('#btnRemove');

		//this.addEvents('loaded', 'removed');
	}
});
