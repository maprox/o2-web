/**
 * @class O.common.act.report.tab.Description
 * @extends C.ui.Panel
 */
C.define('O.common.act.report.tab.Description', {
	extend: 'C.ui.Panel',
	alias: 'widget.common-report-tab-description',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			bodyPadding: '0 20 0 0',
			items: [
				Ext.create('Ext.panel.Panel', {
					border: false,
					width: 148,
					bodyPadding: 10,
					autoScroll: true,
					items: [
						Ext.create('Ext.Img', {
							itemId: 'thumb',
							src: STATIC_PATH+'/img/spacer.gif'
						})
					]
				}),
				Ext.create('Ext.Component', {
					flex: 1,
					itemId: 'html',
					html: ''
				})
			]
		});
		this.callParent(arguments);
	},

	loadReport: function(alias) {
		/*
		this.down('#thumb').setSrc(STATIC_PATH+'/img/reports/' + alias + '.png');
		this.down('#html').update(
			'<iframe style="overflow:auto;width:100%;height:100%;"' +
			'frameborder="0"  src="'+STATIC_PATH+'/html/reports/' +
			this.locale + '/' + alias + '.html"></iframe>');
		*/
	}
});
