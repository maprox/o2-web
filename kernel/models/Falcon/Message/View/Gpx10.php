<?php

/**
 * Gpx exporter of the message (must contain mon_packet data)
 * GPX 1.0 version
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Message_View_Gpx10 extends Falcon_Message_View_Abstract
{
    /**
     * Write headers and content of the response
     * @param Falcon_Message $message
     */
    public function sendMessage(Falcon_Message $message)
    {
        if (!$message->isSuccess()) {
            $json = Falcon_Message_View_Json::getInstance();
            return $json->sendMessage($message);
        }
        $this->initHeaders();
        $this->disableLayout();
        // make xml
        $doc = new DOMDocument('1.0', 'UTF-8');
        $doc->formatOutput = true;
        $root = $this->createGpxRootElement($doc, $message);
        $this->createGpxMetadataElement($doc, $root, $message);
        $this->createGpxTracks($doc, $root, $message);

        $response = Zend_Controller_Front::getInstance()->getResponse();
        $response->setHeader('Content-Type', 'application/gpx+xml', true);
        return $doc->saveXml();
    }

    /**
     * Creates root gpx element
     * @param DOMDocument $doc
     * @param Falcon_Message $message
     * @return DOMElement
     */
    private function createGpxRootElement(
        DOMDocument $doc, Falcon_Message $message)
    {
        $root = $doc->createElementNS(
            'http://www.topografix.com/GPX/1/0', 'gpx');
        $root->setAttribute('version', '1.0');
        $root->setAttribute('creator', 'Maprox');
        $root->setAttribute('xmlns:xsi',
            'http://www.w3.org/2001/XMLSchema-instance');
        $root->setAttribute('xsi:schemaLocation',
            'http://www.topografix.com/GPX/1/0 ' .
            'http://www.topografix.com/GPX/1/0/gpx.xsd');
        return $doc->appendChild($root);
    }

    /**
     * Creates gpx meta element
     * @param DOMDocument $doc
     * @param DOMElement $root
     * @param Falcon_Message $message
     */
    private function createGpxMetadataElement(
        DOMDocument $doc, DOMElement $root, Falcon_Message $message)
    {
        // make name
        $node = $doc->createElement('name',
            'Maprox GPX-formatted tracks file');
        $root->appendChild($node);
        // make description
        $node = $doc->createElement('desc',
            'Tracks from Maprox web-monitoring ' .
            'system exported in GPX format');
        $root->appendChild($node);
        // make creation time
        $node = $doc->createElement('time',
            date('Y-m-d') . 'T' . date('H:i:s') . 'Z');
        $root->appendChild($node);
    }

    /**
     * Creates gpx trk element
     * @param DOMDocument $doc
     * @param DOMElement $root
     * @param Falcon_Message $message
     * @return DOMElement
     */
    private function createGpxTracks(
        DOMDocument $doc, DOMElement $root, Falcon_Message $message)
    {
        $trk = $device = $prev = null;
        foreach ($message as $packet) {
            if (!isset($packet['id_device'])) {
                break;
            }
            $deviceId = $packet['id_device'];
            if (!$device || ($deviceId !== $device->getId())) {
                $device = new Falcon_Model_Device($deviceId);
                $trk = $doc->createElement('trk');
                $trkseg = $doc->createElement('trkseg');
                $sdt = $packet['time'];
                $dt = new DateTime($sdt);
                $trk->appendChild($doc->createElement('name',
                    'Track of "' . $device->get('name') .
                    '" on ' . $dt->format('Y-m-d')));
                $trk->appendChild($doc->createElement('desc',
                    'Track for device "' . $device->get('name') .
                    '" starting from ' . $sdt));
                $trk->appendChild($trkseg);
                $root->appendChild($trk);
            }
            if ($prev
                && ($prev['latitude'] == $packet['latitude'])
                && ($prev['longitude'] == $packet['longitude'])
            ) {
                continue;
            }
            $trkpt = $doc->createElement('trkpt');
            $trkpt->setAttribute('lat', $packet['latitude']);
            $trkpt->setAttribute('lon', $packet['longitude']);
            $trkpt->appendChild($doc->createElement(
                'ele', $packet['altitude']));
            $trkpt->appendChild($doc->createElement(
                'time', str_replace(' ', 'T', $packet['time']) . 'Z'));
            $trkpt->appendChild($doc->createElement(
                'course', $packet['azimuth']));
            $trkpt->appendChild($doc->createElement('speed', $packet['speed']));
            $trkpt->appendChild($doc->createElement(
                'sat', $packet['satellitescount']));
            $trkpt->appendChild($doc->createElement('hdop', $packet['hdop']));
            $trkseg->appendChild($trkpt);
            $prev = $packet;
        }
    }
}