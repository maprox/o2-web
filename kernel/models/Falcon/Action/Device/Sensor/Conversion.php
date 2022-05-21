<?php

use Amenadiel\JpGraph\Graph\Graph;
use Amenadiel\JpGraph\Plot\LinePlot;
use Amenadiel\JpGraph\Plot\ScatterPlot;
use Amenadiel\JpGraph\Util\Spline;

/**
 * Conversion
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Action_Device_Sensor_Conversion
{
    /**
     * Conversion points
     * @var array
     */
    private $_points = [];

    /**
     * Falcon_Action_Device_Sensor_Conversion constructor.
     * @param array $points
     */
    public function __construct($points = [])
    {
        $this->_points = is_array($points) ? $points : [];
    }


    /**
     * Получения массивов x и y координат точек
     * @param {float[]} $xpoints
     * @param {float[]} $ypoints
     */
    protected function getPointsArrays(&$xpoints, &$ypoints)
    {
        // получение массива точек
        $points = $this->_points;
        // массивы x- и y-координат
        $xpoints = $ypoints = [];
        // обход точек, раскидывание координат по массивам
        foreach ($points as $point) {
            $xpoints[] = $point->x;
            $ypoints[] = $point->y;
        }
    }

    /**
     * Value check
     * @param string $x
     * @param boolean $smoothing
     * @return Falcon_Message
     */
    public function check($x, $smoothing)
    {
        return $smoothing ? $this->checkSmoothX($x) : $this->checkX($x);
    }

    /**
     * Проверка значения y при указаном значении x
     * @param string $x Значение x для проверки
     * @return Falcon_Message Ответ сервера
     */
    protected function checkX($x)
    {
        // приведение x к float
        $x = (float)str_replace(',', '.', $x);
        // получение массивов координат
        $this->getPointsArrays($xpoints, $ypoints);
        // всего точек для преобразования
        $count = count($xpoints);
        if ($count == 0) {
            // нет преобразования
            $y = $x;
        } elseif ($count == 1) {
            // горизонтальная прямая
            $y = $ypoints[0];
        } else {
            // y, ближайшие точки слева и справа от искомого x и их индексы
            $y = $left = $right = $ri = $li = null;
            // обход массивов координат
            for ($i = 0; $i < $count; $i++) {
                // если точное совпадение
                if ($x == $xpoints[$i]) {
                    $y = $ypoints[$i];
                    break;
                } // если точка левее x и правее промежуточной левой
                elseif ($x > $xpoints[$i] &&
                    ($left === null || $left[0] < $xpoints[$i])
                ) {
                    // ближайшая точка слева
                    $left = [$xpoints[$i], $ypoints[$i]];
                    // ее индекс
                    $li = $i;
                } // если точка правее x и левее промежуточной правой
                elseif ($x < $xpoints[$i] &&
                    ($right === null || $right[0] > $xpoints[$i])
                ) {
                    // ближайшая точка справа
                    $right = [$xpoints[$i], $ypoints[$i]];
                    // ее индекс
                    $ri = $i;
                }
            }
            // если точных совпадений не было
            if ($y === null) {
                // если точек слева нет (то справа точно есть хотя бы 2)
                if ($left === null) {
                    // виртуальная левая точка (на самом деле вторая правая)
                    $left = [$xpoints[$ri + 1], $ypoints[$ri + 1]];
                } // если точек справа нет (то слева точно есть хотя бы 2)
                elseif ($right === null) {
                    // виртуальная правая точка (на самом деле вторая левая)
                    if ($li < 1) {
                        $li = 1;
                    }
                    $right = [$xpoints[$li - 1], $ypoints[$li - 1]];
                }
                if ($left[0] != $right[0]) {
                    // получаем y по двум точкам
                    $y = ($x * ($right[1] - $left[1]) + $right[0] * $left[1] -
                            $left[0] * $right[1]) / ($right[0] - $left[0]);
                } else {
                    $y = $right[1];
                }
            }
        }

        $answer = new Falcon_Message();
        $data = [
            'x' => $x,
            'y' => $y
        ];
        $answer->addParam('data', $data);
        return $answer;
    }

    /**
     * Проверка значения y при указаном значении x на сглаженном графике
     * @param string $x Значение x для проверки
     * @return Falcon_Message Ответ сервера
     */
    protected function checkSmoothX($x)
    {
        // приведение x к float
        $x = (float)str_replace(',', '.', $x);
        // получение массивов координат
        $this->getPointsArrays($xpoints, $ypoints);
        // всего точек для преобразования
        $count = count($xpoints);
        if ($count == 0) {
            // нет преобразования
            $y = $x;
        } elseif ($count == 1) {
            // горизонтальная прямая
            $y = $ypoints[0];
        } else {
            // кривая зависимости
            $spline = new Spline($xpoints, $ypoints);
            // получение y по кривой
            $y = $spline->Interpolate($x);
        }

        $answer = new Falcon_Message();
        $data = [
            'x' => $x,
            'y' => $y
        ];
        $answer->addParam('data', $data);
        return $answer;
    }

    /**
     * Outputs a convertion graph
     * @param {Boolean} $smoothing
     */
    public function getImage($smoothing)
    {
        $smoothing ? $this->printSmoothGraph() : $this->printGraph();
    }

    /**
     * Вывод на экран графика
     */
    protected function printGraph()
    {
        // получение массивов координат
        $this->getPointsArrays($xpoints, $ypoints);
        // всего точек для преобразования
        $count = count($xpoints);
        if ($count == 0) {
            // добавляем виртуальные точки (0,0) и (1,1)
            $xpoints = $ypoints = [0, 1];
        } elseif ($count == 1) {
            // добавляем виртуальную точку на той же горизонтальной прямой
            $xpoints[] = $xpoints[0] + 1;
            $ypoints[] = $ypoints[0];
        }
        // создание объекта ломаной
        $scatterplot = new ScatterPlot($ypoints, $xpoints);
        // цвет ломаной и ее видимость (true)
        $scatterplot->SetLinkPoints(true, '#69f');
        // цвет точек ломаной
        $scatterplot->mark->SetFillColor('red@0.3');
        $scatterplot->mark->SetColor('red@0.5');
        // создание объекта графика
        $g = new Graph(478, 356); // размеры окна для графика
        $g->SetScale('linlin');
        // формат значений по x
        //$g->xaxis->SetLabelFormat('%1.1f');
        // добавление ломаной на график
        $g->Add($scatterplot);
        // заголовки типа содержимого
        header('Content-Type: image/png');
        // вывод графика
        $g->Stroke();
        // happy end
        die();
    }

    /**
     * Вывод на экран сглаженного графика
     */
    protected function printSmoothGraph()
    {
        // получение массивов координат
        $this->getPointsArrays($xpoints, $ypoints);
        // всего точек для преобразования
        $count = count($xpoints);
        if ($count == 0) {
            // добавляем виртуальные точки (0,0) и (1,1)
            $xpoints = $ypoints = [0, 1];
        } elseif ($count == 1) {
            // добавляем виртуальную точку на той же горизонтальной прямой
            $xpoints[] = $xpoints[0] + 1;
            $ypoints[] = $ypoints[0];
        }
        // кривая по точкам
        $spline = new Spline($xpoints, $ypoints);
        // точки для сглаженной кривой
        list($newx, $newy) = $spline->Get(50);
        // создание объекта графика
        $g = new Graph(478, 356); // размеры окна для графика
        $g->SetScale('linlin');
        // формат значений по x
        //$g->xaxis->SetLabelFormat('%1.1f');
        // объект сглаженной кривой
        $lplot = new LinePlot($newy, $newx);
        // ее цвет
        $lplot->SetColor('#69f');
        if ($count == 1) {
            // удаляем виртуальную точку
            array_pop($xpoints);
            array_pop($ypoints);
        }
        if ($count > 0) {
            // точки (ломаная с невидимыми соединительными элементами)
            $splot = new ScatterPlot($ypoints, $xpoints);
            // цвет точек
            $splot->mark->SetFillColor('red@0.3');
            $splot->mark->SetColor('red@0.5');
            // добавление точек на график
            $g->Add($splot);
        }
        // добавление сглаженной кривой на график
        $g->Add($lplot);
        // заголовки типа содержимого
        header('Content-Type: image/png');
        // вывод графика
        $g->Stroke();
        // happy end
        die();
    }
}
