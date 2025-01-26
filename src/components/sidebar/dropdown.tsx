import { useState } from "react";
import ScrollWrapper from "@/components/shared/scrollWrapper";
import FriendRequest from "@/components/sidebar/friendRequest";
import useStore from "@/store";

type DropdownProps = {
    dropdownVisible: boolean
}

export default function Dropdown({ dropdownVisible }: DropdownProps) {
    const { friendRequests } = useStore();
    const [requestStatus, setRequestStatus] = useState(new Map())

    return (
        <ScrollWrapper className={`${dropdownVisible ? "" : "hidden"} absolute z-20 left-40 w-[350px] min-h-[300px] max-h-96 bg-gray-800 border-l-2 border-slate-500 rounded-br-md gap-2`}>
            {friendRequests.length > 0 ? [...friendRequests].reverse().map((request, index) => (
                <FriendRequest
                    key={index}
                    request={request}
                    requestStatus={requestStatus}
                    setRequestStatus={setRequestStatus} />
            )) : <li className="text-white p-2 text-center list-none">No notifications</li>}
        </ScrollWrapper>
    )
}