"use client";
import { formatItem, firstAndLastFour } from "@/utils/utils";
import { Contract, Signer, ethers } from "ethers";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import tracking from "../../context/TrackPharma.json";
import AppContext from "../../context/AppContext";
import Image from "next/image";
import ze from "../../../public/assets/images/Emzor-Logo-HIRES-1.jpg";
import Web3Modal from "web3modal";

const PHARMA_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PHARMA_ABI = tracking.abi;

interface ManufacturerDetails {
  name: string;
  email: string;
  accountId: string;
  // Add more properties if necessary
}

interface Item {
  name: string;
  manufacturerName: string;
  manufacturer: string;
  manufacturedDate: string;
  expiringDate: string;
  isInBatch: boolean;
  batchCount?: string; // Assuming batchCount is optional
  barcodeId: string;
  itemImage: string;
  itemType: string;
  usage: string;
}

function ItemDetails() {
  const [isConnected, setIsConnected] = useState(false);

  const { currentUser } = useContext(AppContext);
  const address = currentUser;
  const [signer, setSigner] = useState<Signer>();

  useEffect(() => {
    const connectWeb3 = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect(); // Connect to Web3
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner(); // Store the connection object in state
      setSigner(signer);
      setIsConnected(true); // Set connected state
    };

    connectWeb3(); // Call the async function to connect
  }, []);

  const [item, setItem] = useState<Item | undefined>(undefined);
  const [itemHistory, setItemHistory] = useState();
  const [manufacturer, setManufacturer] = useState<ManufacturerDetails>();
  const [distributor, setDistributor] = useState<ManufacturerDetails>();
  const [retailer, setRetailer] = useState<ManufacturerDetails>();
  // const [customers, setCustomers] = useState();

  // const searchParams = useSearchParams();
  const params = useParams();

  useEffect(() => {
    if (signer) {
      const getSingleItem = async () => {
        if (address) {
          setIsConnected(true);
        }

        try {
          if (isConnected) {
            const contractInstance = new Contract(
              PHARMA_ADDRESS,
              PHARMA_ABI,
              signer
            );

            const barcodeId = params.barcodeId;

            const singleItem = await contractInstance.getSingleItem(barcodeId);

            // get item
            const formattedItem = formatItem(singleItem[0]);
            setItem(formattedItem);

            // get item history
            const itemHistory = singleItem[1];
            console.log(
              "🚀 ~ file: [barcodeId].js:37 ~ getSingleItem ~ itemHistory",
              itemHistory
            );

            // get manufacturer details
            const manufacturerAddress = itemHistory.manufacturer?.accountId;
            const getManufacturer = async (address: string) => {
              try {
                const manufacturerDetails =
                  await contractInstance.getAccountDetails(address);
                setManufacturer(manufacturerDetails);
                console.log("manufacturer", manufacturer);
              } catch (error) {
                console.log(
                  "🚀 ~ file: [barcodeId].js:28 ~ getManufacturer ~ error",
                  error
                );
              }
            };
            getManufacturer(manufacturerAddress);

            // get distributor details
            const distributorAddress = itemHistory.distributor?.accountId;

            const getDistributor = async (address: string) => {
              try {
                const distributorDetails =
                  await contractInstance.getAccountDetails(address);
                setDistributor(distributorDetails);
                console.log(distributor);
              } catch (error) {
                console.log(
                  "🚀 ~ file: [barcodeId].js:28 ~ getManufacturer ~ error",
                  error
                );
              }
            };
            getDistributor(distributorAddress);

            // get retailer details
            const retailerAddress = itemHistory.retailer?.accountId;
            const getRetailer = async (address: string) => {
              try {
                const retailerDetails =
                  await contractInstance.getAccountDetails(address);
                retailerDetails
                  ? setRetailer(retailerDetails)
                  : setRetailer(undefined);
                console.log(retailer);
              } catch (error) {
                console.log(
                  "🚀 ~ file: [barcodeId].js:28 ~ getManufacturer ~ error",
                  error
                );
              }
            };
            getRetailer(retailerAddress);
          }
        } catch (error) {
          console.log("Could not get single item", error);
          return null;
        }
      };
      getSingleItem();
    }
  }, [
    signer,
    isConnected,
    params.barcodeId
  ]);
  // useEffect(() => {
  //   if (signer && isConnected && params.barcodeId) {
  //     const getSingleItem = async () => {
  //       try {
  //         const contractInstance = new Contract(
  //           PHARMA_ADDRESS,
  //           PHARMA_ABI,
  //           signer
  //         );
  
  //         const barcodeId = params.barcodeId;
  
  //         const singleItem = await contractInstance.getSingleItem(barcodeId);
  
  //         // get item
  //         const formattedItem = formatItem(singleItem[0]);
  //         setItem(formattedItem);
  
  //         // get item history
  //         const itemHistory = singleItem[1];
  //         console.log(
  //           "🚀 ~ file: [barcodeId].js:37 ~ getSingleItem ~ itemHistory",
  //           itemHistory
  //         );
  
  //         // get manufacturer details
  //         const manufacturerAddress = itemHistory.manufacturer?.accountId;
  //         const manufacturerDetails = await contractInstance.getAccountDetails(
  //           manufacturerAddress
  //         );
  //         setManufacturer(manufacturerDetails);
  //         console.log("Manufacturer:", manufacturerDetails);
  
  //         // get distributor details
  //         const distributorAddress = itemHistory.distributor?.accountId;
  //         const distributorDetails = await contractInstance.getAccountDetails(
  //           distributorAddress
  //         );
  //         setDistributor(distributorDetails);
  //         console.log("Distributor:", distributorDetails);
  
  //         // get retailer details
  //         const retailerAddress = itemHistory.retailer?.accountId;
  //         const retailerDetails = await contractInstance.getAccountDetails(
  //           retailerAddress
  //         );
  //         setRetailer(retailerDetails);
  //         console.log("Retailer:", retailerDetails);
  //       } catch (error) {
  //         console.log("Could not get single item", error);
  //       }
  //     };
  //     getSingleItem();
  //   }
  // }, [signer, isConnected, params.barcodeId]);
  
  return (
    <div className="p-4 md:w-10/12 md:mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col w-full md:w-5/12 px-4 ">
          <div className="text-left sm:text-left mb-14">
            <h3 className="text-2xl font-bold">Item Details</h3>
          </div>
          <div className="flex flex-col">
            <div className="w-full">
              {/* <img src='/logo3.png' className='w-24' /> */}
              <Image src={ze} alt="" className="w-24" />
            </div>
            <div className="w-full space-y-2">
              <p className="text-xl font-bold">{item?.name}</p>
              <p className="">MFG: {item?.manufacturedDate}</p>
              <p className="">EXP: {item?.expiringDate}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-12 md:py-0 w-full md:w-7/12">
          <div className="">
            <div className="">
              <div className="text-left sm:text-left mb-14">
                <h3 className="text-2xl font-bold">Item History</h3>
              </div>
            </div>
            <div className="relative col-span-12 px-4 space-y-6 sm:col-span-9">
              <div className="col-span-12 space-y-12 relative px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:dark:bg-gray-700">
                {manufacturer && (
                  <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-pharmaGreen-800 bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold tracking-wide">
                      {manufacturer?.name}
                    </h3>
                    <time className="text-xs tracking-wide uppercase dark:text-gray-400">
                      Manufacturer
                    </time>
                    <p className="mt-3">{manufacturer?.email}</p>
                    <p className="text-xs mt-3">
                      {firstAndLastFour(manufacturer?.accountId)}
                    </p>
                  </div>
                )}

                {distributor && (
                  <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-pharmaGreen-800 bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold tracking-wide">
                      {distributor?.name}
                    </h3>
                    <time className="text-xs tracking-wide uppercase dark:text-gray-400">
                      Supplier
                    </time>
                    <p className="mt-3">{distributor?.email}</p>
                    <p className="text-xs mt-3">
                      {firstAndLastFour(distributor?.accountId)}
                    </p>
                  </div>
                )}

                {retailer && (
                  <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-400 bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold tracking-wide">
                      {retailer?.name}
                    </h3>
                    <time className="text-xs tracking-wide uppercase dark:text-gray-400">
                      Retailer
                    </time>
                    <p className="mt-3">{retailer?.email}</p>
                    <p className="text-xs mt-3">
                      {firstAndLastFour(retailer?.accountId)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
