<?php

/**
 * Reports mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2013, Maprox LLC
 */
class Falcon_Mapper_X_Report extends Falcon_Mapper_Common
{
    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    protected $firmRestriction = false;

    /**
     * Load reports with parameters
     * @return Mixed[]
     *//*
	public function loadWithParams()
	{
		$records = $this->getTable()->loadWithParams();
		$items = array();
		foreach ($records as $record) {
			if (!array_key_exists($record['id'], $items)) {
				$items[$record['id']] = array(
					'id' => $record['id'],
					'name' => $record['name'],
					'identifier' => $record['identifier'],
					'remote_path' => $record['remote_path'],
					'state' => $record['state'],
					'invisible' => $record['invisible'],
					'params' => array()
				);
			}
			$items[$record['id']]['params'][] = array(
				'alias' => $record['param_alias'],
				'type' => $record['param_type']
			);
		}
		$reports = array();
		foreach ($items as $item) {
			$reports[] = $item;
		}
		return $reports;
	}*/
}