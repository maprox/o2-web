<?php

/**
 * Table "session"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Session extends Falcon_Table_Common
{
    /**
     * Terminate non-master sessions
     * @var String
     */
    private $sqlTerminate = '
		UPDATE session
		SET terminated = 1
			WHERE id_user = ?
			AND is_master = 0
	';

    /**
     * Delete old sessions
     * @var String
     */
    private $sqlGc = '
		DELETE FROM session
			WHERE modified + lifetime < ?
	';

    /**
     * Terminates sessions for user
     * @param {Integer} $idUser
     */
    public function terminate($idUser)
    {
        $this->query($this->sqlTerminate, $idUser);
    }

    /**
     * Garbage Collection - remove old session data older
     * than $maxlifetime (in seconds)
     *
     * @param int $maxlifetime
     */
    public function gc($maxlifetime)
    {
        $this->query($this->sqlGc, time());
    }
}
