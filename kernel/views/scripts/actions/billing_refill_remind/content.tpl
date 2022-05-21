<?php
/*

	Hello, %username%.

	As of 24 march 2012 the balance of your
	account #%accountnum% (%companyname%) at %product% is -2600 rub.
	After 5 days it will be equals to -3100 rub.,
	which is below the threshold of account disabling: -3000 rub.
	Please, go to the tab <Billing> and create an invoice to refill the balance.
	You can also use one of those links for fast invoice creation:

	Issue an invoice:
	  (for a month)    7,800.00
	  (for 3 monthes) 18,200.00
	  (for 6 monthes) 33,800.00
	  (for a year)    65,000.00

		For advanced information about refilling
		an account, visit <this> help page

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$user = $this->params['user'];
$locale = $this->locale;
$this->subject = $zt->_('Please, refill your balance account', $locale);

$username = $user->get('firstname');
if ($username && $user->get('secondname')) {
	$username .= ' ' . $user->get('secondname');
}

$firm = $this->params['firm'];
$company = $firm['company'];
$login = $user->get('login');

$urlTabBilling = $this->hostLink . '/admin/#billing';
$urlHelpPage = 'http://help.maprox.net/';

// get current date
$now = new Zend_Date(date('Y-m-d'));
$now->setLocale($locale);
$currentDate = $now->get(
	Zend_Date::DAY . ' ' .
	Zend_Date::MONTH_NAME . ' ' .
	Zend_Date::YEAR
);
//$currentDate = $currentDate->

$account = $this->params['account'];
$accountNum = $account['num'];
$companyName = $company['name'];
if ($firm['individual']) {
	$companyName = $username;
}
$productName = $zt->_($vars->title, $locale);

// calculate balance values
$currency = new Zend_Currency(array('symbol' => $zt->_('RUR', $locale)),
	$locale);
$accountBalance = $currency->toCurrency($account['balance']);
$accountBalanceAfter = $currency->toCurrency($account['balance_after']);
$accountBalanceLimit = $currency->toCurrency($account['limitvalue']);
$lastWriteOff = $currency->toCurrency(-$account['last_writeoff']);

// calculate days to limit
$daysToLimit = $this->params['balance_limit_days'];
$timeToLimit = sprintf($zt->_(array(
	'%s day', '%s days', $daysToLimit), $locale), $daysToLimit);

// debt
$debt = ($account['balance'] < 0) ? -$account['balance'] : 0;

// ====================================================================
//
// HEADER
//
echo $this->render('header.tpl');
//
//
// ====================================================================

echo $this->emailGreeting($username);
echo $this->emailParagraph(
	sprintf($zt->_(
			'As of %s the balance of your account #%s (%s) at %s is %s',
			$locale
		),
		$currentDate, $accountNum, $companyName,
		$productName, $accountBalance
	) . '. ' .
	(($account['balance_after'] < $account['limitvalue']) ?
	sprintf($zt->_(
			'After %s it will be equal to %s (%s a day), which is below ' .
			'the threshold of account disabling: %s',
			$locale
		),
		$timeToLimit, $accountBalanceAfter,
		$lastWriteOff, $accountBalanceLimit
	)
	:
	sprintf($zt->_('After %s it will be equal to %s (%s a day)', $locale),
		$timeToLimit, $accountBalanceAfter, $lastWriteOff
	)) . '.'
);
echo $this->emailParagraph(
	$this->emailLink($zt->_(
			'Please, go to the tab %sBilling%s and create ' .
			'an invoice to refill the balance',
			$locale
		), $urlTabBilling
	) . '.' .
	(($this->format != 'html') ? '' : ' ' .
		$zt->_('You can also use one of those ' .
			'links for fast invoice creation', $locale) . ':')
);

if ($this->format == 'html'): ?>

<!-- invoice links -->
<table style="padding: 10px;
	border: 1px dashed #ddd;
	background: #fafafa;
	width: 100%;
	text-align:left"
><tr>
	<th colspan="2"><?php
	echo $zt->_('Issue an invoice', $locale);
	if ($debt > 0) {
		echo ' (' . sprintf($zt->_('taking into account debt of %s', $locale),
			$currency->toCurrency($debt)) . ')';
	}
	echo ':';
?></th>
</tr>

<?php
	foreach (array(
		30 => array(
			'text' => 'For a month',
			'discount' => 1
		),
		60 => array(
			'text' => 'For 3 monthes',
			'discount' => 1
		),
		180 => array(
			'text' => 'For 6 monthes',
			'discount' => 1
		),
		360 => array(
			'text' => 'For a year',
			'discount' => 1
		)
	) as $period => $data):
?>
<tr>
	<td width="150"><a href="<?php
		$sum = $debt + -($account['last_writeoff']
			* $period * $data['discount']);
		echo $urlTabBilling . '/issue:'. $sum;
	?>" target="_blank"><?php
		echo $zt->_($data['text'], $locale); ?></a></td>
	<td style="text-align: right"><?php
		echo $currency->toCurrency($sum);
	?></td>
</tr>
<?php
	endforeach;
?>

<tr>
	<th colspan="2"><div style="
		font-size:70%;
		color: #666;
		margin: 10px 0 0;
		padding: 10px 0 0;
		font-weight: normal;
		border-top: 1px dotted #ddd;
	"><?php
	echo sprintf(
		$zt->_('The down payment for a specified period is an estimate, ' .
		'and is calculated based on the last write-off for a day (%s) ' .
		'and the assumption that there is a 30-days month', $locale),
		$lastWriteOff);
	echo '. ';
	echo $zt->_('And so it may differ from the actual expenses for ' .
		'the selected period', $locale) . '.';
?></div></th>
</tr>

</table>
<br/>

<?php endif;
/*
echo $this->emailInline(
	$this->emailLink($zt->_('For advanced information about refilling ' .
		'an account, visit %sthis%s help page', $locale),
		$urlHelpPage)
	. '.'
);
*/
// ====================================================================
//
// FOOTER
//
echo $this->render('footer.tpl');
//
//
// ====================================================================

?>
