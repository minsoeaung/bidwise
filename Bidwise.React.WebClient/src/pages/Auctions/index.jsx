import { useSearchParams } from "react-router-dom";
import { usePaginatedAuctions } from "../../hooks/queries/usePaginatedAuctions";
import { useCreateAuctionItem } from "../../hooks/mutations/useCreateAuctionItem";
import { useEffect } from "react";
import axios from "axios";

const AuctionsPage = () => {
  const [params, setParams] = useSearchParams();

  const { data, isLoading, isFetching, isError, error } = usePaginatedAuctions(
    params.toString()
  );

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(params);
    newParams.set("pageNumber", String(page));
    setParams(newParams);
  };

  const mutation = useCreateAuctionItem();

  useEffect(() => {
    mutation.mutateAsync();
    call();
  }, []);

  const call = async () => {
    const res = await axios.get("api/catalog", {
      headers: { "X-CSRF": 1 },
    });
    const d = res.data;
    console.log("catalog res:", JSON.stringify(d));
  };

  const searchTerm = params.get("searchTerm") || "";

  const clearSearchTerm = () => {
    params.delete("searchTerm");
    setParams(params);
  };

  return <div>Catalog page</div>;
};

export default AuctionsPage;
