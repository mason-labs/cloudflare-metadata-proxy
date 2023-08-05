import { ethers } from "ethers";
import abi from "./abi.json";

async function handleRequest(request: Request) {
  const contractaddress = `0xee013a36c63fa503862cc18eafe4a0e9ea60ccad`;
  const web3endpoint = `https://rpc.ankr.com/polygon`;

  const provider = new ethers.providers.StaticJsonRpcProvider({
    url: web3endpoint,
    skipFetchSetup: true,
  });

  const contract = await new ethers.Contract(
    contractaddress,
    abi,
    provider
  );

  const revealed = await contract.revealed();

  const url = new URL(request.url);

  try {
    const key = url.pathname.slice(1);

    if (!key.includes(`png`) && !key.includes(`json`)) {
      return new Response(
        `Please enter a valid file name. You can query for a png or json file. Use a forward slash after the URL.`,
        { status: 400 }
      );
    }

    const keyint = parseInt(key.split(".")[0]);

    const minted = await contract.tokenURI(keyint);

    if (key.split(".")[1] == "json") {
      let meta = await fetch(
        `https://ipfs.unstoppable.gallery/ipfs/QmWJvJnW75GqqBCQ4wbHYFGbcvkb5ydg3QPgM8x7FNSN9F/${keyint}.json`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );

      let metaj = await meta.json();

      if (revealed == true && metaj !== undefined) {
        metaj.image = `https://wart.unstoppable.gallery/${keyint}.png`;
      }

      const revealed1 = JSON.stringify(metaj);

      return new Response(revealed1, {
        headers: { "content-type": "application/json" },
      });
    } else {
      if (key.split(".")[1] == "png") {
        try {
          let imgreq = new Request(
            `https://ipfs.unstoppable.gallery/ipfs/QmSDvjumNSseHAwUHQ1iSn3ZQtu6At88TE8aV8eYGiZb7r/${keyint}.png`,
            { "content-type": "image/png" }
          );
          imgreq = await fetch(imgreq);

          imgreq = await imgreq.body;

          return new Response(imgreq, { headers: { "content-type": "image/png" } });
        } catch (e) {
          return new Response(e, {
            headers: { "content-type": "application/json" },
          });
        }
      }
    }
  } catch (error) {
    if (error.code == "INVALID_ARGUMENT") {
      return new Response(
        "The server needs to know which file you are looking for. Try including the file name after the URL.",
        {
          headers: { "content-type": "text/plain" },
        }
      );
    }

    return new Response(JSON.stringify({ error }), {
      headers: { "content-type": "application/json" },
    });
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});