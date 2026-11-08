export function errorMiddleware(err, req, res, next) {
    console.error('🔥 [Erro capturado]: ', err.message);

    const statusCode = err.statusCode || 500;

    const message = err.message || 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.';

    return res.status(statusCode).json({
        status: 'error',
        message: message
    });
}