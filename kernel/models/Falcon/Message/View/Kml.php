<?php

/**
 * Kml exporter of the message (must contain mon_packet data)
 * KML 2.2 version
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Message_View_Kml extends Falcon_Message_View_Abstract
{
    /**
     * Kml line styles array
     * @var type
     */
    protected $styles = [
        [
            'id' => 'red',
            'color' => 'C81400FF',
            'width' => 4
        ],
        [
            'id' => 'green',
            'color' => 'C878FF00',
            'width' => 4
        ],
        [
            'id' => 'blue',
            'color' => 'C8FF7800',
            'width' => 4
        ],
        [
            'id' => 'cyan',
            'color' => 'C8F0FF14',
            'width' => 4
        ],
        [
            'id' => 'orange',
            'color' => 'C81478FF',
            'width' => 4
        ]
    ];

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
        $root = $this->createRootElement($doc, $message);
        $this->createMetadataElement($doc, $root, $message);
        $this->createTracks($doc, $root, $message);

        $response = Zend_Controller_Front::getInstance()->getResponse();
        $response->setHeader('Content-Type',
            'application/vnd.google-earth.kml+xml', true);
        return $doc->saveXml();
    }

    /**
     * Creates root kml element
     * @param DOMDocument $doc
     * @param Falcon_Message $message
     * @return DOMElement
     */
    private function createRootElement(
        DOMDocument $doc, Falcon_Message $message)
    {
        $root = $doc->createElementNS('http://www.opengis.net/kml/2.2', 'kml');
        $root->setAttribute('xmlns:gx', 'http://www.google.com/kml/ext/2.2');
        $root->setAttribute('xmlns:kml', 'http://www.opengis.net/kml/2.2');
        $root->setAttribute('xmlns:atom', 'http://www.w3.org/2005/Atom');
        $doc->appendChild($root);
        return $root->appendChild($doc->createElement('Document'));
    }

    /**
     * Creates meta element
     * @param DOMDocument $doc
     * @param DOMElement $root
     * @param Falcon_Message $message
     * @return DOMElement
     */
    private function createMetadataElement(
        DOMDocument $doc, DOMElement $root, Falcon_Message $message)
    {
        // make name
        $root->appendChild($doc->createElement('name',
            'Maprox GPX-formatted tracks file'));
        // make creation time
        $node = $doc->createElement('TimeStamp');
        $node->appendChild($doc->createElement('when',
            date('Y-m-d') . 'T' . date('H:i:s') . 'Z'));
        $root->appendChild($node);
        // make description
        $root->appendChild($doc->createElement('description',
            'Tracks from Maprox web-monitoring ' .
            'system exported in GPX format'));
        // make some other data
        $root->appendChild($doc->createElement('visibility', '1'));
        $root->appendChild($doc->createElement('open', '1'));
        // make styles
        foreach ($this->styles as $style) {
            $s = $doc->createElement('Style');
            $s->setAttribute('id', $style['id']);
            $ls = $doc->createElement('LineStyle');
            $ls->appendChild($doc->createElement('color', $style['color']));
            $ls->appendChild($doc->createElement('width', $style['width']));
            $s->appendChild($ls);
            $root->appendChild($s);
        }
        return $root;
    }

    /**
     * Creates tracks element
     * @param DOMDocument $doc
     * @param DOMElement $root
     * @param Falcon_Message $message
     * @return DOMElement
     */
    private function createTracks(
        DOMDocument $doc, DOMElement $root, Falcon_Message $message)
    {
        $folder = $root->appendChild($doc->createElement('Folder'));
        $folder->appendChild($doc->createElement('name', 'Tracks'));
        $folder->appendChild($doc->createElement('description',
            'A list of tracks, exported from Maprox web-monitoring system'));
        $folder->appendChild($doc->createElement('visibility', '1'));
        $folder->appendChild($doc->createElement('open', '1'));
        //$lookat = $root->appendChild($doc->createElement('LookAt'));
        $placemark = $device = $prev = $linestring = null;
        $styleIndex = 0;
        foreach ($message as $packet) {
            if ($styleIndex > count($this->styles)) {
                $styleIndex = 0;
            }
            if (!isset($packet['id_device'])) {
                break;
            }
            $deviceId = $packet['id_device'];
            if (!$device || ($deviceId !== $device->getId())) {
                if ($linestring) {
                    $linestring->appendChild(
                        $doc->createElement('coordinates', $coords));
                }
                $coords = '';
                $device = new Falcon_Model_Device($deviceId);
                $placemark = $doc->createElement('Placemark');
                $placemark->appendChild($doc->createElement('visibility', '1'));
                $placemark->appendChild($doc->createElement('open', '1'));
                $placemark->appendChild($doc->createElement('styleUrl',
                    '#' . $this->styles[$styleIndex++]['id']));
                $sdt = $packet['time'];
                $dt = new DateTime($sdt);
                $placemark->appendChild($doc->createElement('name',
                    'Track of "' . $device->get('name') .
                    '" on ' . $dt->format('Y-m-d')));
                $placemark->appendChild($doc->createElement('description',
                    'Track for device "' . $device->get('name') .
                    '" starting from ' . $sdt));

                $linestring = $doc->createElement('LineString');
                $linestring->appendChild(
                    $doc->createElement('extrude', 'true'));
                $linestring->appendChild(
                    $doc->createElement('tessellate', 'true'));
                $linestring->appendChild(
                    $doc->createElement('altitudeMode', 'clampToGround'));
                $placemark->appendChild($linestring);
                $folder->appendChild($placemark);
            }
            if ($prev
                && ($prev['latitude'] == $packet['latitude'])
                && ($prev['longitude'] == $packet['longitude'])
            ) {
                continue;
            }
            $coords .= ($coords ? ' ' : '') .
                $packet['longitude'] . ',' .
                $packet['latitude'] . ',' .
                $packet['altitude'];
            $prev = $packet;
        }
        if ($linestring) {
            $linestring->appendChild(
                $doc->createElement('coordinates', $coords));
        }
    }
}