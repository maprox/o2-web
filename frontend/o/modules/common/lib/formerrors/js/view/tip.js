/**
 *
 * @class O.common.formerrors.Tip
 * @extends Ext.tip.ToolTip
 */
C.define('O.common.formerrors.Tip', {
	extend: 'Ext.tip.QuickTip',
	alias: 'widget.formerrors_tip',

	autoHide: false,
	anchor: 'top',
	mouseOffset: [11, 6],
	closable: true,
	constrainPosition: false,
	cls: 'form-errors-tip',

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Errors list:'),
			tpl: new Ext.XTemplate(
				'<ul class="errors-list">',
					'<tpl for=".">',
						'<li>',
							'<a href="{link}" class="form-field-name">',
								'{label}',
							'</a>',
							'<br/>',
							'{error}',
						'</li>',
					'</tpl>',
				'</ul>'
			)
		});
		this.callParent(arguments);
	}
});
