import React, { useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { Bars } from 'react-loader-spinner';
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import {db} from '../firebase/firebase'
import Review from './Review';

const Detail = () => {
    const [loading, setLoading] = useState(false);
    const {id} = useParams();
    const [data,setData] = useState({
        title:'',
        year:'',
        image:'',
        description:'',
        rating:0,
        rated:0
    })
    
    useEffect(()=>{
        async function getData(){
            setLoading(true);
            const _doc = doc(db,"movies",id);
            const _data = await getDoc(_doc);
            setData(_data.data());
            setLoading(false);
        }
        getData();
    },[id])

    return (<>
        { loading?<div className = 'w-full flex justify-center items-center h-96'><Bars height = {25} color = "white" /></div> : 
        <div className='mt-4 p-4 flex flex-col  md:flex-row md:items-start  items-center justify-center w-full '>
            <img className='h-96 md:sticky md:top-24' src={data.image} alt='Poster' />
            <div className="md:ml-4 ml-0 w-full md:w-1/2">
                <h1 className='text-3xl font-bold text-gray-400'>{data.name} <span className='text-xl'>({data.year})</span>
                </h1>
                <ReactStars
                    size={20} half={true} value={data.rating/data.rated} edit={false}
                />
                <p className='mt-2'>
                    {data.description}
                </p>
                <Review id={id} prevRating ={data.rating} userRated = {data.rated}  />
            </div>
        </div>
    }</>)
}

export default Detail