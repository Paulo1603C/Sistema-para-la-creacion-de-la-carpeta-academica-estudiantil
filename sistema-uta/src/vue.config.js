module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/mi-Prouectp/' // Esta es la ruta base para producción
      : '/' // Esta es la ruta base para desarrollo
}