import { useEffect, useState } from "react";

function useAsync(page) {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchList() {
      try {
        setLoading(true);
        const response = await fetch(`/get_data?page=${page}&limit=10`);

        const data = await response.json();
        setResult(data);
      } catch (error) {
        setLoading(false);
      }
    }

    if (page !== "") {
      fetchList();
    }
  }, [page]);

  return [result, loading];
}
