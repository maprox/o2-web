<?php

class Falcon_Model_Docsnet_ProductGroupLink extends Falcon_Db_Table_Abstract
{
    protected $_name = 'dn_product_group_link';
    protected $_primary = ['id_product', 'id_group'];
}