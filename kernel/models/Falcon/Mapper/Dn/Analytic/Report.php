<?php

/**
 * Class of "dn_analytic_report" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Analytic_Report extends Falcon_Mapper_Common
{
    /**
     * Collects data array for frontend
     * @param int $firmId
     * @param array $params
     * @return array
     */
    public function collectData($firmId, $params)
    {
        $mapper = Falcon_Mapper_Dn_Offer::getInstance();
        $db = $this->getTable()->getAdapter();
        $offers = $mapper->loadBy(function ($sql) use ($firmId, $params, $db) {
            $sql
                ->join(
                    ['acc' => 'x_access'],
                    'acc.right = \'dn_offer\' and acc.id_firm = ' . $firmId .
                    ' and acc.id_object = t.id'
                    . ' and acc.status = '
                    . Falcon_Record_X_Access::STATUS_ACTIVE
                    ,
                    []
                )
                ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
            $sdt = isset($params['period_sdt']) ? $params['period_sdt'] : null;
            $edt = isset($params['period_edt']) ? $params['period_edt'] : null;
            $i = '';
            if ($sdt) {
                $i .= ' and ' . $db->quoteInto('o2.sdt >= ?', $sdt);
            }
            if ($edt) {
                $i .= ' and ' . $db->quoteInto('o2.sdt < ?', $edt);
            }
            $sql
                ->where('t.sdt = (select max(sdt) from dn_offer o2
					where o2.id_firm = t.id_firm ' . $i . ' and o2.state = ?)',
                    Falcon_Record_Abstract::STATE_ACTIVE);
        }, [
            'fields' => [
                'id',
                'id_firm'
            ]
        ]);
        $datamapper = Falcon_Mapper_Dn_Offer_Value::getInstance();
        foreach ($offers as $key => $offer) {
            $offerdata = $datamapper->loadBy(function ($sql) use ($offer) {
                $sql
                    ->where('id_offer = ?', $offer['id'])
                    ->where('price != ?', 0)
                    ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
            }, [
                'fields' => [
                    'id_warehouse',
                    'id_region',
                    'id_product',
                    'price'
                ]
            ]);
            $offers[$key]['data'] = $offerdata;
        }
        return $offers;
    }

    /**
     * Collects tender data for consolidated report
     * @param int $tenderId
     * @return array
     */
    public function getTenderData($tenderId)
    {
        if (!$tenderId) {
            return;
        }
        $mapper = Falcon_Mapper_Dn_Response::getInstance();
        $responses = $mapper->loadBy(function ($sql) use ($tenderId) {
            $sql
                ->where('id_request = ?', $tenderId)
                ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
                ->where('status = ?', 3) // SENDED
            ;
        }, [
            'fields' => [
                'id',
                'id_firm'
            ]
        ]);
        $datamapper = Falcon_Mapper_Dn_Response_Value::getInstance();
        foreach ($responses as $key => $response) {
            $data = $datamapper->loadBy(function ($sql) use ($response) {
                $sql
                    ->join(
                        ['reqv' => 'dn_request_value'],
                        'reqv.id = t.id_request_value',
                        [
                            'id_warehouse' => 'reqv.id_place',
                            'reqv.id_product',
                            'reqv.amount'
                        ]
                    )
                    ->where('t.id_response = ?', $response['id'])
                    ->where('t.price != ?', 0)
                    ->where('t.state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
            }, ['fields' => ['price']]);
            $responses[$key]['data'] = $data;
        }
        // join all tender lines to show unanswered positions
        $reqmapper = Falcon_Mapper_Dn_Request::getInstance();
        $responses[] = [
            'data' => $reqmapper->loadBy(function ($sql) use ($tenderId) {
                $sql
                    ->join(
                        ['rv' => 'dn_request_value'],
                        'rv.id_request = t.id and rv.amount > 0',
                        [
                            'id_warehouse' => 'rv.id_place',
                            'rv.id_product',
                            'rv.amount'
                        ]
                    )
                    ->where('t.id = ?', $tenderId);
            }, ['fields' => []])
        ];
        return $responses;
    }
}