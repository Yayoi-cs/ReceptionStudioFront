import Head from "next/head"
import {FaGoogle, FaRegEnvelope} from "react-icons/fa";
import {MdLockOutline} from "react-icons/md";
import {useState} from "react";
import {useRouter} from "next/router";

export default function Signup() {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const router = useRouter();
    const [jwt, setJwt] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData)
            const response = await fetch('http://localhost:8080/CreateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const jwt = await response.text();
                const expires = new Date();
                expires.setDate(expires.getDate() + 1)
                document.cookie = `jwt=${jwt}; expires=${expires.toUTCString()}; path=/`;
                router.push('/verify')
            } else if (response.status == 401) {

            }
        } catch (error) {

        }
    }

    return (
        <div className={"flex flex-col items-center justify-center min-h-screen py-2"}>
            <Head>
                <title>Sign Up</title>
            </Head>
            <main className={"flex flex-col items-center justify-center w-full flex-1 px-20 text-center"}>
                <div className={"bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl"}>
                    <div className={"w-3/5 p-5"}>
                        <div className={"text-left font-bold"}>
                            <span className={"text-blue-600"}>Reception</span>Studio
                        </div>
                        <div className={"py-10"}>
                            <h2 className={"text-3xl font-bold text-blue-600"}>
                                Create Account
                            </h2>
                            <div className={"border-2 w-10 border-blue-600 inline-block mb-2"}/>
                            <div className={"flex justify-center my-2"}>
                                <a href={"http://localhost:8080/Oauth"}
                                   className={"border-2 flex items-center border-gray-200 rounded-full p-3 mx-1"}>
                                    <FaGoogle className={"text-sm mr-2"}/> Sign Up with Google
                                </a>
                            </div>
                            <p className={"text-gray-600 my-3"}>use your email account</p>
                            <form onSubmit={handleSubmit} className={"flex flex-col items-center"}>
                                <div className={"bg-gray-100 w-64 p-2 flex items-center mb-3"}>
                                    <FaRegEnvelope className={"text-gray-400 mr-2"}/>
                                    <input type={"email"} name={"email"} onChange={handleChange} placeholder={"Email"}
                                           required className={"bg-gray-100 outline-none text-sm flex-1"}/>
                                </div>
                                <div className={"bg-gray-100 w-64 p-2 flex items-center mb-3"}>
                                    <MdLockOutline className={"text-gray-400 mr-2"}/>
                                    <input type={"password"} name={"password"} onChange={handleChange}
                                           placeholder={"Password"} required
                                           className={"bg-gray-100 outline-none text-sm flex-1"}/>
                                </div>
                                {errorMessage && <p className={"mb-2 text-red-600"}>{errorMessage}</p>}
                                <button type={"submit"}
                                        className={"border-2 border-blue-600 rounded-full text-blue-600 px-12 py-2 inline-block font-semibold hover:text-white hover:bg-blue-600"}>Sign
                                    Up
                                </button>
                            </form>

                        </div>
                    </div>
                    <div className={"w-2/5 p-5 bg-blue-600 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12"}>


                    </div>
                </div>
            </main>
        </div>
    )

}