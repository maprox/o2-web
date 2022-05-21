/**
 * OpenLayers patches
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {

		if (C.utils.isset('OpenLayers.Layer.Grid')) {
			/**
			 * removeExcessTitles patch (seen in IE 7)
			 * https://github.com/kikuchan/openlayers/commit/7d17331c23eb6b5d76396a36ab4987637788f60b#diff-0
			 */
			Ext.apply(OpenLayers.Layer.Grid.prototype, {
				/**
				 * Method: removeExcessTiles
				 * When the size of the map or the buffer changes, we may need to
				 *     remove some excess rows and columns.
				 *
				 * Parameters:
				 * rows - {Integer} Maximum number of rows we want our grid to have.
				 * columns - {Integer} Maximum number of columns we want our grid to have.
				 */
				removeExcessTiles: function(rows, columns) {
					// remove extra rows
					while (this.grid.length > rows) {
						var row = this.grid.pop();
						for (var i=0, l=row.length; i<l; i++) {
							var tile = row[i];
							this.removeTileMonitoringHooks(tile);
							tile.destroy();
						}
					}

					// remove extra columns
					for (var i=0, l=this.grid.length; i<l; i++) {
						while (this.grid[i].length > columns) {
							var row = this.grid[i];
							var tile = row.pop();
							this.removeTileMonitoringHooks(tile);
							tile.destroy();
						}
					}
				}
			});
		}

		if (C.utils.isset('OpenLayers.Layer.Bing')) {
			Ext.apply(OpenLayers.Layer.Bing.prototype, {
				/**
				* Method: loadMetadata
				*/
				/*loadMetadata: function() {
					this._callbackId = "_callback_"
						+ this.id.replace(/\./g, "_");
					// link the processMetadata method to the global
					// scope and bind it
					// to this instance
					window[this._callbackId] = OpenLayers.Function.bind(
						OpenLayers.Layer.Bing.processMetadata, this
					);
					var params = OpenLayers.Util.applyDefaults({
						key: this.key,
						jsonp: this._callbackId,
						include: "ImageryProviders"
					}, this.metadataParams);
					var url = STATIC_PATH + "/js/bing/" +
						this.type + ".js?"
						+ OpenLayers.Util.getParameterString(params);
					var script = document.createElement("script");
					script.type = "text/javascript";
					script.src = url;
					script.id = this._callbackId;
					document.getElementsByTagName("head")[0].appendChild(script);
				}*/
			});
		}

	});
}