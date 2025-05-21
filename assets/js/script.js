require('dotenv').config();

const https = require('https');


async function consumirApiSymplaNativo() {
  const url = process.env.SYMPLA_API_URL;
  const token = process.env.SYMPLA_API_TOKEN; // Substitua pelo seu token real

  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        's_token': token
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });

      res.on('error', (err) => {
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

consumirApiSymplaNativo()
  .then((dados) => {
    if (dados && dados.data && Array.isArray(dados.data)) {
      const eventosFiltrados = dados.data
        .filter(evento => evento.reference_id === parseInt(process.env.REFERENCE_ID)) // Filtra pelo reference_id
        .map((evento) => ({
          reference_id: evento.reference_id,
          name: evento.name,
          start_date: evento.start_date,
          end_date: evento.end_date,
          image: evento.image,
          url: evento.url,
        }));
      console.log(JSON.stringify(eventosFiltrados, null, 2));
    } else {
      console.log('Estrutura de dados inválida.');
    }
  })
  .catch((erro) => console.error('Ocorreu um erro:', erro));