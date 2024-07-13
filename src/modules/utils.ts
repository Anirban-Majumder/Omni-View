/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { MOVIES } from "@consumet/extensions";


export const getSearchResult = async (query: string, type: string, providers?: []) =>{
    switch(type){
        case "movie":
            const flixhq = new MOVIES.DramaCool();
            const res = await flixhq.search(query);
            return res
            break;
        case "anime":
            console.log("sadasd");
            break;
        case "tv":
            console.log("sadasd");
            break;
        case "manga":
            console.log("sadasd");
            break;
    }

}

export const formatTime = (time: number) => {
    let seconds: any = Math.floor(time % 60),
        minutes: any = Math.floor(time / 60) % 60,
        hours: any = Math.floor(time / 3600);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;
    if (hours == 0) {
      return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
};
