/**
 * @class O.dn.act.pricerequest.Panel
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_pricesrequest',

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'pricesrequests_list',
				width: 400,
				split: true
			}, {
				xtype: 'splitter'
			}, {
				xtype: 'panel',
				flex: 1,
				layout: 'fit',
				border: false,
				items: [{
					xtype: 'otabpanel',
					disabled: true,
					activeTab: 'pricesrequest_editor',
					items: [{
						xtype: 'pricesrequest_editor',
						itemId: 'pricesrequest_editor'
					}, {
						xtype: 'pricesrequest_answers'
					}, {
						xtype: 'pricesrequest_report'
					}, {
						xtype: 'pricesrequest_totals'
					}]
				}],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					items: [{
						xtype: 'button',
						itemId: 'btnHideDisabled',
						text: _('Hide disabled'),
						iconCls: 'btn_dn_supplier_trashed',
						enableToggle: true,
						stateful: true,
						stateId: 'btnhidedisabled',
						stateEvents: ['toggle'],
						getState: function() {
							return {
								pressed: this.pressed
							}
						}
					}]
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.btnHideDisabled = this.down('#btnHideDisabled');
		this.requestsList = this.down('pricesrequests_list');
		this.requestsEditor = this.down('pricesrequest_editor');
		this.requestsAnswers = this.down('pricesrequest_answers');
		this.requestsAnswerList = this.down('pricesrequest_answerlist');
		this.requestsReport = this.down('pricesrequest_report');
		this.requestsTotals = this.down('pricesrequest_totals');
		this.requestsEditorList = this.down('pricesrequest_editorlist');
		this.requestsEditorLines = this.down('pricesrequest_editorlines');
		this.tabPanel = this.down('otabpanel');
	}

});
