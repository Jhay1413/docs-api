export const GenerateId = (lastId: string | null | undefined,type?:string) => {
  const year = new Date().getFullYear();
  var id= "";
  if(type === "ticket"){
    if(!lastId) {
      lastId = `TKT-${year}-0000`  
    }  
  }
  if (!lastId) {
    lastId = `ECC-${year}-0000`
  }
  const parts = lastId.split("-");
  const numericalPart = parts[2];

  let converted_value = parseInt(numericalPart, 10);
  const incremented_value = converted_value + 1;

  const number = String(incremented_value).padStart(4, "0");
  if(type ==="ticket"){
    id = `TKT-${year}-${number}`;
  }
  else{
    id = `ECC-${year}-${number}`;
  }
  return id;
};
