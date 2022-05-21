<?php

/**
 * Table "mon_waylist_route" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Waylist_Route extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_waylist',
        'num',
        'id_company_disposal',
        'id_point',
        'time_way',
        'time_stay',
        'distance',
        'actual_distance',
        'enter_dt',
        'exit_dt',
        'state'
    ];

    /**
     * Required fields (not null)
     * @var String[]
     */
    public static $requiredFields = [
        'id_waylist',
        'num'
    ];

    /**
     * Params for converting id to string representation
     */
    public static $nameConvertParams = [
        'field' => ['num', 'id_point'],
        'tpl' => '№%s, %s'
    ];

    /**
     * Table fields information (types, constraints, etc.)
     * @var String[]
     */
    public static $fieldsInfo = [
        'id_waylist' => [
            'convert_name' => 'mon_waylist'
        ],
        'id_company_disposal' => [
            'convert_name' => 'x_firm'
        ],
        'id_point' => [
            'convert_name' => 'mon_geofence'
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = [
        'journaled' => [
            'parent' => [
                'table' => 'mon_waylist',
                'key' => 'id_waylist'
            ]
        ],
        'logged' => [
            'alias' => 'mon_waylist_route_update'
        ]
    ];

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_company_disposal' => [
            'x_company' => 'id',
            'fields' => [
                'name'
            ]
        ],
        'id_point' => [
            'mon_geofence' => 'id',
            'fields' => [
                'name',
                'center_lat',
                'center_lon',
                'address'
            ]
        ],
        'id_waylist' => ['mon_waylist' => 'id']
    ];

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {
        parent::insert();

        $idWaylist = $this->get('id_waylist');
        if ($idWaylist && $this->get('distance') !== null) {
            $waylist = new Falcon_Record_Mon_Waylist($idWaylist);
            $waylist->calculateDistance();
        }

        return $this;
    }

    /**
     * Update record in the table
     * @return Falcon_Record_Abstract
     */
    public function update()
    {
        $hasDistance = isset($this->changed['distance']);
        parent::update();

        $idWaylist = $this->get('id_waylist');
        if ($idWaylist && $hasDistance) {
            $waylist = new Falcon_Record_Mon_Waylist($idWaylist);
            $waylist->calculateDistance();
        }

        return $this;
    }

    /**
     * Trash record in the table
     * @return Falcon_Record_Abstract
     */
    public function trash()
    {
        $idWaylist = $this->get('id_waylist');
        $hasDistance = $this->get('distance') > 0;

        parent::trash();

        if ($idWaylist) {
            $this->getMapper()->fixNumsForWaylistId($idWaylist);
            if ($hasDistance) {
                $waylist = new Falcon_Record_Mon_Waylist($idWaylist);
                $waylist->calculateDistance();
            }
        }
        return $this;
    }

    /**
     * Remove record from the table
     * @return Falcon_Record_Abstract
     */
    public function delete()
    {
        $idWaylist = $this->get('id_waylist');
        $hasDistance = $this->get('distance') > 0;

        parent::delete();

        if ($idWaylist) {
            $this->getMapper()->fixNumsForWaylistId($idWaylist);
            if ($hasDistance) {
                $waylist = new Falcon_Record_Mon_Waylist($idWaylist);
                $waylist->calculateDistance();
            }
        }
        return $this;
    }
}
