import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export default function useContent() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    async function getContents() {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setContents(response.data.content);
    }

    getContents();
  }, []);
  return contents;
}
