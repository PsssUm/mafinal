import { getDatabase,ref, set, onValue } from "firebase/database";

export function saveUserInDb(db, user) {
    
    set(ref(db, 'albums/' + user.user.id), user);
}
export function getRandomInt(max) {
    const min = 1
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor( rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
}

export const addLocation = (location) => {
    var locations = getSavedLocation()
    if (locations == null || locations == undefined){
        locations = []
    }
    locations.push(location)
    localStorage.setItem('locations', JSON.stringify(locations));
}
export const getSavedLocation = () => {
    return JSON.parse(localStorage.getItem('locations'))
};

export function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? undefined : decodeURIComponent(sParameterName[1]);
        }
    }
};

export const declension = (count, one, two, five) => {
    var realCount = parseInt(count);
  
    if (realCount > 100)
    realCount %= 100;
  
    if (realCount > 20)
    realCount %= 10;
  
    switch (realCount) {
        case 1:
            return one;
        case 2:
        case 3:
        case 4:
            return two;
        default:
            return five;
    }
  }