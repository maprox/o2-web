/**
 * TODO: comment this;
 */
Ext.define('O.mon.act.dashboard.UsersPortlet', {

	extend: 'Ext.panel.Panel',
	alias: 'widget.usersportlet',

	initComponent: function() {

		// Current date
		var curDate = new Date(new Date().setHours(0,0,0,0));


		// Users stats demo data
		var jsonData = [
			{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 9),
				Active: 5,
				Inactive: 10
			},
			{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 8),
				Active: 4,
				Inactive: 11
			},
			{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 7),
				Active: 6,
				Inactive: 9
			},
			{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 6),
				Active: 13,
				Inactive: 2
			},
			{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 5),
				Active: 14,
				Inactive: 1
			},
			{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 4),
				Active: 9,
				Inactive: 8
			},
			{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 3),
				Active: 15,
				Inactive: 2
			},
			{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 2),
				Active: 0,
				Inactive: 17
			},
			{
				date: Ext.Date.subtract(curDate, Ext.Date.DAY, 1),
				Active: 1,
				Inactive: 16
			},
			{
				date: curDate,
				Active: 7,
				Inactive: 10
			}
		];


		var fields = ['date', 'Active', 'Inactive'];

		var usersStore = Ext.create('Ext.data.JsonStore', {
			fields: fields,
			data: jsonData
		});

		var colors = ['rgb(47, 162, 223)',
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
		});


		Ext.apply(this, {
			layout: 'fit',
			height: 300,
			items: {
				xtype: 'chart',
				style: 'background:#fff',
				animate: true,
				theme: 'Browser:gradients',
				defaultInsets: 30,
				store: usersStore,
				legend: {
					position: 'right'
				},
				axes: [{
					type: 'Numeric',
					position: 'left',
					fields: fields.slice(1),
					title: _('Users'),
					grid: true,
					decimals: 0,
					minimum: 0,
					adjustMinimumByMajorUnit: 0
					//maximum: maxForPeriod
				}, {
					type: 'Time',
					position: 'bottom',
					fields: ['date'],
					title: _('Day'),
					dateFormat: 'm.d',
					maximum: curDate
					//,
					/*label: {
						renderer: function(v) {
							return v.match(/([0-9]*)\/[0-9]*\/[0-9][0-9]([0-9]*)/).slice(1).join('/');
						}
					}*/
				}],
				series: [{
					type: 'area',
					axis: 'left',
					highlight: true,
					tips: {
					trackMouse: true,
					width: 220,
					height: 28,
					renderer: function(storeItem, item) {
						var d = Ext.Date.format(new Date(storeItem.get('date')), 'd.m.Y'),
							count = storeItem.get(item.storeField);

						// TODO: spikenail
						var title = '';
						if (item.storeField == 'Active') {
							title = _('Active users');
						}

						if (item.storeField == 'Inactive') {
							title = _('Inactive users');
						}

						this.setTitle(title + ' - ' + d + ' - ' + count);
					}
					},
					xField: 'date',
					yField: fields.slice(1),
					title: [_('Active users'), _('Inactive users')],
					style: {
						lineWidth: 1,
						stroke: '#666',
						opacity: 0.86
					}
				}]

			}
		});

		this.callParent(arguments);
	}
});
