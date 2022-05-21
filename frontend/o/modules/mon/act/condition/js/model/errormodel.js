/**
 * @class O.mon.condition.ErrorModel
 * @extends Ext.data.Model
 */
C.define('O.mon.condition.ErrorModel', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			{name: 'code', type: 'string'},
			{name: 'text', type: 'string', convert: function(v, rec){
				var codes = {
					P0100: 'Неисправность цепи датчика расхода воздуха',
					P0101: 'Выход сигнала датчика расхода воздуха из допустимого диапазона',
					P0102: 'Низкий уровень выходного сигнала датчика расхода воздуха',
					P0103: 'Высокий уровень выходного сигнала датчика расхода воздуха',
					P0105: 'Неисправность датчика давления воздуха',
					P0106: 'Выход сигнала датчика давления воздуха из допустимого диапазона',
					P0107: 'Низкий уровень выходного сигнала датчика давления воздуха',
					P0108: 'Высокий уровень выходного сигнала датчика давления воздуха',
					P0110: 'Неисправность датчика температуры всасываемого воздуха',
					P0111: 'Выход сигнала датчика температуры всасываемого воздуха из допустимого диапазона',
					P0112: 'Низкий уровень датчика температуры всасываемого воздуха',
					P0113: 'Высокий уровень датчика температуры всасываемого воздуха',
					P0115: 'Выход сигнала датчика температуры охлаждающей жидкости из допустимого диапазона',
					P0116: 'Низкий уровень датчика температуры охлаждающей жидкости',
					P0118: 'Высокий уровень датчика температуры охлаждающей жидкости',
					P0120: 'Неисправность датчика положения дроссельной заслонки "A"',
					P0121: 'Выход сигнала датчика положения дроссельной заслонки "A" из допустимого диапазона',
					P0122: 'Низкий уровень выходного сигнала датчика положения дроссельной заслонки "A"',
					P0123: 'Высокий уровень выходного сигнала датчика положения дроссельной заслонки "A"',
					P0125: 'Низкая температура охлаждающей жидкости для управления по замкнутому контуру'
				};

				return codes[rec.get('code')];
			}},
			{name: 'is_critical', type: 'boolean', useNull: true}
		]
	}
});