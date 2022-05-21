<?php

/**
 * Class of tariff mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Tariff extends Falcon_Mapper_Common
{
    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    protected $firmRestriction = false;

    /**
     * Get used tariffs
     * @return Integer[] Used tariffs ids
     */
    public function usedTariffs()
    {
        return $this->getTable()->usedTariffs();
    }

    /**
     * Return tariff options
     * @param int $tariffId
     * @return array
     */
    public function getOptions($tariffId)
    {
        $cacherKey = 'tariff_option_' . $tariffId;
        $cacher = Falcon_Cacher::getInstance();
        $options = $cacher->get('table', $cacherKey);
        if (!$options) {
            $m = Falcon_Mapper_X_Tariff_Option_Value::getInstance();
            $options = $m->loadBy(function ($sql) use ($tariffId) {
                $sql
                    ->where('id_tariff = ?', $tariffId)
                    ->join('x_tariff_option',
                        'id = id_tariff_option',
                        ['identifier']
                    );
            }, [
                'fields' => ['value']
            ]);
            $cacher->set($options, 'table', $cacherKey, Falcon_Cacher::DAY);
        }
        return $options;
    }

    /**
     * Returns a modules list for current tariff
     * @param int $tariffId
     * @return array
     */
    public function getModules($tariffId)
    {
        $m = Falcon_Mapper_X_Module::getInstance();
        $cacherKey = 'tariff_module_' . $tariffId;
        $cacher = Falcon_Cacher::getInstance();
        $records = $cacher->get('table', $cacherKey);
        if (!$records) {
            $records = $m->loadBy(function ($sql) use ($tariffId) {
                $sql
                    ->join(
                        ['tml' => 'x_tariff_module_link'],
                        't.id = tml.id_module',
                        []
                    )
                    ->where('tml.id_tariff = ?', $tariffId);
            });
            $cacher->set($records, 'table', $cacherKey, Falcon_Cacher::DAY);
        }
        return $records;
    }

}
