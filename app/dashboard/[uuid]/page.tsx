"use client"

import Navbar from "@/components/Navbar"
import { useState, useEffect } from "react";
import React from 'react';
import { useRouter, usePathname, notFound } from 'next/navigation';


import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Detail() {

    const path = usePathname();
    const pathUUID = path.substring((path.indexOf("dashboard/")) + "dashboard/".length);
    let keyIndexTimeline = 1;

    const [dbUUID, setDBUUID] = useState<any>([]);


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
                                            <div className={`w-full h-[200px] ${Object.keys(dbUUID.ping).length != 0 ? "bg-[#9EE2D5]" : "bg-[#f0cfa1]"} rounded-[10px] p-4 pt-[25px] font-firaSans font-bold flex gap-5 flex-col items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)] text-[#514545]`}>
                                                <h3 className="text-6xl">{keyIndexTimeline.toLocaleString(undefined, { minimumIntegerDigits: 2 })}</h3>
                                                <p className="text-[18px] font-normal text-center">Website connection check</p>
                                            </div>
                                        </div>

                                        {keyIndexTimeline++ && ''}

                                        <div className="w-[350px] b rounded-[10px] flex items-center justify-start flex-col">
                                            <div className={`w-[100px] h-[40px] rounded-[10px] ${Object.keys(dbUUID.analysis).length != 0 ? "bg-[#7FC668] text-[#225011]" : "bg-[#e1a27a] text-[#843434]"} mb-[-20px] z-[1] font-firaSans font-bold flex items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)]`}>
                                                {Object.keys(dbUUID.analysis).length != 0 ? "Finished" : "Failed"}
                                            </div>
                                            <div className={`w-full h-[200px] ${Object.keys(dbUUID.analysis).length != 0 ? "bg-[#9EE2D5]" : "bg-[#f0cfa1]"} rounded-[10px] p-4 pt-[25px] font-firaSans font-bold flex gap-5 flex-col items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)] text-[#514545]`}>
                                                <h3 className="text-6xl">{keyIndexTimeline.toLocaleString(undefined, { minimumIntegerDigits: 2 })}</h3>
                                                <p className="text-[18px] font-normal text-center">Website malware analysis</p>
                                            </div>
                                        </div>

                                        {keyIndexTimeline++ && ''}

                                        <div className="w-[350px] b rounded-[10px] flex items-center justify-start flex-col">
                                            <div className={`w-[100px] h-[40px] rounded-[10px] ${Object.keys(dbUUID.quality).length != 0 ? "bg-[#7FC668] text-[#225011]" : "bg-[#e1a27a] text-[#843434]"} mb-[-20px] z-[1] font-firaSans font-bold flex items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)]`}>
                                                {Object.keys(dbUUID.quality).length != 0 ? "Finished" : "Failed"}
                                            </div>
                                            <div className={`w-full h-[200px] ${Object.keys(dbUUID.quality).length != 0 ? "bg-[#9EE2D5]" : "bg-[#f0cfa1]"} rounded-[10px] p-4 pt-[25px] font-firaSans font-bold flex gap-5 flex-col items-center justify-center shadow-[0px_0px_20px_5px_rgba(0,0,0,0.08)] text-[#514545]`}>
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
                        <br />
                        <div className="flex flex-wrap items-stretch justify-center gap-7 ">
                            <div className="max-w-[400px] w-full min-h-[200px] rounded-[20px] bg-[#6d759c] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center gap-10 font-firaSans font-bold">
                                <div className="w-full h-full aspect-square">
                                    <img src="/virus.png" className="w-full h-full p-5" />
                                </div>
                                <div className="flex-1 text-white flex items-center justify-center flex-col">
                                    <span className="text-[60px] scorShadow">{dbUUID && dbUUID?.analysis?.stats?.malicious}</span>
                                    <h3 className="font-normal text-[25px]">Malicious</h3>
                                </div>
                            </div>
                            <div className="max-w-[400px] w-full min-h-[200px] rounded-[20px] bg-[#6d759c] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center gap-10 font-firaSans font-bold">
                                <div className="aspect-square w-full h-full ">
                                    <img src="/suspicious.png" className="w-full h-full p-5" />
                                </div>
                                <div className="flex-1 text-white flex items-center justify-center flex-col">
                                    <span className="text-[60px] scorShadow">{dbUUID && dbUUID?.analysis?.stats?.suspicious}</span>
                                    <h3 className="font-normal text-[25px]">Suspicious</h3>
                                </div>
                            </div>
                            <div className="max-w-[400px] w-full min-h-[200px] rounded-[20px] bg-[#6d759c] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center gap-10 font-firaSans font-bold">
                                <div className="w-full h-full aspect-square">
                                    <img src="/ninja.png" className="w-full h-full  p-5" />
                                </div>
                                <div className="flex-1 text-white flex items-center justify-center flex-col">
                                    <span className="text-[60px] scorShadow">{dbUUID && dbUUID?.analysis?.stats?.undetected}</span>
                                    <h3 className="font-normal text-[25px]">Undetected</h3>
                                </div>
                            </div>
                            <div className="max-w-[400px] w-full min-h-[200px] rounded-[20px] bg-[#6d759c] shadow-[0px_0px_18px_5px_rgba(0,0,0,0.35)] p-10 flex items-center justify-center gap-10 font-firaSans font-bold">
                                <div className="w-full h-full aspect-square">
                                    <img src="/shield.png" className="w-full h-full   p-5" />
                                </div>
                                <div className="flex-1 text-white flex items-center justify-center flex-col">
                                    <span className="text-[60px] scorShadow">{dbUUID && dbUUID?.analysis?.stats?.harmless}</span>
                                    <h3 className="font-normal text-[25px]">Harmless</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-14 flex items-center justify-between flex-wrap gap-6 max-sm:p-5">
                        {
                            Object.keys(dbUUID.analysis.results).map((item: any, key: any) => (
                                <div className="max-w-[300px] w-full flex items-center justify-between">
                                    <p>bla bla acr</p>
                                    <div className="">
                                        x <span>Clean</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
        </>
    )
}