<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * @author     Alexander Lyapko <sunsay@maprox.net>
 * @author     Anton Grinin <agrinin@maprox.net>
 * @author     Konstantin Pakshaev <kpakshaev@maprox.net>
 */
class Falcon_Action_Package_Factory_Sdesk
{
    /**
     * Package initialization
     * @param array $params
     */
    public static function init($params)
    {
        if (
            !$params ||
            !is_array($params) ||
            !isset($params['id_firm'])
        ) {
            throw new Falcon_Exception('Incorrect input parameters',
                Falcon_Exception::BAD_REQUEST);
        }

        $packageAlias = 'sdesk';
        $packageId = Falcon_Mapper_X_Package::getInstance()
            ->getPackageIdByAlias($packageAlias);
        $params['id_package'] = $packageId;

        $t = Zend_Registry::get('translator');
        $zt = $t['zt'];

        $db = Zend_Db_Table::getDefaultAdapter();
        $db->beginTransaction();
        try {
            if (isset($params['cleanup']) && $params['cleanup']) {
                // cleanup previous data
                self::cleanup($params);

                // Cleanup and exit:
                // $db->commit(); return;
            }

            $firmId = $params['id_firm'];
            $issueNumSequenceName = 'sdesk_issue_num_seq_' . $firmId;

            // create issue num sequence
            $db->fetchAll('DROP SEQUENCE IF EXISTS ' . $issueNumSequenceName);
            $db->fetchAll('CREATE SEQUENCE ' . $issueNumSequenceName);

            // -----------------------------------------------------------
            // CLIENT
            //

            // sample company
            $clientFirm = new Falcon_Record_X_Company([
                'id_firm' => $firmId,
                'id_package' => $packageId,
                'name' => $zt->_('Sample Company'),
                'fullname' => $zt->_('Sample Company Limited')
            ]);
            $clientFirm->insert();
            $clientFirm->addEmail([
                'address' => 'admin@sample.ru',
                'isprimary' => 1
            ]);
            $clientFirm->addPhone([
                'number' => '+77000000001',
                'isprimary' => 1
            ]);
            $clientFirm->addPhone([
                'number' => '+77000000002'
            ]);

            // sample person
            $clientPerson = new Falcon_Record_X_Person([
                'id_firm' => $firmId,
                'id_package' => $packageId,
                'id_company' => $clientFirm->getId(),
                'firstname' => $zt->_('John'),
                'lastname' => $zt->_('Johnson')
            ]);
            $clientPerson->insert();
            $clientPerson->addPhone([
                'number' => '+70000000003',
                'isprimary' => 1
            ]);
            $clientPerson->addEmail([
                'address' => 'user@sample.ru',
                'isprimary' => 1
            ]);

            // -----------------------------------------------------------
            // PRIORITY
            //
            $priority = [];
            $priorityList = [
                $zt->_('Low'),
                $zt->_('Normal'),
                $zt->_('High'),
                $zt->_('Urgent'),
                $zt->_('Immediate')
            ];
            foreach ($priorityList as $key => $priorityName) {
                $priority[$key] = new Falcon_Record_Sdesk_Priority([
                    'id_firm' => $firmId,
                    'name' => $priorityName,
                    'position' => $key,
                    'isdefault' => ($key === 1) ?: 0
                ]);
                $priority[$key]->insert();
            }

            // -----------------------------------------------------------
            // ISSUE TYPE
            //

            $issueTypeUndefined = new Falcon_Record_Sdesk_Issue_Type([
                'id_firm' => $firmId,
                'name' => $zt->_('Undefined'),
                'isdefault' => 1
            ]);
            $issueTypeUndefined->insert();

            $issueTypeIncident = new Falcon_Record_Sdesk_Issue_Type([
                'id_firm' => $firmId,
                'name' => $zt->_('Incident')
            ]);
            $issueTypeIncident->insert();

            // -----------------------------------------------------------
            // ISSUE STATE
            //

            $stateRegistered = new Falcon_Record_Sdesk_State([
                'id_firm' => $firmId,
                'name' => $zt->_('Created'),
                'description' => $zt->_('Issue is registered'),
                'statetype' => 0
            ]);
            $stateRegistered->insert();

            $stateClosed = new Falcon_Record_Sdesk_State([
                'id_firm' => $firmId,
                'name' => $zt->_('Closed'),
                'description' => $zt->_('Issue is closed (done)'),
                'statetype' => 2
            ]);
            $stateClosed->insert();

            $stateCanceled = new Falcon_Record_Sdesk_State([
                'id_firm' => $firmId,
                'name' => $zt->_('Canceled'),
                'description' => $zt->_('Issue is closed (canceled)'),
                'statetype' => 2
            ]);
            $stateCanceled->insert();

            // -----------------------------------------------------------
            // ISSUE ROUTE
            //

            $r = new Falcon_Record_Sdesk_Route(
                [
                    'id_firm' => $firmId,
                    'id_state' => $stateRegistered->getId(),
                    'id_state_next' => $stateClosed->getId()
                ]);
            $r->insert();

            $r = new Falcon_Record_Sdesk_Route(
                [
                    'id_firm' => $firmId,
                    'id_state' => $stateRegistered->getId(),
                    'id_state_next' => $stateCanceled->getId()
                ]);
            $r->insert();

            // -----------------------------------------------------------
            // SERVICE
            //

            $serviceDefault = new Falcon_Record_Sdesk_Service([
                'id_firm' => $firmId,
                'name' => $zt->_('Customer support'),
                'description' => $zt->_('Default service')
            ]);
            $serviceDefault->insert();

            // -----------------------------------------------------------
            // SERVICE LEVEL
            //

            $serviceLevel = [];
            $serviceLevel['normal'] = new Falcon_Record_Sdesk_Service_Level([
                'id_firm' => $firmId,
                'name' => $zt->_('Normal'),
                'minutes_idle' => 30,
                'minutes_between_incidents' => 30
            ]);

            $serviceLevel['advanced'] = new Falcon_Record_Sdesk_Service_Level([
                'id_firm' => $firmId,
                'name' => $zt->_('Advanced'),
                'minutes_idle' => 20,
                'minutes_between_incidents' => 30
            ]);

            // details
            $mr = [
                'normal' => [60, 50, 40, 30, 20],
                'advanced' => [50, 40, 30, 20, 10]
            ];
            $mf = [
                'normal' => [120, 110, 100, 90, 80],
                'advanced' => [100, 80, 60, 40, 30]
            ];
            foreach ($serviceLevel as $sKey => $sl) {
                $sl->insert();
                foreach ($priority as $pKey => $p) {
                    $r = new Falcon_Record_Sdesk_Service_Detail(
                        [
                            'id_service' => $serviceDefault->getId(),
                            'id_service_level' => $sl->getId(),
                            'id_priority' => $p->getId(),
                            'minutes_response' => $mr[$sKey][$pKey],
                            'minutes_fix' => $mf[$sKey][$pKey]
                        ]);
                    $r->insert();
                }
            }

            // -----------------------------------------------------------
            // SERVICE TIME
            //

            $serviceTime24x7 = new Falcon_Record_Sdesk_Service_Time([
                'id_firm' => $firmId,
                'name' => $zt->_('24x7'),
                'description' => $zt->_('(su-sa, round-the-clock)')
            ]);
            $serviceTime24x7->insert();

            for ($dow = 0; $dow < 7; $dow++) {
                $r = new Falcon_Record_Sdesk_Service_Time_Detail([
                    'id_service_time' => $serviceTime24x7->getId(),
                    'stime' => '00:00:00',
                    'etime' => '23:59:59',
                    'dow' => $dow
                ]);
                $r->insert();
            }

            // -----------------------------------------------------------
            // CONTRACT
            //

            $contract = new Falcon_Record_Dn_Contract([
                'id_firm' => $firmId,
                'id_package' => $packageId,
                'num' => '1',
                'description' => $zt->_('Sample SLA contract'),
                'id_company_supplier' => $firmId,
                'id_company_reciever' => $clientFirm->getId(),
                'cdt' => new Zend_Db_Expr('localtimestamp'),
                'sdt' => new Zend_Db_Expr('localtimestamp'),
                'edt' => new Zend_Db_Expr("localtimestamp + interval '3 day'")
            ]);
            $contract->insert();

            $contractItem = new Falcon_Record_Sdesk_Contract([
                'id_contract' => $contract->getId(),
                'id_user' => $clientPerson->getId(),
                'id_service' => $serviceDefault->getId(),
                'id_service_time' => $serviceTime24x7->getId(),
                'id_service_level' => $serviceLevel['normal']->getId()
            ]);
            $contractItem->insert();

            // -----------------------------------------------------------
            // ISSUE
            //

            $m = Falcon_Mapper_Sdesk_Issue::getInstance();
            $issue = new Falcon_Record_Sdesk_Issue([
                'id_firm' => $firmId,
                'num' => $m->getNextNum($firmId),
                'description' => 'Принтер не печатает',
                'id_client_firm' => $clientFirm->getId(),
                'id_contact_person' => $clientPerson->getId(),
                'id_issue_type' => $issueTypeIncident->getId(),
                'id_service' => $serviceDefault->getId(),
                'id_priority' => $priority[3]->getId(),
                'deadline_dt' =>
                    new Zend_Db_Expr("localtimestamp + interval '1 day'"),
                'id_source' => 1,
                'id_state' => $stateRegistered->getId(),
                'create_id_user' => $clientPerson->getId()
            ]);
            $issue->insert();

            $issue = new Falcon_Record_Sdesk_Issue([
                'id_firm' => $firmId,
                'num' => $m->getNextNum($firmId),
                'description' => 'Интернет не работает',
                'id_client_firm' => $clientFirm->getId(),
                'id_contact_person' => $clientPerson->getId(),
                'id_issue_type' => $issueTypeIncident->getId(),
                'id_service' => $serviceDefault->getId(),
                'id_priority' => $priority[1]->getId(),
                'deadline_dt' =>
                    new Zend_Db_Expr("localtimestamp + interval '1 day'"),
                'id_source' => 1,
                'id_state' => $stateRegistered->getId(),
                'create_id_user' => $clientPerson->getId()
            ]);
            $issue->insert();

            $issue = new Falcon_Record_Sdesk_Issue([
                'id_firm' => $firmId,
                'num' => $m->getNextNum($firmId),
                'description' => 'Чешется над правым коленом',
                'id_client_firm' => $clientFirm->getId(),
                'id_contact_person' => $clientPerson->getId(),
                'id_issue_type' => $issueTypeUndefined->getId(),
                'id_service' => $serviceDefault->getId(),
                'id_priority' => $priority[0]->getId(),
                'deadline_dt' =>
                    new Zend_Db_Expr("localtimestamp + interval '1 day'"),
                'id_source' => 1,
                'id_state' => $stateRegistered->getId(),
                'create_id_user' => $clientPerson->getId()
            ]);
            $issue->insert();

            $db->commit();
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }

    }

    /**
     * Cleanup
     * @param array $params
     */
    public static function cleanup($params)
    {
        $packageId = $params['id_package'];

        $db = Zend_Db_Table::getDefaultAdapter();
        $firmId = $params['id_firm'];

        // delete service desk data for specified firm
        $db->fetchAll('delete from x_company
			where id_firm = ?
			  and id_package = ?',
            [$firmId, $packageId]);

        $db->fetchAll('delete from x_person
			where id_firm = ?
			  and id_package = ?',
            [$firmId, $packageId]);

        $db->fetchAll(
            'delete from sdesk_priority where id_firm = ?', $firmId);
        $db->fetchAll(
            'delete from sdesk_issue_type where id_firm = ?', $firmId);
        $db->fetchAll(
            'delete from sdesk_service_time where id_firm = ?', $firmId);
        $db->fetchAll(
            'delete from sdesk_service where id_firm = ?', $firmId);
        $db->fetchAll(
            'delete from sdesk_service_level where id_firm = ?', $firmId);
        $db->fetchAll(
            'delete from sdesk_issue_source where id_firm = ?', $firmId);
        $db->fetchAll(
            'delete from sdesk_state where id_firm = ?', $firmId);
    }

}


/*

  -- sdesk issues

  -- issue 1 (blank issue)
  issueId = nextval('sdesk_issue_id_seq');
  issueNum = nextval(issueNumSequenceName);
  insert into sdesk_issue (id, id_firm, num, description, id_client_firm, id_contact_person, id_issue_type,
    id_service, id_priority, deadline_dt, id_responsible_user, id_source, id_state, create_id_user, create_dt)
  values (issueId, firmId, issueNum, 'Принтер не печатает', clientFirmId, clientContactId, it_incident, serviceId, sp_1,
    localtimestamp + interval '1 day', 9, 1, s_registered, 9, localtimestamp);

  insert into sdesk_issue_state (id_issue, id_state, dt, id_user, timespent)
  values (issueId, s_registered, localtimestamp, 9, 0);

  -- issue 2 (with attachments)
  issueId = nextval('sdesk_issue_id_seq');
  issueNum = nextval(issueNumSequenceName);
  insert into sdesk_issue (id, id_firm, num, description, id_client_firm, id_contact_person, id_issue_type,
    id_service, id_priority, deadline_dt, id_responsible_user, id_source, id_state, create_id_user, create_dt)
  values (issueId, firmId, issueNum, 'Интернет не работает', clientFirmId, clientContactId, it_incident, serviceId, sp_1,
    localtimestamp + interval '1 day', 9, 1, s_registered, 9, localtimestamp);

  insert into sdesk_issue_state (id_issue, id_state, dt, id_user, timespent)
  values (issueId, s_registered, localtimestamp, 9, 0);

  attachmentId = nextval('x_attachment_id_seq');
  insert into x_attachment(id, name, file, size, hash, dt)
  values (attachmentId, 'Sample attachment (not exists).txt', 'NOT EXISTS', 0, 'NOT EXTIST', localtimestamp);
  insert into sdesk_issue_attachment_link (id_issue, id_attachment) values (issueId, attachmentId);

  -- issue 3 (with comments and history)
  issueId = nextval('sdesk_issue_id_seq');
  issueNum = nextval(issueNumSequenceName);
  insert into sdesk_issue (id, id_firm, num, description, id_client_firm, id_contact_person, id_issue_type,
    id_service, id_priority, deadline_dt, id_responsible_user, id_source, id_state, create_id_user, create_dt)
  values (issueId, firmId, issueNum, 'Чешется над правым коленом', clientFirmId, clientContactId, it_undefined, serviceId, sp_0,
    localtimestamp + interval '1 day', 9, 1, s_registered, 9, localtimestamp);

  insert into sdesk_issue_state (id_issue, id_state, dt, id_user, timespent)
  values (issueId, s_registered, localtimestamp, 9, 0);

  commentId = nextval('x_comment_id_seq');
  insert into x_comment (id, id_user, dt, message, id_source) values (commentId, 9, current_timestamp, 'Пробовали почесать?', 3);
  insert into sdesk_issue_comment_link(id_issue, id_comment) values (issueId, commentId);

*/