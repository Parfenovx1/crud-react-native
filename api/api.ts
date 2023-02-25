import { ListItem } from "../interface";

const API_URL = "https://yourtestapi.com/api/posts/";

export const getItems = async (): Promise<ListItem[]> => {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

export const deleteItem = async (item: ListItem): Promise<void> => {
    await fetch(`${API_URL}${item.id}`, {
        method: 'DELETE',
    })
}

export const saveItem = async (itemID: Number, state: any): Promise<ListItem> => {
    if (itemID === 0) {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "active": state.active,
                "title": state.title,
                "text": state.text,
                "deleted_at": null,
                "created_at": new Date(),
                "updated_at": new Date(),
                "url": state.url,
                "image": state.image,
            }),
        });
        const data = await response.json();
        console.log(data);
        return data;

    } else {
        const response = await fetch(`${API_URL}${itemID}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "active": state.active,
                "title": state.title,
                "text": state.text,
                "deleted_at": null,
                "created_at": new Date(),
                "updated_at": new Date(),
                "url": state.url,
                "image": state.image,
            }),
        });
        const data = await response.json();
        return data;
    }
}