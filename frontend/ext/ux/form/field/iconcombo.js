/**
  * @author  Ing. Jozef Sakalos
  */

/**
  * Ext.ux.IconCombo Extension Class for Ext 2.x Library
  * @class Ext.ux.form.field.IconCombo
  * @extends Ext.form.field.ComboBox
  */
Ext.define('Ext.ux.form.field.IconCombo', {
	extend: 'Ext.form.field.ComboBox',
	alias: 'widget.iconcombo'/*,

	initComponent: function() {
		Ext.apply(this, {
			renderTpl:  '<tpl for=".">'
				+ '<div class="x-combo-list-item ux-icon-combo-item '
				+ '{' + this.iconClsField + '}">'
				+ '{' + this.displayField + '}'
				+ '</div></tpl>'
		});
		this.callParent(arguments);
	},

	onRender: function() {
		// adjust styles
		this.wrap.applyStyles({position:'relative'});
		this.el.addClass('ux-icon-combo-input');

		// add div for icon
		this.icon = Ext.DomHelper.append(this.el.up('div.x-form-field-wrap'), {
			tag: 'div', style:'position:absolute'
		});

		this.setIconCls();

	}, // end of function onRender

	setIconCls: function() {
		var rec = this.store.query(this.valueField, this.getValue()).itemAt(0);
		if(rec) {
			if (this.icon)
				this.icon.className = 'ux-icon-combo-icon ' + rec.get(this.iconClsField);
		}
	}, // end of function setIconCls

	setValue: function(value) {
		Ext.ux.IconCombo.superclass.setValue.call(this, value);
		this.setIconCls();
	} // end of function setValue*/
});
