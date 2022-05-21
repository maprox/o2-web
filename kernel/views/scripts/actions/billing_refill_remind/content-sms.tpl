<?php
/*



*/

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;

$user = $this->params['user'];
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

$account = $this->params['account'];
$accountNum = $account['num'];
$companyName = $company['name'];
$productName = $zt->_($vars->title);

// calculate balance values
$currency = new Zend_Currency(array('symbol' => $zt->_('RUR', $locale)), $locale);
$accountBalance = $currency->toCurrency($account['balance']);
$accountBalanceAfter = $currency->toCurrency($account['balance_after']);
$accountBalanceLimit = $currency->toCurrency($account['limitvalue']);

// calculate days to limit
$daysToLimit = $this->params['balance_limit_days'];
$timeToLimit = sprintf($zt->_(array(
	'%s day', '%s days', $daysToLimit)), $daysToLimit);

// debt
$debt = ($account['balance'] < 0) ? -$account['balance'] : 0;

// text
echo sprintf($zt->_('Refill your account. After %s it will be equal to %s', $locale),
	$timeToLimit, $accountBalanceAfter
);
