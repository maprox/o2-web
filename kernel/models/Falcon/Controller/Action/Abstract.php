<?php

/**
 * Base action controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Controller_Action_Abstract extends Zend_Controller_Action
{
    /**
     * Выдавать ли предупреждение о закрытии сессии через несколько 5 минут
     * @var {Boolean}
     */
    protected $_timeleft = false;

    /**
     * index
     */
    public function indexAction()
    {
        if (method_exists($this, 'loadAction')) {
            return $this->loadAction();
        }
    }

    /**
     *
     * @return type Array
     */
    static function getDBProfilerData()
    {
        if (!Zend_Registry::isRegistered('db')) {
            return [];
        }
        $profiler = Zend_Registry::get('db')->getProfiler();
        $totalTime = $profiler->getTotalElapsedSecs();
        $queryCount = $profiler->getTotalNumQueries();
        $longestTime = 0;
        $longestQuery = null;

        $profiles = $profiler->getQueryProfiles();
        if (!$profiles) {
            return [];
        }

        $queries = [];
        foreach ($profiles as $query) {
            $queries[] = [
                'SQL' => $query->getQuery(),
                'Time' => $query->getElapsedSecs()
            ];
            if ($query->getElapsedSecs() > $longestTime) {
                $longestTime = $query->getElapsedSecs();
                $longestQuery = $query->getQuery();
            }
        }

        return [
            'Executed ' . $queryCount . ' queries in ' . $totalTime .
            ' seconds' . "\n",
            'Average query length: ' . $totalTime / $queryCount .
            ' seconds' . "\n",
            'Queries per second: ' . $queryCount / $totalTime . "\n",
            'Longest query length: ' . $longestTime . "\n",
            "Longest query: \n" . $longestQuery . "\n",
            'Queries' => $queries
        ];
    }

    /**
     * Returns a controller name prefix.
     * For example for "Sdesk_Client_FirmController" this method returns
     * "Sdesk_Client_Firm"
     */
    public function getControllerNamePrefix()
    {
        return preg_replace('/Controller$/ui', '', get_class($this));
    }
}
