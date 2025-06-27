const jwt = require('jsonwebtoken');

// É crucial que este segredo seja o mesmo usado pelo auth-service para assinar o token
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    if (!JWT_SECRET) {
        console.error("ERRO: JWT_SECRET não está definido nas variáveis de ambiente do Gateway.");
        return res.status(500).json({ error: 'Erro de configuração interna do servidor.' });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido ou em formato inválido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verifica se o token é válido e decodifica seu conteúdo
        const decoded = jwt.verify(token, JWT_SECRET);

        // Adiciona os dados decodificados (payload) à requisição para uso futuro, se necessário
        req.user = decoded; 

        // Se o token for válido, permite que a requisição continue para o serviço de destino
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado. Por favor, autentique-se novamente.' });
        }
        console.error("Erro ao verificar token:", error.message);
        return res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;