<?php
// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$prefix = $vars->notifyEmailSubjectPrefix;
$locale = $this->locale;
$this->subject = $zt->_('New device has been shared for you', $locale);
$params = json_decode($this->owner->get('params'), true);
$data = $params['data'];

// ====================================================================
//
// HEADER
//
echo $this->render('header.tpl');
//
//
// ====================================================================

echo $this->emailGreeting($data['user_data']['firstname']);
echo $this->emailParagraph(
	sprintf(
		$zt->_('User %s has shared a device "%s" for you', $locale),
		$data['owner_data']['shortname'], $data['object_data']['name']
	) . '.'
);

$accessText = sprintf(
	$zt->_('You can access it from %s', $locale),
	$data['sdt']
);

if ($data['edt']) {
	$accessText .= ' ' . sprintf($zt->_('till %s', $locale), $data['edt']);
}

$accessText .= '.';
echo $this->emailParagraph(
	$accessText
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
