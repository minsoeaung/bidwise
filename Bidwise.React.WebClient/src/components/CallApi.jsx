import { useState, useEffect } from "react"
import axios from "axios"

export const CallApi = () => {
    const [response, setResponse] = useState("");

    useEffect(() => {
        call();
        callCommmentsApi();
    });

    const call = async () => {
        const res = await axios.get("api/catalog/private", {headers: {"X-CSRF": 1}});
        const d = res.data;
        setResponse(JSON.stringify(d));
    }

    const callCommmentsApi = async () => {
        const res = await axios.get("api/employees", {headers: {"X-CSRF": 1}});
        const d = res.data;
        console.log(d);
    }

    return (
        <div>
            <h1> Call API </h1>
            <p>{response}</p>
        </div>
    )
}