<?php

/**
 * Table "mon_sim_card"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Mon_Sim_Card extends Falcon_Table_Common
{

    private $sqlSearch = "
		select sc.id from mon_sim_card sc
		left join x_firm f on f.id = sc.id_client_firm
		left join x_company c on c.id = f.id_company

		left join mon_device_protocol p on p.id = sc.id_device_protocol

		where sc.id_firm = ?
		and LOWER(concat_ws('  ', p.name,
		c.name, sc.account_number,
		sc.phone_number, sc.tariff,
		sc.imei_sim, sc.imei_tracker,
		sc.connection_date, sc.settings_key,
		sc.note, sc.creation_date)) LIKE LOWER(?)
	";

    /**
     * Search over sim card data
     * @return Array Returns array of ids of matched records
     */
    public function search($text, $firmId = null)
    {
        $text = '%' . $text . '%';
        if (!$firmId) {
            $user = Falcon_Model_User::getInstance();
            $firmId = $user->get('id_firm');
        }

        $result = $this->query($this->sqlSearch, [$firmId, $text]);

        $data = [];
        foreach ($result as $item) {
            $data[] = $item['id'];
        }

        return $data;
    }
}