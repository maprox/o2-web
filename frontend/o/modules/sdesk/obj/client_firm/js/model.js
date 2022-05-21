/**
   @copyright  2012, Maprox LLC <http://maprox.net>

   @author     Alexander Lyapko <sunsay@maprox.net>
   @author     Anton Grinin <agrinin@maprox.net>
   @author     Konstantin Pakshaev <kpakshaev@maprox.net>
*/

/**
 * Service desk client firm object
 * @class O.sdesk.model.ClientFirm
 * @extends O.model.Object
 */
C.define('O.sdesk.model.ClientFirm', {
	extend: 'O.model.Object'
});

C.define('Sdesk.ClientFirm', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'}
		]
	}
});
