import React from "react";

export default function ErrorMessage({...props}) {
    return (
        <p className="text-red-600 text-center">{props.children}</p>
    )
}