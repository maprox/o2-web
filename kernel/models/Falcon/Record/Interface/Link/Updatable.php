<?php

/**
 * Abstract class of table record wich linked to the master table.
 * And can have more than one record linked to master table record.
 * When updating master record instead deleting all linked records
 * and recreating them linked records will be updated or created
 * Example: mon_device_sensor
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
interface Falcon_Record_Interface_Link_Updatable
{
}
