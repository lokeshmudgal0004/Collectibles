//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.28;

interface IERC721 {
  function transferFrom(
    address _from,
    address _to,
    uint256 id
  ) external;
}

contract Escrow {
    address public nftAddress;
    address public artist;
    address public verifier;

    modifier onlySeller() {
        require(msg.sender == artist, "Only seller can call this method");
        _;
    }

    modifier onlyBuyer(uint256 _nftId) {
      require(msg.sender == buyer[_nftId] , "Only buyer can call this method");
      _;
    }

    modifier onlyVerifier() {
      require(msg.sender == verifier , "Only art verifier can call this method");
      _;
    }

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchaseAmount;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => uint256) public escrowDeposited;
    mapping(uint256 => bool) public isVerified;
    mapping(uint256 => mapping(address => bool)) public approval;

    constructor (
      address _nftAddress,
      address _seller,
      address _verifier
    ) {
      nftAddress = _nftAddress;
      artist = _seller;
      verifier = _verifier;
    }

    function list(uint256 _nftId , uint256 _purchasePrice , uint256 _escrowPrice ) public payable onlySeller {
      IERC721(nftAddress).transferFrom(msg.sender , address(this) , _nftId);

      isListed[_nftId] = true;
      purchaseAmount[_nftId] = _purchasePrice;
      escrowAmount[_nftId] = _escrowPrice;
    }

    //pay escrow fees and get under contract
    function depositEscrow(uint256 _nftId) public payable {
      require(isListed[_nftId] , "property not listed yet");
      require(buyer[_nftId] == address(0) , "already registered");
      require(msg.value >= escrowAmount[_nftId] , "not sufficient escrow");

      escrowDeposited[_nftId] = msg.value;
      buyer[_nftId] = msg.sender;
    }

    //verify if the artpiece is not stolen or already listed on some other blockchain
    function verifyStatus(uint256 _nftId , bool _passed) public onlyVerifier {
      isVerified[_nftId] = _passed;
    }

    //sale have to be approved from all parties
    function approveSale(uint256 _nftId) public {
      approval[_nftId][msg.sender] = true;
    }

    //finalise the sale of NFT
    //transfert the purchase amount from this contract to artist
    //transfer the ownership from contract to the buyer
    function finalizeSale(uint256 _nftID) public {
        // 1. Check approvals
        require(approval[_nftID][artist], "Seller has not approved");
        require(approval[_nftID][buyer[_nftID]], "Buyer has not approved");
        require(approval[_nftID][verifier], "Verifier has not approved"); 

        // 2. Check funds
        uint256 price = purchaseAmount[_nftID];
        require(address(this).balance >= price, "Insufficient funds in escrow");

        // 3. Transfer NFT to buyer
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);

        // 4. Pay seller
        (bool success, ) = payable(artist).call{value: purchaseAmount[_nftID]}("");
        require(success, "Payment to seller failed");


        // 5. Mark sale as complete
        isListed[_nftID] = false;
    }

    function cancelSale(uint256 _nftID) public {
        require(isListed[_nftID], "Not listed");

        // Case 1: Buyer cancels
        if (msg.sender == buyer[_nftID]) {
            // Option A: Refund escrow
            if (escrowDeposited[_nftID] > 0) {
                (bool success, ) = payable(buyer[_nftID]).call{
                    value: escrowDeposited[_nftID]
                }("");
                require(success, "Refund failed");
                escrowDeposited[_nftID] = 0;
            }

            // Clear buyer but keep NFT locked/listed for resale
            buyer[_nftID] = address(0);
        }

        // Case 2: Seller cancels
        else if (msg.sender == artist) {
            // Return NFT to seller
            IERC721(nftAddress).transferFrom(address(this), artist, _nftID);

            // Refund escrow to buyer
            if (escrowDeposited[_nftID] > 0) {
                (bool success, ) = payable(buyer[_nftID]).call{
                    value: escrowDeposited[_nftID]
                }("");
                require(success, "Refund failed");
                escrowDeposited[_nftID] = 0;
            }

            // Unlist sale
            isListed[_nftID] = false;
            buyer[_nftID] = address(0);
        }

        else {
            revert("Not authorized");
        }
    }



    function getBalance() public view returns(uint256){
      return address(this).balance;
    }

}