/**
 * @fileOverview Роутер списка точек
 */

/**
 * Роутер списка точек
 *
 * @class O.proxy.Point
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Point', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'points',

/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Points',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Point,
	needPreload: false
});

// Регистрируем роутер в менеджере модели
O.manager.Model.register(new O.proxy.Point());