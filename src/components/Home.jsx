import React, { useRef, useState } from 'react'
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';

const bgs = [
    { bgName: "Indigo", classStr: "bg-gradient-to-r from-violet-600 to-indigo-600" },
    { bgName: "Yellow", classStr: "bg-gradient-to-r from-amber-200 to-yellow-400" },
    { bgName: "Emerald", classStr: "bg-gradient-to-r from-emerald-500 to-emerald-900" },
    { bgName: "Red", classStr: "bg-gradient-to-r from-red-500 to-orange-500" },
    { bgName: "Cyan", classStr: "bg-gradient-to-r from-cyan-500 to-blue-500" }
];
const pad = [
    { padName: "4", classStr: "p-4" },
    { padName: "8", classStr: "p-8" },
    { padName: "12", classStr: "p-12" },
    { padName: "16", classStr: "p-16" },
]

const Home = () => {
    const [bgColor, setBgColor] = useState(0);
    const [activePad, setActivePad] = useState(0);
    const [width, setWidth] = useState(640);
    const divRef = useRef(null);

    const handleMouseDown = (event) => {
        const initialX = event.clientX;
        const handleMouseMove = (event) => {
            const newWidth = width - (event.clientX - initialX);
            if (newWidth < 400) {
                setWidth(400);
            } else if (newWidth > 900) {
                setWidth(900);
            } else {
                setWidth(newWidth);
            }
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="min-h-screen h-full relative overflow-hidden flex flex-col items-center justify-center bg-[#0d0d0d] text-white font-mono">
            {/* Codebox  */}
            <div ref={divRef} style={{ width }} className={`relative z-10 ${pad[activePad].classStr} rounded-md shadow-md text-white ${bgs[bgColor].classStr}`}>
                <div class="w-full shadow-2xl subpixel-antialiased border-gray-400 rounded h-64 bg-black bg-opacity-40  border-2  mx-auto">
                    <div class="flex items-center h-8 rounded-t  border-b-2  border-gray-400 text-center">
                        <div class="ml-2  bg-gray-300 shadow-inner rounded-full w-3 h-3"> </div>
                        <div class="ml-2  bg-gray-300 shadow-inner rounded-full w-3 h-3"> </div>
                        <div class="ml-2  bg-gray-300 shadow-inner rounded-full w-3 h-3"> </div>

                        <div class="mx-auto pr-16 font-bold opacity-80" >
                            <p class="text-center text-sm"><input className='bg-transparent text-center focus:outline-0' type="text" defaultValue={"Untitled-1"} /></p>
                        </div>
                    </div>
                    <div class="pl-1 pt-1 min-h-[40rem]   font-semibold tracking-wider text-lg">
                        <textarea className='h-full  p-2 bg-transparent border-0 focus-0 focus:outline-0 w-full' spellCheck='false' name="" id=""></textarea>
                    </div>
                </div>
                <div onMouseDown={handleMouseDown} className='h-full w-1 rounded-full top-0 -left-10 bg-opacity-10 cursor-col-resize bg-white  absolute'></div>
            </div>
            <div className='z-10 py-2 text-sm text-gray-300'>{width}</div>

            {/* Form  */}
            <div className="z-10 flex gap-4 items-center absolute px-8 py-4 border-blue border-2 rounded-md bg-black bg-opacity-20 bottom-20 ">
                <BgColorBtn setBgColor={setBgColor} />
                <PaddingBtn setActivePad={setActivePad} />
                <SaveImageBtn divRef={divRef} />
            </div>

            {/* Footer  */}
            <img className='absolute bottom-0 w-[40rem]' src="./images/foot-bg.jpg" alt="" />
            <div className='absolute bottom-3 text-gray-400 text-xs '>Made By <span className='text-lg text-gray-200'>Mohit Nippanikar</span></div>
        </div>
    )
};

const BgColorBtn = ({ setBgColor }) => {
    const [toggle, setToggle] = useState(false);
    return (<>
        <div className="flex flex-col relative">
            <button onClick={() => setToggle(v => !v)} className=" border-2 hover:bg-black hover:bg-opacity-30  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button">
                BG color
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <div className={`${toggle ? "" : "hidden"} absolute top-[100%]  z-10 bg-white divide-y divide-gray-100 rounded-lg shadow`}>
                <ul className="py-4 text-sm text-gray-700 w-96 grid grid-cols-3">
                    {bgs.map((bg, index) => (
                        <li key={index} onClick={() => { setBgColor(index); setToggle(false) }} className="flex w-full items-center gap-2 hover:bg-gray-100 px-5 py-2.5 cursor-pointer" role="option">
                            <div className={`w-6 h-6  rounded-full ${bg.classStr}`}></div>
                            {bg.bgName}
                        </li>
                    ))}
                </ul>
            </div>
        </div></>)
}

const SaveImageBtn = ({ divRef }) => {
    const handleDownloadImage = async () => {
        if (divRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toPng(divRef.current);
            saveAs(dataUrl, 'blockbeauty.png');
        } catch (error) {
            console.error('Oops, something went wrong!', error);
        }
    };
    return (
        <button onClick={handleDownloadImage} className=" border-2 hover:bg-black hover:bg-opacity-30 h-max  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button">
            Save Image
        </button>
    )
}
const PaddingBtn = ({ setActivePad }) => {
    return (
        <div className="flex items-center gap-2  border-2 font-medium rounded-lg text-sm px-5 py-2.5 text-center" >
            Padding
            {pad.map((p, i) => (
                <button key={i} onClick={() => { setActivePad(i) }} className="border-2 hover:bg-black hover:bg-opacity-30  font-medium rounded-lg text-sm px-2 py-1   text-center items-center" type="button" >{p.padName}</button>
            ))}
        </div >
    )
}
export default Home