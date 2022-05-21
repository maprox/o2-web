/**
 * @class O.x.act.notification.Tabs
 */
C.utils.inherit('O.x.act.notification.Tabs', {
/**
	 * On action request
	 * @param {String} action
	 * @param {Object} params
	 */
	onActionRequest: function(action, params) {
		if (action == 'typechange') {
			if (params.alias !== null) {
				var tabProps = this.down('#properties');
				if (tabProps) {
					tabProps.setNotificationType(params.alias);
				}
				var tabParams = this.down('#parameters');
				if (tabParams) {
					tabParams.setNotificationType(params.alias);
				}
				var tabActions = this.down('#actions');
				if (tabActions) {
					tabActions.setNotificationType(params.alias);
				}
			}
			return;
		}
	}
});
