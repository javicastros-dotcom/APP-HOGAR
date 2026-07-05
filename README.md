# App Hogar (Compra + Tareas)

App web con backend en Node.js/Express y datos guardados en un archivo **SQLite real** (`database.sqlite`) en el servidor. Cualquier persona que entre a la URL ve y edita los mismos datos.

## Estructura

```
webapp/
├── server.js          ← servidor Express + API
├── package.json
├── database.sqlite    ← se crea solo la primera vez que arrancas el servidor
└── public/
    ├── APP.HTML        ← página de inicio con enlaces
    ├── COMPRA.HTML      ← lista de la compra
    └── TAREAS.HTML      ← lista de tareas
```

## Ejecutar en local

```bash
npm install
npm start
```

Abre `http://localhost:3000/APP.HTML`.

## Desplegar en una web (para que 2 personas accedan)

Necesitas un hosting que ejecute Node.js (no vale un hosting de "solo archivos estáticos", porque el backend tiene que correr como proceso). Opciones sencillas y con capa gratuita:

- **Render.com** → "New Web Service", conecta el repo, build command `npm install`, start command `npm start`.
- **Railway.app** → similar, detecta Node automáticamente.
- **Un VPS propio** (DigitalOcean, Hetzner...) → subes la carpeta, `npm install`, y lo dejas corriendo con `pm2` o como servicio systemd.

⚠️ Importante sobre el archivo `database.sqlite`: en la mayoría de plataformas "serverless" (como Vercel) el disco es efímero y se borra en cada despliegue — para que los datos persistan de verdad necesitas un plan/servicio con **disco persistente** (Render y Railway lo ofrecen; en Render se llama "Persistent Disk").

## Compartir con 2 personas

Simplemente comparte la URL pública que te dé el hosting. No hay usuarios ni login: ambas personas entran a la misma web y ven los mismos datos en tiempo casi real (la página se refresca sola cada 4 segundos).

Si más adelante quieres añadir login o distinguir quién hizo qué cambio, se puede añadir sin tocar la estructura de la base de datos.
