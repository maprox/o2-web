/**
 * @class O.comp.DetailedReport
 */
C.utils.inherit('O.comp.DetailedReport', {

	initComponent: function() {
		this.callOverridden(arguments);
		//data about stoppings
		this.stoppings = new Ext.util.MixedCollection();
	},

/**
	* Возвращает каких остановок больше: видимых или не видимых
	* return {boolean}
	*/
	getStoppingsState: function() {
		var visible = 0,
			notVisible = 0;
		this.store.each(function(record){
			if (record.isSleep()) {
				if (record.get('visible')) {
					visible++;
				} else {
					notVisible++;
				}
			}
		});

		return {
			visible: (visible > notVisible),
			count: visible + notVisible
		};
	},

/**
	* Загрузка списка треков в грид
	* @param {Object[]} tracks Tracks data
	* return {boolean}
	*/
	loadTracks: function(tracks) {
		this.disable();
		this.store.removeAll();
		this.store.commitChanges();

		// Clear summary data
		this.tracksCounted = 0;
		this.total = {
			odometer: 0,
			odometer_nodata: 0,
			odometer_selected: 0,
			moving: 0,
			still: 0
		};
		this.summaryStore.loadData([this.total]);

		if (tracks.length > 0) {
			var lastTrack = tracks[tracks.length - 1];
			if (lastTrack.type == Mon.Track._SLEEP &&
				lastTrack.track.length == 0) {

				tracks.pop();
			}
		}

		this.store.loadData(tracks);

		//Это нужно для обновления грида - иногда он не обновляется
		this.doLayout();
		this.enable();

		this.fireEvent('dataload', this.getSelectedItems());
	},

	stoppingsToggle: function(on) {
		this.store.each(function(record) {
			if (record.isSleep()) {
				record.set('visible', on);
			}
		});
		this.store.commitChanges();
		this.fireEvent('checkedchange', this.getSelectedItems());
	},

/**
	* Hides all selected items
	*/
	hideAll: function() {
		this.store.each(function(record) {
			record.set('visible', false);
		});
		this.store.commitChanges();
		this.fireEvent('checkedchange', this.getSelectedItems());
	},

/**
	 * Commit item at index
	 * @param index
	 */
	commitItemAt: function(index) {
		var store = this.getStore();
		var record = store.getAt(index);
		record.commit();
	},

/**
	*
	*/
	getSelectedItems: function() {
		var store = this.getStore();
		var result = [];
		store.each(function(item){
			if (item.get('visible')) {
				result.push(item);
			}
		}, this);
		return result;
	}
});
