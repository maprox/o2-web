<?php
/*

	Hello, %firstname%.

	The new tender has been created at %product%. To participate in the tender
	follow [this link] and specify your price for the goods / services of
	the tender.

	  Start date: 2012-08-14 17:00
	  End date: 2012-08-16 18:00

	  [TABLE]

		If you have any questions about participating in a tender,
		please read [this page] of the documentation.

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('New tender', $locale);

$helpTenderAnswer = $vars->docsLink .
	'userguide/panel-desktop/tender.html#tender';

$user = $this->params['user'];
$tender = $this->params['tender'];
$tenderLink = $this->hostLink . '/#pricesresponse/id_request:' . $tender['id'];

$tender_sdt = $tender['sdt'];
$tender_edt = $tender['edt'];

// ====================================================================
//
// HEADER
//
echo $this->render('header.tpl');
//
//
// ====================================================================

echo $this->emailGreeting($user->get('firstname'));

echo $this->emailParagraph(
	sprintf($zt->_('The new tender has been created at %s', $locale) . '. ',
		$zt->_($vars->product, $locale)) .
	$this->emailLink($zt->_('To participate in the tender ' .
		'follow %sthis link%s and specify your price for the ' .
		'goods / services of the tender', $locale) . '.', $tenderLink)
);

if ($this->format == 'html') {
	echo '<div style="
			padding:0 16px;
			border:1px solid #eee;
			background:#f6f6f6;
		">';
}

echo $this->emailParagraph(
	$zt->_('Start date', $locale) . ': ' .
		$this->emailFontStyle($tender_sdt, array('bold')) .
	$this->emailEOL() .
	$zt->_('End date', $locale) . ': ' .
		$this->emailFontStyle($tender_edt, array('bold'))
);

if ($this->format == 'html'): ?>

<div style="margin:20px 4px">
<table border="0" cellspacing="0" cellpadding="0" style="
	width:100%;
	font-size:90%;
	text-align:left;
">
	<tr>
		<th style="padding:0 10px">Артикул</th>
		<th style="padding:0 0 0 4px">Наименование</th>
		<th style="padding:0 0 0 4px">Кол-во</th>
		<th style="padding:0 0 0 4px">Ед. изм</th>
	</tr>
	<?php foreach ($tender['data'] as $warehouse): ?>
	<tr>
		<td colspan="4">&nbsp;</td>
	</tr>
	<tr>
		<th colspan="4" style="padding:10px;background:#aaa">
			<?php echo $warehouse['name'] .
					' (' . $warehouse['address'] . ')'; ?>
		</th>
	</tr>
	<?php foreach ($warehouse['data'] as $item): ?>
	<tr>
		<td style="border-bottom:1px solid #aaa;padding:2px 2px 2px 10px;">
			<?php echo $this->escape($item['article']); ?>
		</td>
		<td style="border-bottom:1px solid #aaa;padding:2px;">
			<?php echo $this->escape($item['product_name']); ?>
		</td>
		<td style="border-bottom:1px solid #aaa;padding:2px;">
			<?php echo $this->escape($item['amount']); ?>
		</td>
		<td style="border-bottom:1px solid #aaa;padding:2px;">
			<?php echo $this->escape($item['measure']); ?>
		</td>
	</tr>
	<?php endforeach; ?>
	<?php endforeach; ?>

</table>
</div>

<?php endif;
if ($this->format == 'html') {
	echo '</div>';
}

echo $this->emailEOL();
echo $this->emailInline(
	$this->emailLink($zt->_('If you have any questions about ' .
		'participating in a tender, please read %sthis page%s of ' .
		'the documentation', $locale) . '.',
		$helpTenderAnswer)
);

// ====================================================================
//
// FOOTER
//
echo $this->render('footer.tpl');
//
//
// ====================================================================

?>
