<?php

/**
 * Falcon_Model_Docsnet_Products.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 * @version    $Id: Product.php 1235 2011-09-16 11:09:21Z sunsay $
 * @link       $HeadURL: http://vcs.maprox.net/svn/observer/Web/trunk/library/Falcon/Model/Docsnet/Product.php $
 */
class Falcon_Model_Docsnet_Product extends Falcon_Db_Table_Abstract
{
    protected $_name = 'dn_product';
    protected $_primary = 'id';

    static private $_groupId = 1;
    static private $_supplierId = 163571;

    /**
     * Inserting product with defined article
     * @param {Array} $data
     */
    public function add($data)
    {
        $answer = new Falcon_Message();
        if (empty($data['article']) ||
            empty($data['name'])
        )
            return $answer->error(4042);

        // let's find the same article in our database
        $articleExists = false;
        $articles = new Falcon_Model_Docsnet_Articles();
        $select = $articles->select();
        $select->where('code = ?', $data['article']);
        $articleExists = ($articles->fetchRow($select) !== null);
        if ($articleExists)
            return $answer->error(300, [$data['article']]);

        try {
            // if everything is okey, let's insert product
            $productId = $this->insert(['name' => $data['name']]);
            // and article
            $articles->insert([
                'id_product' => $productId,
                'id_firm' => self::$_supplierId,
                'code' => $data['article']
            ]);
            // and a link to a default group
            $groupLink = new Falcon_Model_Docsnet_ProductGroupLink();
            $groupLink->insert([
                'id_product' => $productId,
                'id_group' => self::$_groupId
            ]);
            $answer->addParam('data', ['id' => $productId]);
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
        return $answer;
    }

    /**
     * Updating product with defined article.
     * Can update fields 'name', 'article'
     * @param {Array} $data
     */
    public function set($data)
    {
        $answer = new Falcon_Message();
        if (empty($data['id']))
            return $answer->error(4042);

        // let's find the same article in our database
        $needUpdateArticle = false;
        $articles = new Falcon_Model_Docsnet_Articles();
        if (!empty($data['article'])) {
            $select = $articles->select();
            $select
                ->where('id_firm = ?', self::$_supplierId)
                ->where('id_product = ?', $data['id'])
                ->where('code = ?', $data['article']);
            $needUpdateArticle = ($articles->fetchRow($select) == null);
        }

        try {
            // let's update product name
            if (!empty($data['name'])) {
                $where = $this->getAdapter()->quoteInto('id = ?', $data['id']);
                $this->update(['name' => $data['name']], $where);
            }
            // and article
            if ($needUpdateArticle) {
                $where = [
                    $this->getAdapter()->quoteInto(
                        'id_firm = ?', self::$_supplierId),
                    $this->getAdapter()->quoteInto(
                        'id_product = ?', $data['id'])
                ];
                $articles->update(['code' => $data['article']], $where);
            }
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
        return $answer;
    }

    /**
     * Deleting product
     * @param {Int} $id Product identifier
     */
    public function del($id)
    {
        $answer = new Falcon_Message();
        if (empty($id))
            return $answer->error(4042);
        try {
            // let's delete product
            $where = $this->getAdapter()->quoteInto('id = ?', $id);
            $this->delete($where);
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
        return $answer;
    }
}