import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
////console.log("API URL:", import.meta.env.VITE_API_URL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

async function testarApi() {
  try {
    const response = await fetch(
      'https://backend-app-acs.onrender.com/test'
    );

    console.log('STATUS:', response.status);

    const data = await response.json();

    console.log('DATA:', data);

  } catch (error) {
    console.log('ERRO FETCH:', error);
  }
}

export async function firstSync(db:any){

  const { data } =
    await api.get("/sync/full");

  for(const pessoa of data.pessoas){

    await db.run(
      `INSERT OR REPLACE INTO pessoa
      (id,nome,cpf,sus)
      VALUES(?,?,?,?)`,
      [
        pessoa.id,
        pessoa.nome,
        pessoa.cpf,
        pessoa.sus
      ]
    );
  }
}

testarApi();

export default api;
