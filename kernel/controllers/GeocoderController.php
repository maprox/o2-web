<?php

/**
 * Geocode controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class GeocoderController extends Falcon_Controller_Action
{
    const ERR_UNKNOWN_PARAMS = 4049;

    /*
     * Action по умолчанию, определяет автоматом какой тип геокодинга нужно
     * применить (по списку переданных параметров)
     */
    public function indexAction()
    {
        $request = Zend_Json::decode($this->_getParam('request'));
        $result = null;
        if (isset($request['address'])) {
            $result = $this->doGeocoding($request['address']);
        }
        if (isset($request['lat']) && isset($request['lng'])) {
            $result = $this->doReverseGeocoding(
                $request['lat'],
                $request['lng']
            );
        }
        if (isset($request['id'])) {
            $result = $this->doPacketGeocoding($request['id']);
        }
        if ($result == null) {
            $result = new Falcon_Message();
            $result->setSuccess(false);
            $result->addParam('error', self::ERR_UNKNOWN_PARAMS);
        }
        $this->sendAnswer($result);
    }

    /*
     * Прямой геокодинг
     * @param {String} $address - Адрес для поиска координат
     * @return {Falcon_Message}
     */
    protected function doGeocoding($address)
    {
        $f = new Zend_Filter_StripTags();
        $address = $f->filter($address);
        $geocoder = new Falcon_Geocoder_Query();
        return $geocoder->execute('geocode', [$address]);
    }

    /*
     * Обратный геокодинг
     * @param {String} $lat - Широта
     * @param {String} $lng - Долгота
     * @return {Flacon_Answer}
     */
    protected function doReverseGeocoding($lat, $lng)
    {
        $geocoder = new Falcon_Geocoder_Query();
        $f = new Zend_Filter_StripTags();
        $lat = $f->filter($lat);
        $lng = $f->filter($lng);
        //Производим геокодинг
        $result = $geocoder->execute('revGeocode', [$lat, $lng]);
        return $result;
    }

    /*
     * Геокодинг по ID пакета, при этом в свойства пакета записывается
     * строка адреса
     * @param {int} $id - ID пакета
     * @return {Falcon_Message}
     */
    protected function doPacketGeocoding($id)
    {
        $f = new Zend_Filter_StripTags();
        $id = (int)$f->filter($id);
        $packet = new Falcon_Record_Mon_Packet($id);
        $address = $packet->get('address');
        if ($address == '' || $address == null) {
            $geocoder = new Falcon_Geocoder_Query();
            $answer = $geocoder->execute('revGeocode', [
                $packet->get('latitude'),
                $packet->get('longitude')
            ]);
            if ($answer->isSuccess()) {
                $address = $answer->getParam('address');
                $packet->set('address', $address);
                $packet->update();
            }
        } else {
            $answer = new Falcon_Message();
            $answer->setSuccess(true);
            $answer->addParam('address', $address);
        }
        return $answer;
    }

    /*
     * Прямой геокодинг (получаем координаты по адресу)
     */
    protected function geocodeAction()
    {
        $this->sendAnswer($this->doGeocoding($this->_getParam('address')));
    }

    /*
     * Геокодинг по ID пакета, при этом в свойства пакета записывается
     * строка адреса
     */
    public function revgeocodebyidAction()
    {
        $this->_helper->json(
            $this->doPacketGeocoding(
                $this->_getParam('id')
            )
        );
    }

    /*
     * Геокодинг по координатам (обратный геокодинг)
     */
    public function revgeocodeAction()
    {
        $this->sendAnswer($this->doReverseGeocoding(
            $this->_getParam('lat'), $this->_getParam('lng')));
    }
}
