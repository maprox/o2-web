/**
 * @class Ext.form.field.ImageSelect
 * @extends Ext.form.field.Field
 */
Ext.define('Ext.form.field.ImageSelect', {
	extend: 'Ext.form.field.Base',

	alias: 'widget.imageselect',

	fieldSubTpl: [''],

/**
	* @constructs
	*/
	initComponent: function() {

		this.imageTpl = Ext.create('Ext.XTemplate', [
			'<tpl for=".">',
				'<div class="thumb-wrap" id="{id}">',
					'<div class="thumb"><img src="{src}"></div>',
				'</div>',
			'</tpl>',
			'<div class="x-clear"></div>'
		]);

		this.callParent(arguments);

		this.on('afterrender', this.onAfterRender, this);

	},

/**
	* On after render
	**/
	onAfterRender: function() {
		// Create view
		this.imagesView = Ext.create('Ext.view.View', {
			itemId: 'images-view',
			name: 'imagealias',
			tpl: this.imageTpl,
			store: this.store,
			itemSelector: 'div.thumb-wrap',
			trackOver: true,
			emptyText: '<div class="devicestabimages_no">' + _('No available images')
				+ '</div>',
			flex: 1,
			autoRender: true,
			renderTo: this.id
		});

		this.imagesView.on('select', this.onImageSelect, this);
	},

/**
	* Image selection handler
	*/
	onImageSelect: function(sm, item) {
		this.setValue(item.get('alias'));
	},

/**
	* Set value and select image
	* @param {String} value
	*/
	setValue: function(value) {
		this.callParent(arguments);

		if (this.imagesView) {
			var sm = this.imagesView.getSelectionModel();

			if (!value) {
				sm.deselectAll();
			} else {
				var imageIndex = this.store.find('alias', value);
				sm.select(imageIndex);
			}
		}
	}

});

