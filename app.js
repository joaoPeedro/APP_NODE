const express = require("express");
const cors = require("cors");
const app = express();
const port = 3120;

// Lista de IPs autorizados na whitelist
const whitelist = [
  "192.168.1.1",
  "10.0.0.1",
  "http://localhost:3120",
  "http://localhost:3000",
  "https://app-node-beta.vercel.app/",
];

// Endereço IP da sua VPN
const vpnIpAddress = ["93.176.86.249", "127.0.0.1"]; // Substitua pelo IP da sua VPN

// Middleware para verificar o IP
const checkVpnIp = (req, res, next) => {
  const clientIp = req.ip; // Obtém o IP do cliente da solicitação

  console.log("CLIENT IP", { clientIp });

  // Verifica se o IP está na whitelist (sua VPN)
  if (vpnIpAddress.includes(clientIp)) {
    next(); // IP autorizado, permite acesso
  } else {
    res.status(403).send("Acesso proibido"); // IP não autorizado, bloqueia acesso
  }
};

// Aplica o middleware de verificação de IP
app.use(checkVpnIp);

// Middleware de whitelist
const whitelistMiddleware = (req, res, next) => {
  const clientIp = req.ip; // Obtém o IP do cliente da solicitação

  console.log(clientIp);

  // Verifica se o IP está na whitelist
  if (whitelist.includes(clientIp)) {
    next(); // IP autorizado, permite acesso
  } else {
    res.status(403).send("Acesso proibido IP em falta"); // IP não autorizado, bloqueia acesso
  }
};

// Aplica o middleware de whitelist em todas as rotas
// app.use(whitelistMiddleware);

// Adiciona o middleware CORS para todas as rotas
// app.use(cors());

// Rota protegida pela whitelist
app.get("/", (req, res) => {
  res.send("Hello, World! IP autorizado.");
});

const corsOptions = {
  origin: function (origin, callback) {
    console.log({ origin });
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.get("/batatas", cors(corsOptions), (req, res) => {
  res.send({ message: "Hello, World batatas!" });
});

app.listen(port, () => {
  console.log(`Servidor ouvindo em http://localhost:${port}`);
});
