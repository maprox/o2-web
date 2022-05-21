/**
 * @class Ext.ux.GridPrinter
 * @author Ed Spencer (edward@domine.co.uk)
 *
 * Helper class to easily print the contents of a grid.
 * Will open a new window with a table where the first row
 * contains the headings from your column model,
 * and with a row for each item in your grid's store. When formatted
 * with appropriate CSS it should look very similar to a default grid.
 * If renderers are specified in your column
 * model, they will be used in creating the table.
 * Override headerTpl and bodyTpl to change how the markup is generated
 *
 * Usage:
 *
 * var grid = new Ext.grid.GridPanel({
 *	 colModel: //some column model,
 *	 store	 : //some store
 * });
 *
 * Ext.ux.GridPrinter.print(grid);
 *
 */
Ext.ux.GridPrinter = {
/**
	* Collects data from specified grid
	* @param {Ext.grid.Panel} grid
	* @return {Object}
	*/
	collectData: function(grid) {
		var columns = [];
		if (grid.items && grid.items.length > 1) {
			// work with locked grid
			Ext.each(grid.items.items, function(g) {
				if (g.columns) {
					Ext.each(g.columns, function(column) {
						if (column.dataIndex && !column.hidden) {
							columns.push(column);
						}
					});
				}
			});
		} else {
			// work with simple grid
			Ext.each(grid.columns, function(column) {
				if (column.dataIndex) {
					columns.push(column);
				}
			});
		}

		// build a useable array of store data for the XTemplate
		var data = [];
		grid.store.data.each(function(item) {
			var convertedData = [];
			// apply renderers from column model
			for (var key in item.data) {
				var value = item.data[key];
				Ext.each(columns, function(column) {
					if (column.dataIndex == key) {
						convertedData[key] = column.renderer ?
							column.renderer(value) : value;
					}
				}, this);
			}
			data.push(convertedData);
		});

		// return object with collected data
		return {
			columns: columns,
			data: data
		};
	},

/**
	* Prints the passed grid.
	* @see Ext.ux.GridPrinter#doExport
	*/
	print: function() {
		var win = this.doPreview.apply(this, arguments);
		win.print();
		//win.close();
	},

/**
	* Exports the passed grid.
	* Reflects on the grid's column model to build a table,
	* and fills it using the store
	* @param {Ext.grid.GridPanel} grid The grid to print
	* @param {String} header Grid header
	* @param {String} footer Grid footer
	* @return {Window}
	*/
	doExport: function(params) {
		var sheets = params.sheets;
		var exportinfo = {
			filename: params.filename,
			title: params.title,
			sheets: []
		};
		Ext.each(sheets, function(item) {
			var sheet = {
				name: item.name,
				header: item.header,
				footer: item.footer,
				columns: [],
				data: []
			};

			var gridinfo = this.collectData(item.grid);
			// convert gridinfo into export-to-xls format
			var columns = [];
			Ext.each(gridinfo.columns, function(column, key) {
				sheet.columns.push(column.text);
				columns.push(column.dataIndex);
			});
			Ext.each(gridinfo.data, function(row) {
				var rowdata = [];
				Ext.each(columns, function(dataIndex) {
					rowdata.push(row[dataIndex]);
				});
				sheet.data.push(rowdata);
			});
			exportinfo.sheets.push(sheet);
		}, this);
		// iframe creation
		var exportIFrameId = 'export-iframe-id';
		var exportIFrame = Ext.fly(exportIFrameId);
		if (!exportIFrame) {
			exportIFrame = Ext.getBody().createChild({
				tag: 'iframe',
				id: exportIFrameId,
				name: exportIFrameId,
				cls: 'x-hidden'
			});
		}
		var exportFormId = 'export-form-id';
		var exportForm = Ext.fly(exportFormId);
		if (!exportForm) {
			exportForm = Ext.getBody().createChild({
				tag: 'form',
				action: '/reports/download.xls',
				method: 'POST',
				target: exportIFrameId,
				id: exportFormId,
				cls: 'x-hidden'
			});
		}
		var exportInputFieldId = 'export-input-field-id';
		var exportInputField = Ext.fly(exportInputFieldId);
		if (!exportInputField) {
			exportInputField = exportForm.createChild({
				tag: 'input',
				type: 'hidden',
				name: 'data'
			});
		}
		exportInputField.dom.value = Ext.encode(exportinfo);
		exportForm.dom.submit();
	},

/**
	* Open preview window for grid, wich can be printed
	* @param {Ext.grid.GridPanel} grid The grid to print
	* @param {String} header Grid header
	* @param {String} footer Grid footer
	*/
	doPreview: function(grid, header, footer) {
		// We generate an XTemplate here by using 2 intermediary
		// XTemplates - one to create the header,
		// the other to create the body (see the escaped {} below)
		var gridinfo = this.collectData(grid);

		// use the headerTpl and bodyTpl XTemplates
		// to create the main XTemplate below
		var headings = Ext.ux.GridPrinter.headerTpl.apply(gridinfo.columns);
		var body = Ext.ux.GridPrinter.bodyTpl.apply(gridinfo.columns);
		var html = new Ext.XTemplate(
			'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"',
			' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
			'<html>',
				'<head>',
					'<meta content="text/html; charset=UTF-8" ',
						'http-equiv="Content-Type" />',
					'<link href="' + Ext.ux.GridPrinter.stylesheetPath +
						'" rel="stylesheet" type="text/css" ',
							'media="screen,print" />',
				'</head>',
				'<body>',
					header || '', '<br/>',
					'<table>',
						headings,
						'<tpl for=".">',
							body,
						'</tpl>',
					'</table>',
					'<br/>', footer || '',
				'</body>',
			'</html>'
		).apply(gridinfo.data);

		// open up a new printing window, write to it, print it and close
		var win = window.open('', 'printgrid');
		win.document.open();
		win.document.write(html);
		return win;
	},

	/**
	 * @property stylesheetPath
	 * @type String
	 * The path at which the print stylesheet can be found
	 * (defaults to '/css/print.css')
	 */
	stylesheetPath: ''+STATIC_PATH+'/css/print.css',

	/**
	 * @property headerTpl
	 * @type Ext.XTemplate
	 * The XTemplate used to create the headings row.
	 * By default this just uses <th> elements, override to provide your own
	 */
	headerTpl: new Ext.XTemplate(
		'<tr>',
			'<tpl for=".">',
				'<th>{text}</th>',
			'</tpl>',
		'</tr>'
	),

	 /**
		* @property bodyTpl
		* @type Ext.XTemplate
		* The XTemplate used to create each row. 
		* This is used inside the 'print' function to build
		* another XTemplate, to which the data are then applied
		* (see the escaped dataIndex attribute here - this
		* ends up as "{dataIndex}")
		*/
	bodyTpl: new Ext.XTemplate(
		'<tr>',
			'<tpl for=".">',
				'<td nowrap>\{{dataIndex}\}</td>',
			'</tpl>',
		'</tr>'
	)
};
