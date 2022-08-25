This is a cloudflare workers project that takes in requests for NFT metadata and images. It protects the metadata location of un-minted tokens by only serving JSON files pertaining to minted NFTs. It also gates access to images pertaining to un-minted NFTs by.

The default location of the metadata in this project exists, as does the contract on polygon. There is a flaw intentionally placed into one file (the file served when the contract metadata state is "hidden"), so that we can demonstrate the vulnerabilities introduced by carelessly leaving a CID in plain view. 

Until there is a release version on the right side of the github repo, please consider this a preview version that may contain bugs. 

It is designed to work well with contracts such as the Hashlips Lab ERC 721 NFT contract, as well as any contract that uses the ERC 721 standard. Enjoy!
