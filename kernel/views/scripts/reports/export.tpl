<?php
/**
 * Export error template /export
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */

	// link to configuration array
	$c = $this->config;

	// current file version
	$obsV = getFileVersionPostfix($c);
	$extV = getExtVersionPostfix($c);
	$touchV = getTouchVersionPostfix($c);

	$this->headLink()->prependStylesheet(
		$this->static . '/css/common.css?' . $obsV)
	;

?>
<body>
<table height="100%" width="100%">
<tr>
<td align="center" valign="middle">
	<div id="container">
		<h1 class="plt"><?php
			echo $this->zt->_('Error during exporting the report.');
		?></h1>
		<div class="plt">
			<p><?php echo $this->errorText; ?></p>
		</div>
	</div>
</td>
</tr>
</table>
</body>