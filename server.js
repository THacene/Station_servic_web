const express = require('express');
const bodyParser = require('body-parser');
const servicesRoutes = require('./routes/services');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const { schema, root } = require('./graphql/schema');
const cors = require('cors');
const app = express();

// Configuration CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'SOAPAction', 'Accept'],
  exposedHeaders: ['Content-Type', 'SOAPAction'],
  credentials: true
};

// Middleware CORS
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// إعداد EJS كمحرك عرض
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use('/api', servicesRoutes);

// الملفات الثابتة (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// الصفحة الرئيسية تعرض index.ejs
app.get('/', (req, res) => {
  res.render('index');
});

// GraphQL
app.use('/graphql', cors(corsOptions), graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
  customFormatErrorFn: (err) => {
    console.error('Erreur GraphQL:', err);
    return {
      message: err.message,
      locations: err.locations,
      path: err.path
    };
  }
}));

// --- SOAP ---
const soap = require('soap');
const fs = require('fs');

const wsdlXml = fs.readFileSync(path.join(__dirname, 'soap/wsdl.xml'), 'utf8');
const soapService = require('./soap/service');

// Configuration SOAP
app.use('/soap', (req, res, next) => {
  console.log('Requête SOAP reçue:', req.url);
  next();
});

// Endpoint WSDL
app.get('/soap/wsdl', (req, res) => {
  res.set('Content-Type', 'application/xml');
  res.send(wsdlXml);
});

// Configuration du serveur SOAP
soap.listen(app, '/soap/wsdl', soapService, wsdlXml, (err) => {
  if (err) {
    console.error('Erreur lors de la configuration du serveur SOAP:', err);
  } else {
    console.log('Serveur SOAP configuré avec succès');
  }
});

// Démarrer le serveur Express sur le port 3000
const server = app.listen(3000, () => {
  console.log('Serveur REST sur http://localhost:3000');
  console.log('Serveur GraphQL sur http://localhost:3000/graphql');
  console.log('Serveur SOAP sur http://localhost:3000/soap/wsdl');
});
