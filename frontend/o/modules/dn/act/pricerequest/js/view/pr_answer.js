/**
 *
 * @class O.dn.act.pricerequest.Editor
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.Answer', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesrequest_answers',

	title: 'Responses to this request',

	disabled: true,

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
				xtype: 'pricesrequest_answerlist',
				split: true,
				flex: 2
			}, {
				xtype: 'splitter'
			}, {
				xtype: 'pricesrequest_answerlines',
				disabled: true,
				flex: 5
			}]
		});

		this.callParent(arguments);
		this.answerList = this.down('pricesrequest_answerlist');
		this.answerLines = this.down('pricesrequest_answerlines');
	}

});
