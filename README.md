# GutiMotos

Tienda virtual estática de repuestos para motos. HTML, CSS y JavaScript puros, sin servidor. El pedido se cierra por WhatsApp.

```
index.html   Página principal
404.html     Página de error
styles.css    Estilos
config.js     Datos del negocio (WhatsApp, dirección, horarios, redes, políticas)
products.js   Catálogo y compatibilidad
app.js        Lógica: filtros, carrito, WhatsApp, formulario
```

Todos los archivos van en la **raíz** del repositorio (sin carpetas).

## Qué debes reemplazar (datos de ejemplo)
1. **`js/config.js`**: número de WhatsApp (`573000000000`), teléfono, dirección, correo, horarios, redes, envío gratis y textos de garantía y envíos.
2. **`js/products.js`**: todos los productos, precios, marcas, compatibilidad y disponibilidad son de demostración. Verifícalos antes de publicar. Si no estás seguro de una compatibilidad, bórrala de `fits`.
3. **`index.html`**: las opiniones de clientes (busca el comentario «OPINIONES DE EJEMPLO»).
4. **Imágenes**: las ilustraciones se generan en el código. Para usar fotos reales, sube la foto a la raíz del repositorio y agrega `img:"mi-foto.jpg"` al producto en `products.js`.
5. Para que se vea bien al compartir el enlace, agrega en `<head>` una etiqueta `og:image` con la URL completa de una imagen JPG.

## Cómo publicarlo en GitHub Pages
1. Crea una cuenta en github.com y un repositorio público nuevo (por ejemplo `gutimotos`).
2. Sube **el contenido** de esta carpeta (no la carpeta misma): `index.html` debe quedar en la raíz del repositorio.
3. Ve a **Settings > Pages**. En «Source» elige **Deploy from a branch**, rama **main** y carpeta **/ (root)**. Guarda.
4. Espera un par de minutos. Tu tienda quedará en `https://TU-USUARIO.github.io/gutimotos/`.

## Probarlo en tu computador
Abre `index.html` con doble clic. Funciona sin servidor.
