import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMessage, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import Button from '@/components/shared/customButton';
import useStore from '@/store';

type SidebarListItemsProps = {
    dropdownVisible: boolean,
    setDropdownVisible: (value: boolean) => void
}

export default function SidebarListItems({ dropdownVisible, setDropdownVisible }: SidebarListItemsProps) {
    const { activePage,
        setActivePage,
        friendRequestReceived,
        setFriendRequestReceived,
        messageReceived,
        setMessageReceived,
        setSelectedFriend
    } = useStore();

    return (
        <>
            <button onClick={() => {
                setDropdownVisible(!dropdownVisible)
                setFriendRequestReceived(false);
            }}
                className={`flex-none self-center w-10 h-10 ${friendRequestReceived ? "text-red-500" : "text-white"} hover:cursor-pointer hover:text-blue-500`}>
                <FontAwesomeIcon
                    className="w-10 h-10 text-blue"
                    icon={faBell} />
            </button>
            <button className={`${messageReceived ? "text-red-500" : activePage === "chat" ? "text-blue-500" : "text-white"} flex-none self-center w-10 h-10 hover:cursor-pointer hover:text-blue-500`}>
                <FontAwesomeIcon
                    onClick={() => {
                        setActivePage("chat");
                        setMessageReceived(false);
                    }}
                    className="w-10 h-10"
                    icon={faMessage} />
            </button>
            <button className={`${activePage === "friends" ? "text-blue-500" : "text-white"} flex-none self-center w-10 h-10 hover:cursor-pointer hover:text-blue-500`}>
                <FontAwesomeIcon
                    onClick={() => {
                        setActivePage("friends");
                        setSelectedFriend(null);
                    }}
                    className="w-10 h-10"
                    icon={faUserFriends} />
            </button>
            <Button onClick={() => signOut()} buttonType="logout" className="mt-auto">Logout</Button>
        </>
    )
}