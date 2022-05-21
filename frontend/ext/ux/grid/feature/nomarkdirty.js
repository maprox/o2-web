/**
 * @class O.feature.NoMarkDirty
 * @extends Ext.grid.feature.Feature
 * Add to grid features, to prevent red triangles from marking dirty data.
 */

Ext.define('O.feature.NoMarkDirty', {
	extend: 'Ext.grid.feature.Feature',
	alias: 'feature.nomarkdirty',
	mutateMetaRowTpl: function(metaRowTpl) {
		metaRowTpl[2] = metaRowTpl[2].replace(/\{\{id\}\-modified\}/, '');
	}
});
