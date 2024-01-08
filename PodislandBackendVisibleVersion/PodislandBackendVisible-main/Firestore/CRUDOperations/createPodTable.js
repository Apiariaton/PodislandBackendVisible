function createPodTable(podKeys,default_value=0)
{
try //Create a table for with a given set of keys and values
{
    const podTable = podKeys.reduce((acc,value)=>{acc[value] = 0;return acc},{});  
    console.log(podTable,Object.keys(podTable),Object.values(podTable)); 
    return podTable
}
catch (e)
{
    console.log(e);
    return null;
}
};

module.exports = createPodTable;