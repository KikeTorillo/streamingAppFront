import { useState, useEffect } from 'react'
function useLocalStorage(itemName, intialValue) {

    const [item, setItems] = useState(intialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            try {
                let localStorageItems = localStorage.getItem(itemName);
                if (!localStorageItems) {
                    localStorage.setItem(itemName, JSON.stringify(intialValue));
                } else {
                    const parsedItem = JSON.parse(localStorageItems);
                    setItems(parsedItem);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error);
            }
        }, 2000);
    }, []);

    const saveItem = (newItems) => {
        setItems(newItems);
        localStorage.setItem(itemName, JSON.stringify(newItems));
    };

    return { item, saveItem, loading, error };
}

export { useLocalStorage };