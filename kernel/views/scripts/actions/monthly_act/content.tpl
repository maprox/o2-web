<?php
/*

	Hello, %username%.

	We send to you your monthly act and detalization of billing at %product%.
	You can find them in attachments.

	Sincerely, administration of %product%

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
	sprintf($zt->_('We send to you your monthly act and ' .
	'detalization of billing at %s', $locale), $title) . '.' .
	$this->emailEOL() .
	$zt->_('You can find them in attachments', $locale) . '.'
);

if (isset($this->params['isManager']) && $this->params['isManager']) {
	echo $this->emailInline(
		$zt->_('Company') . ': ' . $companyName . 
		$this->emailEOL() .
		$zt->_('Identifier') . ': ' . $firm['id']
	);
}

// ====================================================================
//
// FOOTER
//
echo $this->render('footer.tpl');
//
//
// ====================================================================

?>
