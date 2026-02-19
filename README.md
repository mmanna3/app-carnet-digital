## Cómo levantar app

### Levantar back y front
    1. Levantar docker 
    2. cd liga/scripts
    3. ./buen-dia.sh

`Para más data, ver README general y README backend`

### Levantar app
    1. npm run start
    2. Credenciales: jperez/consulta mgomez/consulta clopez/consulta
    (si no funciona, fijate de correr en liga-be scripts/insert-datos.sql)


## Deploy iOS al store

`Subir versión en app.json`

Primero `npm run ios:build`

Después `npm run ios:deploy`

## Deploy Android al store

`Subir versión en app.json`

Primero `npm run android:build`

Después `npm run android:deploy`


