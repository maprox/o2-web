/**
 */
/**
 * Model for OpenLayers layer
 */
C.define('C.model.OpenLayersLayer', {
	extend: 'Ext.data.Model',

	config: {
		fields: ['id', 'name', 'visibility', 'zindex']
	}
});
