/**
 * TODO: comment this;
 */
Ext.define('O.mon.act.dashboard.BalancePortlet', {

	extend: 'Ext.panel.Panel',
	alias: 'widget.balanceportlet',

/* requires: [
		'Ext.data.JsonStore',
		'Ext.chart.theme.Base',
		'Ext.chart.series.Series',
		'Ext.chart.series.Line',
		'Ext.chart.axis.Numeric'
	],*/

	initComponent: function() {

		var store =  Ext.create('Ext.data.Store', {
			fields: [
				{ name: 'balance'},
				{ name: 'date'}
			]
		});

		var dateOffset = (24 * 60 * 60 * 1000) * 1; //1 day
		var curDate = new Date();

		//new Date(2013, 3, 13)
		// Demo data
		store.loadData([{
			balance: 4500,
			date: new Date(curDate.getTime() - (dateOffset * 9))
		}, {
			balance: 4200,
			date: new Date(curDate.getTime() - (dateOffset * 8))
		}, {
			balance: 3900,
			date: new Date(curDate.getTime() - (dateOffset * 7))
		}, {
			balance: 3400,
			date: new Date(curDate.getTime() - (dateOffset * 6))
		}, {
			balance: 2900,
			date: new Date(curDate.getTime() - (dateOffset * 5))
		}, {
			balance: 5000,
			date: new Date(curDate.getTime() - (dateOffset * 4))
		}, {
			balance: 4500,
			date: new Date(curDate.getTime() - (dateOffset * 3))
		}, {
			balance: 3500,
			date: new Date(curDate.getTime() - (dateOffset * 2))
		}, {
			balance: 2500,
			date: new Date(curDate.getTime() - (dateOffset * 1))
		}, {
			balance: 1500,
			date: curDate
		}]);
		// TODO:
		//store = Ext.create('storeBillingHistory');

		Ext.apply(this, {
			layout: 'fit',
			height: 300,
			items: {
				xtype: 'chart',
				animate: false,
				store: store,
				insetPadding: 30,
				axes: [{
					type: 'Numeric',
					//minimum: 0,
					position: 'left',
					fields: ['balance'],
					title: false,
					grid: true,
					label: {
						renderer: Ext.util.Format.numberRenderer('0,0'),
						font: '10px Arial'
					}
				}, {
					type: 'Time',
					position: 'bottom',
					fields: ['date'],
					title: false,
					dateFormat: 'm.d',
					label: {
						font: '11px Arial'//,
						/*renderer: function(name) {
							return name.substr(0, 3);
						}*/
					}
				}],
				series: [{
					type: 'line',
					axis: 'left',
					xField: 'date',
					yField: 'balance',
					/*tips: {
						trackMouse: true,
						width: 110,
						height: 25,
						renderer: function(storeItem, item) {
							this.setTitle(storeItem.get('balance'));
						}
					},*/
					style: {
						fill: '#38B8BF',
						stroke: '#38B8BF',
						'stroke-width': 3
					},
					markerConfig: {
						type: 'circle',
						size: 4,
						radius: 4,
						'stroke-width': 0,
						fill: '#38B8BF',
						stroke: '#38B8BF'
					}
				}]
			}
		});

		this.callParent(arguments);
	}
});
