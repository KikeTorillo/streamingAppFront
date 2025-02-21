import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function useQueryParams () {
    const { search } = useLocation();
    const [queryParams, setQueryParams] = useState({});
    function onDecodeSearch(param){
        const replaceCharacters = param.replace('?','');
        const splitString = replaceCharacters.split('&'); 
        const formatedQuerys = {};
        splitString.forEach(query => {
            const [key,value] = query.split('=');
            Object.assign(formatedQuerys,{
                [key]: value
            })
        });
        setQueryParams(formatedQuerys);
    }

    useEffect(() => {
        onDecodeSearch(search);
    },[search])

    return queryParams;
}

export { useQueryParams };