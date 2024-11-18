const TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const NEW_STORIES_URL = "https://hacker-news.firebaseio.com/v0/newstories.json";
const ITEM_URL = "https://hacker-news.firebaseio.com/v0/item/";
const USER_URL = "https://hacker-news.firebaseio.com/v0/user/";

export interface User {
    about: string,
    created: number,
    id: string,
    karma: number,
    submitted: number[]
}

export interface Item {
    id: number,
    type: "job" | "story" | "comment" | "poll" | "pollopt",
    by: string,
    time: number,
    url: string,
    title: string,
    text: string,
    kids?: number[];
    submitted: number[];
}

export async function getItem(id: number): Promise<Item> {
    const item: Item = await (await fetch(`${ITEM_URL}${id}.json`)).json();
    return item;
}

export async function getComments(list: number[]) {
    return Promise.all(list.slice(0, 30).map(getItem));
}

export async function getStories(which: "top" | "new") {
    const url = which === "top" ? TOP_STORIES_URL : NEW_STORIES_URL;
    const itemIds: number[] = await (await fetch(url)).json();
    return Promise.all(itemIds.slice(0, 30).map(getItem));
}

export async function getUserPosts(list: number[]){
    return Promise.all(list.slice(0, 30).map(getItem));
}

export async function getUser(id: string) {
    const userData: User = await (await fetch(`${USER_URL}${id}.json`)).json();
    return userData;
}