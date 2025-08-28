# Система прав доступа и модулей Maprox Observer

## Общая схема системы прав доступа

```
Пользователь → Уровень прав → Права → Модули → Тарифы → Фирма
     ↓              ↓           ↓        ↓         ↓
  x_user    x_right_level   x_right  x_module  x_tariff  x_firm
```

## Основные таблицы

### 1. **x_right** - Права доступа
```sql
id           INT PRIMARY KEY
alias        VARCHAR    -- Уникальный алиас права (например: 'act_devices', 'mon_device')  
name         VARCHAR    -- Человекочитаемое название ('Module Devices', 'Devices')
service      INT        -- Битовая маска сервисов (1=READ, 2=WRITE, 4=CREATE, 8=GRANT)
type         INT        -- Битовая маска типов доступа  
state        INT        -- Состояние записи (1=активно)
```

**Битовые маски service:**
- `1` = READ (чтение)
- `2` = WRITE (запись) 
- `4` = CREATE (создание)
- `8` = GRANT (предоставление доступа другим пользователям/фирмам)
- `15` = ALL (1+2+4+8 = полные права)

### 🔐 **GRANT доступ - подробно:**

**Файлы системы GRANT:**
- `kernel/models/Falcon/Access/Abstract.php` - основная логика
- `kernel/models/Falcon/Action/Rest/Helper/Access.php` - хелперы 
- `kernel/models/Falcon/Action/Rest/Common.php` - REST API операции

**GRANT право позволяет:**
- Предоставлять доступ к объектам другим пользователям (`$accessGrant`)
- Редактировать права доступа (`$accessEdit`) 
- Отзывать доступ (`$accessRevoke`)
- Управлять sharing объектов между фирмами

**Проверка GRANT прав:**
```php
// Проверка глобального права GRANT на тип объекта
Falcon_Access::checkGrant($entityName, $userId);

// В REST API автоматически вызывается при операциях с доступом
$this->getAccessHelper()->checkGrant();
```

**Создание GRANT записи:**
```php
// Создается запись в x_access с правами доступа
$access = new Falcon_Record_X_Access([
    'id_user' => $targetUserId,    // Кому предоставляем
    'id_firm' => $targetFirmId,    // Или фирме
    'right' => $entityType,        // Тип объекта
    'id_object' => $objectId,      // Конкретный объект
    'writeable' => $canWrite,      // Права записи
    'shared' => $isShared,         // Разрешен sharing
    'status' => STATUS_PENDING     // Ожидает подтверждения
]);
```

### 2. **x_module** - Модули системы
```sql
id           INT PRIMARY KEY  
identifier   VARCHAR    -- Идентификатор модуля ('act_devices', 'act_map')
name         VARCHAR    -- Название модуля  
id_right     INT        -- FK на x_right - какое право требуется
location     INT        -- Где показывать модуль (1=index, 2=admin)
actions      TEXT       -- JSON с дополнительными действиями
state        INT        -- Состояние записи
```

### 3. **x_location** - Местоположение модулей  
```sql
id       INT PRIMARY KEY
alias    VARCHAR    -- 'index' или 'admin' 
bitmask  INT        -- 1 для index, 2 для admin
```

### 4. **x_right_level** - Уровни прав (роли)
```sql
id    INT PRIMARY KEY
name  VARCHAR    -- Название роли
```

### 5. Связующие таблицы
- **x_right_level_link_right** - связь уровня прав с конкретными правами
- **x_right_level_link_user** - связь пользователя с уровнем прав  
- **x_tariff_module_link** - связь тарифа с модулями
- **billing_account_tariff** - связь фирмы с тарифом

## Логика работы системы прав

### Этап 1: Аутентификация пользователя
```php
// User.php::isLoggedIn()
$user = Falcon_Model_User::getInstance();
if (!$user->isLoggedIn()) {
    redirect('/auth/');
}
```

### Этап 2: Получение модулей пользователя
```php
// User.php::getModules($location)
public function getModules($location = false) {
    // 1. Получаем фирму пользователя
    $firm = new Falcon_Model_Firm($this->getFirmId());
    
    // 2. Получаем модули из тарифов фирмы
    $modules = $firm->getModules();
    
    // 3. Фильтруем по правам пользователя
    foreach ($modules as $module) {
        if ($this->hasRight((int)$module['id_right'])) {
            $result[] = $module;
        }
    }
    
    // 4. Фильтруем по location (index/admin)
    if ($location) {
        foreach ($modules as $module) {
            if ($module['location'] == $locationId) {
                $finalResult[] = $module;
            }
        }
    }
    
    return $finalResult;
}
```

### Этап 3: Цепочка получения модулей фирмы
```php
// Firm.php::getModules()
foreach ($this->getBillingAccounts() as $account) {
    $tariff = $account->getTariff();
    $tariffModules = $tariff->getModules();  // JOIN с x_tariff_module_link
    $modules = array_merge($tariffModules, $modules);
}
```

### Этап 4: Проверка прав пользователя  
```php
// User.php::hasRight($rightId)
foreach ($this->getRights() as $right) {
    if ($right['id'] == $rightId || $right['alias'] == $rightId) {
        return true;
    }
}
```

### Этап 5: Загрузка frontend модулей
```php
// FrontendController.php::compileUser()
$user = Falcon_Model_User::getInstance();
$modules = $user->getModules($isAdmin ? 'admin' : 'index');

foreach ($modules as $record) {
    $loadList = array_merge($loadList, 
        $compiler->loadModuleData($record['identifier']));
}
```

## Конфигурация модулей во frontend

### frontend/config.yaml - алиасы модулей
```yaml
aliases:
  act_devices: mon/act/device    # Модуль устройств
  act_map: mon/act/map           # Модуль карты  
  act_users: x/act/user          # Модуль пользователей
```

### Структура модуля
```
frontend/o/modules/mon/act/device/
├── config.yaml          # Конфигурация модуля
├── js/
│   ├── module.js        # Основной класс модуля
│   └── ...
├── css/
└── lang/
    ├── ru.js
    └── en.js
```

### config.yaml модуля
```yaml
modules:
  - mon/lib/device       # Зависимые модули
  - mon/obj/device       # Содержит proxy для данных

js:
  - js/module.js         # JavaScript файлы

css:
  - css/style.css        # CSS файлы
```

## Система proxy для данных

### mon/obj/device/js/proxy.js
```javascript
Ext.define('O.mon.proxy.Device', {
    extend: 'O.proxy.Custom',
    id: 'mon_device',              // ID прокси
    needPreload: true,             // Загружать при старте
    model: 'Mon.Device',           // Модель данных
    isRest: true,                  // REST API
    extraParams: {
        '$getaccesslist': 1        // Проверка прав доступа
    }
});
```

## Типичные проблемы и решения

### Проблема: "Proxy not exists"
**Причины:**
1. Модуль не загружен (нет в тарифе)
2. Нет прав у пользователя  
3. Неправильный location модуля
4. Модуль не содержит нужный obj/ с proxy

**Решение:**
1. Проверить: `SELECT * FROM x_tariff_module_link WHERE id_module = ?`
2. Проверить: `User::hasRight($module['id_right'])`  
3. Обновить: `UPDATE x_module SET location = 1 WHERE identifier = ?`
4. Добавить в config.yaml: `modules: - mon/obj/device`

### Проблема: модуль в админке но не в index
**Причина:** `location = 2` вместо `location = 1`

**Решение:**
```sql  
UPDATE x_module SET location = 1 WHERE identifier IN ('act_devices', 'act_map');
```

### Проблема: есть права, но модуль не загружается  
**Причина:** модуль не привязан к тарифу фирмы

**Решение:**
```sql
INSERT INTO x_tariff_module_link (id_tariff, id_module)
VALUES ((SELECT id FROM x_tariff WHERE name = 'monitoring_free'), module_id);
```

## Создание нового модуля - пошаговая инструкция

### 1. Создать право в базе
```sql
INSERT INTO x_right (id, alias, name, service, type, state) 
VALUES (30, 'module_map', 'Модуль: Карта', 15, 15, 1);
```

### 2. Создать модуль в базе  
```sql
INSERT INTO x_module (id, id_right, name, identifier, location, state)
VALUES (13, 30, 'Модуль: Карта', 'act_map', 1, 1);
```

### 3. Привязать к тарифу
```sql  
INSERT INTO x_tariff_module_link (id_tariff, id_module)
VALUES (tariff_id, 13);
```

### 4. Назначить право пользователю
```sql
INSERT INTO x_right_level_link_right (id_right_level, id_right)
SELECT rlu.id_right_level, 30 FROM x_right_level_link_user rlu 
JOIN x_user u ON rlu.id_user = u.id WHERE u.login = 'username';
```

### 5. Добавить алиас во frontend/config.yaml
```yaml
aliases:
  act_map: mon/act/map
```

### 6. Создать структуру модуля
```
frontend/o/modules/mon/act/map/
├── config.yaml
├── js/module.js
└── css/style.css
```

### 7. Очистить кеш
```bash
del /q cache\compiled\*
del /q cache\zend\*  
```

## Отладка системы прав

### Полезные SQL запросы:

```sql
-- Права пользователя
SELECT r.alias, r.name FROM x_right r
JOIN x_right_level_link_right rlr ON r.id = rlr.id_right  
JOIN x_right_level_link_user rlu ON rlr.id_right_level = rlu.id_right_level
JOIN x_user u ON rlu.id_user = u.id
WHERE u.login = 'username';

-- Модули тарифа фирмы
SELECT m.identifier, m.name, m.location, r.alias as right_alias
FROM x_module m
JOIN x_tariff_module_link tml ON m.id = tml.id_module
JOIN billing_account_tariff bat ON tml.id_tariff = bat.id_tariff
JOIN billing_account ba ON bat.id_account = ba.id  
JOIN x_right r ON m.id_right = r.id
WHERE ba.id_firm = firm_id AND bat.edt IS NULL;

-- Проверка всей цепочки для пользователя
SELECT 
    u.login,
    m.identifier as module,
    m.location,
    r.alias as required_right,
    CASE WHEN ur.id IS NOT NULL THEN 'YES' ELSE 'NO' END as has_right
FROM x_user u
JOIN billing_account ba ON ba.id_firm = u.id_firm
JOIN billing_account_tariff bat ON bat.id_account = ba.id AND bat.edt IS NULL
JOIN x_tariff_module_link tml ON tml.id_tariff = bat.id_tariff  
JOIN x_module m ON m.id = tml.id_module
JOIN x_right r ON r.id = m.id_right
LEFT JOIN (
    SELECT DISTINCT r2.id FROM x_right r2
    JOIN x_right_level_link_right rlr2 ON r2.id = rlr2.id_right
    JOIN x_right_level_link_user rlu2 ON rlr2.id_right_level = rlu2.id_right_level
    WHERE rlu2.id_user = u.id
) ur ON ur.id = r.id
WHERE u.login = 'username'
ORDER BY m.identifier;
```

## Архитектура frontend

### Загрузка модулей в приложении:
1. **O.app.launch()** - инициализация приложения
2. **O.manager.Model.init()** - регистрация всех proxy
3. **FrontendController::compileUser()** - компиляция JS с модулями пользователя
4. **O.ui.Desktop.getModules()** - получение списка модулей для отображения

### Система proxy и stores:
- **Proxy** - определяет откуда брать данные (REST API endpoint)
- **Model** - структура данных  
- **Store** - коллекция записей модели
- **getStore('mon_device')** - получение store по ID прокси

Эта документация поможет понимать и отлаживать систему прав доступа в Maprox Observer.
