<?php

/**
 * Class of schedule table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_X_Schedule extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat',
        'from',
        'to',
        'state'
    ];

    /**
     * Проверка на соответствие расписанию указанного времени
     * @param {string} $date Строка даты (по умолчанию текущее время)
     * @return {boolean} Соответствует ли расписанию
     */
    public function according($date = null)
    {
        return $this->timeleft($date) > -1;
    }

    /**
     * Returns next date from user can continue his work
     */
    public function nextTime($today = null)
    {
        $days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        $time = ($today === null) ? time() : strtotime($today);
        // Current day
        $d = strtolower(date('D', $time));

        // Sort array for iteration
        $dayIndex = array_search($d, $days);
        $firstPart = array_slice($days, $dayIndex + 1);
        $secondPart = array_slice($days, 0, $dayIndex + 1);
        $dayOrder = array_merge($firstPart, $secondPart);

        // Find next working day
        $nextDay = null;
        foreach ($dayOrder as $day) {
            if ($this->get($day) > 0) {
                $nextDay = $day;
                break;
            }
        }

        if (!$nextDay) {
            return false;
        }
        $nextTime = null;

        // All day
        if ($this->get($nextDay) == 1) {
            // Next day time
            $time = $time
                + ((array_search($nextDay, $dayOrder) + 1) * 60 * 60 * 24);

            $nextTime = date('Y-m-d 00:00', $time);
        }

        // By schedule
        if ($this->get($nextDay) == 2) {

            // Get utc hours
            $user = Falcon_Model_User::getInstance();

            $utcHours = $user->correctDate($this->get('from'), false);
            $hi = date('H:i', strtotime($utcHours));

            // Next day time
            $time = $time
                + ((array_search($nextDay, $dayOrder) + 1) * 60 * 60 * 24);

            // Add utc corrected hours to next day
            $nextTime = date('Y-m-d ' . $hi, $time);
        }

        return $nextTime;
    }

    /**
     * Время, оставшееся до закрытия сессии
     * @param {string} $date Строка даты (по умолчанию текущее время)
     * @return {integer} Секунд до окончания сессии.
     * Если > 1 дня, то 0. Если не входит в расписание, то -1
     */
    public function timeleft($date = null)
    {
        // если указана дата, то парсим ее в timestamp,
        // иначе берем текущее время
        $time = ($date === null) ? time() : strtotime($date);
        // прибовляем добавочное время
        //$time += $timeleft;
        // день недели
        $d = strtolower(date('D', $time));
        // предыдущий день недели
        $dp = strtolower(date('D', $time - 86400));
        // следующий день недели
        $dn = strtolower(date('D', $time + 86400));
        // часы
        $h = (int)date('H', $time);
        // минуты
        $m = (int)date('i', $time);
        // секунды
        $s = (int)date('s', $time);
        // массив расписаний
        $data = $this->toArray();
        // если ничего не найдено, то false
        if (empty($data['from'])) {
            $data['from'] = date(DB_DATE_FORMAT, 0);
        }
        if (empty($data['to'])) {
            $data['to'] = date(DB_DATE_FORMAT, 0);
        }
        // время от
        $timeF = strtotime($data['from']);
        // часы от
        $hf = (int)date('H', $timeF);
        // минуты от
        $mf = (int)date('i', $timeF);
        // время до
        $timeT = strtotime($data['to']);
        // часы до
        $ht = (int)date('H', $timeT);
        // минуты до
        $mt = (int)date('i', $timeT);

        // проверка
        switch ($data[$d]) {
            // неактивен весь день
            case 0:
                // если входит в предыдущий день и удовлетворяет его условиям,
                // если он захватывает часть текущего
                if ($data[$dp] > 1 && $timeF > $timeT &&
                    ($h < $ht || ($h == $ht && $m < $mt))
                )
                    return 60 * (60 * ($ht - $h) + $mt - $m) - $s;
                else
                    return -1;
                break;
            // активен весь день
            case 1:
                switch ($data[$dn]) {
                    case 0:
                        return 60 * (60 * (24 - $h) - $m) - $s;
                        break;
                    case 1:
                        return 0;
                        break;
                    default:
                        return 60 * (60 * (24 + $ht - $h) + $mt - $m) - $s;
                        break;
                }
                break;
            // по расписанию
            default:
                // если удовлетворяет условиям расписания по часам и минутам
                if ($timeF <= $timeT
                    && ($h > $hf || ($h == $hf && $m >= $mf))
                    && ($h < $ht || ($h == $ht && $m < $mt))
                ) {

                    return 60 * (60 * ($ht - $h) + $mt - $m) - $s;
                } elseif (
                    ($timeF <= $timeT)
                    && ($hf > $ht)
                    && (($h >= $hf && ($h < 24)) || ($h >= 0 && $h <= $ht))
                ) {
                    return 60 * (60 * ($ht - $h) + $mt - $m) - $s;
                } elseif ($timeF > $timeT
                    && ($h > $hf || ($h == $hf && $m >= $mf))
                ) {

                    switch ($data[$dn]) {
                        case 0:
                            return 60 * (60 * (24 - $h) - $m) - $s;
                            break;
                        case 1:
                            return 0;
                            break;
                        default:
                            return 60 * (60 * (24 + $ht - $h) + $mt - $m) - $s;
                            break;
                    }
                } else {
                    return -1;
                }
                break;
        }
    }
}
