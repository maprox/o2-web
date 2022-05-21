<?php
/*


 */
// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$user = $this->params['user'];
$locale = $this->locale;

// Subject
$this->subject = $zt->_('Monthly detailing', $locale);

// Username
$username = $user->get('firstname');
if ($username && $user->get('secondname')) {
	$username .= ' ' . $user->get('secondname');
}

$title = $zt->_($vars->title, $locale);

// Firm and company
$firm = $this->params['firm'];
$company = $firm['company'];
$companyName = $company['name'];

// Login
$login = $user->get('login');

// Links
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

// Product name
$productName = $zt->_($vars->title, $locale);
//echo $this->emailGreeting($username);

if (isset($this->params['isManager']) && $this->params['isManager']) {
	echo ' ' . $companyName . ' (' . $firm['id'] . ') ';
}
echo $zt->_('Monthly act and detalization has been sent', $locale);

?>
