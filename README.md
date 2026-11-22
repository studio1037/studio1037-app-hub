# Studio1037 App Hub

Единый каталог приложений Studio1037. Без фреймворка и backend; GitHub Pages публикует статический `index.html`, который читает `apps.json`.

## Адреса
- Production (текущая main): https://studio1037.github.io/studio1037-app-hub/
- GitHub: https://github.com/studio1037/studio1037-app-hub
- DEV: **не развёрнут**. Наличие ветки само по себе не создаёт DEV URL.

## Release workflow
1. Изменения — в `feature/*`; `main` соответствует production.
2. Заполнить `apps.json`, указав **проверенные** адреса и точную дату `checkedAt` только после реальной проверки.
3. Выполнить `node --test tests/registry.test.mjs` и ручные smoke tests на desktop/mobile/tablet.
4. Открыть PR к `main`. Записать результаты проверки.
5. Merge и публикация на production — **только после одобрения Product Owner**.
6. Отдельный DEV-хостинг (например, Cloudflare Pages с branch alias) должен быть настроен и проверен до публикации какого-либо DEV URL в реестре.

## Формат `apps.json`
Корень: `schemaVersion`, `registryVersion`, `updatedAt`, `statusValues`, `apps`.
Карточка: `id`, `name`, `description`, `production`, `development`, `github`, `stableVersion`, `developmentVersion`, `status`, `note`.
`production` и `development` содержат `url` (либо `null`), `status`; production дополнительно `checkedAt` (YYYY-MM-DD либо null), `verification`.

Статусы: **Verified**, **In Development**, **Not Deployed**, **Needs Verification**, **Archived**.

**Verified** для публичной страницы означает, что проверен доступ к интерфейсу по соответствующему адресу; полноту функционального тестирования указывают отдельно в `verification`. Состояние приложения `status` не следует смешивать со статусом конкретной ссылки. Не копируйте даты коммитов в `checkedAt`.

## Проверка
```sh
node --test tests/registry.test.mjs
python3 -m http.server 8000
```
Открыть http://localhost:8000 (через `file://` загрузка JSON может быть заблокирована). Проверить пять карточек, поиск, ссылки, кнопку копирования, режимы 320px/768px/desktop, клавиатуру и состояние недоступного JSON.

Никаких секретов или персональных данных не хранить в публичном реестре.
