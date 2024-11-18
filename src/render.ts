import { Item, User } from "./api";

function buildTitle(item: Item) {
    let title = document.createElement('a');
    title.href = item.url;
    title.target = "_blank";
    title.classList.add('link');
    title.innerText = item.title;
    return title;
}

function buildTagElement(item: Item, showComments: boolean = false) {
    let tagElement = document.createElement('div');
    tagElement.classList.add('meta-info');

    let spanA = document.createElement("span");
    spanA.appendChild(document.createTextNode("by "));
    let author = document.createElement('a');
    author.href = '#';
    author.innerText = `${item.by}`;
    author.addEventListener("click", () => {
        document.dispatchEvent(
            new CustomEvent<{ user: string }>("userClick", { detail: { user: item.by } })
        )
    });
    spanA.appendChild(author);
    tagElement.appendChild(spanA);

    let spanB = document.createElement("span");
    let date = document.createElement('div');
    const dateObj = new Date(item.time * 1000);
    date.appendChild(document.createTextNode(`on ${dateObj.toDateString()}, ${dateObj.toLocaleTimeString('en-US')}`));
    spanB.appendChild(date);
    tagElement.appendChild(spanB);

    if (showComments) {
        let spanC = document.createElement("span");
        spanC.appendChild(document.createTextNode(" with "));
        const itemComments = item.kids || [];
        let comments = document.createElement("a");
        comments.href = "#";
        if (itemComments.length > 0) {
            comments.addEventListener("click", () => {
                document.dispatchEvent(
                    new CustomEvent<{ item: Item }>("commentsClick", { detail: { item: item } })
                )
            });
        }
        comments.innerText = `${itemComments.length}`;
        spanC.appendChild(comments);
        spanC.appendChild(document.createTextNode(" comments"));
        tagElement.appendChild(spanC);
    }
    return tagElement;
}

export function renderStories(which: Item[]) {
    let newContent = document.createElement("ul");
    which.forEach((item) => {
        if (!item.url || !item.title) return;
        let itemElement = document.createElement("li");
        itemElement.classList.add("post");
        const title = buildTitle(item);
        itemElement.appendChild(title);

        const tagElement = buildTagElement(item, true);
        itemElement.appendChild(tagElement);
        newContent.appendChild(itemElement);
    })
    return newContent;
}

export function renderComments(which: Item, comments: Item[]) {
    let container = document.createElement("div");
    let header = document.createElement("h1");
    header.classList.add("header");
    const title = buildTitle(which);
    header.appendChild(title);
    container.appendChild(header);

    const tagElement = buildTagElement(which);
    container.appendChild(tagElement);
    container.appendChild(document.createElement("p"));

    comments.forEach((item) => {
        let cContainer = document.createElement("div");
        cContainer.classList.add("comment");

        let cTag = buildTagElement(item);
        cContainer.appendChild(cTag);

        let cText = document.createElement("p");
        cText.innerHTML = item.text;
        cContainer.appendChild(cText);

        container.appendChild(cContainer);
    });

    return container;
}

export function renderUser(which: User, posts:Item[]) {
    let container = document.createElement("div");
    let header = document.createElement("h1");
    header.classList.add("header");
    header.innerText = which.id;
    container.appendChild(header);
    
    let tagElement = document.createElement('div');
    tagElement.classList.add('meta-info');
    tagElement.appendChild(document.createTextNode("joined "));
    const dateObj = new Date(which.created * 1000);
    tagElement.appendChild(document.createTextNode(`${dateObj.toDateString()}, ${dateObj.toLocaleTimeString('en-US')}`));
    tagElement.appendChild(document.createTextNode(` has ${which.karma} karma`));
    tagElement.appendChild(document.createElement("p"));
    container.appendChild(tagElement);
    let title = document.createElement("h2");
    title.innerText = "Posts";
    container.appendChild(title);

    const userPosts = renderStories(posts);
    container.appendChild(userPosts);

    return container;
}