<?php

/**
 * Class of notification settings
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 * @version    $Id: Answer.php 1277 2011-09-22 13:13:08Z agrinin $
 * @link       $HeadURL: http://vcs.maprox.net/svn/observer/Web/trunk/library/Falcon/Answer.php $
 */
class Falcon_Table_X_Notification_Setting extends Falcon_Table_Common
{
    /*private $sqlLoadWithImportance = "
        SELECT s.id, s.id_type, s.address, s.active,
            array_agg(i.id_importance) as importance
        FROM x_notification_setting AS s
        LEFT JOIN x_notification_setting_importance AS i
            ON s.id = i.id_setting
        WHERE
            s.id_user = ?
            AND s.state = 1
            AND (i.state = 1 OR i.state is NULL)
        GROUP BY
            s.id, s.id_type, s.address, s.active
    ";*/

    /**
     * Load notification settings with importance values checked by user
     * @param {Integer} $userId
     * @return {Integer} $importance Load settings with only given importance
     */
    public function loadWithImportance($userId, $importance = null)
    {
        $params = [$userId];

        if ($importance) {
            if (!is_array($importance)) {
                $importance = [$importance];
            }

            $params = array_merge($params, $importance);
        }

        return $this->query(
            $this->getSqlLoadWithImportance($importance),
            $params
        );
    }

    /**
     * Returns sql for notification settings query
     * @param {Boolean} $importance Adds importance restriction
     */
    protected function getSqlLoadWithImportance($importance = false)
    {
        $sql = "SELECT s.id, s.id_type, st.name as type_name,
			s.address, s.active, array_agg(i.id_importance) as importance
		FROM x_notification_setting AS s
		LEFT JOIN x_notification_setting_importance AS i
			ON s.id = i.id_setting
		LEFT JOIN x_notification_setting_type AS st
			ON st.id = s.id_type
		WHERE
			s.id_user = ?
			AND s.state = 1
			AND (i.state = 1 OR i.state is NULL)";

        if ($importance) {
            $sql .= " AND i.id_importance IN (?)";
        }

        $sql .= " GROUP BY s.id, s.id_type, st.name, s.address, s.active";

        return $sql;
    }
}
