<?php

/**
 * Report contoller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */
class ReportsController extends Falcon_Controller_Action
{
    /**
     * Флаг отмены необходимости проверки
     * контроллера на доступность пользователю
     * @var {Boolean}
     */
    protected $_skipAccessCheck = true;

    /**
     * Initialization of the controller
     *//*
	public function init()
	{
		parent::init();
		$this->_skipAccessCheck = true;
	}*/

    /**
     * show
     */
    public function showAction()
    {
        //Check if user logged in
        $auth = Zend_Auth::getInstance();
        if (!$auth->hasIdentity()) {
            $this->_redirect('/');
        }

        $answer = new Falcon_Message();
        $request = $this->getJsonData();

        if (!$request) {
            $answer->error(1, ['No input data']);
            return $this->sendAnswer($answer);
        }

        // Checking access
        $params = (array)$request->params;
        if (isset($params['invoiceid'])) {
            $params['billing_invoice'] = $params['invoiceid'];
            unset($params['invoiceid']);
        }
        if (!$this->checkParams($params)) {
            $answer->error(1, ['Wrong input data']);
            return $this->sendAnswer($answer);
        }

        // соединяемся с JasperServer'ом
        $client = new Falcon_Reports_Loader();
        try {
            $report = $client->requestReport($request);
            $answer->addParam('data', base64_encode($report['body']));
            Falcon_Mapper_X_Report_History::getInstance()->historyAdd($request);
        } catch (Exception $e) {
            // заполнение объекта ответа клиенту данными об ошибке
            $code = 500;
            $params = [];
            $params[] = $e->getMessage();
            if ($e instanceof Falcon_Exception) {
                $code = $e->getCode();
                foreach ($e->getParams() as $param)
                    $params[] = $param;
            }
            $answer->error($code, $params);
        }
        return $this->sendAnswer($answer);
    }

    /**
     * export
     */
    public function exportAction()
    {
        //Check if user logged in
        $auth = Zend_Auth::getInstance();
        if (!$auth->hasIdentity()) {
            $this->_redirect('/');
        }

        $f = new Zend_Filter_StripTags();
        $request = $this->getJsonData();

        if ($request == null) {
            $this->view->errorCode = 1;
            $this->view->errorText = 'No input data.';
            return;
        }

        $params = (array)$request->params;

        // Skip access checking for superadmin
        $user = Falcon_Model_User::getInstance();

        // Set locale
        $t = Zend_Registry::get('translator');
        $locale = $user->getLocale();
        if ($this->getParam('locale')) {
            $locale = $this->getParam('locale');
        }
        $t['zt']->setLocale($locale);

        if (!Falcon_Access::haveAdminRight($user->getId())) {
            // Checking access
            if (!$this->checkParams($params)) {
                return false;
            }
        }

        // Rename billing_invoice param
        if (isset($params['billing_invoice'])) {
            $request->params->invoiceid = $params['billing_invoice'];
            unset ($request->params->billing_invoice);
        }

        // соединяемся с JasperServer'ом
        $client = new Falcon_Reports_Loader();
        try {
            $report = $client->requestReport($request);
            $response = $this->getResponse();
            $response->setHeader('Content-Type', $report['contentType']);
            $name = strtolower(basename($request->report));
            $extension = strtolower($request->format);
            $response->setHeader('Content-Disposition',
                "inline; filename=\"$name.$extension\"");
            $response->appendBody($report['content']);
            $response->sendResponse();
            exit;
        } catch (Exception $e) {
            $this->view->errorCode = $e->getCode();
            $this->view->errorText = $e->getMessage();
        }
    }

    /**
     * Check access to objects passed as report params
     * @param array $ids Ids of objects
     * @param string $alias Alias
     * @return Boolean
     */
    private function checkAccess($ids, $alias)
    {
        $class = 'Falcon_Action_'
            . preg_replace('/^\w|(?<=_)\w/e', 'strtoupper("\\0")', $alias);
        $action = new $class;

        foreach ($ids as $id) {
            if ($id === -1) {
                continue;
            }
            $action->setParams(['id' => $id]);
            $item = $action->doGetItem(false);
            if (!$item->isSuccess()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks report params
     * @param type $prams
     */
    public function checkParams($params)
    {
        // Params to check
        $checkParams = [
            'billing_invoice',
            'x_group_mon_device',
            'mon_device'
        ];

        foreach ($params as $paramName => $paramValue) {
            if (!in_array($paramName, $checkParams)) {
                continue;
            }
            if (empty($paramValue)) {
                continue;
            }
            if (!is_array($paramValue)) {
                $paramValue = [$paramValue];
            }

            if (!$this->checkAccess(
                $paramValue,
                $paramName
            )
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * history
     */
    public function historyAction()
    {
        $this->sendAnswer($this->getHistory());
    }

    /**
     * Get report history
     * @return Falcon_Message
     */
    public function getHistory()
    {
        $reportId = json_decode($this->_getParam('id'));
        $records = Falcon_Mapper_X_Report_History::getInstance()
            ->historyGet($reportId, $this->getUserFirmId());
        return new Falcon_Message($records);
    }

    /**
     * Exports data in xml
     */
    public function downloadXlsAction()
    {
        $request = $this->getJsonData();
        if ($request == null) {
            $this->_redirect('/reports/export');
        }

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $config = Zend_Registry::get('config');

        // ---------------------------
        // filename dancing
        // ---------------------------
        $useragent = $this->getRequest()->getServer('HTTP_USER_AGENT');
        $filename = (isset($request->filename) ?
                $request->filename : 'download') . '.xlsx';

        $response = $this->getResponse();
        $response->setHeader('Content-Disposition',
            'attachment; ' . $this->getFilenameHeader($filename, $useragent));
        // ---------------------------
        $response->setHeader('Content-Type', 'application/vnd.ms-excel');
        $response->setHeader('Content-Transfer-Encoding', 'binary');
        $response->sendResponse();

        include_once 'PHPExcel.php';
        include_once 'PHPExcel/Cell.php';

        // Create new PHPExcel object
        $excel = new PHPExcel();

        // Set properties
        $excel->getProperties()->setCreator($config->variables->copyright);
        if (isset($request->title)) {
            $excel->getProperties()->setTitle($request->title);
        }

        $excel->getDefaultStyle()->getFont()->setName('Arial');
        $excel->getDefaultStyle()->getFont()->setSize(10);

        // Create sheet
        foreach ($request->sheets as $index => $item) {
            if ($index > 0) {
                $excel->createSheet($index);
            }
            $excel->setActiveSheetIndex($index);
            $sheet = $excel->getActiveSheet();
            $sheet->setTitle(isset($item->name) ?
                $item->name : 'Table data');

            // Add data
            $col = $row = 0;
            if (isset($item->header)) {
                $sheet->mergeCells('A1:E1');
                $sheet->setCellValueByColumnAndRow($col, ++$row,
                    $item->header);
                $font = $sheet->getStyle(PHPExcel_Cell::
                    stringFromColumnIndex($col) . $row)->getFont();
                $font->setSize(16);
                $font->setBold(true);
            }
            $row++;
            foreach ((array)$item->columns as $column) {
                $sheet->getColumnDimensionByColumn($col)->setAutosize(true);
                $sheet->getStyle(
                    PHPExcel_Cell::stringFromColumnIndex($col) . $row
                )->getFont()->setBold(true);
                $sheet->setCellValueByColumnAndRow($col++, $row, $column);
            }
            foreach ((array)$item->data as $line) {
                $col = 0;
                $row++;
                foreach ($line as $cell) {
                    $sheet->setCellValueByColumnAndRow($col++, $row, $cell);
                    $sheet->getStyleByColumnAndRow($col, $row)
                        ->getNumberFormat()->setFormatCode('#,##0.00');
                }
            }
            $col = 0;
            if (isset($item->footer)) {
                $sheet->setCellValueByColumnAndRow($col, ++$row,
                    $item->footer);
            }
        }
        $excel->setActiveSheetIndex(0);

        // Save Excel 2007 file
        ob_end_clean();
        $writer = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
        $writer->save('php://output');
        $excel->disconnectWorksheets();
        unset($excel);
        die();
    }

    /**
     * Elma data export
     */
    public function downloadxlselmaAction()
    {
        $config = Zend_Registry::get('config');

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        // ---------------------------
        // filename dancing
        // ---------------------------
        $useragent = $this->getRequest()->getServer('HTTP_USER_AGENT');
        $filename = (isset($request->filename) ?
                $request->filename : 'download') . '.xlsx';
        $filenameHeader = 'filename="' . rawurlencode($filename) . '"';
        if (strpos(strtolower($useragent), 'firefox')) {
            $filenameHeader = 'filename*="utf8\'\'' .
                rawurlencode($filename) . '"';
        }
        if (strpos(strtolower($useragent), 'safari')) {
            $filenameHeader = 'filename="' . $filename . '"';
        }

        $response = $this->getResponse();
        $response->setHeader('Content-Disposition',
            'attachment; ' . $filenameHeader);
        // ---------------------------
        $response->setHeader('Content-Type', 'application/vnd.ms-excel');
        $response->setHeader('Content-Transfer-Encoding', 'binary');
        $response->sendResponse();

        include_once 'PHPExcel.php';
        include_once 'PHPExcel/Cell.php';

        // Create new PHPExcel object
        $excel = new PHPExcel();

        // Set properties
        $excel->getProperties()->setCreator($config->variables->copyright);
        $excel->getDefaultStyle()->getFont()->setName('Arial');
        $excel->getDefaultStyle()->getFont()->setSize(10);

        // Create sheet
        $index = 0;
        $excel->setActiveSheetIndex($index);
        $sheet = $excel->getActiveSheet();

        $sheet->setTitle('List 1');

        // Headers
        $sheet->mergeCells('A1:M1');
        $sheet->setCellValueByColumnAndRow(0, 1, 'Реквизиты');

        $sheet->mergeCells('N1:O1');
        $sheet->setCellValueByColumnAndRow(13, 1, 'Маркетинговое мероприятие');

        $sheet->mergeCells('P1:Z1');
        $sheet->setCellValueByColumnAndRow(15, 1, 'Адрес');

        $sheet->mergeCells('AA1:AH1');
        $sheet->setCellValueByColumnAndRow(26, 1, 'Контакт');

        // Columns
        $columns = [
            'Наименование',
            'Источник',
            'ОПФ',
            'Тип',
            'Статус',
            'Категории',
            'Региональная группа',
            'Отрасль',
            'Ответственный',
            'Сайт',
            'Email',
            'Телефон',
            'О потенциальном клиенте',
            'Название',
            'Ответственный',
            'Страна',
            'Регион',
            'Район',
            'Город',
            'Нас. Пункт',
            'Улица',
            'Дом',
            'Строение',
            'Корпус',
            'Квартира',
            'Индекс',
            'Фамилия',
            'Имя',
            'Отчество',
            'Должность',
            'Email',
            'ICQ',
            'Skype',
            'Телефоны'
        ];

        $user = Falcon_Model_User::getInstance();
        $firmId = $user->getFirmId();
        $firm = new Falcon_Record_X_Firm($firmId, false, false);
        $list = $firm->getActiveClients(true, false);

        foreach ($list as $index => $supplier) {
            $client = $supplier['firm_client'];
            $supplierId = $client['id'];

            // Firm name
            $sheet->setCellValueByColumnAndRow(0, $index + 3,
                $client['company']['name']);

            $firm = new Falcon_Model_Firm($supplierId);
            $firmData = $firm->getFields();

            $users = $firm->getFirmUsers();

            if (count($users)) {
                $user = $users[0];
                $person = (array)$user->get('person');

                // Email
                if (!empty($person['email'])) {
                    $sheet->setCellValueByColumnAndRow(10, $index + 3,
                        $person['email'][0]['address']);
                    $sheet->setCellValueByColumnAndRow(30, $index + 3,
                        $person['email'][0]['address']);
                }

                // Phone
                if (!empty($person['phone'])) {
                    $sheet->setCellValueByColumnAndRow(11, $index + 3,
                        $person['phone'][0]['number']);
                    $sheet->setCellValueByColumnAndRow(33, $index + 3,
                        $person['phone'][0]['number']);
                }

                // Lastname
                if (!empty($person['lastname'])) {
                    $sheet->setCellValueByColumnAndRow(26, $index + 3,
                        $person['lastname']);
                }

                // Firstname
                if (!empty($person['firstname'])) {
                    $sheet->setCellValueByColumnAndRow(27, $index + 3,
                        $person['firstname']);
                }

                // Secondname
                if (!empty($person['secondname'])) {
                    $sheet->setCellValueByColumnAndRow(28, $index + 3,
                        $person['secondname']);
                }

                // Address actual
                if (!empty($firmData['company']['id_address_physical'])) {
                    $address = new Falcon_Record_A_Address([
                        'id_address'
                        => $firmData['company']['id_address_physical'],
                        'id_lang' => 2
                    ]);

                    // Street
                    $street = new Falcon_Record_A_Street([
                        'id_street' => $address->get('id_street'),
                        'id_lang' => 2
                    ]);
                    $sheet->setCellValueByColumnAndRow(20, $index + 3,
                        $street->get('name'));

                    // City
                    $city = new Falcon_Record_A_City([
                        'id_city' => $street->get('id_city'),
                        'id_lang' => 2
                    ]);
                    $sheet->setCellValueByColumnAndRow(18, $index + 3,
                        $city->get('name'));

                    // Country
                    $country = new Falcon_Record_A_Country([
                        'id_country' => $city->get('id_country'),
                        'id_lang' => 2
                    ]);
                    $sheet->setCellValueByColumnAndRow(15, $index + 3,
                        $country->get('name'));

                    // House
                    $sheet->setCellValueByColumnAndRow(21, $index + 3,
                        $address->get('house'));

                    // Flat
                    $sheet->setCellValueByColumnAndRow(24, $index + 3,
                        $address->get('flat'));

                    // Index
                    $sheet->setCellValueByColumnAndRow(25, $index + 3,
                        $address->get('index'));
                }
            }
        }

        foreach ($columns as $index => $column) {
            $sheet->setCellValueByColumnAndRow($index, 2, $column);
            $sheet->getColumnDimensionByColumn($index)->setAutosize(true);
        }

        // Save Excel 2007 file
        ob_end_clean();
        $writer = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
        $writer->save('php://output');
        $excel->disconnectWorksheets();
        unset($excel);
        die();
    }
}
