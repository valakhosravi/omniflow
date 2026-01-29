import axios from "axios";

const app = axios.create({
  baseURL: "",
  withCredentials: true,
});

app.interceptors.request.use(
  (res) => res,
  (err) => Promise.reject(err)
);

// Response interceptor removed - refresh token is now handled by RTK Query baseQuery

const http = {
  get: app.get,
  post: app.post,
  delete: app.delete,
  put: app.put,
  patch: app.patch,
};

export default http;
