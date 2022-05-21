<?php
/**
 * SERVER WORKS Entry point
 *
 * File to which all requests are redirected.
 * Loads the core of the site and starts the application
 *
 * 2009-2012, Maprox LLC
 */
	// current file version
	$obsV = getFileVersionPostfix($this->config);
	$static = 'http://' . $this->config->resources->static;
	$this->headLink()
		->prependStylesheet($static . '/css/common.css?' . $obsV)
	;
?>
<table height="100%" width="100%">
<tr>
<td align="center" valign="middle">
	<div id="container">
		<h1 class="plt"><?php echo $this->code;?></h1>
		<div class="plt">
			<p><?php echo $this->message;?></p>
		</div>
	</div>
</td>
</tr>
</table>