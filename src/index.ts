import { getComments, getStories, getUser, getUserPosts, Item } from "./api";
import { renderComments, renderStories, renderUser } from "./render";

const contentDiv = document.getElementById("content")!;
init();

export async function showStories(which:"top"|"new"){
    const nowInactive = which === "top" ? "new" : "top";
    const otherButton = document.getElementById(nowInactive);
    otherButton?.classList.remove("active");
    const currentButton = document.getElementById(which);
    currentButton?.classList.add("active");
    showLoading();
    const storyData = await getStories(which);
    const storyElement = renderStories(storyData);
    changeContent(storyElement);
}

export async function showUser(which:string){
    showLoading();
    const userData = await getUser(which);
    const userSubmitted = userData.submitted || [];
    const userPosts = await getUserPosts(userSubmitted);
    const userElement = renderUser(userData, userPosts);
    changeContent(userElement);
}

export async function showComments(which:Item){
    showLoading();
    if(which.kids && which.kids.length>0){
        const commentData = await getComments(which.kids);
        const commentElement = renderComments(which, commentData);
        changeContent(commentElement);
    }
}

function init(){
    showStories("top");
    document.addEventListener("commentsClick", ((event: CustomEvent) => {
        showComments(event.detail.item);
     }) as EventListener);

    document.addEventListener("userClick", ((event:CustomEvent) => {
        showUser(event.detail.user);
    }) as EventListener);
}

function showLoading(){
    contentDiv.innerHTML = "Loading...";
}

function changeContent(to:HTMLElement){
    contentDiv.innerHTML = "";
    contentDiv.appendChild(to);
}

export function toggleStyle(){
    const isDark = document.body.classList.contains("dark");
    if(isDark){
        document.body.classList.remove("dark");
    }else{
        document.body.classList.add("dark");
    }
    let toggleBtn = document.getElementById("styleBtn");
    if(toggleBtn){
        toggleBtn.innerHTML = isDark ? "🔦": "💡";
    }
}