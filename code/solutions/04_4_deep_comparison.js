function deepEqual(value1, value2){
    if((value1 && value2) && (value1.length == value2.length)){

       if(value1[Object.keys(value1)[0]] !== value2[Object.keys(value2)[0]]){
            return false;
       }
       else{
           if(Object.keys(value1).length>1){
                delete value1[Object.keys(value1)[0]];
                delete value2[Object.keys(value2)[0]];
                return deepEqual(value1, value2);
            }
            else return true;
       }
    }
    else if(value1 === value2) return true;
    else {
        return false;}
}

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
