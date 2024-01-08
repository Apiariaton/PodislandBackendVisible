function unifyMultiParamsIntoArr(cleanQueryDict,multiParamCommonTerm){

    let cleanQueryDictKeysArr = Object.keys(cleanQueryDict);
    
    let queryArrayForMP = cleanQueryDictKeysArr.reduce((acc,key)=>{
        if (key.includes(multiParamCommonTerm)) //For podcasts, genre
        {
            acc.push(cleanQueryDict[key]);
        }   
        return acc; 
        },[]);


    return queryArrayForMP;

};

module.exports = unifyMultiParamsIntoArr;