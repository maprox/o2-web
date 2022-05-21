/**
 * @fileOverview Abstract map monitoring engine
 */
/**
 * @class C.lib.map.Engine
 */
C.utils.inherit('C.lib.map.Engine', {

/**
	* Packet selection
	* @event selectpacket
	* @param {O.mon.model.Packet} packet
	* @param {Boolean} isLastPacket True if packet is last
	*/

/**
	* Отображение границы контейнера
	* @type Boolean
	* @default false
	*/
	border: false,

	/**
	* Component initialization
	*/
	initComponent: function() {
		// panel configuration
		Ext.apply(this, {
			layout: 'fit',
			firstLoad: true
		});
		this.callParent(arguments);
		this.on({
			afterrender: 'onAfterRender',
			resize: 'onResize',
			scope: this
		});
	},

/**
	* Renders map
	*/
	onAfterRender: function() {
		this.renderMap();
	},

/**
	* Check resize on panel resize
	*/
	onResize: function() {
		this.checkResize();
	}
});
