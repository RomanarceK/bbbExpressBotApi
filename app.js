const express = require('express');
const xml2js = require('xml2js');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.raw({ type: '*/*' }));

// app.use(bodyParser.xml());
app.post('/consultar-envio', async (req, res) => {
  try {
    const rawBody = req.query.xml;
    const xmlString = rawBody.toString('utf8');

    xml2js.parseString(xmlString, (err, result) => {
      if (err) {
        console.error('Error al parsear la respuesta XML:', err);
        res.status(500).send('Error al parsear la respuesta XML');
        return;
      }

      const comentario = result['soap:Envelope']['soap:Body'][0]['Trazabilidad_EnvioResponse'][0]['Trazabilidad_EnvioResult'][0]['diffgr:diffgram'][0]['NewDataSet'][0]['Table'][0]['comentario'][0];
      const fechayhora = result['soap:Envelope']['soap:Body'][0]['Trazabilidad_EnvioResponse'][0]['Trazabilidad_EnvioResult'][0]['diffgr:diffgram'][0]['NewDataSet'][0]['Table'][0]['fechayhora'][0];

      const mensaje = `El estado de su envío es: ${comentario}, y la última actualización fue el: ${fechayhora}`;
      res.status(200).send(mensaje);
    });
  } catch (error) {
    console.error('Error al consultar la API externa:', error);
    res.status(500).send('Error al consultar la API externa');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});