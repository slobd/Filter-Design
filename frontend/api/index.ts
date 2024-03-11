// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {} from '../utils/types';
import Axios, { AxiosInstance } from "axios";

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {    
  res.status(200).json({ name: 'John Doe' })
}

export const API: any = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"
  }
});

const APIService = {
  filter: {
    getAll: (data?: any) => API.get("/filters", { params: { author: data } }),
    get: (data?: any) => API.get("/filter", { params: { id: data } }),
    create: (data: any) =>
      API.post(
        "/filter",
        { ...data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    delete: (data: any) => API.delete("/filter", { params: { ...data } }),
  },

  campaign: {
    create: (data: any) =>
      API.post(
        "/campaign",
        { ...data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    edit: (data: any) =>
      API.put(
        "/campaign",
        { ...data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    delete: (data: any) => API.delete("/campaign", { params: { ...data } }),
    get: (data?: any) => API.get("/campaign", { params: { id: data } }),
    getBySlug: (data: any) => API.get("/campaign", { params: { slug: data } }),
    getAll: (data?: any) => API.get("/campaigns", { params: { author: data } }),
    getReport: (data?: any) => API.get("/campaign/report", { params: data }),
    confirmPassword: (data: any) =>
      API.get("/campaign/confirm-password", { params: data }),
    inviteByEmail: (data: any) => API.post("/campaign/invite-by-email", { ...data }),
  },

  gallery: {
    getAll: (data?: any) => API.get("/galleries", { params: { author: data } }),
    sendGalleryByEmail: (data: any) => API.post("/gallery/send", { ...data }),
    create: (data: any) =>
      API.post(
        "/gallery",
        { ...data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    delete: (data: any) => API.delete("/gallery", { params: { ...data } }),
  },

  file: {
    upload: (data: any) =>
      API.post(
        "/upload",
        { file: data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
  },

  placeholder: {
    getAll: () => API.get("/placeholders"),
    create: (data: any) =>
      API.post(
        "/placeholder",
        { ...data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
  },

  tag: {
    getAll: () => API.get("/tags"),
    create: (data: any) => API.post("/tag", { ...data }),
  },

  contact: {
    getAll: (data?: any) => API.get("/contacts", { params: { author: data } }),
    get: (data?: any) => API.get("/contact", { params: { id: data } }),
    create: (data: any) =>
      API.post(
        "/contact",
        { ...data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    bulkImport: (data: any) => API.post("/contact/import", { contacts: data }),
    delete: (data: any) => API.delete("/contact", { params: { ...data } }),
  },

  uniqueLink: {
    getAll: (data?: any) => API.get("/unique-links", { params: { campaign: data } }),
    create: (data: any) => API.post("/unique-links", { ...data }),
  },
}
export { APIService };
