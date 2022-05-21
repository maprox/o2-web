/**
 * TODO: comment this;
 */
Ext.define('O.mon.act.dashboard.ConditionPortlet', {

	extend: 'Ext.panel.Panel',
	alias: 'widget.conditionportlet',

	initComponent: function() {

		// Current date
		var curDate = new Date(new Date().setHours(0,0,0,0));


		// Users stats demo data
		var jsonData = [
			{
				name: _('No error'),
				data: 88
			}, {
				name: _('Medium error'),
				data: 7
			}, {
				name: _('Critical'),
				data: 5
			}/*, {
				name: 'te',
				noerror: 78,
				error: 5,
				critical: 2
			}, {
				name: 'te',
				noerror: 78,
				error: 5,
				critical: 2
			}*/
			/*{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 8),
				Active: 4,
				Inactive: 11
			},
			{
				name: 'test1',
				Active: 6,
				Inactive: 9
			}*/
		];


		var fields = ['name', 'data'];

		var store = Ext.create('Ext.data.JsonStore', {
			fields: fields,
			data: jsonData
		});

		/*var colors = ['rgb(47, 162, 223)',
					'rgb(60, 133, 46)',
					'rgb(234, 102, 17)',
					'rgb(154, 176, 213)',
					'rgb(186, 10, 25)',
					'rgb(40, 40, 40)'];

		Ext.chart.theme.Browser = Ext.extend(Ext.chart.theme.Base, {
			constructor: function(config) {
				Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
					colors: colors
				}, config));
			}
		});*/


		Ext.apply(this, {
			layout: 'fit',
			height: 300,
			items: {
				xtype: 'chart',
				animate: true,
				store: store,
				shadow: true,
				legend: {
					position: 'right'
				},
				insetPadding: 20,
				theme: 'Base:gradients',
				series: [{
					/*colorSet: [
						'#89A109',
						//'#E37703',
						'#FFCB23',
						'#9E101E'
					],*/
					type: 'pie',
					field: 'data',
					showInLegend: true,
					donut: false,
					tips: {
						trackMouse: true,
						width: 240,
						height: 28,
						renderer: function(storeItem, item) {
							//calculate percentage.
							var total = 0;
							store.each(function(rec) {
								total += rec.get('data');
							});
							this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data') / total * 100) + '%');
						}
					},
					highlight: {
					segment: {
						margin: 20
					}
					}/*,
					label: {
						field: 'name',
						display: 'rotate',
						contrast: true,
						font: '18px Arial'
					}*/
				}]
			}
		});

		this.callParent(arguments);
	}
});
