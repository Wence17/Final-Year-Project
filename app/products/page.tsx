"use client";
import ProductModal from "../components/ProductModal";
// import { PHARMA_ABI, PHARMA_ADDRESS } from '@/constants'
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
// import { useAccount, useSigner } from 'wagmi'
import ProductCard from "../components/products/ProductCard";
import { formatItem } from "../../utils/utils";
import AppContext from "../context/AppContext";
import tracking from "../context/TrackPharma.json";
import Web3Modal from "web3modal";
import { ethers, Contract, Signer } from "ethers";
import { UserContext } from "../components/UserContext";

const PHARMA_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PHARMA_ABI = tracking.abi;

function ProductIndex() {
  const { usersList } = useContext(UserContext);


  // const { isWalletConnected } = useContext(AppContext);
  // const { isConnected } = isWalletConnected();
  const [signer, setSigner] = useState<Signer>();
  const [isConnected, setIsConnected] = useState(false);

  const { currentUser } = useContext(AppContext);
  // const { data: signer } = currentUser;
  const address = currentUser;

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

  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    if (signer) {
      const getAllItems = async () => {
        try {
          const contractInstance = new Contract(
            PHARMA_ADDRESS,
            PHARMA_ABI,
            signer
          );

          const allItems = await contractInstance.getAllItems();
          const formattedItems = allItems.map((item: any) => formatItem(item));

          setAllItems(formattedItems);
        } catch (error) {
          console.log("Could not get all items", error);
        }
      };
      getAllItems();
    }
  }, [signer]);

  const [myItems, setMyItems] = useState();
  const getMyItems = async () => {
    try {
      if (isConnected) {
        const contractInstance = new Contract(
          PHARMA_ADDRESS,
          PHARMA_ABI,
          signer
        );

        const myItems = await contractInstance.getMyItems();
        const formattedItems = myItems.map((item: any) => formatItem(item));

        setMyItems(formattedItems);
      }
    } catch (error) {
      console.log("Could not get my items", error);
    }
  };

  const [myAccountList, setMyAccountList] = useState();

  useEffect(() => {
    if (signer) {
      const getMyAccountsList = async () => {
        try {
          if (isConnected) {
            const contractInstance = new Contract(
              PHARMA_ADDRESS,
              PHARMA_ABI,
              signer
            );

            const myUsersList = await contractInstance.getMyAccountsList();
            setMyAccountList(myUsersList);
          }
        } catch (error) {
          console.log("Could not get mu accounts list", error);
        }
      };
      getMyAccountsList();
    }
  }, [isConnected, signer]);

  const sellItem = async (data: { accountId: any; barcodeId: any }) => {
      console.log(isConnected)
    
    const { accountId, barcodeId } = data;
    console.log(
      "🚀 ~ file: index.js:247 ~ sellItem ~ accountId, barcodeId",
      accountId,
      barcodeId
    );


    try {
      if (isConnected) {
        const contractInstance = new Contract(
          PHARMA_ADDRESS,
          PHARMA_ABI,
          signer
        );

        const currentTimestamp = Date.now(); // current time epoch

        const response = await contractInstance.sellItem(
          accountId,
          barcodeId,
          currentTimestamp,{
            gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Specify gas price in gwei
            gasLimit: 3000000, // Specify gas limit
          }
        );
        console.log(
          "🚀 ~ file: ContextWrapper.js:247 ~ sellItem ~ response",
          response
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log("Could not sell item", error);
      return null;
    }
  };

  // Modal Logic
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState({});

  function openModal(item: any) {
    setModalItem({ item, myAccountList });
    setShowModal(true);
  }

  function closeModal() {
    console.log("set close");
    setShowModal(false);
  }

  return (
    <div className="p-4 md:w-10/12 md:mx-auto">
      <div className="bg-white w-full h-full shadow-md rounded-md p-2 md:p-10">
        <div className="flex justify-between items-center w-full">
          <p className="text-2xl font-bold mb-8">Products</p>
          <Link
            href="/products/new"
            className="border border-pharmaGreen-700 py-2 px-4 rounded-md text-xs text-pharmaGreen-700 transition ease-linear duration-200 hover:bg-pharmaGreen-500 hover:text-pharmaGreen-700"
          >
            Add new product
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allItems &&
            allItems.map((item: any, index: React.Key | null | undefined) => (
              <ProductCard key={index} item={item} openModal={openModal} />
            ))}
        </div>

        {/* MODAL */}
        {showModal && (
          <ProductModal
            isVisible={showModal}
            onClose={closeModal}
            modalItem={modalItem}
            shouldCloseOnOverlayClick={false}
            sellItem={sellItem}
            usersList={usersList} // Pass usersList as a prop to the modal
          />
        )}
      </div>
    </div>
  );
}

export default ProductIndex;
