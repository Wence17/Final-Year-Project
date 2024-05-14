'use client'
import React, { useContext, useEffect, useState } from 'react'
import { CiMail } from "react-icons/ci";
import { RiWallet2Line } from "react-icons/ri";
import { BsSearch } from "react-icons/bs";
import AppContext from '../context/AppContext';
import { useForm } from "react-hook-form";
import tracking from '../context/TrackPharma.json';
import Web3Modal from "web3modal";
import { ethers, Contract, Signer } from "ethers";

const  PHARMA_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PHARMA_ABI = tracking.abi;
//  '../context/AppContext'


interface User {
    name: string;
    email: string;
    accountId: string;
    // Add more properties if necessary
  }


function UserCard ({user}:{user:User}) {
    
    return (
        <div className='space-y-2 border border-gray-300 p-4 rounded-md backdrop-blur-sm bg-pharmaGreen-700/5'>
            <div><p className='font-semibold'>{user.name}</p></div>
            <div className='flex items-center space-x-2'>
                <CiMail size={18} />
                <p className='text-xs'>{user.email}</p>
            </div>
            <div className='flex items-center space-x-2'>
                <RiWallet2Line size={18} />
                <p className='text-xs hidden lg:block'>{user.accountId} </p>
                <p className='text-xs block lg:hidden'>{user.accountId.slice(0, 25)}...</p>
            </div>
        </div>
    )
}

function AddProduct() {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [isConnected, setIsConnected] = useState(false);
    // const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
    // const [signer, setSigner] = useState<Signer | null>(null);
    const [signer, setSigner] = useState<Signer>();

    const { currentUser } = useContext(AppContext);
    // const { data: signer } = currentUser;
    const address = currentUser;

    useEffect(() => {
        const connectWeb3 = async () => {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect(); // Connect to Web3
            const provider =  new ethers.providers.Web3Provider(connection);
            const signer=provider.getSigner(); // Store the connection object in state
            setSigner(signer)
            setIsConnected(true); // Set connected state
        };

        connectWeb3(); // Call the async function to connect
    }, []); 
    
    //   const signer = provider.getSigner();
      

    const [search, setSearch] = useState('');
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const saveUser = async(user:any) => {
              
        try {
            if(isConnected) {
        
                const contractInstance = new Contract(
                    PHARMA_ADDRESS,
                    PHARMA_ABI,
                    signer
                );
                console.log("🚀 ~ file: index.js:66 ~ saveUser ~ contractInstance", contractInstance)
                
                user.role = 1 // temporarily hardcoded
                // const accountDetails = {
                //     role: user.role =1, // Assuming user.role contains the role value
                //     accountId: user.accountId,
                //     name: user.name,
                //     email: user.email
                // };
                // const tx = await contractInstance.addParty(user);
                const tx = await contractInstance.addParty(user, {
                    gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Specify gas price in gwei
                    gasLimit: 3000000, // Specify gas limit
                  });
                // const tx = await contractInstance.addParty(accountDetails);
                // const tx = await contractInstance.addParty(accountDetails, {
                //     gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Specify gas price in gwei
                //     gasLimit: 3000000, // Specify gas limit
                //   });
                
                console.log("🚀 ~ file: index.js:69 ~ saveUser ~ tx", tx)
                console.log("🚀 ~ file: index.js:69.123 ~ saveUser ~ tx", tx.hash)

                setLoading(true)
                await tx.wait()
                setLoading(false)

                // get users list
                await getMyAccountsList()
                
                console.log("🚀 ~ file: index.js:69 ~ saveUser ~ saveddddd", tx)
                
            console.log("User added successfully");
            }
        } catch (error) {
            console.log('Could not add user', error);
        }
    }
    
    const getMyAccountsList = async() => {
        
    if (address) {
        setIsConnected(true);
      }
            
        try {
            if(isConnected) {
         
                const contractInstance = new Contract(
                    PHARMA_ADDRESS,
                    PHARMA_ABI,
                    signer
                );
                
                const myUsersList = await contractInstance.getMyAccountsList();
                setUsersList(myUsersList)                                
            }
        } catch (error) {
            console.log('Could not add user', error);
        }
    }

    // const handleSaveUser = async (e) => {
        
    //     e.preventDefault()
        
    //     await saveUser();
    // }

    useEffect(() => {
      if(!signer) return;
      getMyAccountsList()
    }, )
    


    return (
        <div className='p-4 md:w-10/12 md:mx-auto'>
            <div className='flex flex-col-reverse gap-12 md:flex-row bg-white w-full h-full shadow-md rounded-md p-10'>
                
                <div className='w-full md:w-1/2 mb-12'>
                    <p className='text-xl md:text-2xl font-bold mb-10'>Existing Users</p>

                        <div className='flex items-center my-4 border border-gray-400 rounded-md px-2 space-x-4'>
                            <BsSearch size={18} />
                            <input 
                                value={search}
                                onChange={(event) => setSearch(event.currentTarget.value)} 
                                className='w-full h-9 border-none p-2 text-sm focus-within:border-none active:border-none' 
                                type="search" 
                                placeholder='Filter...' 
                                autoFocus 
                            />
                        </div>

                        <div className='mt-12 space-y-4'>
                            {
                                usersList && usersList.filter((user) => {
                                    const query = search.toLowerCase()
                                    return query === '' ? user : (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
                                }).map((user, idx) => (<UserCard key={idx} user={user} />))
                            }
                        </div>
                </div>
                <div className='w-full md:w-1/2 mb-12'>
                    <p className='text-xl md:text-2xl font-bold mb-4'>Add New User</p>

                    <form onSubmit={handleSubmit(saveUser)}>
                        <div className=''>
                            <div className='mb-4'>
                                <label className='text-sm font-semibold'>Name</label>
                                <div>
                                    <input {...register("name", { required: true })} className='w-full h-9 rounded-md p-2 text-sm border shadow-sm' type="text" />
                                    {errors.name && <span className='text-red-600 text-xs'>This field is required</span>}
                                </div>
                            </div>
                            <div className='mb-4'>
                                <label className='text-sm font-semibold'>Email</label>
                                <div>
                                    <input {...register("email", { required: true })} className='w-full h-9 rounded-md p-2 text-sm border shadow-sm' type="email" />
                                    {errors.email && <span className='text-red-600 text-xs'>This field is required</span>}
                                </div>
                            </div>
                            <div className='mb-4'>
                                <label className='text-sm font-semibold'>Address</label>
                                <div>
                                    <input {...register("accountId", { required: true })} className='w-full h-9 rounded-md p-2 text-sm border shadow-sm' type="text" />
                                    {errors.accountId && <span className='text-red-600 text-xs'>This field is required</span>}
                                </div>
                            </div>
                            <div className='mb-4'>
                                <button type='submit' className='bg-pharmaGreen-800 px-4 py-2 text-white rounded-md hover:bg-pharmaGreen-900'>{loading ? 'Saving...' : 'Save'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProduct