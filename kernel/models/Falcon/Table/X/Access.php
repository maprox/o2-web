<?php

/**
 * Table "x_access"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_X_Access extends Falcon_Table_Common
{
    /**
     * Returns an array of object firms
     * @param Falcon_Record_Abstract $entity
     * @param string $time
     * @return int[]
     */
    public function getObjectSharedFirmIds($entity, $time = null)
    {
        $identifier = $entity->getId();
        $tablename = $entity->getTableName();
        $sdt = $time ? "'" . $time . "'" : 'current_timestamp';
        $records = $this->query('
			--
			-- SHARED via ID_FIRM
			--
			select firmShared.id_firm
			from x_access firmShared
			where firmShared.right = \'' . $tablename . '\'
			  and firmShared.id_object = ' . $identifier . '
			  and firmShared.sdt <= ' . $sdt . '
			  and (firmShared.edt is null or firmShared.edt > ' . $sdt . ')
			  and (firmShared.status = '
            . Falcon_Record_X_Access::STATUS_ACTIVE . ')
			  and coalesce(firmShared.id_firm, 0) != 0
			--
			union
			--
			-- SHARED via ID_FIRM GROUP
			--
			select firmShared.id_firm
			from x_access firmShared
			join x_group_item_link firmSharedGroup
			  on firmSharedGroup.id_item = firmShared.id_object
			 and firmSharedGroup.id_item = ' . $identifier . '
			where firmShared.right = \'x_group_' . $tablename . '\'
			  and firmShared.sdt <= ' . $sdt . '
			  and (firmShared.edt is null or firmShared.edt > ' . $sdt . ')
			  and (firmShared.status = '
            . Falcon_Record_X_Access::STATUS_ACTIVE . ')
			  and coalesce(firmShared.id_firm, 0) != 0
			--
			union
			--
			-- SHARED via ID_USER
			--
			select u.id_firm
			from x_access firmShared
			join x_user u on u.id = firmShared.id_user
			where firmShared.right = \'' . $tablename . '\'
			  and firmShared.id_object = ' . $identifier . '
			  and firmShared.sdt <= ' . $sdt . '
			  and (firmShared.edt is null or firmShared.edt > ' . $sdt . ')
			  and (firmShared.status = '
            . Falcon_Record_X_Access::STATUS_ACTIVE . ')
			--
			union
			--
			-- SHARED via ID_USER GROUP
			--
			select u.id_firm
			from x_access firmShared
			join x_user u on u.id = firmShared.id_user
			join x_group_item_link firmSharedGroup
			  on firmSharedGroup.id_item = firmShared.id_object
			 and firmSharedGroup.id_item = ' . $identifier . '
			where firmShared.right = \'x_group_' . $tablename . '\'
			  and firmShared.sdt <= ' . $sdt . '
			  and (firmShared.edt is null or firmShared.edt > ' . $sdt . ')
			  and (firmShared.status = '
            . Falcon_Record_X_Access::STATUS_ACTIVE . ')
		');
        // make resulting array of firms' identifiers
        $result = [];
        foreach ($records as $record) {
            $result[] = $record['id_firm'];
        }
        return $result;
    }

    /**
     * Returns array of x_access entries for devices ids
     * @param String $alias
     * @param Integer[] $ids
     */
    public function massQueryAccessList($ids, $alias)
    {
        $db = $this->_db;
        $query = $db
            ->select()
            ->from(['xa' => 'x_access'])
            ->joinLeft(['f' => 'x_firm'],
                'xa.id_firm = f.id',
                []
            )
            ->joinLeft(['c' => 'x_company'],
                'c.id = f.id_company',
                ['firm_name' => 'c.name']
            )
            ->where('xa.id_object IN (?)', $ids)
            ->where('xa.right = ?', $alias)
            ->where('xa.auto = ?', 0);
        $rows = $db->query($query);
        $result = $rows->fetchAll();

        return $result;
    }

    /**
     * Get users by object id
     * @param type $entity
     * @param type $time
     * @return type
     */
    public function getUsersByObject($entity, $time = null)
    {
        // If inherited get users for parent entity
        if ($entity instanceof Falcon_Record_Interface_Inherited) {
            $parentClassName = 'Falcon_Record_'
                . ucwords_custom($entity->getParentTableName());
            $entity = new $parentClassName(
                $entity->get($entity::$inheritJoinKey)
            );
        }

        // Additional table name. If specified used in some checks too
        $additionalTableName = null;
        // If need to check access by another entity
        if ($entity::$checkAccessAlias && $entity::$checkAccessField) {
            // Right on original table name will be also checked
            $additionalTableName = $entity->getTableName();

            // Get new entity
            $parentClassName = 'Falcon_Record_'
                . ucwords_custom($entity::$checkAccessAlias);
            $entity = new $parentClassName(
                $entity->get($entity::$checkAccessField)
            );
        }

        $identifier = $entity->getId();
        if (!$identifier) {
            return [];
        }
        $tablename = $entity->getTableName();

        $sdt = $time ? "'" . $time . "'" : 'current_timestamp';

        $groupClassName = 'Falcon_Mapper_' .
            ucwords_custom('X_Group_' . ucwords_custom($tablename));
        $groupExists = class_exists_warn_off($groupClassName);

        $sqlUsersByFirm = new Zend_Db_Select($this->_db);
        $sqlUsersByFirm->from(['t' => $tablename]);
        $firmTable = $entity->getMapper()->addFirmJoin($sqlUsersByFirm);
        $sqlUsersByFirm->join(['xu' => 'x_user'], 'xu.id_firm = ' .
            ($firmTable ? $firmTable : 't') . '.id_firm');
        $sqlUsersByFirm->reset(Zend_Db_Select::COLUMNS);
        $sqlUsersByFirm->columns(['xu.id', 'xu.login']);
        $sqlUsersByFirm->where('t.id = ' . $identifier);
        $sqlUsersByFirm->where("u_user_has_right(xu.id, '" . $tablename . "', 1)");
        $sqlUsersByFirm->where('coalesce(xu.id_firm, 0) != 0');

        $query = "
			--
			-- Objects that shared to user directly
			-- No special rights needed
			--
			select xu.id, xu.login from x_user xu
			join x_access xa on xu.id = xa.id_user
			where xa.id_object = " . $identifier . "
			  and xa.right = '" . $tablename . "'
			  and (xa.sdt <= " . $sdt . ")
			  and (xa.edt > " . $sdt . " or xa.edt IS NULL)
			  and (xa.status = "
            . Falcon_Record_X_Access::STATUS_ACTIVE . ")
			--
			union
			--
			-- Objects that belongs to user's firm
			-- Read right needed
			--
			" . $sqlUsersByFirm . "
			--
			union
			--
			-- Objects that shared to user's firm
			-- view_shared_objects right is needed
			--
			select xu.id, xu.login  from x_user xu
			join x_access xa on xu.id_firm = xa.id_firm
			where xa.id_object = " . $identifier . "
			  and xa.right = '" . $tablename . "'
			  and (xa.sdt <= " . $sdt . ")
			  and (xa.edt > " . $sdt . " or xa.edt IS NULL)
			  and (xa.status = "
            . Falcon_Record_X_Access::STATUS_ACTIVE . ")
			  and coalesce(xu.id_firm, 0) != 0
			  and u_user_has_right(xu.id, 'view_shared_for_firm', 1)
			";

        // If additional table name specified also check right on it
        $extraCondition = '';
        if ($additionalTableName) {
            $extraCondition = "  and u_user_has_right(xu.id, '"
                . $additionalTableName . "', 1)
			";

            $query .= $extraCondition;
        }

        $groupQuery = "--
			union
			--
			-- Groups shared to user or his firm
			--
			select xu.id, xu.login from x_user xu
			join (
				select * from x_access xa
				join x_group_item_link xgil on xa.id_object = xgil.id_group
				where xa.right = 'x_group_" . $tablename . "'
				and (xa.sdt <= " . $sdt . ")
				and (xa.edt > " . $sdt . " or xa.edt IS NULL)
				  and (xa.status = "
            . Falcon_Record_X_Access::STATUS_ACTIVE . ")
				 and xgil.id_item = " . $identifier . "
			) xag on (
				(xag.id_user = xu.id)
				or (
					xag.id_firm = xu.id_firm
					and coalesce(xag.id_firm, 0) != 0
					and u_user_has_right(xu.id, 'view_shared_for_firm', 1)
				)
			)
			join x_group_" . $tablename . " gd on gd.id = xag.id_group
			join " . $tablename . " d on d.id = xag.id_item
			where (
				not exists(
					select * from x_access xai
					where xai.id_object = " . $identifier . "
						and (xai.id_user = xu.id or xai.id_firm = xu.id_firm)
						and (xai.edt <= " . $sdt . " or xai.sdt > " . $sdt . ")
						and (xai.status = "
            . Falcon_Record_X_Access::STATUS_ACTIVE . ")
						and d.id_firm != gd.id_firm
				)

				or exists (
					select * from x_access xa
					join x_group_item_link xgil on xa.id_object = xgil.id_group
					and xgil.id_group != xag.id_group
					where xa.right = 'x_group_" . $tablename . "'
					and (xa.sdt <= " . $sdt . ")
					and (xa.edt > " . $sdt . " or xa.edt IS NULL)
					and (xa.status = "
            . Falcon_Record_X_Access::STATUS_ACTIVE . ")
					and xgil.id_item = " . $identifier . "
					and (xa.id_user = xu.id)
					or (
						xa.id_firm = xu.id_firm
						and coalesce(xa.id_firm, 0) != 0
					)
				)

				or exists (
					select * from x_access xai
					where xai.id_object = " . $identifier . "
					and (xai.id_user = xu.id or xai.id_firm = xu.id_firm)
					and (xai.edt > " . $sdt . " or xai.edt IS NULL)
					and (xai.sdt <= " . $sdt . ")
					and (xai.status = "
            . Falcon_Record_X_Access::STATUS_ACTIVE . ")
					and d.id_firm != gd.id_firm
				)
			)
			$extraCondition
		";

        if ($groupExists) {
            $query .= $groupQuery;
        }

        $records = $this->query($query);
        // make resulting array of users' identifiers
        $result = [];
        foreach ($records as $record) {
            $result[] = $record['id'];
        }

        return $result;
    }

}