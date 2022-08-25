# A Metadata Provider That Only Serves Data for Minted Tokens

This is a cloudflare workers project that takes in requests for NFT metadata and images. 

It protects the metadata (and true file location) of un-minted tokens by only serving JSON files pertaining to minted NFTs. It also gates access to images pertaining to un-minted NFTs by.

It's easier to understand what it does by visiting [the deployed worker itself](https://wart.unstoppable.gallery/1.json) and viewing a JSON file. 

Aside from serving JSON files for metadata, the worker also serves the images pointed to by the metadata.The image below is served from a worker deployed using the codebase in this repo:

![image from worker](https://wart.unstoppable.gallery/4.png)

Above image is obtained from: wart.unstoppable.gallery/4.png.

**How it works:**

Let's assume that your smart contract points to the url "https://wart.unstoppable.gallery/", followed by "1.json" as the token URI for token ID number 1. 

The worker will take that requested url, pull the metadata from the IPFS folder (while masking the CID), and return the JSON file to the client making the request. 

The default location of the metadata in this project exists, as does the contract on polygon. There is a flaw intentionally placed into one file (the file served when the contract metadata state is "hidden"), so that we can demonstrate the vulnerabilities introduced by carelessly leaving a CID in plain view. 

Until there is a release versio 1.0 on the right side of the github repo, please consider this a preview version that may contain bugs. 

It is designed to work well with contracts such as the Hashlips Lab ERC 721 NFT contract, as well as any contract that uses the ERC 721 standard. Enjoy!
