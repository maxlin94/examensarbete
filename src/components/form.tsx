import React from "react";

export default function Form({...props}) {
    return <form action={props.action} onSubmit={props.onSubmit} className="flex flex-col w-full gap-3 items-center">{props.children}</form>
}