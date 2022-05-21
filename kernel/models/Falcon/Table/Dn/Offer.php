<?php

/**
 * dn_offer table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_Dn_Offer extends Falcon_Table_Common
{
    /**
     * Last num for firm getting query
     * @var String
     */
    private $sqlLastNum = "
		SELECT MAX(CAST(num AS INTEGER)) AS lastnum
		FROM dn_offer
		WHERE id_firm = ?
	";

    private $sqlExpiredOffers = "
		select o3.id, o3.id_firm, edt from dn_offer o3
		inner join
		(
			select id_firm, max(edt) m from dn_offer o
			where state = 1 and
			current_timestamp - o.edt > interval '{{expired}}'
			and not exists (
				select * from dn_offer o2
				where o2.id_firm = o.id_firm
				and current_timestamp - o2.edt <= interval '{{expired}}'
			)
			group by id_firm
		) expdmax
		on expdmax.id_firm = o3.id_firm
		and o3.edt = expdmax.m
		where not exists (
			select * from x_history
			where entity_table = 'dn_offer'
			and id_entity = o3.id
			and id_operation = {{operation}}
		)
	";

    /**
     * Get last num for firm by identifier
     * @param Integer $firmId Firm identifier
     * @return Mixed[] Result data
     */
    public function queryLastNum($firmId)
    {
        return $this->queryCell($this->sqlLastNum, $firmId);
    }

    /**
     * Return entry for each firm that have expired offer
     * @param String $expired
     * @return type
     */
    public function getExpiredOffers($expired)
    {
        $subst = [
            '{{expired}}' => $expired,
            '{{operation}}' => Falcon_Record_X_History::OPERATION_PROCESS
        ];
        $query = strtr($this->sqlExpiredOffers, $subst);
        return $this->query($query);
    }
}
