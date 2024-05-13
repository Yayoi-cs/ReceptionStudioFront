import Head from "next/head";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {FaFolderPlus} from "react-icons/fa";

const items = ["Settings", "Profile", "Messages"]

function ListItem({item}) {
    return (
        <a href="#"
           className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
            {item}
        </a>
    );
};

export default function Home() {
    const [items, setItems] = useState([]);
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            try {
                let tokenCookie = "";
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.startsWith("token=")) {
                        tokenCookie = cookie.substring(6);
                        break;
                    }
                }
                if (tokenCookie == "") {
                    router.push("/")
                }
                const response = await fetch('http://localhost:8080/info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({RequestToken: tokenCookie})
                });
                if (response.status == 401) {
                    router.push("/")
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                const projectNames = data.map(project => project.pna);
                setItems(projectNames);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();

    }, []);

    return (
        <div className={"flex flex-col items-center justify-center min-h-screen py-2"}>
            <Head>
                <title>Home</title>
            </Head>
            <main className={"flex flex-col items-center justify-center w-full flex-1 px-20 text-center"}>
                <div className={"bg-white flex-col rounded-2xl shadow-2xl flex w-3/4 max-w-4xl"}>
                    <div className={"text-left font-bold p-5"}>
                        <span className={"text-blue-600"}>Reception</span>Studio
                    </div>
                    <div className={"py-2 flex text-left p-10"}>
                        <div className={"flex-col"}>
                            <h2 className={"text-3xl font-bold text-blue-600"}>
                                Home
                            </h2>
                            <div className={"border-2 w-10 border-blue-600 inline-block mb-2"}/>
                            <p className={"text-gray-600 my-3"}>
                                Choose your project
                            </p>
                        </div>
                        <div className={"flex-col"}>
                             
                        </div>
                    </div>
                    <div className={"py-2 text-left p-10"}>
                        <div
                            className={"text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:text-white"}>

                            {items.map((item, index) => (
                                <ListItem key={index} item={item}/>
                            ))}
                        </div>
                    </div>
                    <div className={"py-3"}/>
                </div>
            </main>
        </div>
    )
}