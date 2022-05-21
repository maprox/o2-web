<?php
/**
 * Authorization page template
 * /auth
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */

	// current file version
	$version = getFileVersionPostfix($this->config);

	$this->headTitle($this->zt->translate('Authorization'));

	$theme = 'default';
	$css = $this->static . '/css/themes/'. $theme .'.auth';
	$this->headLink()
		->prependStylesheet($css . '.' . $this->lang . '.css?' . $version)
		->prependStylesheet($css . '.css?' . $version)
	;

	$this->headScript()
		->appendFile($this->static . '/js/md5.js')
		->appendFile($this->static . '/js/jquery-1.7.min.js')
		->appendFile($this->static . '/js/jquery.ba-hashchange.min.js')
	;

?>

<table height="100%" width="100%">
<tr>
<td align="center" style="vertical-align: middle;">

<!-- no script container -->
<noscript>
	<hr style="border:2px dotted #000"/>
	<?php echo $this->zt->translate(
		'Your browser does not support JavaScript'
	); ?>!
	<hr style="border:2px dotted #000"/>
	<br/>
	<br/>
</noscript>

<div id="container" class="logincontainer">

	<div id="header">
		<!-- Logo -->
		<h1 id="logo"
			class="<?=$this->config->variables->class;?>"><?=
			$this->zt->translate($this->config->variables->title);?></h1>
	</div>

	<!-- The application "window" -->
	<div id="application">

		<div id="secondary">
			<table style="width:100%;height:100%"><tr><td><ul>
				<li class="current"><a href="#login"><?php
					echo $this->zt->translate('Login');
				?></a></li>
				<li><a href="#restore"><?php
					echo $this->zt->translate('Forgot password');
				?></a></li>
			</ul></td></tr></table>
		</div>

		<!-- The content -->
		<div id="content">
		<div class="tab" id="login">

		<form
			id="auth-form"
			name="authForm"
			action="/"
			method="post"
			onsubmit="return submitCall();">

			<div class="section">

				<label for="auth-username"><?php
					echo $this->zt->translate('Username');
				?></label>
				<div><input
					type="text"
					name="username"
					id="auth-username"
					autofocus="autofocus"
					required/></div>

				<label for="auth-password"><?php
					echo $this->zt->translate('Password');
				?></label>
				<div><input
					type="password"
					name="password"
					id="auth-password"
					required/></div>

				<div class="remember">
					<input checked
						type="checkbox"
						name="remember"
						id="remember"/>
					<label for="remember"><?php
						echo $this->zt->translate('Remember me');
					?></label>
				</div>
			</div>

			<div class="password-change section"
				 style="display:none">
				<span class="request-text"><?php
					echo $this->zt->translate(
						'Administrator have requested a password change');
				?></span>

				<label for="auth-new-password"><?php
					echo $this->zt->translate('New password');
				?></label>
				<div><input
					type="text"
					name="new-password"
					id="auth-new-password"/></div>

				<label for="auth-repeat-password"><?php
					echo $this->zt->translate('Repeat password');
				?></label>
				<div><input
					type="text"
					name="repeat-password"
					id="auth-repeat-password"/></div>
			</div>

			<div class="section msg_container" id="msg_login"
				 style="display:none">
				<div class="container">
					<div class="message"></div>
				</div>
			</div>

			<div class="section buttons login" style="text-align:left">
				<div>
					<input
						type="submit"
						class="button big primary"
						id="btnlogin"
						value="<?php
							echo $this->zt->translate('Log in');
						?>"/>
					<input
						type="button"
						class="button big"
						id="btnloginadmin"
						style="display:none"
						value="<?php
							echo $this->zt->translate('Admin');
						?>"/>
				</div>
			</div>

			<input
				type="hidden"
				name="section"
				id="auth-section"
				value="noscript"/>

		</form>
		</div>

		<div class="tab" id="restore" style="display:none">
		<form
			id="restore-form"
			action="#"
			method="post"
			onsubmit="return false;">

			<div class="section">
				<label for="restorelogin"><?php
					echo $this->zt->translate('Username');
				?></label>
				<div><input
					type="text"
					name="restorelogin"
					id="restorelogin"/></div>
			</div>

			<div class="section msg_container" id="msg_restore">
				<div class="container">
					<div class="message"></div>
				</div>
			</div>

			<div class="section buttons restore" style="text-align:left">
				<div>
					<a
						href="/"
						onclick="return false;"
						class="button big primary"
						id="btnrestore"><?php
							echo $this->zt->translate('Restore');
					?></a>
				</div>
			</div>

		</form>
		</div>

		<div class="loader" style="display:none"><?php
			echo $this->zt->translate('Sending request to the server');
		?>...</div>

		</div>
	</div>

<?php if ($this->config->register->enabled): ?>

	<div id="register">
		<a href="<?php echo $this->config->register->url; ?>"><?php
			echo $this->zt->translate('Register');
		?></a>
	</div>

<?php endif; ?>

	<div id="copyright">&copy; <?php
		echo '<a href="' . $this->config->variables->copyrightUrl .
			'" target="_blank">';
		echo $this->zt->translate($this->config->variables->copyright);
		echo '</a>';
		echo ', ' . date('Y') . '.';
		echo ' ' . $this->zt->translate('All rights reserved');
	?>.</div>

</div>

</td>
</tr>
</table>

<script type="text/javascript">

var urlhash = location.hash;
var submitFlag = false;
var isMobile = <?php
	echo ($this->deviceType !== 'mobile') ? 'false' : 'true' ?>;

/**
 * Returns an url param value by its name
 * @param {String} name
 * @return {String}
 */
function getUrlParam(name) {
	var val = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
	if (val === null) {
		return null;
	}
	return decodeURI(val);
}

/**
 * Submit call method
 * @return {Boolean}
 */
function submitCall() {
	return submitFlag;
}

/**
	* Auth data submit
	* @param {String} section
	* @param {Object} params
	*/
function submit(section, params) {
	$('.loader').show();
	$('.buttons.' + section).hide();
	$('#msg_' + section).hide();
	$.ajax({
		type: 'POST',
		url: params.url,
		data: params.data,
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$('.loader').hide();
			$('.buttons.' + section).show();
			if (textStatus === 'timeout') {
				displayError({code: 1}, section);
			} else {
				displayError(textStatus, section);
			}
		},
		success: function(result) {
			$('.loader').hide();
			if (!result.success) {
				if (result.changepass) {
					displayPasswordChange();
				} else {
					displayError(result.errors || result, section);
				}
				$('.buttons.' + section).show();
			} else {
				if (section === 'login') {
					if ($.browser.msie) {
						// IE FIX FORM SUBMIT
						window.external.AutoCompleteSaveForm(authForm);
						//authForm.username.value="";
						//authForm.password.value="";
					}
					if (params.data.new_password) {
						// changing password to the new when changed
						// so browser will remember new password for the login
						$('#auth-password').val(params.data.new_password);
					}
					$('#auth-section').val(params.admin ? 'admin' : 'index');
					$('#auth-form').attr("action", '/' + urlhash);
					// let's submit the form
					submitFlag = true;
					$('#auth-form').submit();
				} else if (section === 'restore') {
					displayMessage("<?php echo $this->zt->translate(
						'Link to reset password has ' .
						'been sent to your E-mail'); ?>", section);
				} else {
					displayMessage('Section is not found', section);
				}
			}
		}
	});
}

/**
 * Changes type of input from "text" to "password" and vice versa
 * @param {HTMLElement} oldObject Html element
 * @param {String} oType Type to convert (text | password)
 * @return {HTMLElement}
 */
function setInputType(oldObject, oType) {
	var newObject = document.createElement('input');
	newObject.type = oType;
	if (oldObject.size) newObject.size = oldObject.size;
	if (oldObject.value) newObject.value = oldObject.value;
	if (oldObject.name) newObject.name = oldObject.name;
	if (oldObject.id) newObject.id = oldObject.id;
	if (oldObject.tabIndex) newObject.tabIndex = oldObject.tabIndex;
	if (oldObject.placeholder) newObject.placeholder = oldObject.placeholder;
	if (oldObject.className) newObject.className = oldObject.className;
	oldObject.parentNode.replaceChild(newObject, oldObject);
	return newObject;
}

/**
 * Displaying fields for new password
 */
function displayPasswordChange() {
	setInputType($('#auth-new-password').get(0), 'password');
	setInputType($('#auth-repeat-password').get(0), 'password');
	$('.password-change').slideDown();
}

/**
 * Submitting the login form.
 * Validate fields before sending request.
 * @param {Boolean} admin Go to administration panel after login if true
 */
function submitRequest(admin) {
	var username = $('#auth-username').val(),
		password = $('#auth-password').val(),
		remember = $('#remember').is(':checked');

	var data = {
		user: username,
		hash: md5(password),
		remember: remember
	};

	if ($('.password-change').is(':visible')) {
		var newPassword = $('#auth-new-password').val(),
			repeatPassword = $('#auth-repeat-password').val();

		if (!newPassword || !repeatPassword) {
			displayError({code: 4055});
			return;
		}

		if (newPassword.length < 6) {
			displayError({code: 4056});
			return;
		}

		if (newPassword != repeatPassword) {
			displayError({code: 4044});
			return;
		}

		if (newPassword == password) {
			displayError({code: 4057});
			return;
		}

		data.new_password = newPassword;
	}

	if (!username || !password) {
		displayError({code: 4041});
		return;
	}

	submit('login', {
		url: "/auth/login",
		admin: admin,
		data: data
	});
}

/**
 * Submitting the login formю
 * Validate fields before sending request.
 * @param {Boolean} admin Go to administration panel after login if true
 */
function submitRestore() {
	var restorelogin = $('#restorelogin').val();
	if (restorelogin) {
		submit('restore', {
			url: "/auth/restore",
			data: {
				login: restorelogin
			}
		});
	} else {
		displayError({code: 4043}, 'restore');
	}
}

// X-Browser isArray(), including Safari
function isArray(obj) {
	return obj.constructor == Array;
}

/**
 * Displays error message
 * @param {String|Object|Array} obj
 * @param {String} Error section
 */
function displayError(obj, section) {
	section = section || 'login'; // defaults to 'msg_login'
	var msgList = {
		0: "<?php echo $this->zt->translate('Unknown error'); ?>",
		1: "<?php echo $this->zt->translate(
			'The request to the server is timed out.<br/>' .
			'Probably there is a network connection problem'
		); ?>",
		415: "<?php echo $this->zt->translate('The user is disabled'); ?>",
		416: "<?php echo $this->zt->translate(
			'You are not allowed to work at this time'
		); ?>",
		<?php echo Falcon_Exception::UNATHORIZED; ?>:
		"<?php echo $this->zt->translate('Authorization error'); ?>",
		<?php echo Falcon_Exception::SESSION_IS_EXPIRED; ?>:
		"<?php echo $this->zt->translate(
			'Your session is expired'
		); ?>",
		<?php echo Falcon_Exception::MULTIPLE_AUTHORIZATION; ?>:
		"<?php echo $this->zt->translate(
			'Under your username are logged in from another computer'
		); echo '. ' . $this->zt->translate("Time") . ': {0}, ' .
				$this->zt->translate("IP address") . ': {1}' ?>",
		<?php echo Falcon_Exception::SCHEDULE_LIMIT; ?>:
		"<?php echo $this->zt->translate(
			'Time expired'
		);
			echo '.<br />';
			echo $this->zt->translate('You can continue to work at');
			echo ' {0}' ?>",
		4040: "<?php echo $this->zt->translate(
				'Login or password is wrong'
		); ?>",
		4041: "<?php echo $this->zt->translate('Both fields are required'); ?>",
		4043: "<?php echo $this->zt->translate('Enter username'); ?>",
		4044: "<?php echo $this->zt->translate(
			'Password confirmation do not match'
		); ?>",
		4046: "<?php echo $this->zt->translate(
			'The E-mail for this login is empty, contact administrator'); ?>",
		4047: "<?php echo $this->zt->translate(
			'There is no user with such login'
		); ?>",
		4051: "<?php echo $this->zt->translate('The firm is disabled'); ?>",
		4052: "<?php echo $this->zt->translate(
			'Your account is temporarily disabled due to non-payment') .
			".<br/>"; ?>"
		+ "<?php echo $this->zt->translate(
			'Please, refill your balance account') . "."; ?>",
		4054: "<?php echo $this->zt->translate(
			'Account is not activated yet'
		); ?>",
		4055: "<?php echo $this->zt->translate(
			'You need to provide a new password and confirmation'
		); ?>",
		4056: "<?php echo $this->zt->translate(
			'Password is too short, it must have at least 6 characters');
		?>",
		4057: "<?php echo $this->zt->translate(
			'New password matches old password'
		); ?>",
		4058: "<?php echo $this->zt->translate('The account has been deleted'); ?>"
	};
	if (typeof(obj) == 'undefined') {
		obj = msgList[0];
	}
	if (isArray(obj)) {
		for (var i = 0; i < obj.length; i++) {
			displayError(obj[i], section);
		}
	} else
	if (typeof(obj) == 'string') {
		$('#msg_' + section).addClass('error');
		$('#msg_' + section + " div.message").html(obj);
		$('#msg_' + section).show();
	} else
	if (typeof(obj) == 'object') {
		var code = obj.code || 0;
		var params = obj.params || [];
		if (isArray(params) && params.length > 0) {
			msgList[code] = params[0];
		}
		var data = null;
		if (obj.data) {
			data = obj.data;
		}
		if (obj.params && obj.params.data) {
			data = obj.params.data;
		}
		if (data) {
			var error = msgList[code];
			jQuery.each(data, function(index, value) {
				decoded = $('<div />').text(value).html()
				error = error.replace("{" + index + "}", decoded);
			});
			msgList[code] = error;
		}
		displayError(msgList[code], section);
	}
}

/**
 * Displays message (not error)
 * @param {String} msg Message text
 * @param {String} section Tab in wich need to display message
 */
function displayMessage(msg, section) {
	section = section || 'login'; // defaults to 'msg_login'
	$('#msg_' + section).removeClass('error');
	$('#msg_' + section + " div.message").html(msg);
	$('#msg_' + section).show();
}

// -----------------------------
/**
 * Initialization
 */
$(function() {

	// Checking if hash allowed
	var isHashAllowed = function(hash) {
		var allowedHashes = ["#login", "#restore"];
		if ($.inArray(hash, allowedHashes) === -1) {
			return false;
		}
		return true;
	}

	// Open tab
	var openTab = function(hash) {
		$(".tab").hide();
		$("#secondary ul li").removeClass("current");
		$("div#secondary ul li a[href=" + hash + "]")
			.parent().addClass("current");
		$(hash).show();
	}

	$("div.msg_container").hide();

	// tabs initialization
	$(".tab").hide();

	var link = $("#secondary ul li.current a").attr("href");

	// Hash change handler
	$(window).hashchange(function() {
		var hash = location.hash;
		if (!isHashAllowed(window.location.hash)) {
			window.location.hash = '#login';
			return;
		}

		openTab(window.location.hash);
	});

	// If url with hash openned
	if (window.location.hash) {
		if (!isHashAllowed(window.location.hash)) {
			window.location.hash = '#login';
		}
		link = window.location.hash;
	}
	openTab(link);

	// handler for tab switching
	$("div#secondary ul li a").click(function() {
		if (!$(this).hasClass("current") &&
		    !$(this).hasClass("disabled") &&
		    !$('.loader').is(':visible')) {
		  $("div#secondary ul li").removeClass("current");
		  $(this).parent().addClass("current");
		  $(".tab").hide();
		  var link = $(this).attr("href");
		  $(link).show();
		}
		window.location.hash = link;
		return false;
	});

	// submit button handler
	$(".button").click(function() {
		if (!$(this).hasClass('disabled')) {
			if ($(this).attr('id') === 'btnrestore') {
				submitRestore();
			} else {
				submitRequest($(this).attr('id') === 'btnloginadmin');
			}
		}
	});

	var logoutReason = getUrlParam('r');
	if (logoutReason && logoutReason !== "null") {
		var error = {code: logoutReason};

		var ip = getUrlParam('ip');
		var dt = getUrlParam('dt');
		var nt = getUrlParam('nt');
		var contactStr = getUrlParam('contact_str');

		if (ip && dt) {
			error.data = [
				$('<div />').text(dt).html(),
				$('<div />').text(ip).html()
			];
		}
		if (nt) {
			error.data = [$('<div />').text(nt).html()];
		}

		if (contactStr) {
			error.data = [contactStr];
		}
		displayError(error);
	}

	if (!isMobile) {
		$('#btnloginadmin').show();
	}
});
</script>
