<?php
/**
 * Jumping to webmoney payment
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 * @version    $Id: $
 * @link       $HeadURL: $
*/
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
	<meta http-equiv="Content-Language" content="ru_RU" >
</head>
<body>
	<form action="https://merchant.webmoney.ru/lmi/payment.asp"
		method="post" id="form"
		style="display: none;">
		<input type="hidden" name="LMI_PAYMENT_AMOUNT" value="<?php echo $this->payment['amount'];?>" />
		<input type="hidden" name="LMI_PAYMENT_DESC_BASE64" value="<?php echo base64_encode($this->payment['message']);?>" />
		<input type="hidden" name="LMI_PAYMENT_NO" value="<?php echo $this->payment['id'];?>" />
		<input type="hidden" name="LMI_PAYEE_PURSE" value="<?php echo $this->payment['wallet'];?>" />
		<input type="hidden" name="LMI_SIM_MODE" value="0" />
	</form>
	<script type="text/javascript">
		document.getElementById("form").submit();
	</script>
</body>
</html>
