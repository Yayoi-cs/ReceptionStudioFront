import Head from "next/head";
import {useState} from "react";
import {useRouter} from "next/router";
import {TbNumber} from "react-icons/tb";


export default function Check() {

    const [formData,setFormData] = useState({
        verifyCode: ''
    });
    const [requestData, setrequestData] = useState({
        TokenString: '',
        VerifyCode: '',
    });
    const [errorMessage,setErrorMessage] = useState('')
    const router = useRouter()

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let jwtCookie = "";
            const cookies = document.cookie.split(';');
            for (let i = 0; i< cookies.length;i++){
                const cookie = cookies[i].trim();
                if (cookie.startsWith("jwt=")) {
                    jwtCookie = cookie.substring(4);
                    break;
                }
            }
            setrequestData({
                TokenString: jwtCookie,
                VerifyCode: formData.verifyCode
            });
            console.log(requestData)
            const response = await fetch('http://localhost:8080/AuthUser',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            if (response.ok) {
                const jwt = await response.text()
                const expires = new Date();
                expires.setMonth(expires.getMonth() + 1)
                document.cookie = `token=${jwt}; expires=${expires.toUTCString()}; path=/`;
                router.push('/home')
            } else if (response.status == 401) {
                setErrorMessage('Invalid Verify Code.')
            }
        } catch (error) {

        }
    }

    return (
        <div className={"flex flex-col items-center justify-center min-h-screen py-2"}>
            <Head>
                <title>Verify</title>
            </Head>
            <main className={"flex flex-col items-center justify-center w-full flex-1 px-20 text-center"}>
                <div className={"bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl"}>
                    <div className={"w-3/5 p-5"}>
                        <div className={"text-left font-bold"}>
                            <span className={"text-blue-600"}>Reception</span>Studio
                        </div>
                        <div className={"py-10"}>
                            <h2 className={"text-3xl font-bold text-blue-600"}>
                                Verify your Account
                            </h2>
                            <div className={"border-2 w-10 border-blue-600 inline-block mb-2"}/>

                            <form onSubmit={handleSubmit} className={"flex flex-col items-center"}>
                                <div className={"bg-gray-100 w-64 p-2 flex items-center mb-3"}>
                                    <TbNumber className={"text-gray-400 mr-2"} />
                                    <input name={"verifyCode"} onChange={handleChange} type={"number"} placeholder={"Verify Code"} required className={"bg-gray-100 outline-none text-sm flex-1"}/>
                                </div>
                                {errorMessage && <p className={"mb-2 text-red-600"}>{errorMessage}</p>}
                                <button type={"submit"}
                                        className={"border-2 border-blue-600 rounded-full text-blue-600 px-12 py-2 inline-block font-semibold hover:text-white hover:bg-blue-600"}>Submit
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