import axios from "axios"

const LOCALURL = 'http://localhost:5000/api/apolloapi'

export function manualSearch(data:any){
    return axios.post(`${LOCALURL}/peopleSearch`,data)
}


export function statusAutomation(){
    return axios.get(`${LOCALURL}/statusAutomation`)
}

export function startAutomation(){
    return axios.post(`${LOCALURL}/startAutomation`)
}


export function stopAutomation(){
    return axios.post(`${LOCALURL}/stopAutomation`)
}


export function processDetail(){
    return axios.post(`${LOCALURL}/processDetail`)
}

export function getFileList(){
    return axios.get(`${LOCALURL}/filesList`)
}

export function downloadFile(name:string){
    return axios.get(`${LOCALURL}/downloadFile/${name}`)
}


export function chat(data:any){
    return axios.post(`http://localhost:5000/chat`,data)
}