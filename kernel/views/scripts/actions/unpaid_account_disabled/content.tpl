<?php
// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$prefix = $vars->notifyEmailSubjectPrefix;
$locale = $this->locale;
$this->subject = $zt->_('Your firm is temporary disabled', $locale);
$params = json_decode($this->owner->get('params'), true);
$data = $params['data'];
$userData = $data['user'];
$companyData = $data['company'];
$locale = $params['locale'];
// ====================================================================
//
// HEADER
//
echo $this->render('header.tpl');
//
//
// ====================================================================

echo $this->emailGreeting($userData['firstname']);

echo $this->emailParagraph(
	sprintf(
		$zt->_('The firm "%s" is disabled due to non-payment', $locale),
		$companyData['name']
	) . '.'
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
