export const getSessionsStatus = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Recurso sessions preparado. Autenticación pendiente de implementar.',
  });
};