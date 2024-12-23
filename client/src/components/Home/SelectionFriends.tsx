type Props = {}

const SelectionFriends = (props: Props) => {
    return (
        <div className='h-full overflow-y-auto'>

            <div className="border-2 border-black text-left p-2 my-1">
                <p className="font-bold text-lg">Friends</p>
                <ul>
                    <li>...</li>
                </ul>
            </div>

            <div className="border-2 border-black text-left p-2 my-1">
                <p className="font-bold text-lg">Requests received</p>
                <ul>
                    <li>...</li>
                </ul>
            </div>

            <div className="border-2 border-black text-left p-2 my-1">
                <p className="font-bold text-lg">Requests sent</p>
                <ul>
                    <li>...</li>
                </ul>
            </div>  

        </div>
    )
}

export default SelectionFriends