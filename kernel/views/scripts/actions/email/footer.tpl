<?php
/*

	This is an email footer mockup.
	It is applied for each email in the system.

 */

	// init variables
	$t = Zend_Registry::get('translator');
	$zt = $t['zt'];
	$vars = (object)$this->variables;
	$prefix = $vars->notifyEmailSubjectPrefix;
	$locale = $this->locale;
	$title = $zt->_($vars->title, $locale);

	echo $this->emailEOL();
	echo sprintf($zt->_('Sincerely, administration of %s', $locale), $title);

if ($this->format == 'html'): ?>
	</td></tr>
	<tr><td style="padding:1.2em;font-size:9pt;color:#666">
		<div style="width:370px;float:right;color:#99a"><?php
echo sprintf($zt->_(
	'If you have any questions or suggestions, feel free ' .
	'to send an email to %s, or %s for a techsupport', $locale), 
	sprintf('<a href="mailto:%1$s" style="color:#99c">%1$s</a>',
		$vars->contactEmail),
	sprintf('<a href="mailto:%1$s" style="color:#99c">%1$s</a>',
		$vars->supportEmail)
);
?></div>
<?php else:
	echo $this->emailEOL();
	echo $this->emailEOL();
	echo "----------------------------------\n";
endif;
		echo $this->emailSpecialSymbol('copy') . ' ';
if ($this->format == 'html')
{
	echo $this->emailLink('%s' . $zt->_($vars->copyright, $locale) . '%s',
		$vars->copyrightUrl, 'text-decoration:none;color:#666');
}
else
{
	echo $zt->_($vars->copyright, $locale);
}
	echo ', 2009' . $this->emailSpecialSymbol('ndash');
	echo date('Y') . '. ';
	echo $this->emailEOL();
	echo $zt->_('All rights reserved', $locale) . '.';
if ($this->format == 'html'): ?>
	</td></tr>
	</table>
</td></tr>
</table>
<?php endif;