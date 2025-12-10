import axios from 'axios';

async function importClients() {
  try {
    const res = await axios.post('http://localhost:3000/clients/import');
    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

importClients();