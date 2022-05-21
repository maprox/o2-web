<?php

/**
 * Class of "x_notice" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Notice extends Falcon_Mapper_Common
{
    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    protected $firmRestriction = false;

    /**
     * Notice aliases map
     * @var type
     */
    protected $aliases = [];

    /**
     * Loads user's notices settings
     * @param {Integer} $userId
     */
    public function getUserSettings($userId, $alias = null)
    {
        return $this->loadBy(function ($sql) use ($userId, $alias) {
            $sql->distinct();
            $sql->joinLeft(
                ['i' => 'x_notice_importance'],
                'i.id_notice = t.id AND i.id_user = ' . $userId,
                ['id_importance']
            )
                ->joinLeft(
                    ['ni' => 'x_notification_importance'],
                    'i.id_importance = ni.id',
                    ['alias_importance' => 'name']
                );

            if ($alias) {
                $sql->where('t.alias = ?', $alias);
            }
        });
    }

    /**
     * Set user setting by aliases
     * @param {String} $noticeAlias
     * @param {Integer} $userId
     * @param {Integer} $value
     */
    public function setUserSetting($noticeAlias, $valueAlias, $userId)
    {
        $record = new Falcon_Record_X_Notice_Importance([
            'id_notice' => $this->getIdByAlias($noticeAlias),
            'id_user' => $userId
        ]);

        // Get importance id by name
        $m = Falcon_Mapper_X_Notification_Importance::getInstance();
        $importances = $m->loadBy(function ($sql) use ($valueAlias) {
            $sql->where('name = ?', $valueAlias);
        });

        if (empty($importances)) {
            throw new Exception('Importance with given name does not exists');
        }

        $importance = $importances[0];
        $value = $importance['id'];

        $record->set('id_importance', $value);
        if ($record->isLoaded()) {
            $record->update();
        } else {
            $record->insert();
        }
    }

    /**
     * Load all aliases
     */
    protected function loadAliases()
    {
        $notices = $this->load();

        foreach ($notices as $notice) {
            $this->aliases[$notice->get('alias')] = $notice->get('id');
        }
    }

    /**
     * Check if given alias exists
     * @param {String} $noticeAlias
     */
    public function aliasExists($noticeAlias)
    {
        if (empty($this->aliases)) {
            $this->loadAliases();
        }
        return isset($this->aliases[$noticeAlias]);
    }

    /**
     * Returns notice id by alias
     * @param {String} $alias
     * @return {Integer}
     */
    public function getIdByAlias($alias)
    {
        if (empty($this->aliases)) {
            $this->loadAliases();
        }

        return $this->aliases[$alias];
    }

}