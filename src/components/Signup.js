import React, { useContext, useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber, getAuth } from "firebase/auth";
import app, { usersRef } from '../firebase/firebase'
import swal from 'sweetalert';
import bcrypt from 'bcryptjs'
import { addDoc } from 'firebase/firestore';
import { Appstate } from '../App';

const auth = getAuth(app)
const Signup = () => {
    const useAppstate = useContext(Appstate);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        mobile: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [OTP, setOTP] = useState("");

    useEffect(() => {
        if (useAppstate.login) {
            navigate('/');
        }
    }, [useAppstate.login, navigate])

    const generateRecapcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {

            }
        }, auth);
    }
    const requestOtp = () => {
        if(form.name.length>4 && form.mobile.length===10 && form.password.length>4){
            setLoading(true);
            generateRecapcha();
            let appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
                .then(confirmationResult => {
                    window.confirmationResult = confirmationResult;
                    swal({
                        text: 'OTP Sent',
                        icon: "success",
                        buttons: false,
                        timer: 3000,
                    });
                    setOtpSent(true);
                    setLoading(false);
                }).catch((error) => {
                    console.log(error);
                })
        }
    }

    const verifyOTP = () => {
        try {
            if(OTP.length === 6){
                setLoading(true);
                //verifying the opt
                window.confirmationResult.confirm(OTP).then((result) => {
                    uploadData();
                })
                swal({
                    text: 'Successfully Registered',
                    icon: 'success',
                    buttons: false,
                    timer: 3000,
                });
                navigate('/login');
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const uploadData = async () => {
        try {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(form.password, salt);
            await addDoc(usersRef, {
                name: form.name,
                password: hash,
                mobile: form.mobile
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div className='w-full flex flex-col items-center justify-center mt-8 '>
            <h1 className='text-xl font-bold'>Sign up</h1>
            {otpSent ?
                <>
                    <div className="p-2 w-full md:w-1/3">
                        <div className="relative">
                            <label htmlFor="name" className="leading-7 text-sm text-gray-300">OTP</label>
                            <input required value={OTP} onChange={(e) => (setOTP(e.target.value))} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>
                    <div className="p-2 w-full">
                        <button
                            onClick={verifyOTP}
                            className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
                            {loading ? <TailSpin height={25} color="white" /> : 'Confirm OTP'}
                        </button>
                    </div>
                </>
                : <>
                    <div className="p-2 w-full md:w-1/3">
                        <div className="relative">
                            <label htmlFor="name" className="leading-7 text-sm text-gray-300">Name</label>
                            <input type="string" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>
                    <div className="p-2 w-full md:w-1/3">
                        <div className="relative">
                            <label htmlFor="name" className="leading-7 text-sm text-gray-300">Mobile No.</label>
                            <input  type={"number"} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>
                    <div className="p-2 w-full md:w-1/3">
                        <div className="relative">
                            <label htmlFor="name" className="leading-7 text-sm text-gray-300">Password</label>
                            <input  type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>
                    <div className="p-2 w-full">
                        <button
                            onClick={requestOtp}
                            className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
                            {loading ? <TailSpin height={25} color="white" /> : 'Request OTP'}
                        </button>
                    </div>
                </>}
            <div className='mt-2'>
                <p>Already have an account <Link to='/login'><span className='text-blue-500'>Login</span></Link></p>
            </div>
            <div id='recaptcha-container'></div>
        </div>
    )
}

export default Signup