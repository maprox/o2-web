/**
   @copyright  2012, Maprox LLC <http://maprox.net>

   @author     Alexander Lyapko <sunsay@maprox.net>
   @author     Anton Grinin <agrinin@maprox.net>
   @author     Konstantin Pakshaev <kpakshaev@maprox.net>
*/

/**
 * Service desk service object
 * @class O.sdesk.model.Service
 * @extends O.model.Object
 */
C.define('O.sdesk.model.Service', {
	extend: 'O.model.Object'
});

C.define('Sdesk.Service', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'description', type: 'string'},
			{name: 'state', type: 'int'}
		]
	}
});
