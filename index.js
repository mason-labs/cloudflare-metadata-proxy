
import { ethers } from "ethers"; // ethers is the library that allows us to interact with the contract through remote procedure calls
import abi from "./abi.json"; // the abi is available to you when you compile the contract itself. just add it to a json file and import here


async function handleRequest(request) { 

const contractaddress = `0xee013a36c63fa503862cc18eafe4a0e9ea60ccad` // contract address
const web3endpoint =  `https://rpc.ankr.com/polygon`  // you can change this to match your own endpoint and network. 

// the provider below connects to thwe web 3 endpoint so that you can interact with the contract and read information from it 
const provider = new ethers.providers.StaticJsonRpcProvider(
  {
    url:      web3endpoint,
    skipFetchSetup:true
  }
      );    
  
      const contract = await new ethers.Contract(
        contractaddress,
        abi,
        provider
      );
    
// the variable below is what we will use to check if the contract is in a revealed state

  const revealed = await contract.revealed()

  //the variables below take the desired file from the URL, isolating the png or json file desired, depending on the input.
  
  const url = await new URL(request.url )

  
  try{

// the key is taken from the url pathname  )


const key =  url.pathname.slice(1);

// the keyint variable takes the key, which is the file name, and converts the numerical part into an actual integer


if(!key.includes(`png`) && !key.includes(`json`)){

return new Response(`Please enter a valid file name. You can query for a png or json file. Use a forward slash after the URL.`, {status: 400})
}

const keyint = await parseInt(key.split('.')[0])




    //we pass the keyint (corresonding to the token ID) to the contract tokenURI method, which returns the tokenURI (metadata location) for that ID
    //the reason it's called minted is that it will return an error if the token is not minted

    const minted = await contract.tokenURI(keyint)
  



  //if statement below applies conditional logic to check if the request is for a metadata file. If yes, it pulls the
  // metadata file and prepares it for processing
if(key.split('.')[1] == 'json'){

  let meta = await fetch(`https://ipfs.unstoppable.gallery/ipfs/QmWJvJnW75GqqBCQ4wbHYFGbcvkb5ydg3QPgM8x7FNSN9F/${keyint}.json`, //you can replace this with your own metadata location
  {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  }
  )

  //the variable below turns the fetched metadata file into a json object
  
  let metaj = await meta.json()
//below, we use the if statement to check if the contract is revealed. If yes, we process the metadata file to mask the true location of the image file, and send
// the metdata file back to the client. If not, we send the metadata file back to the client without any changes, becuase the
// hidden metdata file is fine to show as is. 

  if(revealed==true && metaj !==undefined){
  metaj.image = `https://wart.unstoppable.gallery/${keyint}.png` // you can replace this with your own image location
  }

  // below, we stringify the object so that it can be sent back in a Response 
  const revealed1 = JSON.stringify(metaj)

  return new Response(revealed1, {
    headers: { 'content-type': 'application/json' },
  })

}

    

else{
// if the request is for a png file, we process the png file from its original location and send it back to the client so that
// is served from the worker URL, and not directly from the IPFS URL, which we want to keep hidden until we decide it is safe to reveal


    
  if(key.split('.')[1] == 'png'){

    try{

//Below, we take the file from the ipfs location by a fetch request. Note: Please do not expose your IPFS CID or url to the public unless you really intend to. The URL below 
// is placed for educational purposes, but if you intend on including your own data in a repository, consider keeping the repository private,
// or use environment variables to store sensitive data. That said, anything that's in the worker script will not be visible to those that visit the woerker URL,
// because the javascript code of the worker runs on a server that is not exposed to the public. Just make sure you don't make the code you write here
// visible to others outside your team.

  let imgreq = await new Request(`https://ipfs.unstoppable.gallery/ipfs/QmSDvjumNSseHAwUHQ1iSn3ZQtu6At88TE8aV8eYGiZb7r/${keyint}.png`,
  {'content-type': 'image/png'})
      imgreq = await fetch(imgreq)
  
// we extract the body from the response, because that is what contains the actual image
imgreq = await imgreq.body
 
    // we include the image in a new Response, because it is this step that ensures we do not pass on any headers that show
    // the IPFS CID

return new Response(imgreq, {headers: {'content-type': 'image/png'}})

    }catch(e){
 
      return new Response(e, {
        headers: { 'content-type': 'application/json' },
      })
    }

}





}

}
  catch(error){



 
  
if(error.code=="INVALID_ARGUMENT"){
    return new Response("The server needs to know which file you are looking for. Try including the file name after the URL.", {
        headers: { 'content-type': 'text/plain' },
      })
    
}


    return new Response(JSON.stringify({error}), {
      headers: { 'content-type': 'application/json' },
    })
  
  }

}
 





addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

