"use client"

import Navbar from "@/components/Navbar"
import { useState, useEffect } from "react";
import React from 'react';
import { useRouter, usePathname, notFound } from 'next/navigation';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineExclamationCircle, AiOutlineEyeInvisible } from "react-icons/ai";


import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debugPort } from "process";


export default function Detail() {

    const path = usePathname();
    const pathUUID = path.substring((path.indexOf("dashboard/")) + "dashboard/".length);
    let keyIndexTimeline = 1;

    const [dbUUID, setDBUUID] = useState<any>([]);
    const [showCount, setShowCount] = useState(20);

    const handleShowMore = () => {
        setShowCount(prevCount => prevCount + 10);
    };

    function removeProtocolAndWww(url: string) {
        return url.replace(/^(https?:\/\/)?(www\.)?/i, '');
    }

    useEffect(() => {
        let find = false;
        if (typeof localStorage !== 'undefined') {
            JSON.parse(localStorage.getItem("db") || '[]').map((item: any, key: any) => {
                if (item.uuid == pathUUID) {
                    find = true;
                    setDBUUID(item);
                }
            })
        }

        if (find == false)
            notFound();
    }, [])

    return (
        <>
            <Navbar />

            <div className="w-full min-h-[calc(100%-80px)] flex flex-wrap flex-col items-start justify-start p-5 gap-16">
                <div className="w-full flex p-5 items-center justify-center">
                    <div className="max-w-[1200px] w-full min-h-[300px] rounded-[20px] bg-[#313549] shadow-[inset_0px_0px_15px_5px_rgba(255,255,255,0.35)] flex items-center gap-10 justify-between p-10 max-sm:flex-col">
                        <div className="flex p-1 bg-[#BBC1E2] rounded-[50%] shadow-[0px_0px_13px_7px_rgba(59,88,142,0.70)]">
                            <div className="w-[130px] h-[130px]">
                                <img src={`https://icon.horse/icon/${removeProtocolAndWww(dbUUID.domain || '')}`} loading="lazy" className="min-w-[130px] min-h-[130px] rounded-[50%] object-cover" />
                            </div>
                        </div>

                        <div className="flex flex-col w-full overflow-hidden">
                            <h1 className="text-ellipsis overflow-hidden text-nowrap font-firaSans font-bold text-2xl text-[#EEEEEE]">{dbUUID.domain || dbUUID.content}</h1>
                            <p className="font-firaSans  text-[#CACACA]">{dbUUID.domain && dbUUID.content ? 'Website & Content' : dbUUID.domain && !dbUUID.content ? 'Website' : 'Content'}</p>
                        </div>

                        <div className="flex-1 flex gap-10 max-sm:flex-col">
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[80px] font-firaSans font-bold text-[#FFFFFF] scorShadow">
                                    {dbUUID && dbUUID.scoreWebsite >= 100.0 ? '100' : !dbUUID.scoreWebsite ? 'N/A' : dbUUID.scoreWebsite}
                                </span>
                                <p className="text-[24px] font-firaSans font-bold text-[#FFFFFF] text-nowrap scorShadow">Scor Website</p>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[80px] font-firaSans font-bold text-[#FFFFFF] scorShadow">
                                    {dbUUID && dbUUID.scoreContent >= 100.0 ? '100' : !dbUUID.scoreContent ? 'N/A' : dbUUID.scoreContent}
                                </span>
                                <p className="text-[24px] font-firaSans font-bold text-[#FFFFFF] text-nowrap scorShadow">Fake content</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full p-14 flex flex-wrap items-start justify-start gap-10 max-sm:flex-col max-sm:items-center max-sm:p-5">
                    <div className="w-full flex flex-col gap-5">
                        <h1 className="font-firaSans font-bold text-2xl tracking-wider">Timeline</h1>
                        <br />
                        <div className="flex flex-wrap items-start justify-center gap-7 ">
                            {
                                dbUUID && dbUUID.domain && (
                                    <>
                                        <div className="w-[350px] b rounded-[10px] flex items-center justify-start flex-col">
                                            <div className={`w-[100px] h-[40px] rounded-[10px] ${Object.keys(dbUUID.ping).length != 0 ? "bg-[#7FC668] text-[#225011]" : "bg-[#e1a27a] text-[#843434]"} mb-[-20px] z-[1] font-firaSans font-bold flex items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)]`}>
                                                {Object.keys(dbUUID.ping).length != 0 ? "Finished" : "Failed"}
                                            </div>
                                            <div className={`w-full h-[200px] ${Object.keys(dbUUID.ping).length != 0 ? "bg-[#9EE2D5]" : "bg-[#f0cfa1]"} rounded-[10px] p-4 pt-[25px] font-firaSans font-bold  flex gap-5 flex-col items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)] text-[#514545]`}>
                                                <h3 className="text-6xl">{keyIndexTimeline.toLocaleString(undefined, { minimumIntegerDigits: 2 })}</h3>
                                                <p className="text-[18px] font-normal text-center">Website connection check</p>
                                            </div>
                                        </div>

                                        {keyIndexTimeline++ && ''}

                                        <div className="w-[350px] b rounded-[10px] flex items-center justify-start flex-col">
                                            <div className={`w-[100px] h-[40px] rounded-[10px] ${dbUUID.analysis && Object.keys(dbUUID.analysis).length != 0 ? "bg-[#7FC668] text-[#225011]" : "bg-[#e1a27a] text-[#843434]"} mb-[-20px] z-[1] font-firaSans font-bold flex items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)]`}>
                                                {dbUUID.analysis && Object.keys(dbUUID.analysis).length != 0 ? "Finished" : "Failed"}
                                            </div>
                                            <div className={`w-full h-[200px] ${dbUUID.analysis && Object.keys(dbUUID.analysis).length != 0 ? "bg-[#9EE2D5]" : "bg-[#f0cfa1]"} rounded-[10px] p-4 pt-[25px] font-firaSans font-bold flex gap-5 flex-col items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)] text-[#514545]`}>
                                                <h3 className="text-6xl">{keyIndexTimeline.toLocaleString(undefined, { minimumIntegerDigits: 2 })}</h3>
                                                <p className="text-[18px] font-normal text-center">Website malware analysis</p>
                                            </div>
                                        </div>

                                        {keyIndexTimeline++ && ''}

                                        <div className="w-[350px] b rounded-[10px] flex items-center justify-start flex-col">
                                            <div className={`w-[100px] h-[40px] rounded-[10px] ${dbUUID.quality && Object.keys(dbUUID.quality).length != 0 ? "bg-[#7FC668] text-[#225011]" : "bg-[#e1a27a] text-[#843434]"} mb-[-20px] z-[1] font-firaSans font-bold flex items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)]`}>
                                                {dbUUID.quality && Object.keys(dbUUID.quality).length != 0 ? "Finished" : "Failed"}
                                            </div>
                                            <div className={`w-full h-[200px] ${dbUUID.quality && Object.keys(dbUUID.quality).length != 0 ? "bg-[#9EE2D5]" : "bg-[#f0cfa1]"} rounded-[10px] p-4 pt-[25px] font-firaSans font-bold flex gap-5 flex-col items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)] text-[#514545]`}>
                                                <h3 className="text-6xl">{keyIndexTimeline.toLocaleString(undefined, { minimumIntegerDigits: 2 })}</h3>
                                                <p className="text-[18px] font-normal text-center">Website quality analysis</p>
                                            </div>
                                        </div>

                                        {keyIndexTimeline++ && ''}
                                    </>
                                )
                            }

                            {
                                dbUUID && dbUUID.domain && dbUUID.content && (
                                    <>
                                        <div className="w-[350px] b rounded-[10px] flex items-center justify-start flex-col">
                                            <div className={`w-[100px] h-[40px] rounded-[10px] bg-[#7FC668] text-[#225011] mb-[-20px] z-[1] font-firaSans font-bold flex items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)]`}>
                                                {Object.keys(dbUUID.contentDomain).length != 0 && dbUUID.contentDomain.status == "yes" ? "Yes" : "No"}
                                            </div>
                                            <div className={`w-full h-[200px] bg-[#9EE2D5] rounded-[10px] p-4 pt-[25px] font-firaSans font-bold flex gap-5 flex-col items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)] text-[#514545]`}>
                                                <h3 className="text-6xl">{keyIndexTimeline.toLocaleString(undefined, { minimumIntegerDigits: 2 })}</h3>
                                                <p className="text-[18px] font-normal text-center">The content is on the website provided</p>
                                            </div>
                                        </div>

                                        {keyIndexTimeline++ && ''}
                                    </>
                                )
                            }

                            {
                                dbUUID && dbUUID.content && (
                                    <>
                                        <div className="w-[350px] b rounded-[10px] flex items-center justify-start flex-col">
                                            <div className={`w-[100px] h-[40px] rounded-[10px] ${Object.keys(dbUUID.contentAnalysis).length != 0 ? "bg-[#7FC668] text-[#225011]" : "bg-[#e1a27a] text-[#843434]"} mb-[-20px] z-[1] font-firaSans font-bold flex items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)]`}>
                                                {Object.keys(dbUUID.contentAnalysis).length != 0 ? "Finished" : "Failed"}
                                            </div>
                                            <div className={`w-full h-[200px] ${Object.keys(dbUUID.contentAnalysis).length != 0 ? "bg-[#9EE2D5]" : "bg-[#f0cfa1]"} rounded-[10px] p-4 pt-[25px] font-firaSans font-bold flex gap-5 flex-col items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)] text-[#514545]`}>
                                                <h3 className="text-6xl">{keyIndexTimeline.toLocaleString(undefined, { minimumIntegerDigits: 2 })}</h3>
                                                <p className="text-[18px] font-normal text-center">We verify content with AI</p>
                                            </div>
                                        </div>

                                        {keyIndexTimeline++ && ''}

                                        <div className="w-[350px] b rounded-[10px] flex items-center justify-start flex-col">
                                            <div className={`w-[100px] h-[40px] rounded-[10px] ${Object.keys(dbUUID.contentTop).length != 0 ? "bg-[#7FC668] text-[#225011]" : "bg-[#e1a27a] text-[#843434]"} mb-[-20px] z-[1] font-firaSans font-bold flex items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)]`}>
                                                {Object.keys(dbUUID.contentTop).length != 0 ? "Finished" : "Failed"}
                                            </div>
                                            <div className={`w-full h-[200px] ${Object.keys(dbUUID.contentTop).length != 0 ? "bg-[#9EE2D5]" : "bg-[#f0cfa1]"} rounded-[10px] p-4 pt-[25px] font-firaSans font-bold flex gap-5 flex-col items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)] text-[#514545]`}>
                                                <h3 className="text-6xl">{keyIndexTimeline.toLocaleString(undefined, { minimumIntegerDigits: 2 })}</h3>
                                                <p className="text-[18px] font-normal text-center">We extract the first 10 websites with relative content</p>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-5">
                        <h1 className="font-firaSans font-bold text-2xl tracking-wider">Website</h1>

                        <div className="w-full pb-5 flex items-center justify-center basis-1/2 flex-wrap gap-8 max-sm:p-5 font-firaSans max-sm:flex-col">
                            <div className="flex-auto flex flex-col items-stacenterrt justify-center">
                                <h4 className="text-[20px] font-bold text-[#514545]">Domain:</h4>
                                <li className=" text-[16px]"><b>{dbUUID && dbUUID?.quality?.domain || "N/A"}</b></li>
                            </div>

                            <div className="flex-auto flex flex-col items-start justify-center">
                                <h4 className="text-[20px] font-bold text-[#514545]">Root domain:</h4>
                                <li className="text-[16px]"><b>{dbUUID && dbUUID?.quality?.root_domain || "N/A"}</b></li>
                            </div>

                            <div className="flex-auto flex flex-col items-start justify-center">
                                <h4 className="text-[20px] font-bold text-[#514545]">Server:</h4>
                                <li className="text-[16px]"><b>{dbUUID && dbUUID?.quality?.server || "N/A"}</b></li>
                            </div>

                            <div className="flex-auto flex flex-col items-start justify-center">
                                <h4 className="text-[20px] font-bold text-[#514545]">A records:</h4>
                                <li className="text-[16px]"><b>{dbUUID && dbUUID?.quality?.a_records[0] || "N/A"}</b></li>
                                <li className="text-[16px]"><b>{dbUUID && dbUUID?.quality?.a_records[1] || "N/A"}</b></li>
                            </div>

                            <div className="flex-auto flex flex-col items-start justify-center">
                                <h4 className="text-[20px] font-bold text-[#514545]">MX records:</h4>
                                <li className="text-[16px]"><b>{dbUUID && dbUUID?.quality?.mx_records[0] || "N/A"}</b></li>
                                <li className="text-[16px]"><b>{dbUUID && dbUUID?.quality?.mx_records[1] || "N/A"}</b></li>
                                <li className="text-[16px]"><b>{dbUUID && dbUUID?.quality?.mx_records[2] || "N/A"}</b></li>
                            </div>

                            <div className="flex-auto flex flex-col items-start justify-center">
                                <h4 className="text-[20px] font-bold text-[#514545]">NS records:</h4>
                                <li className="text-[16px]"><b>{dbUUID && dbUUID?.quality?.ns_records[0] || "N/A"}</b></li>
                                <li className="text-[16px]"><b>{dbUUID && dbUUID?.quality?.ns_records[1] || "N/A"}</b></li>
                            </div>
                        </div>


                        <br />
                        <div className="flex flex-wrap items-stretch justify-center gap-7 ">
                            <div className="max-w-[400px] w-full min-h-[200px] rounded-[20px] bg-[#6d759c] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center gap-10 font-firaSans font-bold">
                                <div className="w-full h-full aspect-square">
                                    <img src="/virus.png" className="w-full h-full p-5" />
                                </div>
                                <div className="flex-1 text-white flex items-center justify-center flex-col">
                                    <span className="text-[60px] scorShadow">{dbUUID && dbUUID?.analysis?.stats?.malicious || "0"}</span>
                                    <h3 className="font-firaSans font-bold text-[25px]">Malicious</h3>
                                </div>
                            </div>
                            <div className="max-w-[400px] w-full min-h-[200px] rounded-[20px] bg-[#6d759c] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center gap-10 font-firaSans font-bold">
                                <div className="aspect-square w-full h-full ">
                                    <img src="/suspicious.png" className="w-full h-full p-5" />
                                </div>
                                <div className="flex-1 text-white flex items-center justify-center flex-col">
                                    <span className="text-[60px] scorShadow">{dbUUID && dbUUID?.analysis?.stats?.suspicious || "0"}</span>
                                    <h3 className="font-firaSans font-bold text-[25px]">Suspicious</h3>
                                </div>
                            </div>
                            <div className="max-w-[400px] w-full min-h-[200px] rounded-[20px] bg-[#6d759c] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center gap-10 font-firaSans font-bold">
                                <div className="w-full h-full aspect-square">
                                    <img src="/ninja.png" className="w-full h-full p-5" />
                                </div>
                                <div className="flex-1 text-white flex items-center justify-center flex-col">
                                    <span className="text-[60px] scorShadow">{dbUUID && dbUUID?.analysis?.stats?.undetected || "0"}</span>
                                    <h3 className="ffont-firaSans font-bold text-[25px]">Undetected</h3>
                                </div>
                            </div>
                            <div className="max-w-[400px] w-full min-h-[200px] rounded-[20px] bg-[#6d759c] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center gap-10 font-firaSans font-bold">
                                <div className="w-full h-full aspect-square">
                                    <img src="/shield.png" className="w-full h-full p-5" />
                                </div>
                                <div className="flex-1 text-white flex items-center justify-center flex-col">
                                    <span className="text-[60px] scorShadow">{dbUUID && dbUUID?.analysis?.stats?.harmless || "0"}</span>
                                    <h3 className="font-firaSans font-bold text-[25px]">Harmless</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        dbUUID && dbUUID.analysis && (
                            <div className="w-full p-10 pb-5 flex items-center justify-between flex-wrap gap-6 max-sm:p-5">
                                <b className="w-full text-[22px] font-firaSans font-bold text-[#514545]">Details</b>
                                <hr className="w-full border-[#8b8b8b]" />
                                {
                                    dbUUID?.analysis?.results && Object.entries(dbUUID.analysis.results).slice(0, showCount).map(([key, value]: [string, any], index: number) => (
                                        <div className="max-w-[400px] w-full flex items-center justify-between gap-5 text-nowrap" key={key}>
                                            <b>{value.engine_name}</b>
                                            <div className="w-full text-right flex items-center justify-end gap-3">
                                                {
                                                    value.category == "undetected" ? (
                                                        <AiOutlineEyeInvisible className="text-[22px] text-[#8c9349]" />
                                                    ) : value.category == "harmless" ? (
                                                        <AiOutlineCheckCircle className="text-[20px] text-[#617839]" />
                                                    ) : value.category == "suspicious" ? (
                                                        <AiOutlineExclamationCircle className="text-[20px] text-[#bc7c4b]" />
                                                    ) : (
                                                        <AiOutlineCloseCircle className="text-[20px] text-[#bc4b4b]" />
                                                    )
                                                }
                                                <span className={`${value.category == "undetected" ? "text-[#8c9349]" : value.category == "harmless" ? "text-[#617839]" : value.category == "suspicious" ? "text-[#bc7c4b]" : "text-[#bc4b4b]"}`}>{value.result}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                    
                        )
                    }

                    {
                        dbUUID && dbUUID.analysis && dbUUID?.analysis?.results && showCount < Object.keys(dbUUID.analysis.results).length && (
                            <button className="w-full text-[#514545] text-center underline underline-offset-auto text-[18px] hover:scale-[1.05]" onClick={handleShowMore}>
                                Show more
                            </button>
                        )
                    }


                    <div className="w-full p-10 pb-5 flex items-center justify-center flex-wrap gap-16 max-sm:p-5">
                        <b className="w-full text-[22px] font-firaSans font-bold text-[#514545]">Advanced details about the website</b>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/bug.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.malware ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Malware</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/suspicious (1).png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.suspicious ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Suspicious</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/crash.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.unsafe ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Unsafe</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/phising.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.phishing ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Phishing</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/speedometer.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.risk_score || "0"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Risk Score</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/spam.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.spamming ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Spamming</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/adults-only.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.adult ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Adult</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/category.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.category || "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Category</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/dns.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.dns_valid ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">DNS valid</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/age.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[25px] scorShadow">{dbUUID && dbUUID?.quality?.domain_age?.human || "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Age</h3>
                            </div>
                        </div>
                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/parking.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.Parking ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Parking</h3>
                            </div>
                        </div>

                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/forwarding.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.short_link_redirect ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Redirected</h3>
                            </div>
                        </div>

                        <div className="max-w-[240px] w-full max-h-[280px] rounded-[20px] flex-col bg-[#a2a7c2] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center font-firaSans font-bold">
                            <div className="w-[130px] h-[130px] aspect-square">
                                <img src="/website.png" className="w-full h-full p-5" />
                            </div>
                            <div className="flex-1 text-white flex items-center justify-center flex-col">
                                <span className="text-[40px] scorShadow">{dbUUID && dbUUID?.quality?.risky_tld ? "Yes" : dbUUID.quality ? "NO" : "N/A"}</span>
                                <h3 className="font-firaSans font-bold text-[20px]">Risky_tld</h3>
                            </div>
                        </div>


                    </div>

                </div>

                {
                    dbUUID && dbUUID.content && (
                        <div className="w-full p-14 flex flex-wrap items-start justify-start gap-10 max-sm:flex-col max-sm:items-center max-sm:p-5">
                            <div className="w-full flex flex-col gap-5">
                                <h1 className="font-firaSans font-bold text-2xl tracking-wider">Content</h1>
                            </div>

                            <div className="w-full flex flex-wrap items-start justify-center gap-10 p-5">
                                {
                                    dbUUID && dbUUID?.contentDomain?.status == "yes" && (
                                        <b className="text-left w-full font-firaSans text-[18px] p-5 bg-[#eeb471] rounded-[15px] flex items-center gap-2"><span className="text-[30px]">ℹ️ </span>The content received was found on the site provided!</b>
                                    )
                                }
                                <div className="font-firaSans w-full p-5 rounded-[10px] bg-[#313548] text-white text-justify" dangerouslySetInnerHTML={{__html:dbUUID && dbUUID.content}}/>
                            </div>
                        </div>
                    )
                }

            </div>
        </>
    )
}