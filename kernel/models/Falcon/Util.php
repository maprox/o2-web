<?php

class Falcon_Util
{
    /**
     * Transliteration replacement
     * @var Array[]
     */
    private static $translitReplacement = [
        'ru' => [
            'а' => 'a',
            'б' => 'b',
            'в' => 'v',
            'г' => 'g',
            'д' => 'd',
            'е' => 'e',
            'ё' => 'e',
            'ж' => 'zh',
            'з' => 'z',
            'и' => 'i',
            'й' => 'y',
            'к' => 'k',
            'л' => 'l',
            'м' => 'm',
            'н' => 'n',
            'о' => 'o',
            'п' => 'p',
            'р' => 'r',
            'с' => 's',
            'т' => 't',
            'у' => 'u',
            'ф' => 'f',
            'х' => 'h',
            'ц' => 'tc',
            'ч' => 'ch',
            'ш' => 'sh',
            'щ' => 'sch',
            'ъ' => '',
            'ы' => 'i',
            'ь' => '',
            'э' => 'e',
            'ю' => 'yu',
            'я' => 'ya'
        ]
    ];

    /**
     * Chars to generate hash
     * @var String[]
     */
    private static $genHashSymbols = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd',
        'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'
    ];

    public static function translitProcessRu($match)
    {
        $replacement = self::$translitReplacement['ru'];
        $char = $match[0];
        $upper = false;
        if ($char == mb_strtoupper($char, 'UTF-8')) {
            $upper = true;
            $char = mb_strtolower($char, 'UTF-8');
        }
        if (array_key_exists($char, $replacement)) {
            $char = $replacement[$char];
        }
        if ($upper) {
            $char = ucfirst($char);
        }
        return $char;
    }

    /**
     * Transliteration
     * @param String $str
     * @param String $lang
     * @return String
     */
    public static function translit($str, $lang = 'ru')
    {
        if (array_key_exists($lang, self::$translitReplacement)) {
            $pattern = '/./iu';
            $fn = 'self::translitProcess' . ucfirst($lang);
            try {
                $str = preg_replace_callback($pattern, $fn, $str);
            } catch (Exception $e) {
                vd($e);
            }
            /*$pattern = '/[^\s\da-z-_\.]/ig';
            $str = preg_replace($pattern, '', $str);*/
        }
        return $str;
    }

    /**
     * Generates random string [A-Za-z0-9]
     * @param Integer $length
     * @return string
     */
    public static function randomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyz'
            . 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $randomString;
    }

    /**
     * Generates v4 pseudo-random GUID
     * @return String
     */
    public static function genGuid()
    {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            // 32 bits for "time_low"
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),

            // 16 bits for "time_mid"
            mt_rand(0, 0xffff),

            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 4
            mt_rand(0, 0x0fff) | 0x4000,

            // 16 bits, 8 bits for "clk_seq_hi_res",
            // 8 bits for "clk_seq_low",
            // two most significant bits holds zero and one for variant DCE1.1
            mt_rand(0, 0x3fff) | 0x8000,

            // 48 bits for "node"
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    /**
     * Preparation string to file name
     * @param String $str
     * @return String
     */
    public static function filePrepare($str)
    {
        $pattern = '/\s+/iu';
        $str = preg_replace($pattern, '_', $str);
        $pattern = '/[^\da-z-_]/iu';
        //$pattern = '/[^\da-z-_\.]/ig';
        return preg_replace($pattern, '', $str);
    }

    /**
     * Generate random string
     * @param Integer $length String length
     * @return String
     */
    public static function genHash($length = 16)
    {
        $symbols = self::$genHashSymbols;
        $hash = '';
        for ($i = 0; $i < $length; $i++) {
            $hash .= $symbols[array_rand($symbols)];
        }
        return trim($hash, '_');
    }

    /**
     * Applies a OData $filter to an $sql
     * TODO Make it OOP!
     * Available filters:
     *  - supports only AND
     *  - in
     *  - eq
     *  - ne
     *  - lt
     *  - gt
     * @param string $filter
     * @param Zend_Db_Select $sql
     */
    public static function applyODataFilter($filter, &$sql)
    {
        if (!$filter || !($sql instanceof Zend_Db_Select)) {
            return false;
        }
        // bicycle
        $patterns = [
            'In' => '/\s+IN\s+/i',
            'Eq' => '/\s+EQ\s+/i',
            'Lt' => '/\s+LT\s+/i',
            'Gt' => '/\s+GT\s+/i'
        ];
        // AND
        $andQueries = preg_split('/\s+AND\s+/i', $filter);
        foreach ($andQueries as $query) {
            foreach ($patterns as $key => $pattern) {
                $parts = preg_split($pattern, $query);
                if (count($parts) > 1) {
                    $methodName = 'applyODataFilter_' . $key;
                    self::$methodName($parts, $sql);
                    break;
                }
            }
        }
        return true;
    }

    /**
     * IN FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function applyODataFilter_In($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_Alnum();
        $field = $f_Alnum->filter($parts[0]);
        // filter value
        // remove first and last brackets
        $value = preg_replace(
            ['/^\(/', '/\)$/'],
            ['', ''], $parts[1]);
        // split string into array by commas
        $regex =
            <<<HERE
            			/  "  ( (?:[^"\\\\]++|\\\\.)*+ ) \"
			| '  ( (?:[^'\\\\]++|\\\\.)*+ ) \'
			| \( ( [^)]*                  ) \)
			| [\s,]+
			/x
HERE;

        $values = preg_split($regex, $value, -1,
            PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);

        // add sql where
        $sql->where($field . ' in (?)', $values);
    }

    /**
     * EQ FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function applyODataFilter_Eq($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_Alnum();
        $field = $f_Alnum->filter($parts[0]);
        $value = $parts[1];
        // add sql where
        $sql->where($field . ' = ?', $value);
    }

    /**
     * LT FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function applyODataFilter_Lt($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_Alnum();
        $field = $f_Alnum->filter($parts[0]);
        $value = $parts[1];
        // add sql where
        $sql->where($field . ' < ?', $value);
    }

    /**
     * GT FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function applyODataFilter_Gt($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_Alnum();
        $field = $f_Alnum->filter($parts[0]);
        $value = $parts[1];
        // add sql where
        $sql->where($field . ' > ?', $value);
    }

    /**
     * Returns count of days in month for supplied date.
     * If date is not supplied or null, then current timestamp is used
     * @param string $dt
     */
    public static function getCountOfDaysInMonthForDate($dt = null)
    {
        return (int)date("t", strtotime($dt));
    }
}