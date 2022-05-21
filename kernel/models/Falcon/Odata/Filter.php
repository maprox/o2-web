<?php

class Falcon_Odata_Filter
{
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
     *  - like
     * @param string $filter
     * @param Zend_Db_Select $sql
     */
    public static function apply($filter, &$sql)
    {
        if (!$filter || !($sql instanceof Zend_Db_Select)) {
            return false;
        }
        // bicycle
        $patterns = [
            'In' => '/\s+IN\s+/i',
            'Eq' => '/\s+EQ\s+/i',
            'Ne' => '/\s+NE\s+/i',
            'Lt' => '/\s+LT\s+/i',
            'Le' => '/\s+LE\s+/i',
            'Like' => '/\s+LIKE\s+/i',
            'Gt' => '/\s+GT\s+/i',
            'Ge' => '/\s+GE\s+/i'
        ];
        // AND
        $andQueries = preg_split('/\s+AND\s+/i', $filter);
        foreach ($andQueries as $query) {
            foreach ($patterns as $key => $pattern) {
                $parts = preg_split($pattern, $query);
                if (count($parts) > 1) {
                    $methodName = 'apply_' . $key;
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
    public static function apply_In($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_PregReplace('/[^a-z\d\_]/i');
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
        $keys = array_keys($sql->getPart(Zend_Db_Select::FROM));
        $prefix = reset($keys);
        // add sql where
        $sql->where($prefix . '.' . $field . ' in (?)', $values);
    }

    /**
     * Trying to cast value to a number
     * @param string $value
     * @return string|float|int
     */
    public static function toNumber($value)
    {
        if ((string)(int)$value === $value) {
            $value = (int)$value;
        } elseif ((string)(float)$value === $value) {
            $value = (float)$value;
        }
        return $value;
    }

    /**
     * EQ FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function apply_Eq($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_PregReplace('/[^a-z\d\_]/i');
        $field = $f_Alnum->filter($parts[0]);
        $value = self::toNumber($parts[1]);
        // add sql where
        $keys = array_keys($sql->getPart(Zend_Db_Select::FROM));
        $prefix = reset($keys);
        if (strtoupper($value) === 'NULL') {
            $sql->where($prefix . '.' . $field . ' is null');
        } else {
            $sql->where($prefix . '.' . $field . ' = ?', $value);
        }
    }

    /**
     * NE FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function apply_Ne($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_PregReplace('/[^a-z\d\_]/i');
        $field = $f_Alnum->filter($parts[0]);
        $value = self::toNumber($parts[1]);
        // add sql where
        $keys = array_keys($sql->getPart(Zend_Db_Select::FROM));
        $prefix = reset($keys);
        if (strtoupper($value) === 'NULL') {
            $sql->where($prefix . '.' . $field . ' is not null');
        } else {
            $sql->where($prefix . '.' . $field . ' != ?', $value);
        }
    }

    /**
     * LT FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function apply_Lt($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_PregReplace('/[^a-z\d\_]/i');
        $field = $f_Alnum->filter($parts[0]);
        $value = $parts[1];
        // add sql where
        $keys = array_keys($sql->getPart(Zend_Db_Select::FROM));
        $prefix = reset($keys);
        $sql->where($prefix . '.' . $field . ' < ?', $value);
    }

    /**
     * GT FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function apply_Gt($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_PregReplace('/[^a-z\d\_]/i');
        $field = $f_Alnum->filter($parts[0]);
        $value = $parts[1];
        // add sql where
        $keys = array_keys($sql->getPart(Zend_Db_Select::FROM));
        $prefix = reset($keys);
        $sql->where($prefix . '.' . $field . ' > ?', $value);
    }

    /**
     * LE FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function apply_Le($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_PregReplace('/[^a-z\d\_]/i');
        $field = $f_Alnum->filter($parts[0]);
        $value = $parts[1];
        // add sql where
        $keys = array_keys($sql->getPart(Zend_Db_Select::FROM));
        $prefix = reset($keys);
        $sql->where($prefix . '.' . $field . ' <= ?', $value);
    }

    /**
     * GE FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function apply_Ge($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_PregReplace('/[^a-z\d\_]/i');
        $field = $f_Alnum->filter($parts[0]);
        $value = $parts[1];
        // add sql where
        $keys = array_keys($sql->getPart(Zend_Db_Select::FROM));
        $prefix = reset($keys);
        $sql->where($prefix . '.' . $field . ' >= ?', $value);
    }

    /**
     * LIKE FILTER
     * @param array $parts
     * @param Zend_Db_Select $sql
     */
    public static function apply_Like($parts, &$sql)
    {
        $f_Alnum = new Zend_Filter_PregReplace('/[^a-z\d\_]/i');
        $field = $f_Alnum->filter($parts[0]);
        $value = '%' . $parts[1] . '%';
        // add sql where
        $keys = array_keys($sql->getPart(Zend_Db_Select::FROM));
        $prefix = reset($keys);
        $sql->where('upper(' . $prefix . '.' . $field . ') like upper(?)', $value);
    }

}
