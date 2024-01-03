import React from 'react'
import { BallTriangle } from "react-loader-spinner"
const Loading = ({ text }) => {
    return (
        <div className="flex flex-col gap-8 items-center py-32 w-full h-full">
            <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#e91e63"
                ariaLabel="ball-triangle-loading"
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
            <div className="text-lg font-semibold">{text}</div>
        </div>
    )
}

export default Loading