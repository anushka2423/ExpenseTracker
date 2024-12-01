"use client"
import { authContext } from "@/lib/store/auth-context";
import { useContext } from "react";
import { ImStatsBars } from "react-icons/im";

function Nav() {
  const {user, loading, logout} = useContext(authContext)
    return (
        <header className="container max-w-2xl px-6 py-6 mx-auto">
      {/* {user information} */}
      <div className="flex items-center justify-between">
        {user && !loading && (
        <div className="flex items-center gap-2">
          {/* img */}
          <div className="h-[40px] w-[40px] rounded-full overflow-hidden" >
            <img 
              className="w-full h-full object-cover"
              src={user.photoURL}
              alt="profile image"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* name */}
          <small>Hi, {user.displayName}!</small>
        </div>
        )}

        <div className="flex items-center gap-5">
          <a href="#stats"><div><ImStatsBars className="text-2xl"/></div></a>
          <div><button onClick={logout} className="btn btn-danger">Signout</button></div>
        </div>
      </div>
    </header>
    );
}

export default Nav;