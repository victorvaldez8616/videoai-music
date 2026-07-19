# VideoAI Music - Generador de Videos Musicales con IA

Genera clips visuales para tu música usando inteligencia artificial.

## Configuración (Paso a Paso)

### 1. Crear cuenta en Replicate
1. Ve a https://replicate.com
2. Haz clic en "Sign up" y regístrate con tu cuenta de GitHub
3. Ve a Settings → API Tokens
4. Haz clic en "Create token" y cópialo

### 2. Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Haz clic on "Sign up" y regístrate con GitHub
3. Conecta tu cuenta de GitHub

### 3. Subir el código a GitHub
1. Crea un nuevo repositorio en GitHub
2. Sube todos los archivos de este proyecto
3. Asegúrate de que el `.env.example` esté incluido (pero NUNCA subas un archivo `.env` real)

### 4. Desplegar en Vercel
1. En Vercel, haz clic en "Add New Project"
2. Selecciona tu repositorio de GitHub
3. En "Environment Variables", agrega:
   - Nombre: `REPLICATE_API_TOKEN`
   - Valor: tu token de Replicate (r8_...)
4. Haz clic en "Deploy"
5. Espera a que termine de desplegar

### 5. ¡Listo!
Tu app estará online en una URL como `https://tu-proyecto.vercel.app`

## Ejecutar Localmente

```bash
# Instalar dependencias
npm install

# Crear archivo .env con tu token
cp .env.example .env
# Edita .env y agrega tu token real

# Instalar Vercel CLI
npm i -g vercel

# Ejecutar en desarrollo
vercel dev
```

## Costos

- **Vercel**: Gratis para proyectos personales
- **Replicate**: $5 de crédito gratis al registrarse
- **Cada clip de 5 segundos**: ~$0.35
- **Con $5 gratis**: ~14 clips de prueba

## Modelos Disponibles

La app usa `vidu/q3-pro` por defecto. Para cambiar de modelo, edita `api/generate.js` y cambia el campo `model`.

Modelos recomendados:
- `vidu/q3-pro` - $0.07/s (540p) - Buen equilibrio calidad/precio
- `wavespeedai/wan-2.1-t2v-480p` - $0.09/s - Más barato
- `pixverse/pixverse-v6` - $0.05-0.18/s - Alta calidad

## Estructura del Proyecto

```
├── index.html          # Frontend
├── api/
│   ├── generate.js     # Endpoint: crear predicción
│   └── status.js       # Endpoint: consultar estado
├── package.json        # Dependencias
├── vercel.json         # Configuración de despliegue
└── .env.example        # Plantilla de variables
```
