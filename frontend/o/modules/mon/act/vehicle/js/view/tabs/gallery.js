/**
 * @class O.mon.vehicle.tab.Gallery
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.mon.vehicle.tab.Gallery', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-vehicle-tab-gallery',

/**
	* @constructor
	*/
	initComponent: function() {

		this.attachmentStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name', 'dt'],
			sorters: [{
				property: 'dt',
				direction: 'DESC'
			}]
		});

		// Thumb template
		var thumbTpl = new Ext.XTemplate(
			'<div class="vehicle-thumbs">',
			'<tpl for=".">',
				'<div class="vehicle-thumb loading">',
					'<img src="/mon_vehicle/attachment/{id}/thumb" />',
					'<div>',
					'<a href="/mon_vehicle/attachment/{id}"',
					'title="{name}" target="_blank">',
						'{[this.convertName(values.name)]}',
					'</a>',
					'</div>',
				'</div>',
			'</tpl>',
			'<div style="clear: both"> </div>',
			'</div>',
			{
				convertName: function(name) {
					var maxLen = 40;
					var append = '';
					if (name.length > maxLen) {
						append = '...';
					}
					return name.substring(0, maxLen) + append;
				}
			}
		);

		this.thumbsView = Ext.create('Ext.view.View', {
			store: this.attachmentStore,
			tpl: thumbTpl,
			itemSelector: 'div.vehicle-thumb',
			emptyText: _('No photo available')
		});

		Ext.apply(this, {
			title: _('Photo gallery'),
			itemId: 'gallery',
			bodyPadding: 0,
			border: false,
			layout: 'border',
			defaults: {
				split: true
			},
			items: [{
				title: _('Upload photos'),
				region: 'south',
				xtype: 'xuploadpanel',
				itemId: 'uploadpanel',
				filters: [{
					title: "Image files",
					extensions: "jpg,jpeg,gif,png"
				}],
				//flex: 1,
				minHeight: 250,
				maxHeight: 500,
				collapsible: true
			}, {
				title: false,
				xtype: 'panel',
				layout: 'anchor',
				region: 'center',
				bodyBorder: false,
				bodyPadding: 5,
				autoScroll: true,
				items: [this.thumbsView],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					items: [{
						xtype: 'button',
						itemId: 'removePhoto',
						disabled: true,
						iconCls: 'btn-delete',
						text: _('Remove photo')
					}]
				}],
				flex: 2.5
			}]
		});

		this.callParent(arguments);
	}
});
