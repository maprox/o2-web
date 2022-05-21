<?php
/**
 * Authorization page template
 * /auth/reset
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */

	// current file version
	$version = getFileVersionPostfix($this->config);
	$success = $this->answer->isSuccess();
	$zt = $this->zt;
	$this->headTitle($zt->translate('Password recovery'));

	$theme = 'default';
	$cssname = '/css/themes/'. $theme .'.auth';
	$this->headLink()
		->prependStylesheet($this->static . $cssname . '.' . $this->lang . '.css?' . $version)
		->prependStylesheet($this->static . $cssname . '.css?' . $version)
	;

	$errormessage = '';
	if (!$success)
	{
		echo "<!--\n" . vdv($this->answer->getErrorsList()) . "-->\n";
		$errormessage = $zt->translate(
			'The supplied key for password reset is probably outdated'
		) . ".<br/>\n" . $zt->translate(
			'Try to resend the reset link from password restore form'
		);
	}

?>
<table height="100%" width="100%">
<tr>
<td align="center" valign="middle" style="vertical-align:middle">
	<div id="container">
		<h1 class="plt"><?php
			echo $zt->translate('Password recovery'); ?></h1>
		<div class="plt">
			<br/>
			<p>
			<?php if ($success): ?>
				<?php
					echo $zt->translate(
						'Your password was successfully reset');
				?>.<br/>
				<?php
					echo $zt->translate(
						'A letter with the new password has been sent '.
						'to your email address');
				?>.<br/>
				<?php
					echo $zt->translate('To log in, click below');
				?>:
			<?php else: ?>
				<b><?php
					echo $zt->translate(
						'There was an error during password restore');
				?>:</b>
				<div class="error-container">
					<?php echo $errormessage; ?>
				</div>
			<?php endif; ?>
			</p>
			<?php if ($success): ?>
			<form action="/" method="post">
				<br/>
				<input
					type="submit"
					value="<?php echo $zt->translate('Log in'); ?>"
					class="button primary big">
			</form>
			<?php endif; ?>
		</div>
	</div>
</td>
</tr>
</table>