/**
 * Worker posts list
 * @class O.dn.act.worker_post.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.dn.act.worker_post.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.dn-worker-post',

	model: 'Dn.WorkerPost',
	managerAlias: 'dn_worker_post',
	tabsAliases: [
		'dn-worker-post-tab-props'
	]
});