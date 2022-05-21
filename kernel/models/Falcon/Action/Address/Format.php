<?php

/**
 * Formatting class for address library
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Action_Address_Format
{
    /**
     * Массив шаблонов с кратким написанием адреса
     * @var {String[]}
     */
    protected static $templateShort = [
        1 => '"{$data->index}, city {$data->city}, " .
			(preg_match("/\\.|,/ui", $data->street) ?
				Falcon_Action_Address_Format::decapitalize($data->street) :
				"street " . $data->street) .
			", house {$data->house}" .
			($data->flat ? ", " .
				(preg_match("/^[\\s\\d]+$/ui", $data->flat) ?
					"apartment " . $data->flat :
					Falcon_Action_Address_Format::decapitalize($data->flat))
			 : "");',
        2 => '"{$data->index}, г. {$data->city}, " .
			(preg_match("/\\.|,/ui", $data->street) ?
				Falcon_Action_Address_Format::decapitalize($data->street) :
				"ул. " . $data->street) .
			", д. {$data->house}" .
			($data->flat ? ", " .
				(preg_match("/^[\\s\\d]+$/ui", $data->flat) ?
					"кв " . $data->flat :
					Falcon_Action_Address_Format::decapitalize($data->flat))
			 : "");',
    ];

    /**
     * Массив шаблонов с полным написанием адреса
     * @var {String[]}
     */
    protected static $templateFull = [
        1 => '"{$data->index}, city {$data->city}, " .
			(preg_match("/\\.|,/ui", $data->street) ?
				Falcon_Action_Address_Format::decapitalize($data->street) :
				"street " . $data->street) .
			", house {$data->house}" .
			($data->flat ? ", " .
				(preg_match("/^[\\s\\d]+$/ui", $data->flat) ?
					"apartment " . $data->flat :
					Falcon_Action_Address_Format::decapitalize($data->flat))
			 : "");',
        2 => '"{$data->index}, г. {$data->city}, " .
			(preg_match("/\\.|,/ui", $data->street) ?
				Falcon_Action_Address_Format::decapitalize($data->street) :
				"ул. " . $data->street) .
			", д. {$data->house}" .
			($data->flat ? ", " .
				(preg_match("/^[\\s\\d]+$/ui", $data->flat) ?
					"кв " . $data->flat :
					Falcon_Action_Address_Format::decapitalize($data->flat))
			 : "");',
    ];

    /**
     * Превращает данные в краткую форму адреса
     * @param {Object} $data - данные
     * @param {Integer} $idLang - идентификатор языка
     * @return {String}
     */
    public static function short($data, $idLang)
    {
        if (empty(self::$templateShort[$idLang])) {
            throw new Falcon_Action_Address_Exception(
                'Language not yet defined in format templates',
                Falcon_Exception::NOT_IMPLEMENTED);
        }

        eval('$string = ' . self::$templateShort[$idLang]);

        return $string;
    }

    /**
     * Превращает данные в полную форму адреса
     * @param {Object} $data - данные
     * @param {Integer} $idLang - идентификатор языка
     * @return {String}
     */
    public static function full($data, $idLang)
    {
        if (empty(self::$templateFull[$idLang])) {
            throw new Falcon_Action_Address_Exception(
                'Language not yet defined in format templates',
                Falcon_Exception::NOT_IMPLEMENTED);
        }

        eval('$string = ' . self::$templateFull[$idLang]);

        return $string;
    }

    public static function decapitalize($string)
    {
        return preg_replace('/^\s*(\w)(?![[:upper:]])/ue',
            'mb_strtolower("$1", "UTF-8")', $string);
    }
}
