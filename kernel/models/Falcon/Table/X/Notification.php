<?php

/**
 * Table "x_notification"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_X_Notification extends Falcon_Table_Common
{
    /**
     * Loads notifications by device id
     * @param int $deviceId
     * @param string $time [Opt.] defaults to current_timestamp
     * @return array
     */
    public function loadByDevice($deviceId, $time = null)
    {
        return $this->loadBy(function ($sql) use ($deviceId, $time) {
            $ACTIVE = Falcon_Record_Abstract::STATE_ACTIVE;
            $sdt = $time ? "'" . $time . "'" : 'current_timestamp';
            $sql
                ->distinct()
                // check as direct param
                ->joinLeft(
                    ['np' => 'x_notification_param'],
                    'np.id_notification = t.id
						and (np.state = ' . $ACTIVE . ')
						and (np.name = \'mon_device\')
						and (np.value = ' . $deviceId . '::text)',
                    []
                )
                // check as param in mon_device group
                ->joinLeft(
                    ['npg' => 'x_notification_param'],
                    'npg.id_notification = t.id
						and (npg.state = ' . $ACTIVE . ')
						and (npg.name = \'x_group_mon_device\')',
                    []
                )
                ->joinLeft(
                    ['gl' => 'x_group_item_link'],
                    'gl.id_group::text = npg.value
						and (gl.id_item = ' . $deviceId . ')',
                    []
                )
                // check shared devices (time is used if supplied)
                ->where('t.state = ?', $ACTIVE)
                ->where('
					(
					  (
						(
						  (np.value is not null)
						  or
						  (gl.id_item is not null)
						)
						and
						(
						  (
							t.id_firm = (
							  select id_firm from mon_device
							  where id = coalesce(np.value::int, gl.id_item)
							)
						  )
						  or
						  exists (
							select * from x_access a
							left join x_user u on u.id = a.id_user
							 and u.id_firm = t.id_firm
							 and exists (
							   select * from x_history h
							   where h.entity_table = \'x_notification\'
								 and h.id_entity = t.id
								 and h.id_operation = 1
								 and h.id_user = u.id)
							where a.right = \'mon_device\'
							  and a.id_object = ' . $deviceId . '
							  and a.sdt <= ' . $sdt . '
							  and (a.edt is null or a.edt > ' . $sdt . ')
							  and (a.status = '
                    . Falcon_Record_X_Access::STATUS_ACTIVE . ')
							  and (a.id_firm = t.id_firm
								or u.id is not null)
						  )
						)
					  )
					  or ' .
                    // --------------------------------------------------
                    // check notifications with "ALL" devices selected
                    // --------------------------------------------------
                    '
					  (
						(npg.value = \'-1\') -- ALL
						and
						(
						  exists (
							select * from mon_device d
							where d.id = ' . $deviceId . '
							  and d.id_firm = t.id_firm
						  )
						  or
						  exists (
							select * from x_access a
							left join x_user u on u.id = a.id_user
							 and u.id_firm = t.id_firm
							 and exists (
							   select * from x_history h
							   where h.entity_table = \'x_notification\'
								 and h.id_entity = t.id
								 and h.id_operation = 1
								 and h.id_user = u.id)
							where a.right = \'mon_device\'
							  and a.id_object = ' . $deviceId . '
							  and a.sdt <= ' . $sdt . '
							  and (a.edt is null or a.edt > ' . $sdt . ')
							  and (a.status = '
                    . Falcon_Record_X_Access::STATUS_ACTIVE . ')
							  and (a.id_firm = t.id_firm
								or u.id is not null)
						  )
						)
					  )
					)
				');
        });
    }

    /**
     * Returns notification param identifiers
     * @param int $notificationId Notification identifier
     * @param string $entity_tablename
     * @param string $time [Opt.] defaults to current_timestamp
     */
    public function getNotificationParamIds($notificationId,
                                            $param_tablename, $time = null)
    {
        $ACTIVE = Falcon_Record_Abstract::STATE_ACTIVE;
        $sdt = $time ? "'" . $time . "'" : 'current_timestamp';
        $records = $this->query('
			select g.id from ' . $param_tablename . ' g
			join x_notification t on t.id = ' . $notificationId . '
			left join x_notification_param np on np.id_notification = t.id
			 and np.name = \'' . $param_tablename . '\'
			 and np.value = g.id::text
			 and np.state = ' . $ACTIVE . '
			left join x_notification_param npg on npg.id_notification = t.id
			 and npg.name = \'x_group_' . $param_tablename . '\'
			 and npg.state = ' . $ACTIVE . '
			left join x_group_item_link gl on gl.id_group::text = npg.value
			 and gl.id_item = g.id
			where g.state = ' . $ACTIVE . '
			  and
			  (
				(
				  (
					(np.value is not null)
					or
					(gl.id_item is not null)
				  )
				  and
				  (
					(
					  t.id_firm = (
					    select id_firm from ' . $param_tablename . '
					    where id = coalesce(np.value::int, gl.id_item))
					)
					or
					exists (
					  select * from x_access a
					  left join x_user u on u.id = a.id_user
					   and u.id_firm = t.id_firm
					   and exists (
						 select * from x_history h
						 where h.entity_table = \'x_notification\'
						   and h.id_entity = t.id
						   and h.id_operation = 1
						   and h.id_user = u.id)
					  where a.right = \'' . $param_tablename . '\'
						and a.id_object = g.id
						and a.sdt <= ' . $sdt . '
						and (a.edt is null or a.edt > ' . $sdt . ')
						and (a.status = '
            . Falcon_Record_X_Access::STATUS_ACTIVE . ')
						and (a.id_firm = t.id_firm
						  or u.id is not null)
					)
				  )
				)
				or
				(
				  (npg.value = \'-1\') -- ALL
				  and
				  (
					exists (
					  select * from ' . $param_tablename . ' d
					  where d.id = g.id
						and d.id_firm = t.id_firm
					)
					or
					exists (
					  select * from x_access a
					  left join x_user u on u.id = a.id_user
					   and u.id_firm = t.id_firm
					  where a.right = \'' . $param_tablename . '\'
						and a.id_object = g.id
						and a.sdt <= ' . $sdt . '
						and (a.edt is null or a.edt > ' . $sdt . ')
						and (a.status = '
            . Falcon_Record_X_Access::STATUS_ACTIVE . ')
						and (a.id_firm = t.id_firm
						  or u.id is not null)
					)
				  )
				)
			  )
		');
        // make resulting array of firms' identifiers
        $result = [];
        foreach ($records as $record) {
            $result[] = $record['id'];
        }
        return $result;
    }
}