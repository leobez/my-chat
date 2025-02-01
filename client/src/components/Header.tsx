import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Header = () => {

    return (
      <div className="h-full flex text-white">
          <Link to={`/`} className="flex gap-1 items-center justify-center">
            <IoChatboxEllipsesOutline size={40}/>
            <p className="tracking-wide font-bold">MYCHAT</p>
          </Link>
      </div>
    )
}

export default Header