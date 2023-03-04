import React, { useContext, useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { reviewsRef, db } from '../firebase/firebase';
import { addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import swal from 'sweetalert';
import { Appstate } from '../App';
import { useNavigate } from 'react-router-dom';

const Review = ({ id, prevRating, userRated }) => {
    const navigate = useNavigate();
    const useAppstate = useContext(Appstate);
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [form, setForm] = useState("");
    const [data, setData] = useState([]);
    const [newAdded, setNewAdded] = useState(0);

    const sendReview = async () => {
        if (useAppstate.login) {
            setLoading(true);
            try {
                if(rating > 0 && form.length>2){
                    await addDoc(reviewsRef, {
                        movieId: id,
                        name: useAppstate.userName,
                        rating: rating,
                        thought: form,
                        timestamp: new Date().getTime()
                    })
                    const ref = doc(db, "movies", id);
                    await updateDoc(ref, {
                        rating: rating + prevRating,
                        rated: userRated + 1,
                    })
                    setForm('');
                    setRating(0);
                    setNewAdded(newAdded + 1);
                    swal({
                        title: 'Review Sent',
                        icon: "success",
                        buttons: false,
                        timer: 3000
                    })
                }
            } catch (error) {
                swal({
                    title: error,
                    icon: "error",
                    buttons: false,
                    timer: 3000
                })
            }
            setLoading(false);
        }
        else {
            navigate('/login')
        }
    }

    useEffect(() => {
        async function getData() {
            setReviewsLoading(true);
            setData([]);
            let quer = query(reviewsRef, where('movieId', '==', id));
            const querySnapshot = await getDocs(quer);
            querySnapshot.forEach((doc) => {
                setData((prev) => [...prev, doc.data()])
            })
            setReviewsLoading(false);
        }
        getData();
    }, [id,newAdded])

    return (
        <div className='mt-4  border-t-2 border-gray-700 w-full'>
            <ReactStars
                size={30}
                half={true}
                edit={true}
                value={rating}
                onChange={(rate) => setRating(rate)}
            />
            <input placeholder='Share Your Reviews...' value={form} onChange={(e) => setForm(e.target.value)} className='w-full p-2 outline-none header' />
            {useAppstate.login ?
                <button onClick={sendReview} className='bg-green-600 w-full p-2 mt-2 flex justify-center items-center'>
                    {loading ? <TailSpin height={20} color="white" /> : 'Share'}
                </button> :
                <button onClick={sendReview} className='bg-red-600 w-full p-2 mt-2 flex justify-center items-center'>
                    Login to Add Review
                </button>
            }

            {
                reviewsLoading ? <div className='mt-6 flex justify-center'><ThreeDots height={10} color="white" /></div>
                    :
                    <div className='mt-4'>
                        {
                            data.map((e, i) => {
                                return (
                                    <div key={i} className='bg-gray-900 border-b border-gray-600 p-2 w-full mt-2'>
                                        <div className='flex items-center'>
                                            <p className='text-blue-500'>{e.name}</p>
                                            <p className='ml-4 text-xs'>({new Date(e.timestamp).toLocaleString()})</p>
                                        </div>
                                        <ReactStars
                                            size={15}
                                            half={true}
                                            edit={false}
                                            value={e.rating}
                                        />
                                        <p>{e.thought}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
            }
        </div>
    )
}

export default Review