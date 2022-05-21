/**
 * В случае если нет ни одного модуля, и мы не находимся в админке,
 * перенаправим туда. Скорее всего человеку в биллинг.
 */

if (!window.location.pathname == '/admin/'
	&& !window.location.pathname == '/admin') {

	window.location.pathname = "/admin/";
}
