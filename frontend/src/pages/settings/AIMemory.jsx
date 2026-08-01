import { useEffect, useState } from "react";

import {
  getMemory,
  clearMemory,
} from "../../services/memoryService";


export default function AIMemory() {

  const [
    memory,
    setMemory,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);



  useEffect(()=>{

    async function load(){

      const data =
        await getMemory();

      setMemory(data);

      setLoading(false);

    }


    load();

  },[]);




  const handleClear = async()=>{

    await clearMemory();

    setMemory(null);

  };



  if(loading){

    return (

      <div className="text-white">

        Loading memory...

      </div>

    );

  }



  return (

    <div className="p-6 text-white">


      <h1 className="text-2xl font-bold mb-6">

        Nyxora AI Memory

      </h1>



      {!memory ? (

        <div className="text-gray-400">

          No saved memories.

        </div>

      ) : (

        <div className="bg-[#111827] rounded-xl p-5">


          <pre className="whitespace-pre-wrap text-gray-200">

            {JSON.stringify(
              memory,
              null,
              2
            )}

          </pre>


          <button

            onClick={handleClear}

            className="
              mt-5
              bg-red-600
              px-4
              py-2
              rounded-lg
              hover:bg-red-700
            "

          >

            Clear Memory

          </button>


        </div>

      )}


    </div>

  );

}