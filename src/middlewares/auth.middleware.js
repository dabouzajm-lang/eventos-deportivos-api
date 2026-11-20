import passport from '../config/passport.config.js';

export const authenticate = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      (error, user, info) => {
        if (error) {
          console.error(
            `Error en la estrategia ${strategy}:`,
            error.name,
            error.message
          );

          return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
          });
        }

        if (!user) {
          const isCurrentStrategy = strategy === 'current';

          return res.status(
            isCurrentStrategy ? 401 : (info?.statusCode ?? 401)
          ).json({
            status: 'error',
            message: isCurrentStrategy
              ? 'No autenticado'
              : (info?.message ?? 'Credenciales inválidas'),
          });
        }

        req.user = user;

        return next();
      }
    )(req, res, next);
  };
};

export const auth = authenticate('current');