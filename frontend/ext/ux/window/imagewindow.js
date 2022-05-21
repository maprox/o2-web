/**
 * @class Ext.ux.window.ImageWindow
 * @extends Ext.window.Window
 */
Ext.define('Ext.ux.window.ImageWindow', {
	extend: 'O.ui.Window',
	alias: 'widget.imagewindow',

/**
	* @contructor
	*/
	initComponent: function() {
		var me = this;

		this.thumbsView.on('select', function(t, record) {
			me.setImage({
				id: record.get('id'),
				time: record.get('time'),
				note: record.get('note')
			});
		});

		var padding = 4;
		Ext.apply(this, {
			title: _('Images history'),
			layout: 'border',
			defaults: {
				bodyPadding: padding,
				border: false,
				layout: 'fit'
			},
			items: [{
				region: 'center',
				layout: 'ux.center',
				items: [{
					itemId: 'imageview',
					border: false,
					autoScroll: true,
					width: '100%'
				}]
			}, {
				region: 'south',
				height: 160,
				items: [
					this.thumbsView
				],
				dockedItems: [{
					xtype: 'pagingtoolbar',
					store: this.imageStore,
					dock: 'bottom',
					displayInfo: true
				}]
			}]
		});
		this.callParent(arguments);
		this.largeImageView = this.down('#imageview');
	},

/**
	* Sets large image
	*/
	setImage: function(data) {
		//this.largeImageStore.loadData([data]);
		this.largeImageView.update('<img src="/mon_device_image/' +
			data.id + '/draw/large" class="image-large"/>');
	},

/**
	* Resizes window to screen
	*/
	resizeWindow: function() {
		var b = Ext.getBody();
		var bw = b.getWidth();
		var bh = b.getHeight();
		var margin = 0.1; // 10%
		var size = {
			width: bw - (bw * margin),
			height: bh - (bh * margin)
		};
		if (size.width > 700) {
			size.width = 700;
		}
		if (size.height > 700) {
			size.height = 700;
		}
		var x = (bw - size.width) * 0.5;
		var y = (bh - size.height) * 0.5;
		this.setPagePosition(x, y);
		this.setSize(size);
	}

});