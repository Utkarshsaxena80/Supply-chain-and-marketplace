const {expect}=require("chai");
const {ethers}= require("hardhat");

describe("SUPPLY CHAIN",function(){
    let manufacturer,manufacturerTwo,wholesaler,wholesalerTwo,retailer,consumer;
    const fee= ethers.parseUnits("0.01",18);
beforeEach(async function (){
[manufacturer,wholesaler,retailer,consumer,manufacturerTwo,wholesalerTwo]= await ethers.getSigners();
Supply=await ethers.getContractFactory("supplyChain");
supply=await Supply.deploy(fee);
await supply.waitForDeployment();

})
describe("deployment",function (){

    it("should set the fee",async function (){
        expect(await supply.FEE()).to.equal(fee);
       // console.log(await supply.FEE());
    })
})
describe("should set the various users",function (){

    describe("should set the manufacturer details",function (){

        it("should revert with error because no or less fees given",async function (){
            await expect(
                supply.connect(manufacturer).manufacturerSetDetails(
                    "Utkarsh",
                    1,
                    { value: ethers.parseEther("0.005") } 
                )
            ).to.be.revertedWith("Not enough FEE entered");
        })
    
        it("should set the manufacturer",async function (){
            const manu=await supply.connect(manufacturer).manufacturerSetDetails(
                "Utkarsh",
                1,
                {value:fee}
            );
            expect(manu).to.emit(supply,"manufacturerSetUpCompleted").withArgs(manufacturer.address);
            const manuTwo=await supply.connect(manufacturerTwo).manufacturerSetDetails(
                "Ayushman",
                2,
                {value:fee}
            );
            expect(manuTwo).to.emit(supply,"manufacturerSetUpCompleted").withArgs(manufacturerTwo.address);
            const manufacturerDetails = await supply.manDetails(1);
            expect(manufacturerDetails.manufacturer).to.equal(manufacturer.address);
            expect(manufacturerDetails.name).to.equal("Utkarsh");
            expect(manufacturerDetails.manId).to.equal(1);
            const manTwo= await supply.manDetails(2);
            expect(manTwo.manufacturer).to.equal(manufacturerTwo.address);
        })
        it("should revert with error as id already used",async function (){
          await   expect(
                supply.connect(manufacturer).manufacturerSetDetails(
                    "Utkarsh",
                    1,
                    {value:fee}
                )
            ).to.emit(supply,"manufacturerSetUpCompleted").withArgs(manufacturer);
           await  expect(
                supply.connect(manufacturerTwo).manufacturerSetDetails(
                    "Ayushman",
                    1,
                    {value:fee}
                )
            ).to.be.revertedWith("id already set , use another number ");
        });
        it("should revert with error as invalid id provided",async function (){
            await   expect(
                supply.connect(manufacturer).manufacturerSetDetails(
                    "Utkarsh",
                    0,
                    {value:fee}
                )
            ).to.be.revertedWith("id cannot be lesser than 0 and greater than 5");
        })


    })
   
    describe("should set the wholsaler details",function (){
    it("should set the wholesaler",async function (){
        const wholOne= await supply.connect(wholesaler).wholsalersSetDetail(
            "utkarsh",
            1,
            {value:fee}
        );
        const wholTwo=await supply.connect(wholesalerTwo).wholsalersSetDetail(
            "ayushman",
            2,
            {value:fee}
        );
      await expect(wholOne).to.emit(supply,"wholsalerSetUpCompleted").withArgs(wholesaler.address);
      await expect(wholTwo).to.emit(supply,"wholsalerSetUpCompleted").withArgs(wholesalerTwo.address);
     const wholDetails=await supply.wholDetail(1);
     expect(wholDetails.whol).to.equal(wholesaler.address);
     expect(wholDetails.name).to.equal("utkarsh");
     expect(wholDetails.wholId).to.equal(1);
     const wholDetailsTwo=await supply.wholDetail(2);
     expect(wholDetailsTwo.whol).to.equal(wholesalerTwo.address);
     expect(wholDetailsTwo.name).to.equal("ayushman");
     expect(wholDetailsTwo.wholId).to.equal(2);
     
      })
    it("should revert with error because no or less fees given",async function (){
        await expect(
            supply.connect(wholesaler).wholsalersSetDetail(
                "Utkarsh",
                1,
                { value: ethers.parseEther("0.005") } 
            )
        ).to.be.revertedWith("Not enough FEE entered");
    })
    it("should revert with error as id already used",async function (){
        
        await expect(
            await supply.connect(wholesaler).wholsalersSetDetail(
                "utkarsh",
                1,
                {value:fee}
            )
        ).to.emit(supply,"wholsalerSetUpCompleted").withArgs(wholesaler.address);
      await expect(
        supply.connect(wholesalerTwo).wholsalersSetDetail(
            "ayushman",
            1,
            {value:fee}
        )
    ).to.be.revertedWith("id already set , use another");
      })
    it("should revert with error as invalid id provided",async function (){
        await   expect(
            supply.connect(wholesaler).wholsalersSetDetail(
                "Utkarsh",
                0,
                {value:fee}
            )
        ).to.be.revertedWith("id cannot be lesser than 0 and greater than 5");

    })


    })
    describe("should set the retailers detail",async function (){

    })
    describe("should set the consumers detail",async function (){

    })

})
describe("adds product",function (){
//first add product 
//
it("should add an product ",async function (){
    const manu=await supply.connect(manufacturer).manufacturerSetDetails(
        "Utkarsh",
        1,
        {value:fee}
    );
   expect(manu).to.emit(supply,"manufacturerSetUpCompleted").withArgs(manufacturer.address);
    const productId=1;
     expect(
        await supply.connect(manufacturer).addProducts(
            1,
            "bottles",
            2025,
            100,
            2050,
            400,
            productId,
            {value:fee}
        )
     ).to.emit(supply,"productDetailsAdded").withArgs(manufacturer.address);
     const addedProduct= await supply.mfgProdHistory(1,productId-1);
     expect(addedProduct.manufacturer).to.equal(manufacturer.address);
     expect(addedProduct.productName).to.equal("bottles");
     expect(addedProduct.mfgYear).to.equal(2025);
     expect(addedProduct.quantity).to.equal(100);
     expect(addedProduct.expireYear).to.equal(2050);
     expect(addedProduct.sellingPrice).to.equal(400);
     expect(addedProduct.uniqueId).to.equal(1);
     console.log(addedProduct.lotPrice);

})

})
describe("buys from manufacturer",async function (){
    let productId=1;
    let manu,wholOne;
    beforeEach(async function (){
        //register both manufacturer and wholsaler
        //add an product
        const manu=await supply.connect(manufacturer).manufacturerSetDetails(
            "Utkarsh",
            1,
            {value:fee}
        );
        const wholOne= await supply.connect(wholesaler).wholsalersSetDetail(
            "utkarsh",
             1,
            {value:fee}
        );
        await supply.connect(manufacturer).addProducts(
            1,
            "bottles",
            2025,
            100,
            2050,
            400,
            productId,
            {value:fee}
        );
        
    })
      it(" should buy from a manufacturer ",async function (){
        const productId = 1;
        const quantityToBuy = 60;
        const pricePerUnit = 400;
        const totalPrice = quantityToBuy * pricePerUnit;

        let productBefore = await supply.mfgProdHistory(1, productId - 1);
        expect(productBefore.quantity).to.equal(100);

        await expect(
            supply.connect(wholesaler).buyFromManufacturer(
                1, 1, quantityToBuy, productId, { value: totalPrice }
            )
        ).to.emit(supply, "boughtFromManufacturer").withArgs(wholesaler.address);

        let productAfter = await supply.mfgProdHistory(1, productId - 1);
        expect(productAfter.quantity).to.equal(40);

        const addedProduct = await supply.wholProdHistory(1, 0);
        expect(addedProduct.manufacturer).to.equal(manufacturer.address);
        expect(addedProduct.productName).to.equal("bottles");
        expect(addedProduct.mfgYear).to.equal(2025);
        expect(addedProduct.quantity).to.equal(quantityToBuy);
        expect(addedProduct.expireYear).to.equal(2050);
        expect(addedProduct.sellingPrice).to.equal((6 * pricePerUnit) / 5);
        expect(addedProduct.uniqueId).to.equal(1);

    }) 
})
describe("buys from wholsaler",function (){
    let mfgId=1;
    let productId=1;
    let totalPrice,Price;

    beforeEach(async function (){

      const manu=await supply.connect(manufacturer).manufacturerSetDetails(
        "Utkarsh", 
        1,                                                                       
        {value:fee}
    );
    const wholOne= await supply.connect(wholesaler).wholsalersSetDetail(
        "utkarsh",
         1,
        {value:fee}                                                                 
    );
    const retail= await supply.connect(retailer).retailSetDetail(
        "ayushman",
        1,
        {value:fee}                                                               
    );
    await supply.connect(manufacturer).addProducts(
        1,
        "bottles",
        2025,
        100,
        2050,
        400,                                                                           
        productId,
        {value:fee}
    );
    
    await expect(
        supply.connect(wholesaler).buyFromManufacturer(
            1, 1, 60, productId, { value: 24000 }
        )                     
    ).to.emit(supply, "boughtFromManufacturer").withArgs(wholesaler.address);
   
    const productDetails=await supply.wholProdHistory(1,0);
    
    Price=await productDetails.sellingPrice;
    console.log(Price.toString());
    totalPrice = Price * BigInt(20); 
    console.log(totalPrice.toString());

    })

    it("should buy from wholsaler",async function (){
        await expect(
           await  supply.connect(retailer).buyFromWholSaler(
                1,
                1,
                20,
                1,
                {value:totalPrice}
            )
        ).to.emit(supply,"boughtFromWholSaler").withArgs(retailer.address);

        let productAfter=await supply.wholProdHistory(1,productId-1);
        expect(productAfter.quantity).to.equal(40);
        const addedProduct=await supply.retailProdHistory(1,productId-1);
        expect(addedProduct.manufacturer).to.equal(manufacturer.address);
        expect(addedProduct.productName).to.equal("bottles");
        expect(addedProduct.mfgYear).to.equal(2025);
        expect(addedProduct.quantity).to.equal(20);
        expect(addedProduct.expireYear).to.equal(2050);
        expect(addedProduct.sellingPrice).to.equal((BigInt(6) * Price) /BigInt( 5));
        expect(addedProduct.uniqueId).to.equal(1);
    })
})
describe("buys from retailer",function (){
   beforeEach(async function (){
    //register manufacturer, whol,retail,consumer--sone
    //add an product 
    //buy from manufacturer
    //buy from wholsaler
    //buyfrom retailer
    const manu=await supply.connect(manufacturer).manufacturerSetDetails(
        "Utkarsh", 
        1,                                                                       
        {value:fee}
    );
    const wholOne= await supply.connect(wholesaler).wholsalersSetDetail(
        "utkarsh",
         1,
        {value:fee}                                                                 
    );
    const retail= await supply.connect(retailer).retailSetDetail(
        "ayushman",
        1,
        {value:fee}                                                               
    );
    const cons=await supply.connect(consumer).consumerSetDetail(
    "utkarsh",
    1,
    {value:fee}
    );
    //add products
    ///buy from manufacturer
    //buy from wholsaler
    await supply.connect(manufacturer).addProducts(
        1,
        "bottles",
        2025,
        100,
        2050,
        400,
        productId,
        {value:fee}
    );
    await expect(
        supply.connect(wholesaler).buyFromManufacturer(
            1, 1, 60, productId, { value: 24000 }
        )                     
    ).to.emit(supply, "boughtFromManufacturer").withArgs(wholesaler.address);
    
    await expect(
        supply.connect(retailer).buyFromWholSaler(
            1,1,40,productId,{value:fee}
        )
    )

    

   })
})

describe("displays the products if from its id",function (){

beforeEach(async function (){

    const manu=await supply.connect(manufacturer).manufacturerSetDetails(
        "Utkarsh", 
        1,                                                                       
        {value:fee}
    );
    const wholOne= await supply.connect(wholesaler).wholsalersSetDetail(
        "utkarsh",
         1,
        {value:fee}                                                                 
    );
    const retail= await supply.connect(retailer).retailSetDetail(
        "ayushman",
        1,
        {value:fee}                                                               
    );
    const cons=await supply.connect(consumer).consumerSetDetail(
    "utkarsh",
    1,
    {value:fee});
    //add from products 
    await supply.connect(manufacturer).addProducts(
        1,
        "bottles",
        2025,
        100,
        2050,
        400,
        productId,
        {value:fee}
    );
    //buy from manufacturer
      
        const productId = 1;
        const quantityToBuy = 60;
        const pricePerUnit = 400;
        const totalPrice = quantityToBuy * pricePerUnit;

        let productBefore = await supply.mfgProdHistory(1, productId - 1);
        expect(productBefore.quantity).to.equal(100);

        await expect(
            supply.connect(wholesaler).buyFromManufacturer(
                1, 1, quantityToBuy, productId, { value: totalPrice }
            )
        ).to.emit(supply, "boughtFromManufacturer").withArgs(wholesaler.address);
        //buy from wholsaler
        const productDetails=await supply.wholProdHistory(1,0);
    
    Price=await productDetails.sellingPrice;
    console.log(Price.toString());
    let  TotalPrice = Price * BigInt(20); 
    console.log(TotalPriceotalPrice.toString());
    await expect(
        await  supply.connect(retailer).buyFromWholSaler(
             1,
             1,
             20,
             1,
             {value:TotalPrice}
         )
     ).to.emit(supply,"boughtFromWholSaler").withArgs(retailer.address);

     
})
})

})
