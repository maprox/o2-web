<?php
/**
 * Jumping to rbkmoney payment
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
	<style>
		html {height:100%;-webkit-font-smoothing:antialiased;border:0;overflow-y:scroll;margin:0;padding:0;}
		body {height:100%;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;border:0;background:#3c5a76 url("/resource/img/status_bg.png") no-repeat center;margin:0;padding:0;}
		#container {width:440px;}
		h1.plt {color:#fff;font-size:30px;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,0.68);letter-spacing:-1px;margin:0;}
		div.plt {color:#243748;font-size:18px;line-height:24px;text-shadow:0 1px 1px rgba(255,255,255,0.33);}
		div.plt a {color:#142738;}
	</style>
	<table height="100%" width="100%" id="splash">
		<tr>
			<td align="center" valign="middle">
				<div id="container">
						<h1 class="plt">Перенаправление</h1>
						<div class="plt">
							<p>Выполняется перенаправление на страницу выполнения платежа...</p>
						</div>
				</div>
			</td>
		</tr>
	</table>
	<form action="https://rbkmoney.ru/acceptpurchase.aspx"
		method="post" id="form"
		style="display: none;">
		<input type="hidden" name="recipientAmount" value="<?php echo $this->payment['amount'];?>" />
		<input type="hidden" name="orderId" value="<?php echo $this->payment['id'];?>" />
		<input type="hidden" name="eshopId" value="<?php echo $this->payment['shopId'];?>" />
		<input type="hidden" name="serviceName" value="<?php echo $this->payment['message'];?>" />
		<input type="hidden" name="recipientCurrency" value="RUR" />
		<input type="hidden" name="preference" value="<?php echo $this->payment['preference'];?>" />
		<input type="hidden" name="successUrl" value="<?php echo $this->serverUrl();?>/admin#billing" />
		<input type="hidden" name="failUrl" value="<?php echo $this->serverUrl();?>/admin#billing" />
		<input type="hidden" name="userField_1" value="<?php echo $this->payment['userId'];?>" />
		<?php if ($this->payment['email']) { ?>
			<input type="hidden" name="user_email" value="<?php echo $this->payment['email'];?>" />
		<?php } ?>
	</form>
	<script type="text/javascript">
		function createCookie(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		}

		function readCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return '';
		}

		function parseGet(name) {
			name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			var regexS = "[\\?&]"+name+"=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(window.location.href);
			if(results == null) {
				return "";
			}
			return results[1];
		}

		var uid = parseGet('uid'),
			cookie = readCookie('used_uid'),
			used = cookie.split(',');

		var send = true;

		for (key in used) {
			if (used[key] == uid) {
				// Соблюдение условий после document.location.href выглядит забавно,
				// Но иногда он услает отправить форму до того как вернется в биллинг
				document.location.href = '/admin#billing';
				send = false;
				break;
			}
		}

		if (send) {
			used.push(uid);

			createCookie('used_uid', used.join(','), 3);

			document.getElementById("form").submit();
		}
	</script>
</body>
</html>
