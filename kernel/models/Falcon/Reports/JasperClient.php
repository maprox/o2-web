<?php

/**
 * PHP client for requesting reports from JasperServer via SOAP.
 *
 * USAGE:
 *
 *  $jasper_url = "http://jasper.example.com/jasperserver/services/repository";
 *  $jasper_username = "jasperadmin";
 *  $jasper_password = "topsecret";
 *
 *
 *  $client = new JasperClient($jasper_url, $jasper_username, $jasper_password);
 *
 *  $report_unit = "/my_report";
 *  $report_format = "PDF";
 *  $report_params = array('foo' => 'bar', 'fruit' => 'apple');
 *
 *  $result = $client->requestReport($report_unit, $report_format,$report_params);
 *
 *  header('Content-type: application/pdf');
 *  echo $result;
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */
class Falcon_Reports_JasperClient
{
    private $config;
    private $path;
    private $path_url;
    private $request;

    /**
     * @constructs
     * @param {Array} $initialConfig Initial configuration array
     */
    public function __construct($initialConfig)
    {
        $this->config = $initialConfig;
    }

    /**
     * Report request from JasperServer
     * @param {String} $request Input data:
     *   $request->report Full path to a report
     *   $request->output Export format
     *   $request->params Report parameters
     * @return {String} Report body
     */
    public function requestReport($request)
    {
        $this->request = $request;
        // store path to report files
        $report_hash = md5($request->report . json_encode($request->params));
        $this->path_url = $this->config['files_url'] . $report_hash . '/';
        $this->path = $this->config['files'] . $report_hash . '/';
        // form request header
        $op_xml = "<request operationName='runReport'>";
        $op_xml .= "<argument name='RUN_OUTPUT_FORMAT'>" .
            ($request->format == 'HTMLEmbedded' ? 'HTML' : $request->format) .
            "</argument>";
        $op_xml .= "<resourceDescriptor" .
            " name=''" .
            " wsType='reportUnit'" .
            " uriString='" . $request->report . "'" .
            " isNew='false'>";
        $op_xml .= "<label></label>";

        // add parameters
        if (isset($request->params))
            foreach ($request->params as $name => $value)
                $op_xml .= $this->getParamXml($name, $value);

        // add locale
        if (Zend_Registry::isRegistered('translator')) {
            $t = Zend_Registry::get('translator');
            $op_xml .= $this->getParamXml('REPORT_LOCALE',
                $t['zt']->getLocale());
        }

        $op_xml .= "</resourceDescriptor>";
        $op_xml .= "</request>";

        $client = new SoapClient(null, [
            'location' => $this->config['url'],
            'uri' => 'http://www.jaspersoft.com/namespaces/php',
            'login' => $this->config['username'],
            'password' => $this->config['password'],
            'trace' => 1,
            'exception' => 1,
            'soap_version' => SOAP_1_1,
            'style' => SOAP_RPC,
            'use' => SOAP_LITERAL
        ]);

        $result = [];
        try {
            $response = $client->__soapCall('runReport', [
                new SoapParam($op_xml, "requestXmlString")
            ]);
            $operationResult = $this->getOperationResult($response);
            if ($operationResult['returnCode'] != '0') {
                throw new Exception($operationResult['returnMessage']);
            }
            $result = $this->parseResponse(
                $client->__getLastResponseHeaders(),
                $client->__getLastResponse()
            );
        } catch (SoapFault $E) {
            if ($E->faultstring == 'looks like we got no XML document') {
                $result = $this->parseResponse(
                    $client->__getLastResponseHeaders(),
                    $client->__getLastResponse()
                );
            } else {
                throw $E;
            }
        }
        return $result;
    }

    /**
     * Gets an xml for specified param
     * @param {String} $name Parameter name
     * @param {Mixed} $value Parameter value
     */
    private function getParamXml($name, $value)
    {
        $op_xml = '';
        if (is_object($value)) {
            foreach ($value as $prop => $val) {
                $op_xml .=
                    "<parameter name='{$name}_{$prop}'>" .
                    "<![CDATA[$val]]>" .
                    "</parameter>\n";
            }
        } else {
            if (is_array($value))
                $value = implode(';', $value) . ';';
            $op_xml .=
                "<parameter name='$name'>" .
                "<![CDATA[$value]]>" .
                "</parameter>\n";
        }
        return $op_xml;
    }

    /**
     * Get a part of server answer
     * @param {String} $part MIME-part of answer
     * @return {Array} [contentType, contentId, content]
     */
    private function getPartInfo($part)
    {
        $result = [
            'contentType' => '',
            'contentId' => '',
            'content' => ''
        ];

        // search for content beginning
        $splitter = strpos($part, "\r\n\r\n");
        $header = substr($part, 0, $splitter);

        preg_match('|Content-Id: <(.*?)>|', $header, $matches);
        if (count($matches) < 2) return $result;
        $result['contentId'] = $matches[1];

        preg_match('|Content-Type: ([\w\d\/]*)|', $header, $matches);
        if (count($matches) < 2) return $result;
        $result['contentType'] = $matches[1];

        $result['content'] = substr($part, $splitter + 4);

        return $result;
    }

    /**
     * Функция парсинга данных от сервера.
     * Создаются файлы картинок на диске (если нет) и возвращается
     * тело отчета в требуемом формате
     * @param {String} $headers HTTP заголовок
     * @param {String} $response MIME тело ответа
     * @return {Array} Данные отчета [contentType, contentId, content]
     */
    private function parseResponse($headers, $response)
    {
        preg_match('/boundary="(.*?)"/', $headers, $matches);
        if (count($matches) < 2)
            throw new Exception("Error parsing response (no boundary)");
        $report = "";
        $boundary = $matches[1];
        $parts = explode($boundary, $response);
        foreach ($parts as $part) {
            $partInfo = $this->parsePart($this->getPartInfo($part));
            if ($partInfo['contentId'] == '') continue;
            if ($partInfo['contentId'] == 'report') {
                $report = $partInfo;
            }
            $this->savePart($partInfo);
        }
        return $report;
    }

    /**
     * Получение результата запроса из XML ответа сервера
     * @param {String} $response Ответ сервера в формате XML
     * @return {Array}
     */
    private function getOperationResult($response)
    {
        $domDocument = new DOMDocument();
        $domDocument->loadXML($response);
        $result = [];
        foreach ($domDocument->childNodes AS $node) {
            if ($node->nodeName == "operationResult") {
                foreach ($node->childNodes AS $childNode) {
                    $nodeName = $childNode->nodeName;
                    if ($nodeName == 'returnCode'
                        || $nodeName == 'returnMessage'
                    ) {
                        $result[$nodeName] = $childNode->nodeValue;
                    }
                }
            }
        }
        return $result;
    }

    /**
     * Обработка части ответа от сервера отчетов.
     * В частности обрабатывается HTML, для замены урл-ов картинок
     * и удаления лишних тегов типа <html> или <body>
     * @param {array} $partInfo данные
     * @return {array} Обработанные данные
     */
    protected function parsePart($partInfo)
    {
        if ($partInfo['contentType'] == 'text/html') {
            $html = substr($partInfo['content'], 0, -4);
            // всё что между <body> ... </body>
            $body = '';
            if (preg_match('|<body([^>]*)>\s+(.+)\s+</body>|s', $html, $res))
                $body = $res[2];

            $config = Zend_Registry::get('config');
            // замена пути к картинкам на путь из конфига
            $body = preg_replace(
                '|src="images/(.+)"|',
                'src="' . $this->path_url . '\\1"',
                $body);
            // замена пути к файлу 1x1.gif
            $body = preg_replace(
                '|src="' . $this->path_url . 'px"|',
                'src="' . $config->url->BLANK_IMAGE_URL . '"',
                $body);

            // добавим информацию о страницах отчета
            $pages = preg_split($this->config['rexp_page'], $body);
            $partInfo['pagescount'] = count($pages) - 1;
            foreach ($pages as $i => $page) {
                if ($i > 0) {
                    if (preg_match('|(<table.*</table>)(.*?)|Us', $page, $res)) {
                        if ($res[1] != '') $partInfo['page-' . $i] = $res[1];
                        if ($res[2] != '') $partInfo['page-footer'] = $res[2];
                    }
                } else {
                    $partInfo['page-header'] = $page;
                }
            }

            $partInfo['content'] = $html;
            $partInfo['body'] = $body;
        }
        return $partInfo;
    }

    /**
     * Сохранение части ответа от сервера отчетов на диск
     * @param {array} $partInfo данные
     */
    protected function savePart($partInfo)
    {
        if ($partInfo['contentId'] == 'px') return;
        if ($partInfo['contentType'] == 'text/html') {
            /*
                        if (!is_dir($this->path))
                            mkdir($this->path, 0777, true);
                        $file = fopen($this->path.'page-header.txt', "wb");
                        fwrite($file, $partInfo['page-header']);
                        fclose($file);
                        for ($i = 1; $i <= $partInfo['pagescount']; $i++)
                        {
                            $file = fopen($this->path.'page-'.$i.'.txt', "wb");
                            fwrite($file, $partInfo['page-'.$i]);
                            fclose($file);
                        }
                        $file = fopen($this->path.'page-footer.txt', "wb");
                        fwrite($file, $partInfo['page-footer']);
                        fclose($file);
            */
        } else
            // Исключаем XML, т.к. там еще шняга какая-то передается.
            // Пока исключаем просто вот таким условием (которое ниже), но стоит
            // помнить, что так мы скорее всего не получим отчет, если
            // его запросить в формате XML
            if ($partInfo['contentType'] != 'text/xml') {
                if (!is_dir($this->path))
                    mkdir($this->path, 0777, true);
                $file = fopen($this->path . $partInfo['contentId'], "wb");
                fwrite($file, $partInfo['content']);
                fclose($file);
            }
    }
}