import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faMessage } from "@fortawesome/free-solid-svg-icons";

type FriendProps = {
    user: UserType;
}

export default function Friend({ user }: FriendProps) {
    return (
        <div className="flex justify-evenly items-center w-full p-5">
            <img src="/images/placeholder.png" className="w-10 h-10 rounded-full" />
            <p>{user.name}</p>
            {user.isFriend ?
                <button className="text-blue-500">
                    <FontAwesomeIcon icon={faMessage} />
                </button> :
                <button className="text-blue-500">
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            }
        </div>
    )
}