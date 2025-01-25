import { useState, useEffect } from "react"
import axios from "axios"

export const CallApi = () => {
    const [result, setResult] = useState("");


    useEffect(() => {
        call();
    });
    const call = () => {
        const res = axios.get("catalog/nope/me");
        const d = res.data;
        console.log(d);
    }

    return (
        <div>
            <h1> Call API </h1>
        </div>
    )
}