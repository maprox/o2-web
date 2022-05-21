/**
   @copyright  2012, Maprox LLC <http://maprox.net>

   @author     Alexander Lyapko <sunsay@maprox.net>
   @author     Anton Grinin <agrinin@maprox.net>
   @author     Konstantin Pakshaev <kpakshaev@maprox.net>
*/

/**
 * Service desk priority object
 * @class O.sdesk.model.Priority
 * @extends O.model.Object
 */
C.define('O.sdesk.model.Priority', {
	extend: 'O.model.Object'
});

C.define('Sdesk.Priority', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'position', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'isdefault', type: 'int'},
			{name: 'state', type: 'int'}
		]
	}
});
