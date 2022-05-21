<?php
/*
	Hello, %username%.

    On %Y-m-d H:i% the balance of your account #%accountnum% (%companyname%) at %product%
    has changed on 500 rub. (payment of invoice #%invoicenum%) and now is 600 rub. (was 100 rub.)

    Sincerely, administration of %product%
*/

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$user = $this->params['user'];
$locale = $this->locale;
$this->subject = $zt->_('Your account balance has been changed', $locale);

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

$dateString = $user->correctDate(date('Y-m-d H:i'), false, 'Y-m-d H:i');

$now->setLocale($locale);
$currentDate = $now->get(
	Zend_Date::DAY . ' ' .
	Zend_Date::MONTH_NAME . ' ' .
	Zend_Date::YEAR
);

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
$accountBalanceLimit = $currency->toCurrency($account['limitvalue']);

// Amount
$amount = $currency->toCurrency($this->params['amount']);

// Balance before changes
$balanceWas = $currency->toCurrency($account['balance'] - $this->params['amount']);

// Invoice num
if (isset($this->params['invoice_num'])) {
	$invoiceNum = $this->params['invoice_num'];
} else {
	$invoiceNum = null;
}

// Note
if (isset($this->params['note'])) {
	$note = $this->params['note'];
} else {
	$note = null;
}

$commentStr = '';
if (!$invoiceNum) {
	$commentStr = '(' .$note . ')';
} else {
	$commentStr = sprintf($zt->_(
		'Invoice #%s',
		$locale
	), $invoiceNum);
}

// Output
echo sprintf($zt->_(
	'The balance has changed on %s and now is %s',
	$locale
), $amount, $accountBalance);
echo '. ' . $commentStr;

?>
