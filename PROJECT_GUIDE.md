# Maprox Observer Web Application - Справочное руководство

## Общее описание проекта

**Maprox Observer** - это веб-приложение для мониторинга транспорта и управления активами. Система предоставляет функции отслеживания местоположения устройств, анализа данных, биллинга и управления пользователями.

## Архитектура проекта

### Технический стек
- **Backend**: PHP (Zend Framework 1.x)
- **Frontend**: ExtJS 4.x (JavaScript)
- **Database**: PostgreSQL
- **Message Queue**: RabbitMQ (AMQP)
- **Real-time**: Node.js + Socket.IO
- **Caching**: Redis (через Predis)
- **Dependencies**: Composer

### Структура директорий

```
o2-web/
├── kernel/           # Backend PHP код
│   ├── controllers/ # MVC контроллеры
│   ├── models/      # Модели и маппера данных
│   │   └── Falcon/  # Основной фреймворк
│   ├── views/       # Шаблоны (.tpl файлы)
│   └── boot.php     # Точка входа системы
├── frontend/        # Frontend JavaScript код
│   ├── c/          # Common модули
│   ├── o/          # Observer модули (основные)
│   ├── m/          # Mobile модули
│   └── config.yaml # Конфигурация фронтенда
├── public/         # Веб-доступная директория
├── jobs/           # Фоновые задачи
├── vendor/         # Composer зависимости
└── cache/          # Кеш файлы
```

## Ключевые компоненты

### 1. Система пользователей и аутентификация
- **Модель**: `Falcon_Model_User` (Singleton)
- **Контроллер**: `AuthController`
- **Функции**:
  - Аутентификация через логин/пароль или API ключ
  - Система прав доступа (`hasRight()`)
  - Управление сессиями
  - Уведомления пользователей

### 2. Модульная архитектура фронтенда
- **Конфигурация**: `frontend/config.yaml` с алиасами модулей
- **Основные модули**:
  - `act_map` - карта мониторинга
  - `act_devices` - управление устройствами
  - `act_billing` - биллинг
  - `act_reports` - отчеты
  - `act_users` - управление пользователями

### 3. База данных (PostgreSQL)
- **Основные таблицы**:
  - `x_user` - пользователи
  - `x_firm` - организации
  - `x_person` - персональные данные
  - `mon_device` - устройства мониторинга
  - `mon_vehicle` - транспортные средства
  - Функции БД для логики (например: `web_user_exists2()`)

### 4. Система уведомлений
- **Message Queue**: RabbitMQ для асинхронной обработки
- **Node.js**: Real-time уведомления через WebSocket
- **Jobs**: Фоновая обработка в `jobs/` директории

## Конфигурация

### Environment переменные
```bash
DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
AMQP_HOST, AMQP_USER, AMQP_PASSWORD
NODE_HOST, NODE_HOST_SSL
MAPS_KEYS_YANDEX_*
KEY_SALT
```

### Основные конфиги
- `kernel/config.dev.php` - основная конфигурация
- `kernel/config.local.php` - локальные настройки
- `frontend/config.yaml` - настройки фронтенда

## Falcon Framework

Собственный фреймворк поверх Zend Framework:

### Основные классы:
- `Falcon_Model_Abstract` - базовая модель
- `Falcon_Record_Abstract` - запись таблицы
- `Falcon_Mapper_*` - работа с данными
- `Falcon_Controller_*` - контроллеры
- `Falcon_Message` - стандартный ответ API

### Паттерны проектирования:
- **Singleton**: `Falcon_Model_User::getInstance()`
- **Mapper**: Отделение логики работы с БД
- **Factory**: `Falcon_Manager_Notice_Factory`

## Система джобов (Background Jobs)

### Структура:
- `jobs/abstract.php` - базовый класс
- `jobs/starter.php` - запуск джобов
- `jobs/*/` - конкретные джобы по категориям

### Типы джобов:
- `mon/device.php` - обработка данных устройств
- `mon/track.php` - обработка треков
- `x/notification.php` - уведомления

## REST API

### Роутинг:
- REST роуты автоматически генерируются для основных сущностей
- Поддержка стандартных HTTP методов (GET, POST, PUT, DELETE)
- Авторизация через API ключи или сессии

### Основные эндпоинты:
```
/x_user          - пользователи
/mon_device      - устройства
/mon_vehicle     - транспорт  
/x_firm          - организации
/auth/login      - аутентификация
```

## Фронтенд архитектура

### ExtJS компоненты:
- **Desktop**: `O.ui.Desktop` - основной интерфейс
- **Modules**: Модульная система с автозагрузкой
- **Proxy**: `O.manager.Model` - работа с API
- **State**: Сохранение состояния интерфейса

### Конфигурация модулей (YAML):
```yaml
modules:
  - common/act/settings
  - mon/act/map
  - act/devices

js:
  - js/control/app.js

css:
  - css/style.css
```

## Система прав доступа

> 📋 **Подробная документация**: См. [ACCESS_SYSTEM.md](ACCESS_SYSTEM.md) для полного описания системы прав, модулей и их взаимодействия.

### Краткое описание:
- **Цепочка**: Пользователь → Уровень прав → Права → Модули → Тарифы → Фирма
- **Основные таблицы**: `x_right`, `x_module`, `x_tariff_module_link`, `x_right_level_link_*`
- **Location модулей**: `1` = index (основное приложение), `2` = admin (админка)
- **Проверка прав**: `$user->hasRight($rightId)` и фильтрация по тарифу фирмы

### Типы пользователей:
- Администратор системы
- Администратор фирмы  
- Обычный пользователь

## Мониторинг и логирование

### Логи:
- `Falcon_Logger::getInstance()` - основной логгер
- `logs/` директория с файлами логов
- Категории: auth, job, error

### Мониторинг устройств:
- Real-time данные через WebSocket
- Обработка пакетов в фоновых джобах
- История треков и событий

## Развертывание

### Требования:
- PHP 7.x+
- PostgreSQL 10+
- RabbitMQ
- Redis
- Node.js

### Установка:
1. `composer install`
2. Настройка БД и миграции
3. Конфигурация environment переменных
4. Запуск джобов: `php jobs/job-server.php`

## Полезные команды

```bash
# Запуск конкретного джоба
php jobs/starter.php mon_device

# Запуск всех джобов
php jobs/job-server.php

# Очистка кеша
rm -rf cache/compiled/*
```

## Основные модели и их назначение

### Пользователи и организации:
- `Falcon_Model_User` - пользователи системы
- `Falcon_Record_X_Firm` - организации
- `Falcon_Record_X_Person` - персональные данные

### Мониторинг:
- `Falcon_Record_Mon_Device` - GPS/ГЛОНАСС устройства
- `Falcon_Record_Mon_Vehicle` - транспортные средства
- События и треки устройств

### Система:
- `Falcon_Record_X_Module` - модули системы
- `Falcon_Record_X_Right` - права доступа
- Настройки и конфигурации

## Особенности разработки

### Соглашения:
- Классы в стиле `Falcon_*`
- Таблицы с префиксами (`x_`, `mon_`, `dn_`)
- YAML конфиги для модулей
- JavaScript в ExtJS стиле

### Отладка:
- `$config['debug']` - режим отладки
- Профайлер БД встроен в Zend
- Логирование ошибок и событий

Этот документ предоставляет базовое понимание архитектуры и структуры проекта Maprox Observer для эффективной работы с кодом.
