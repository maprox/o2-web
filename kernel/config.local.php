<?php

// Path to the root of the site
$root = dirname(dirname(__FILE__)) . '/';

// Local config array, will overwrite global config
// For more information, see config.dev.php
$local_config = [
    // кеширование
    'cache' => [
        // тип: memcache, files
        'type' => 'memcache',
        'enabled' => true
    ],
    'cache_pipe' => [
        'type' => 'files'
    ],
    'register' => [
        'enabled' => true,
        'url' => getenv('REGISTER_URL')
    ],
    // Debug flag
    'debug' => false,
    'migrate' => [
        'newauth' => true,
        'newnotify' => true
    ],
    'analytics' => [
        'header' => ["

<!-- Google analytics -->
<script type='text/javascript'>

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', '" . getenv('GA_ACCOUNT') . "']);
  _gaq.push(['_setDomainName', '" . getenv('GA_DOMAIN') . "']);
  _gaq.push(['_trackPageview']);

  (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
          ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>

          "],
        'footer' => ['
        <!-- Yandex.Metrika counter --><script type="text/javascript">(function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter' . getenv('YM_ID') . ' = new Ya.Metrika({id:' . getenv('YM_ID') . ', webvisor:true, clickmap:true, trackHash:true, ut:"noindex"}); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks");</script><noscript><div><img src="//mc.yandex.ru/watch/22669048?ut=noindex" style="position:absolute; left:-9999px;" alt="" /></div></noscript><!-- /Yandex.Metrika counter -->
        ']
    ],
    'elma' => [
        'registration' => [
            'username' => 'maprox.observer',
            'password' => '12345',
            'token' => '312b5698-0d41-4bac-9127-056021901e12'
        ]
    ],
    'partners' => [
        'linkomm' => [
            // Payment configuration
            'payment' => [
                'message' => [
                    'ru' => 'Пополнение баланса в системе Линком / Мониторинг транспорта, счет №%d',
                    'en' => 'Account refill, invoice #%d'
                ],
                'rbkmoney' => [
                    'shopId' => '2024891',
                    'wallet' => 'RU571647063',
                    'secretKey' => 'FOEev5iY51iTsSeo'
                ]
            ]
        ]
    ]
];