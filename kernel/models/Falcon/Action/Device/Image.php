<?php

/**
 * Class for working with images
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012-2013, Maprox LLC
 */
class Falcon_Action_Device_Image extends Falcon_Action_Abstract
{
    /**
     * @var Falcon_Record_Mon_Device
     */
    protected $device;

    /**
     * Constructor
     */
    public function __construct($device)
    {
        $this->device = $device;
        parent::__construct();
    }


    /**
     * Image receiving
     * @param Mixed[] $data
     * @throws Exception
     */
    public function receive($data)
    {
        $logger = Falcon_Logger::getInstance();
        $logger->log('recieve_image', 'Uploading image start...');
        $path = Zend_Registry::get('config')->path->uploaded;
        $filename = '';
        // images from device camera have been sent
        foreach ($data['images'] as $image) {
            $logger->log('recieve_image', 'New image', $image);
            if (!is_array($image)) continue;
            if (!isset($image['content'])) continue;
            if (!isset($image['mime']))
                $image['mime'] = 'application/octet-stream';
            if (!isset($image['time'])) $image['time'] = $data['time'];
            if (!isset($image['note'])) $image['note'] = null;
            if (!isset($image['source'])) $image['source'] = null;
            while (true) {
                $filename = uniqid('CameraImage', true);
                if (!file_exists($path . $filename)) break;
            }
            $imgdata = base64_decode($image['content']);
            $logger->log('recieve_image', 'Writing to file: ' . $filename);
            try {
                $file = fopen($path . $filename, "wb");
                fwrite($file, $imgdata);
                fclose($file);
            } catch (Exception $e) {
                Falcon_Logger::getInstance()->log('recieve_image',
                    "Can not save to file <" .
                    $path . $filename . ">: " . $e->getMessage());
                throw $e;
            }

            // Reading exif data
            $params = null;
            $latlon = $this->getExifLatLon($path . $filename);
            if ($latlon) {
                $params = json_encode($latlon);
            }

            // Saving thumb
            $imagePath = $path . $filename;
            $resized = $this->resize($imagePath);
            $resized->writeImage($imagePath . '.thumb');
            $resized->destroy();

            if ($image['mime'] == 'image/jpeg') {
                // TODO: LET'S GET IMAGE INFORMATION
            }
            $r = new Falcon_Record_Mon_Device_Image([
                'id_device' => $this->device->getId(),
                'source' => $image['source'],
                'time' => $image['time'],
                'mime' => $image['mime'],
                'note' => $image['note'],
                'params' => $params,
                'hash' => $filename
            ]);
            $r->insert();

            $this->device
                ->set('lastimage', json_encode($r->load()->toArray()))
                ->set('lastconnect', $this->device->getMapper()->dbDate())
                ->update();

            $logger->log('recieve_image', 'Done.');
        }
    }

    /**
     * Resizes the image
     * @param String $file Path to file
     * @param Integer $w Width
     * @param Integer $h Height
     * @return Imagick
     */
    public function resize($file, $w = 150, $h = 0)
    {
        $img = new Imagick($file);
        $img->thumbnailImage($w, $h);
        return $img;
    }

    /**
     * Extracts latitude and longitude from image file
     * @param String $path Path to image
     * @return Integer[]
     */
    public function getExifLatLon($path)
    {
        $exif = exif_read_data($path, null, true);
        if (isset($exif['GPS'])) {
            $gps = $exif['GPS'];
            $lon = $this->getGps($gps["GPSLongitude"], $gps['GPSLongitudeRef']);
            $lat = $this->getGps($gps["GPSLatitude"], $gps['GPSLatitudeRef']);
            return [
                'lat' => $lat,
                'lon' => $lon
            ];
        }
        return false;
    }

    /**
     * Converts exif coordinats to [-]d.d format
     * @param Array $exifCoord
     * @param Array $hemi
     * @return float
     */
    public function getGps($exifCoord, $hemi)
    {
        $degrees = count($exifCoord) > 0 ? $this->gps2Num($exifCoord[0]) : 0;
        $minutes = count($exifCoord) > 1 ? $this->gps2Num($exifCoord[1]) : 0;
        $seconds = count($exifCoord) > 2 ? $this->gps2Num($exifCoord[2]) : 0;
        $flip = ($hemi == 'W' or $hemi == 'S') ? -1 : 1;
        return round($flip * ($degrees + $minutes / 60 + $seconds / 3600), 6);
    }

    /**
     * gps 2 num
     * @param type $coordPart
     * @return int
     */
    public function gps2Num($coordPart)
    {
        $parts = explode('/', $coordPart);
        if (count($parts) <= 0) {
            return 0;
        }
        if (count($parts) == 1) {
            return $parts[0];
        }
        return floatval($parts[0]) / floatval($parts[1]);
    }
}