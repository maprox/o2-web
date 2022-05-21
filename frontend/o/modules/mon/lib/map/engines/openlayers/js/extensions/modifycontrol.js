/*
 * Собственный Control для редактирования фигур
 * Добавлен метод getPoints, общий для всех расширений OpenLayers,
 * который возвращает все точки фигуры
 *
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {
		OpenLayers.Control.ModifyControl =
		OpenLayers.Class(OpenLayers.Control.ModifyFeature, {

			/*
			 * Возвращает список нарисованных точек геозоны
			 */
			getPoints: function() {
				return this.vertices;
			},

			CLASS_NAME: "OpenLayers.Control.ModifyControl"
		});
	});
}
