<?php

class Falcon_Model_Docsnet_Articles extends Falcon_Db_Table_Abstract
{
    protected $_name = 'dn_articles';
    protected $_primary = ['id_product', 'id_firm'];
}