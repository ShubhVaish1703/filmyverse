import React, { useContext, useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { addDoc } from 'firebase/firestore';
import { moviesRef } from '../firebase/firebase';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { Appstate } from '../App';

const AddMovie = () => {
    const useAppstate = useContext(Appstate);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        year: '',
        description: '',
        image: '',
        rating: 0,
        rated: 0,
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!useAppstate.login) {
            navigate('/login')
        }
    }, [useAppstate.login, navigate])

    const addMovie = async () => {
        setLoading(true);
        try {
            if (useAppstate.login) {
                if(form.image.length>10 && form.title.length>2 && form.description.length>5 && form.year.length>3){
                    await addDoc(moviesRef, form);
                    swal({
                        title: 'Successfully Added',
                        icon: "success",
                        buttons: false,
                        timer: 3000
                    })
                    setForm({
                        title: '',
                        year: '',
                        description: '',
                        image: '',
                    });
                    navigate('/');
                }
            }
            else{
                navigate('/login')
            }
        }
        catch (error) {
            swal({
                title: error,
                icon: "error",
                buttons: false,
                timer: 3000
            })
        }
        setLoading(false);
    }
    return (
        <div >
            <section className="text-gray-600 body-font relative">
                <div className="container px-5 py-8 mx-auto">
                    <div className="flex flex-col text-center w-full mb-4">
                        <h1 className="sm:text-3xl text-xl font-medium title-font mb-4 text-white">Add Movie</h1>
                    </div>
                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                        <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="name" className="leading-7 text-sm text-gray-300">Title</label>
                                    <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="name" className="leading-7 text-sm text-gray-300">Year</label>
                                    <input required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} type="text" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <div className="relative">
                                    <label htmlFor="message" className="leading-7 text-sm text-gray-300">Image Link</label>
                                    <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} type="text" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <div className="relative">
                                    <label htmlFor="message" className="leading-7 text-sm text-gray-300">Description</label>
                                    <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <button onClick={addMovie} className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
                                    {loading ? <TailSpin height={25} color="white" /> : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AddMovie