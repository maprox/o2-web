C.define('O.mon.trackhistory.TrackStore', {
	extend: 'Ext.data.Store',
	model: 'O.mon.trackhistory.TrackModel',
	groupDir: 'ASC',
	groupField: 'date',
	sorters: 'sdt',
	proxy: {
		type: 'memory'
	}
});
