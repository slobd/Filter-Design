// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {} from '../utils/types';
import Axios from "axios";

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {    
  res.status(200).json({ name: 'John Doe' })
}

export const API = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// API.filter = {
//   getAll: (data) => API.get("/filters", { params: { author: data } }),
//   get: (data) => API.get("/filter", { params: { id: data } }),
//   create: (data) =>
//     API.post(
//       "/filter",
//       { ...data },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     ),
//   delete: (data) => API.delete("/filter", { params: { id: data } }),
// };

// API.campaign = {
//   create: (data) =>
//     API.post(
//       "/campaign",
//       { ...data },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     ),
//   edit: (data) =>
//     API.put(
//       "/campaign",
//       { ...data },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     ),
//   delete: (data) => API.delete("/campaign", { params: { id: data } }),
//   get: (data) => API.get("/campaign", { params: { id: data } }),
//   getBySlug: (data) => API.get("/campaign", { params: { slug: data } }),
//   getAll: (data) => API.get("/campaigns", { params: { author: data } }),
//   getReport: (data) => API.get("/campaign/report", { params: data }),
//   confirmPassword: (data) =>
//     API.get("/campaign/confirm-password", { params: data }),
//   inviteByEmail: (data) => API.post("/campaign/invite-by-email", { ...data }),
// };

// API.gallery = {
//   getAll: (data) => API.get("/galleries", { params: { author: data } }),
//   sendGalleryByEmail: (data) => API.post("/gallery/send", { ...data }),
//   create: (data) =>
//     API.post(
//       "/gallery",
//       { ...data },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     ),
//   delete: (data) => API.delete("/gallery", { params: { id: data } }),
// };

// API.file = {
//   upload: (data) =>
//     API.post(
//       "/upload",
//       { file: data },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     ),
// };

// API.placeholder = {
//   getAll: () => API.get("/placeholders"),
//   create: (data) =>
//     API.post(
//       "/placeholder",
//       { ...data },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     ),
// };

// API.tag = {
//   getAll: () => API.get("/tags"),
//   create: (data) => API.post("/tag", { ...data }),
// };

// API.contact = {
//   getAll: (data) => API.get("/contacts", { params: { author: data } }),
//   get: (data) => API.get("/contact", { params: { id: data } }),
//   create: (data) =>
//     API.post(
//       "/contact",
//       { ...data },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     ),
//   bulkImport: (data) => API.post("/contact/import", { contacts: data }),
//   delete: (data) => API.delete("/contact", { params: { id: data } }),
// };

// API.uniqueLink = {
//   getAll: (data) => API.get("/unique-links", { params: { campaign: data } }),
//   create: (data) => API.post("/unique-links", { ...data }),
// };

// export default API;
