<?php

/**
 * Class of "session" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Session extends Falcon_Mapper_Common
    implements Zend_Session_SaveHandler_Interface
{
    /**
     * Terminates sessions for user
     * @param {Integer} $idUser
     */
    public function terminate($idUser)
    {
        $user = new Falcon_Model_User($idUser);
        if ($user->needUniqueSession()) {
            $this->getTable()->terminate($idUser);
        }
    }

    /**
     * Open Session - retrieve resources
     *
     * @param string $save_path
     * @param string $name
     */
    public function open($save_path, $name)
    {
        return true;
    }

    /**
     * Close Session - free resources
     *
     */
    public function close()
    {
        return true;
    }

    /**
     * Read session data
     *
     * @param string $id
     */
    public function read($id)
    {
        try {
            $record = $this->loadRecord($id);
            if (!$record) {
                return '';
            }

            if ($record->get('modified') + $record->get('lifetime') < time()) {
                $this->destroy($id);
                return '';
            }

            return $record->get('data');
        } catch (Exception $e) {
            // Log database errors but don't break session functionality
            $logger = Falcon_Logger::getInstance();
            $logger->log('error', [
                'message' => 'Session read error: ' . $e->getMessage(),
                'session_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            return '';
        }
    }

    /**
     * Write Session - commit data to resource
     *
     * @param string $id
     * @param mixed $data
     */
    public function write($id, $data)
    {
        if (!isset($_SESSION['Zend_Auth']['storage'])) {
            return true;
        }
        $sessionData = $_SESSION['Zend_Auth']['storage'];
        if (!isset($sessionData['id'])) {
            return true;
        }

        $record = $this->loadRecord($id);
        if (!$record) {
            $config = Zend_Registry::get('config');
            $this->newRecord([
                'id' => $id,
                'id_user' => $sessionData['id'],
                'data' => $data,
                'is_master' => (int)!empty($sessionData['is_master']),
                'lifetime' => $config->session->lifeTime,
                'modified' => time()
            ])->insert();
        } else {
            $record->setProps([
                'data' => $data,
                'modified' => time()
            ])->update();
        }

        return true;
    }

    /**
     * Destroy Session - remove data from resource for
     * given session id
     *
     * @param string $id
     */
    public function destroy($id)
    {
        $this->deleteRecord($id);
    }

    /**
     * Garbage Collection - remove old session data older
     * than $maxlifetime (in seconds)
     *
     * @param int $maxlifetime
     */
    public function gc($maxlifetime)
    {
        $this->getTable()->gc($maxlifetime);
    }
}
