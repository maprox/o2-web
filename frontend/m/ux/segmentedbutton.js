/**
 * @class Ext.SegmentedButton
 */
C.utils.inherit('Ext.SegmentedButton', {

	/**
	 * Sets all contained buttons to be pressed
 	 */
	pressAll: function() {
		this.setPressedButtons(this.getItems().getRange());
	},

	/**
	 * Sets all contained buttons to be pressed
	 */
	unpressAll: function() {
		this.setPressedButtons([]);
	}
});