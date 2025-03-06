// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract supplyChain{


event manufacturerSetUpCompleted(address indexed manufacturer );
event wholsalerSetUpCompleted(address indexed whol);
event retailerSetUpCompleted(address indexed retail);
event consumerSetUpCompleted(address indexed consumer);
event productDetailsAdded(address indexed manufacturer);
event boughtFromManufacturer(address indexed buyer);
event productsFinished(address indexed manufacturer);
event boughtFromWholSaler(address indexed retailer);


uint256 public immutable FEE;

constructor(uint256 _fee){
  FEE= _fee;
}
struct productDetails{
    address manufacturer;
    string  productName;
    uint256 mfgYear;
    uint256 quantity;
    uint256 expireYear;
    uint256 sellingPrice;
    uint256 lotPrice;
    uint256 uniqueId;
}

    // address[] manufacturers;
    // address[] wholesalers;
    // address[] retailers;
    // address[] consumer;

    struct ManDetails{
         address manufacturer;
         string name;
         uint256 manId;
    } 
    struct WholDetail{
      address whol;
      string name;
      uint256 wholId;
    }
    struct RetailDetail{
      address retail;
      string name;
      uint256 retailId;
    }

    struct ConsumerDetail{
      address consumer;
      string name;
      uint256 consId;
    }
    
  
    mapping(uint256=>ManDetails) public  manDetails;
    mapping(uint256=>WholDetail) public wholDetail;
    mapping(uint256=>RetailDetail) public retailDetail ;
    mapping(uint256=>ConsumerDetail) public consumerDetail;
    mapping(uint256=>productDetails[]) public mfgProdHistory;
    mapping(uint256=>productDetails[]) public wholProdHistory;
    mapping(uint256=>productDetails[]) public retailProdHistory;
    mapping(uint256=>productDetails[]) public consumerProdHistory;

    function manufacturerSetDetails(string  memory name, uint256 id) public payable {
     // require(id>manDetails.length,"invalid id of manufacturer");
      require(id>0&&id<5,"id cannot be lesser than 0 and greater than 5");
      require(manDetails[id].manufacturer==address(0),"id already set , use another number ");   
      require(msg.value>=FEE,"Not enough FEE entered");
      manDetails[id]=ManDetails({
      manufacturer:msg.sender,
      name:name,
      manId:id
     });
      emit manufacturerSetUpCompleted(msg.sender);
    }

    function wholsalersSetDetail(string memory name,uint256 id) public payable {
      require(id>0&&id<5,"id cannot be lesser than 0 and greater than 5");
      require(wholDetail[id].whol==address(0),"id already set , use another");
      require(msg.value>=FEE,"Not enough FEE entered");
      wholDetail[id]=WholDetail({
        whol:msg.sender,
        name:name,
        wholId:id
      });
      emit wholsalerSetUpCompleted(msg.sender);
    }

    function retailSetDetail(string memory name,uint256 id) public  payable {
       require(id>0&&id<5,"id cannot be lesser than 0 and greater than 5");
       require(retailDetail[id].retail==address(0),"id already set , use another");
       require(msg.value>=FEE,"Not enough FEE entered");
       retailDetail[id]=RetailDetail({
        retail:msg.sender,
        name:name,
        retailId:id
      });
      emit retailerSetUpCompleted(msg.sender);
    }

     function consumerSetDetail(string memory name,uint256 id) public  payable {
      require(id>0&&id<5,"id cannot be lesser than 0 and greater than 5");
      require(consumerDetail[id].consumer==address(0),"id already set , use another");
      require(msg.value>=FEE,"Not enough FEE entered");
      consumerDetail[id]=ConsumerDetail({
        consumer:msg.sender,
        name:name,
        consId:id
      });
      emit consumerSetUpCompleted(msg.sender);
    }

   // function productListing
  //buy from manufacturer , from wholsaler, from retailer , 

    function addProducts(
    uint256 mfgId,
    string memory name,
    uint256 mfgYear,
    uint256 quantity,
    uint256 expireYear,
    uint256 sellingPrice,
    //uint256 lotPrice,
    uint256 uniqueId
     ) public  payable{

       require(mfgId>0&&mfgId<5,"id cannot be lesser than 0 and greater than 5");
       require(manDetails[mfgId].manufacturer!=address(0),"invalid manufacturer id , create an account first ");
       require(msg.value>0,"no eth entered ");
       require(msg.value>FEE/10);
       
       mfgProdHistory[mfgId].push(productDetails({
        manufacturer:msg.sender,
        productName:name,
        mfgYear:mfgYear,
        quantity:quantity,
        expireYear:expireYear,
        sellingPrice:sellingPrice,
        lotPrice: quantity*sellingPrice,
        uniqueId:uniqueId
       })
       );
       emit productDetailsAdded(msg.sender);
    }

function buyFromManufacturer(
      uint256 wholId,
      uint256 mfgId,
      uint256 quantityDemanded,
      uint256 productId
 ) public payable {
  if (wholProdHistory[wholId].length == 0) {
    wholProdHistory;
}
require(wholDetail[wholId].whol != address(0), "no such wholesaler");

productDetails storage product = mfgProdHistory[mfgId][productId - 1];
uint256 quantityAvailable = product.quantity;
uint256 price=product.sellingPrice;
uint256 newPrice;
require(quantityDemanded>quantityAvailable/2,"buy adequate product");
require(quantityDemanded<quantityAvailable,"products Finished");
if(product.quantity==0){
  emit productsFinished(product.manufacturer);
}
require(msg.value>=quantityDemanded*price,"lesser amount ");
                   (bool success ,)= manDetails[mfgId].manufacturer.call{value:msg.value}("");
                                 require(success,"couldnt send money");
//lessen the quantity 
 product.quantity-=quantityDemanded;
newPrice=6*(price)/5;

         wholProdHistory[wholId].push(productDetails({
         manufacturer:mfgProdHistory[mfgId][productId-1].manufacturer,
         productName:mfgProdHistory[mfgId][productId-1].productName,
         mfgYear:mfgProdHistory[mfgId][productId-1].mfgYear,
         quantity:quantityDemanded,
         expireYear:mfgProdHistory[mfgId][productId-1].expireYear,
         sellingPrice:newPrice ,
         lotPrice: quantityAvailable*mfgProdHistory[mfgId][productId-1].sellingPrice,
         uniqueId:mfgProdHistory[mfgId][productId-1].uniqueId
})
);
emit boughtFromManufacturer(msg.sender);
//mfgProdHistory[mfgId][productId].quantity-=quantityDemanded;
 }

 function buyFromWholSaler(
    uint256  retailId,
    uint256 wholId,
    uint256 quantityDemanded,
    uint256 productId
 ) public payable{
require(retailDetail[retailId].retail!=address(0),"no such retailer exists");
productDetails storage product = wholProdHistory[wholId][productId - 1];
uint256 quantityAvailable=product.quantity;
require(quantityDemanded<quantityAvailable,"not adequate quantity");
uint256 price=product.sellingPrice;
uint256 newPrice;
newPrice=6*price/5;
require(msg.value>=quantityDemanded*price,"lesser amount ");
(bool success , )=wholDetail[wholId].whol.call{value:msg.value}("");
require(success,"couldnt send money");

 product.quantity-=quantityDemanded;

 
 retailProdHistory[retailId].push(productDetails({
         manufacturer:product.manufacturer,
         productName:product.productName,
         mfgYear:product.mfgYear,
         quantity:quantityDemanded,
         expireYear:product.expireYear,
         sellingPrice:newPrice ,
         lotPrice: quantityAvailable*product.sellingPrice,
         uniqueId:product.uniqueId

 }));
//wholProdHistory[wholId][productId].quantity-=quantityDemanded;
emit boughtFromWholSaler(msg.sender);

 }

function buyFromRetailer(
    uint256  retailId,
    uint256 consId,
    uint256 quantityDemanded,
    uint256 productId
) public payable{
require(consumerDetail[consId].consumer!=address(0),"no such consumer exists");
uint256 quantityAvailable=retailProdHistory[retailId][productId].quantity;
require(quantityDemanded<quantityAvailable,"not adequate quantity");
uint256 price=retailProdHistory[retailId][productId].sellingPrice;
uint256 newPrice;
newPrice=6*price/5;
require(msg.value>=quantityDemanded*price,"lesser amount ");
quantityAvailable-=quantityDemanded;
consumerProdHistory[consId].push(productDetails({
         manufacturer:retailProdHistory[retailId][productId].manufacturer,
         productName:retailProdHistory[retailId][productId].productName,
         mfgYear:retailProdHistory[retailId][productId].mfgYear,
         quantity:quantityDemanded,
         expireYear:retailProdHistory[retailId][productId].expireYear,
         sellingPrice:newPrice ,
         lotPrice: quantityAvailable*retailProdHistory[retailId][productId].sellingPrice,
         uniqueId:retailProdHistory[retailId][productId].uniqueId
 }));
    
}

  productDetails[] public foundProducts;

 function productHistory(uint256 productId) public returns (
  productDetails[] memory
 ){

     for(uint256 i=1;i<=5;i++){
         for(uint256 j=0; j<mfgProdHistory[i].length; j++){
             if(mfgProdHistory[i][j].uniqueId == productId){
                 foundProducts.push(productDetails({
                      manufacturer:mfgProdHistory[i][j].manufacturer,
                      productName:mfgProdHistory[i][j].productName,
                      mfgYear:mfgProdHistory[i][j].mfgYear,
                      quantity:mfgProdHistory[i][j].quantity,
                      expireYear:mfgProdHistory[i][j].expireYear,
                      sellingPrice:mfgProdHistory[i][j].sellingPrice,
                      lotPrice: mfgProdHistory[i][j].sellingPrice,
                       uniqueId:mfgProdHistory[i][j].uniqueId

                 }));
             }
         }
     }
     for(uint256 i=1;i<=5;i++){
         for(uint256 j=0; j<retailProdHistory[i].length; j++){
             if(retailProdHistory[i][j].uniqueId == productId){
                 foundProducts.push(productDetails({
                      manufacturer:retailProdHistory[i][j].manufacturer,
                      productName:retailProdHistory[i][j].productName,
                      mfgYear:retailProdHistory[i][j].mfgYear,
                      quantity:retailProdHistory[i][j].quantity,
                      expireYear:retailProdHistory[i][j].expireYear,
                      sellingPrice:retailProdHistory[i][j].sellingPrice,
                      lotPrice: retailProdHistory[i][j].sellingPrice,
                       uniqueId:retailProdHistory[i][j].uniqueId

                 }));
             }
         }
     }
     for(uint256 i=1;i<=5;i++){
         for(uint256 j=0; j<wholProdHistory[i].length; j++){
             if(wholProdHistory[i][j].uniqueId == productId){
                 foundProducts.push(productDetails({
                      manufacturer:wholProdHistory[i][j].manufacturer,
                      productName:wholProdHistory[i][j].productName,
                      mfgYear:wholProdHistory[i][j].mfgYear,
                      quantity:wholProdHistory[i][j].quantity,
                      expireYear:wholProdHistory[i][j].expireYear,
                      sellingPrice:wholProdHistory[i][j].sellingPrice,
                      lotPrice: wholProdHistory[i][j].sellingPrice,
                       uniqueId:wholProdHistory[i][j].uniqueId

                 }));
             }
         }
     }

return foundProducts;
 }

 }

