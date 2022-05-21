<?php

/**
 * Abstract class for working with database
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
abstract class Falcon_Db_Table_Abstract extends Zend_Db_Table_Abstract
{
    // last answer object link
    private $_lastAnswer;

    /**
     * Returns last answer object
     * @return Falcon_Message
     */
    public function getLastAnswer()
    {
        return $this->_lastAnswer;
    }

    /**
     * Returns default parameter wich will be supplied to
     * function LoadQuery if $params parameter wasn't defined
     * @return {mixed}
     */
    protected function getDefaultParams()
    {
        return [];
    }

    /**
     * Query load
     * @param {string} $sql SQL request
     * @param {array} $params [Opt.] Parameters array
     * @return Falcon_Message
     */
    public function LoadQuery($sql, $params = null)
    {
        $answer = new Falcon_Message(null, false);
        try {
            if (is_null($params)) {
                $params = $this->getDefaultParams();
            }
            $data = $this->_db->fetchAll(
                $this->_db->quoteInto($sql, $params)
            );

            $answer->addParam('data', $this->tryToCastRowsToInt($data));
            $answer->setSuccess(true);
        } catch (Zend_Db_Adapter_Exception $e) {
            // possible incorrect connection settings
            // or the RDBMS is not running
            $answer->error(10, [$e->getMessage()]);
        } catch (Zend_Exception $e) {
            // probably failed to load the specified Adapter class
            // or an SQL error
            $answer->error(3, [$e->getMessage()]);
        } catch (Exception $e) {
            // unknown exception
            $answer->error(0, [$e->getMessage()]);
        }
        $this->_lastAnswer = $answer;
        return $answer;
    }

    /**
     * Query load
     * @param {string} $sql SQL request
     * @param {array} $bind [Opt.] Parameters array
     * @return Falcon_Message
     */
    public function LoadComplexQuery($sql, $bind = [])
    {
        $answer = new Falcon_Message(null, false);
        try {
            $data = $this->_db->query($sql, $bind);
            $data = $data->fetchAll(Zend_Db::FETCH_ASSOC);

            $answer->addParam('data', $this->tryToCastRowsToInt($data));
            $answer->setSuccess(true);
        } catch (Zend_Db_Adapter_Exception $e) {
            // possible incorrect connection settings
            // or the RDBMS is not running
            $answer->error(10, [$e->getMessage()]);
        } catch (Zend_Exception $e) {
            // probably failed to load the specified Adapter class
            // or an SQL error
            $answer->error(3, [$e->getMessage()]);
        } catch (Exception $e) {
            // unknown exception
            $answer->error(0, [$e->getMessage()]);
        }
        $this->_lastAnswer = $answer;
        return $answer;
    }

    /**
     * Tries to cast rows to int/float
     * @param type $rows
     * @return type
     */
    public function tryToCastRowsToInt(&$rows)
    {
        // if not 64 bit OS (written in config), cast numbers
        if (!Zend_Registry::get('config')->is64)
            foreach ($rows as &$row)
                foreach ($row as &$field)
                    if ((string)(int)$field === $field)
                        $field = (int)$field;
                    elseif ((string)(float)$field === $field)
                        $field = (float)$field;

        return $rows;
    }

}
