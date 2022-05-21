/**
 * @class Ext.form.field.ColorPicker
 * @extends Ext.form.field.Field
 */
Ext.define('Ext.form.field.ColorPicker', {
	extend: 'Ext.form.field.Base',
	alias: 'widget.cpicker',

	// Цвет в пикере по умолчанию
	color: 'ff6600',
/**
	* @constructs
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.on('afterrender', this.onAfterRender, this);
		this.color = 'ff6600';
		this.menu = Ext.widget('menu', {
			plain: true,
			items: [{
				xtype: 'colorpicker',
				focus: Ext.emptyFn,
				plain: true,
				allowReselect: true,
				clickEvent: 'mousedown',
				scope: this,
				handler: this.colorSelected
			}]
		});
	},

/*
	* Инициализация компонента
	*/
	onAfterRender: function() {
		this.inputEl.dom.style.width = '100%';
		this.inputEl.dom.style.height = '24px';
		this.inputEl.dom.style.cursor = 'pointer';
		this.inputEl.on('click', this.menuShow, this);
		this.setValue();
	},

/*
	* Обработчик события выбора цвета
	*/
	colorSelected: function(cp, color) {
		this.setValue(color);
		this.fireEvent('colorchanged', color, this);
		this.menu.hide();
	},

/*
	* Показать меню выбора цвета
	*/
	menuShow: function(event) {
		this.menu.showAt(event.getX(), event.getY());
	},

/*
	* Возвращает текущий выбранный цвет
	* @return {String}
	*/
	getColor: function() {
		return this.getValue();
	},

/**
	* COMMENT THIS
	* @param {String} value
	*/
	setValue: function(value) {
		this.callParent(arguments);
		if (this.inputEl) {
			if(!value) {
				value = this.color;
			}
			this.inputEl.dom.style.background = "#" + value;
			this.inputEl.dom.style.color = "#" + value;
		}
	}
});
