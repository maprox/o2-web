/**
 * @fileOverview Роутер преобразований
 */

/**
 * Роутер преобразований
 *
 * @class O.proxy.Conversion
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Conversion', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'conversions',

/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Conversions',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Conversion,
	needPreload: false
});

// Регистрируем роутер в менеджере модели
O.manager.Model.register(new O.proxy.Conversion());