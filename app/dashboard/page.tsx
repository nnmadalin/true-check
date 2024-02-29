"use client"

import Navbar from "@/components/Navbar"
import { useState, useEffect } from "react";
import React from 'react';
import { useRouter } from 'next/navigation';
import {v4 as uuidv4} from 'uuid';

import { FaSearch } from "react-icons/fa";
import { FaFile } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { HashLoader } from "react-spinners";

import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Dashboard() {

    const [isShowContent, setIsShowContent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(true);

    const [domainLoading, setDomainLoading] = useState("");
    const [contentLoading, setContentLoading] = useState("");

    const [isClient, setIsClient] = useState(false)
    const [domain, setDomain] = useState("");
    const [content, setContent] = useState("");

    const router = useRouter();

    function handlerShowContent() {
        if (isShowContent == true)
            setIsShowContent(false);
        else
            setIsShowContent(true);
    }

    function handlerChangeDomain(e: any) {
        setDomain(e.target.value);
    }

    function handlerChangeContent(e: any) {
        console.log(e.target.value)
        setContent(e.target.value);
    }

    function removeProtocolAndWww(url: string) {
        return url.replace(/^(https?:\/\/)?(www\.)?/i, '');
    }

    function handlerDeleteItem(key: any) {

        confirmAlert({
            title: 'Confirm to delete!',
            message: 'Are you sure you want to delete the search? (choice is irreversible)',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        if (typeof localStorage !== 'undefined') {

                            const jsonFromLocalStorage = JSON.parse(localStorage.getItem('db') || "[]");

                            if (jsonFromLocalStorage) {
                                const updatedJson = jsonFromLocalStorage.sort((a: any, b: any) => (new Date(b.created).valueOf() - new Date(a.created).valueOf())).filter((item: any, index: any) => index !== key);
                                localStorage.setItem('db', JSON.stringify(updatedJson));
                                router.refresh();
                            }
                        }
                    }
                },
                {
                    label: 'No',
                }
            ]
        });

    }

    function dbUpdate(storage: any) {
        const existingDataJSON: any = localStorage.getItem('db');
        const existingData = JSON.parse(existingDataJSON) || [];
        existingData.push(storage);
        const newDataJSON = JSON.stringify(existingData);
        localStorage.setItem('db', newDataJSON);
    }

    async function handlerFind() {

        var url = "";
        var domainOnly="";
        try{
            const urlt = new URL(domain);
            url = (new URL(domain)).toString();
            domainOnly = `${urlt.protocol}//${urlt.hostname}`;
        }catch{
            url = domain;
        }
        

        var searchJson: any;
        searchJson = {
            domain: domainOnly,
            content: content.trim(),
            uuid: uuidv4(),
            created: new Date(),
            logs: {},
        }

        setLoading(true);

       

        setDomainLoading(domainOnly); setDomain("");
        setContentLoading(content.trim()); setContent("");

        const id = toast.loading("Loading...");

        if (domainOnly.trim() != "") {
            //check ping
            const fetchPing = await fetch('/api/ping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ domain: domainOnly }),
                cache: 'no-store'
            });
            //return error check ping
            if (fetchPing.status != 200) {
                toast.update(id, { render: `Could not access the domain provided (${domainOnly})!`, type: "error", isLoading: false, autoClose: 5000, closeButton: true });

                searchJson.logs[searchJson.logs.length] = `Could not access the domain provided (${domainOnly})!`;
                searchJson.ping = {}
                dbUpdate(searchJson);
                setLoading(false);
                return;
            }
            toast(`I have successfully connected to the provided domain (${domain})!`, {
                autoClose: 3000,
                type: "success",
            });
            searchJson.logs[Object.keys(searchJson.logs).length] = `I have successfully connected to the provided domain!`;
            searchJson.ping = {
                status: "up",
                checked: new Date()
            }


            //check analysis
            const fetchAnalysis = await fetch('/api/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ domain: domainOnly }),
                cache: 'no-store'
            });
            //return error analysis
            if (fetchAnalysis.status != 200) {
                toast.update(id, { render: `We could not analyze the domain correctly!`, type: "error", isLoading: false, autoClose: 5000, closeButton: true });

                searchJson.logs[searchJson.logs.length] = `We could not analyze the domain correctly!`;
                searchJson.analysis = {};
                dbUpdate(searchJson);
                setLoading(false);
                return;
            }
            toast(`I was able to analyze the domain correctly!`, {
                autoClose: 3000,
                type: "success",
            });
            searchJson.logs[Object.keys(searchJson.logs).length] = `I was able to analyze the domain correctly!`;
            const responseAnalysis = await fetchAnalysis.json();
            searchJson.analysis = responseAnalysis;



            //check quality
            const fetchQuality = await fetch('/api/quality-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ domain: domainOnly }),
                cache: 'no-store'
            });
            //return error quality
            if (fetchQuality.status != 200) {
                toast.update(id, { render: `We could not determine the quality of the website!`, type: "error", isLoading: false, autoClose: 5000, closeButton: true });

                searchJson.logs[searchJson.logs.length] = `We could not determine the quality of the website!`;
                searchJson.analysis = {};
                dbUpdate(searchJson);
                setLoading(false);
                return;
            }
            toast(`We were able to determine the quality of the website correctly!`, {
                autoClose: 3000,
                type: "success",
            });
            searchJson.logs[Object.keys(searchJson.logs).length] = `We were able to determine the quality of the website correctly!`;
            const responseQuality = await fetchQuality.json();
            searchJson.quality = responseQuality;


            //score
            let scoreWebsite = 100.0;
            scoreWebsite -= ((parseFloat(responseAnalysis.stats.malicious) + parseFloat(responseAnalysis.stats.suspicious)) / 91) * 50.0;
            if(responseQuality.unsafe == true)
                scoreWebsite -= 4;
            if(responseQuality.dns_valid == false)
                scoreWebsite -= 4;
            if(responseQuality.parking == true)
                scoreWebsite -= 4;
            if(responseQuality.spamming == true)
                scoreWebsite -= 4;
            if(responseQuality.malware == true)
                scoreWebsite -= 4;
            if(responseQuality.phishing == true)
                scoreWebsite -= 4;
            if(responseQuality.suspicious == true)
                scoreWebsite -= 4;
            if(responseQuality.adult == true)
                scoreWebsite -= 4;
            if(responseQuality.redirected == true)
                scoreWebsite -= 4;
            if(responseQuality.risky_tld == true)
                scoreWebsite -= 4;
            scoreWebsite -= (parseInt(responseQuality.risk_score) / 10.0);

            try{
                searchJson.scoreWebsite = scoreWebsite.toFixed(2);
            }catch{
                searchJson.scoreWebsite = scoreWebsite;
            }

            if(content.trim() != ""){
                //check content - domain
                const fetchContentDomain = await fetch('/api/content/provide', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ domain: domainOnly, content: content.trim() }),
                    cache: 'no-store'
                });
                //return error content - domain
                if (fetchContentDomain.status != 200) {
                    toast.update(id, { render: `We could not verify the origin of the text!`, type: "error", isLoading: false, autoClose: 5000, closeButton: true });

                    searchJson.logs[searchJson.logs.length] = `We could not verify the origin of the text!`;
                    searchJson.contentDomain = {};
                    dbUpdate(searchJson);
                    setLoading(false);
                    return;
                }
                toast(`I was able to verify the provenance of the correct text!`, {
                    autoClose: 3000,
                    type: "success",
                });
                searchJson.logs[Object.keys(searchJson.logs).length] = `I was able to verify the provenance of the correct text!`;
                const responseContentDomain = await fetchContentDomain.json();
                searchJson.contentDomain = responseContentDomain;


                //check content analysis
                const fetchContentAnalysis = await fetch('/api/content/analysis', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: content.trim() }),
                    cache: 'no-store'
                });
                //return error content analysis
                if (fetchContentAnalysis.status != 200) {
                    toast.update(id, { render: `We could not analyze the content with artificial intelligence!`, type: "error", isLoading: false, autoClose: 5000, closeButton: true });

                    searchJson.logs[searchJson.logs.length] = `We could not analyze the content with artificial intelligence!`;
                    searchJson.contentAnalysis = {};
                    dbUpdate(searchJson);
                    setLoading(false);
                    return;
                }
                toast(`I was able to analyze the content with artificial intelligence correctly!`, {
                    autoClose: 3000,
                    type: "success",
                });
                searchJson.logs[Object.keys(searchJson.logs).length] = `I was able to analyze the content with artificial intelligence correctly!`;
                const responseContentAnalysis = await fetchContentAnalysis.json();
                searchJson.contentAnalysis = responseContentAnalysis;

                //check content is fake
                const fetchContentFake = await fetch('/api/content/is-fake', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: content.trim() }),
                    cache: 'no-store'
                });
                //return error content is fake
                if (fetchContentFake.status != 200) {
                    toast.update(id, { render: `I could not check if the text is fake or not!`, type: "error", isLoading: false, autoClose: 5000, closeButton: true });

                    searchJson.logs[searchJson.logs.length] = `I could not check if the text is fake or not!`;
                    searchJson.contentFake = {};
                    dbUpdate(searchJson);
                    setLoading(false);
                    return;
                }
                toast(`I was able to check if the text is fake or not!`, {
                    autoClose: 3000,
                    type: "success",
                });
                searchJson.logs[Object.keys(searchJson.logs).length] = `I was able to check if the text is fake or not!`;
                const responseContentFake = await fetchContentFake.json();
                searchJson.contentFake = responseContentFake;


                try{
                    if((JSON.parse(responseContentFake.candidates[0].content.parts[0].text).is_fake).toString().toLowerCase() == "false"){
                        searchJson.scoreContent = "No";
                    }
                    else
                        searchJson.scoreContent = "Yes";
                }catch{
                    searchJson.scoreContent = "N/A";
                }
            }



            dbUpdate(searchJson);
            toast.update(id, { render: `I have successfully completed the analysis!`, type: "success", isLoading: false, autoClose: 5000, closeButton: true });
            setLoading(false);
            return;
        }
        if (content.trim() != "") {

            //check content analysis
            const fetchContentAnalysis = await fetch('/api/content/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content.trim() }),
                cache: 'no-store'
            });
            //return error content analysis
            if (fetchContentAnalysis.status != 200) {
                toast.update(id, { render: `We could not analyze the content with artificial intelligence!`, type: "error", isLoading: false, autoClose: 5000, closeButton: true });

                searchJson.logs[searchJson.logs.length] = `We could not analyze the content with artificial intelligence!`;
                searchJson.contentAnalysis = {};
                dbUpdate(searchJson);
                setLoading(false);
                return;
            }
            toast(`I was able to analyze the content with artificial intelligence correctly!`, {
                autoClose: 3000,
                type: "success",
            });
            searchJson.logs[Object.keys(searchJson.logs).length] = `I was able to analyze the content with artificial intelligence correctly!`;
            const responseContentAnalysis = await fetchContentAnalysis.json();
            searchJson.contentAnalysis = responseContentAnalysis;

            //check content is fake
            const fetchContentFake = await fetch('/api/content/is-fake', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content.trim() }),
                cache: 'no-store'
            });
            //return error content is fake
            if (fetchContentFake.status != 200) {
                toast.update(id, { render: `I could not check if the text is fake or not!`, type: "error", isLoading: false, autoClose: 5000, closeButton: true });

                searchJson.logs[searchJson.logs.length] = `I could not check if the text is fake or not!`;
                searchJson.contentFake = {};
                dbUpdate(searchJson);
                setLoading(false);
                return;
            }
            toast(`I was able to check if the text is fake or not!`, {
                autoClose: 3000,
                type: "success",
            });
            searchJson.logs[Object.keys(searchJson.logs).length] = `I was able to check if the text is fake or not!`;
            const responseContentFake = await fetchContentFake.json();
            searchJson.contentFake = responseContentFake;


            try{
                if((JSON.parse(responseContentFake.candidates[0].content.parts[0].text).is_fake).toString().toLowerCase() == "false"){
                    searchJson.scoreContent = "No";
                }
                else
                    searchJson.scoreContent = "Yes";
            }catch{
                searchJson.scoreContent = "N/A";
            }

            dbUpdate(searchJson);
            toast.update(id, { render: `I have successfully completed the analysis!`, type: "success", isLoading: false, autoClose: 5000, closeButton: true });
            setLoading(false);
            return;
        }

        dbUpdate(searchJson);
        toast.update(id, { render: "You must complete at least one box!", type: "error", isLoading: false, autoClose: 5000, closeButton: true });
        setLoading(false);
    }

    useEffect(() => {
        setIsClient(true);
    }, [])

    setTimeout(function() {
        setLoadingScreen(false);
    }, 5000);

    return (
        <>
            {
                loadingScreen == true && (
                    <div className="w-full h-full bg-[#F5F6F9] fixed top-0 left-0 flex items-center justify-center flex-col gap-10 overflow-hidden z-[9999999999999]">
                        <h1 className="font-firaSans font-bold  text-5xl text-[#193452]">TrueCheck</h1>
                        <HashLoader color="#36d7b7"/>
                    </div>
                )
            }

            <Navbar />

            <div className="w-full min-h-[calc(100%-80px)] flex flex-wrap flex-col items-start justify-start p-5 gap-16">
                <div className="w-full flex p-5 items-center justify-center">
                    <h1 className="font-firaSans font-bold tracking-wider text-5xl text-[#193452]">Dashboard</h1>
                </div>

                <div className="w-full p-10 flex flex-wrap items-start justify-start gap-10 max-sm:flex-col max-sm:items-center max-sm:p-3">
                    <div className={`w-full h-[80px]  bg-[#F5F6F9] flex-1 shadow-[0px_0px_35px_2px_rgba(0,0,0,0.1)] p-5 pl-7 pr-7 rounded-[20px] flex items-start justify-start gap-10 flex-col overflow-hidden isAnimating ${isShowContent === true ? 'max-h-[350px] h-auto' : ' max-h-[140px]'}`}>

                        <div className="w-full flex items-center gap-5 max-sm:flex-col">
                            <div className="flex-1 w-full h-[40px] flex relative">
                                <input type="text" placeholder="Search domain" className="font-firaSans h-[40px] text-[14px] w-full  pl-5 pr-8 border-2 border-solid rounded bg-white border-[#DADADA]" value={domain} onChange={handlerChangeDomain} />
                                <FaSearch className="absolute right-[10px] top-[12px] text-[#999999]" />
                            </div>

                            <button className="h-[40px] w-max flex-0 border-2 border-solid rounded text-[#999999] bg-white border-[#DADADA] pl-5 pr-5 font-firaSans text-[14px] flex items-center justify-between gap-3 hover:text-[#6383ED] hover:border-[#6383ED]" onClick={handlerShowContent}><FaFile /> {isShowContent == true ? 'Hide' : 'Show'} Content</button>
                        </div>

                        <div className="w-full">
                            <textarea placeholder="Content" className="font-firaSans text-[14px] w-full min-h-[170px] resize-none max-h-[170px] p-3 border-2 border-solid rounded bg-white border-[#DADADA] transition-none max-sm:max-h-[400px]" value={content} onChange={handlerChangeContent}/>
                        </div>

                    </div>
                    <div className="max-w-[170px] w-full max-h-[80px] h-[90px] bg-[#F5F6F9] text-[#6f6f6f] flex-1 flex items-center justify-center shadow-[0px_0px_35px_2px_rgba(0,0,0,0.1)] p-5 rounded-[20px]">
                        <button className={`h-[40px] w-full flex-0 border-2 border-solid rounded bg-white pl-5 pr-5 font-firaSans text-[16px] flex items-center justify-center gap-3 font-bold text-[#6383ED] border-[#6383ED] hover:scale-[1.03] ${loading === true && "cursor-not-allowed"} `} onClick={handlerFind} disabled={loading}>Find</button>
                    </div>
                </div>

                <div className="w-full flex-1 p-10 max-sm:p-3 overflow-auto">
                    {
                        isClient == true && (
                            <table className="w-full overflow-auto font-firaSans">
                                <thead className="">
                                    <tr className="[&>*]:pb-[50px] [&>*]:text-left [&>*]:text-nowrap [&>*]:font-normal [&>*]:text-[#656464]">
                                        <th ></th>
                                        <th>Website</th>
                                        <th>Content</th>
                                        <th>Created</th>
                                        <th>Status</th>
                                        <th>Score Website</th>
                                        <th>Fake content</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr>td]:text-left [&>tr>td]:text-nowrap [&>tr>td]:font-bold [&>tr>td]:text-[#656464]">
                                    {
                                        loading == true && (
                                            <>
                                                <tr className="bg-white shadow-[0px_0px_35px_2px_rgba(0,0,0,0.1)] rounded-[20px] mb-10 ">
                                                    <td className="max-w-[100px] min-w-[100px]">
                                                        <img src={domainLoading.trim() != "" ? `https://icon.horse/icon/${removeProtocolAndWww(domainLoading)}` : '/err.png'} loading="lazy" className="w-[60px] h-[60px] p-2 bg-[#f5f5f5] rounded-[10px] object-cover" />
                                                    </td>
                                                    <td className="w-[400px] max-w-[400px] text-ellipsis overflow-hidden">{domainLoading.trim() != "" ? domainLoading : "N/A"}</td>
                                                    <td className="w-[400px] max-w-[400px] text-ellipsis overflow-hidden">{contentLoading.trim() != "" ? contentLoading : "N/A"}</td>
                                                    <td className="max-w-[200px] w-[200px]">
                                                        <p>{format(new Date(), 'd MMMM yyyy')}</p>
                                                        <p className="text-[#A6A6A6] font-normal text-[14px]">{format(new Date(), 'HH:mma')}</p>
                                                    </td>
                                                    <td className="max-w-[150px] w-[150px]">
                                                        <span className="p-2 pl-3 pr-3 rounded-[20px] bg-[#ffebb7] text-[#9e894a]">Loading</span>
                                                    </td>
                                                    <td className="max-w-[180px] w-[180px]">
                                                        <span className="font-normal">Loading...</span>
                                                    </td>
                                                    <td className="max-w-[180px] w-[180px]">
                                                        <span className="font-normal">Loading...</span>
                                                    </td>
                                                    <td className="max-w-[200px] w-[200px] flex items-center justify-center gap-10">
                                                        <button className="text-[30px] hover:scale-[1.15] cursor-not-allowed" disabled={true}><IoEyeSharp /></button>
                                                        <div className="h-full w-[2px] bg-[#656464]" />
                                                        <button className="text-[30px] hover:scale-[1.15] cursor-not-allowed" disabled={true}><MdDelete /></button>
                                                    </td>
                                                    <td className="max-w-[1px] w-[1px] p-3"></td>
                                                </tr>
                                                <tr className="h-[50px]" />
                                                <tr className="h-[50px]" />
                                                <tr className="h-[50px]" />
                                            </>
                                        )
                                    }

                                    {
                                        typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem("db") || '[]').sort((a: any, b: any) => (new Date(b.created).valueOf() - new Date(a.created).valueOf())).map((item: any, key: any) => (
                                            <React.Fragment key={key}>
                                                <tr className="bg-white shadow-[0px_0px_35px_2px_rgba(0,0,0,0.1)] rounded-[20px] mb-10 ">
                                                    <td className="max-w-[100px] min-w-[100px]">
                                                        <img src={item.domain ? `https://icon.horse/icon/${removeProtocolAndWww(item.domain)}` : '/err.png'} loading="lazy" className="w-[60px] h-[60px] p-2 bg-[#f5f5f5] rounded-[10px] object-cover" />
                                                    </td>
                                                    <td className="w-[400px] max-w-[400px] text-ellipsis overflow-hidden">{item.domain.trim() != "" ? item.domain : "N/A"}</td>
                                                    <td className="w-[400px] max-w-[400px] text-ellipsis overflow-hidden">{item.content.trim() != "" ? item.content : "N/A"}</td>
                                                    <td className="max-w-[200px] w-[200px]">
                                                        <p>{format(new Date(item.created), 'd MMMM yyyy')}</p>
                                                        <p className="text-[#A6A6A6] font-normal text-[14px]">{format(new Date(item.created), 'HH:mma')}</p>
                                                    </td>
                                                    <td className="max-w-[150px] w-[150px]">
                                                        {
                                                            item.ping != null && item.quality != null  && item.analysis != null && Object.keys(item.ping).length !== 0 && Object.keys(item.quality).length !== 0 && Object.keys(item.analysis).length !== 0 ? (
                                                                <span className="p-2 pl-3 pr-3 rounded-[20px] bg-[#D6F5CB] text-[#6DAA57]">Finished</span>
                                                            ) : item.contentAnalysis != null &&  Object.keys(item.contentAnalysis).length !== 0 ? (
                                                                <span className="p-2 pl-3 pr-3 rounded-[20px] bg-[#D6F5CB] text-[#6DAA57]">Finished</span>
                                                            ) : (
                                                                <span className="p-2 pl-3 pr-3 rounded-[20px] bg-[#ffb7b7] text-[#bc6262]">Failed</span>
                                                            )
                                                        }
                                                    </td>
                                                    <td className="max-w-[180px] w-[180px]">
                                                        {
                                                            !item.scoreWebsite ? (
                                                                <b>N/A</b>
                                                            ) : (
                                                                <><span className="font-normal">{item.scoreWebsite}</span>/100</>
                                                            )
                                                        }
                                                        
                                                    </td>
                                                    <td className="max-w-[180px] w-[180px]">
                                                    {
                                                            !item.scoreContent ? (
                                                                <b>N/A</b>
                                                            ) : (
                                                                <b>{item.scoreContent}</b>
                                                            )
                                                        }
                                                    </td>
                                                    <td className="max-w-[200px] w-[200px] flex items-center justify-center gap-10">
                                                        <a href={'/dashboard/' + item.uuid} className="text-[30px] hover:scale-[1.15]"><IoEyeSharp /></a>
                                                        <div className="h-full w-[2px] bg-[#656464]" />
                                                        <button className="text-[30px] hover:scale-[1.15]" onClick={() => handlerDeleteItem(key)}><MdDelete /></button>
                                                    </td>
                                                    <td className="max-w-[1px] w-[1px] p-3"></td>
                                                </tr>

                                                {
                                                    key == 0 && loading == false ? (
                                                        <>
                                                            <tr className="h-[50px]" />
                                                            <tr className="h-[50px]" />
                                                            <tr className="h-[50px]" />
                                                        </>
                                                    ) : (
                                                        <tr className="h-[50px]" />
                                                    )
                                                }
                                            </React.Fragment>
                                        ))

                                    }
                                </tbody>
                            </table>
                        )
                    }
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    )
}