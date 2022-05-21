<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 *
 * Utility class for address library
 */
class Falcon_Action_Address_Utils
{
    /**
     * Default system language id
     * @var {Integer}
     */
    const DEFAULT_LANG_ID = 2;

    /**
     * Language ids by user
     * @var {Integer[]}
     */
    protected static $langId = [];

    /**
     * Full list of language ids
     * @var {Integer[]}
     */
    protected static $langList = false;

    /**
     * Old lang ids to new
     * @var {Integer[]}
     */
    protected static $aliasConversion = [
        443 => 2, 444 => 1
    ];

    /**
     * Fetches language id for current user, of for user with given id
     * @param {Integer} $userId
     * @return {Integer}
     */
    public static function getLangId($userId = false)
    {
        // Allways russian
        return self::DEFAULT_LANG_ID;

        if (empty($userId)) {
            $userId = Falcon_Model_User::getInstance()->getId();
        }

        if ($userId <= 0) {
            return self::DEFAULT_LANG_ID;
        }

        if (empty(self::$langId[$userId])) {
            $user = Falcon_Model_User::getInstance();

            $settings = $user->getSettings();

            $record = Falcon_Mapper_X_Lang::getInstance()->
            load(['name = ?' => $settings['p.lng_alias']]);

            if (!empty($record)) {
                self::$langId[$userId] = $record[0]->getId();
            } else {
                self::$langId[$userId] = self::DEFAULT_LANG_ID;
            }
        }

        return self::$langId[$userId];
    }

    /**
     * Fetches language id by its alias
     * @param {String} $alias
     * @return {Integer}
     */
    public static function getLangIdByAlias($alias)
    {
        // Allways russian
        return self::DEFAULT_LANG_ID;

        if (is_numeric($alias)) {
            return self::$aliasConversion[$alias];
        }

        $langList = self::getLangList();
        if (!isset($langList[$alias])) {
            return self::DEFAULT_LANG_ID;
        }

        return $langList[$alias];
    }

    /**
     * Fetches list of language ids
     * @return {Integer[]}
     */
    public static function getLangList()
    {
        if (self::$langList === false) {
            $langs = Falcon_Mapper_X_Lang::getInstance()->load(null, true);
            self::$langList = [];

            foreach ($langs as $lang) {
                self::$langList[$lang['name']] = $lang['id'];
            }
        }

        return self::$langList;
    }
}
