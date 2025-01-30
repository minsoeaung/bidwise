import { useState, useEffect } from "react"
import axios from "axios"

export const CallApi = () => {
    const [response, setResponse] = useState("");

    useEffect(() => {
        call();
        callBidsApi();
        //callCommmentsApi();
    });

    const call = async () => {
        const res = await axios.get("api/catalog/private", {headers: {"X-CSRF": 1}});
        const d = res.data;
        console.log("catalog res:", JSON.stringify(d));
        setResponse(JSON.stringify(d));
    }

    const callCommmentsApi = async () => {
        const res = await axios.get("api/comments", {headers: {"X-CSRF": 1}});
        const d = res.data;
        console.log("comments res:", JSON.stringify(d));
        console.log(d);
    }

    const callBidsApi = async () => {
        const res = await axios.get("api/bids/private", { headers: { "X-CSRF": 1 } });
        const d = res.data;
        console.log("bids res:", JSON.stringify(d));
        //setResponse(JSON.stringify(d));
    }

    return (
        <div>
            <h1> Call API </h1>
            <p>{response}</p>
        </div>
    )
}