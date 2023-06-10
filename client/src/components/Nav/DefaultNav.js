import React, {useState,useRef, useEffect} from "react";
import Hamburger from "../helpers/Hamburger";
import UserSublist from "../helpers/Usersublist";
import { Link } from "react-router-dom";
const DefaultNav = ({
  isAuthenticated,
  user,
  onLogout,
  products,
  categories,
}) => {
    const [visibility, setVisbility] = useState(false);
    // Dropdown sublist
    const node = useRef();
    const handleClick = (e) => {
      if (node.current.contains(e.target)) {
        // inside click
        return;
      }
      // outside click
      setVisbility(false);
    };
    //Outside click functioality
    useEffect(() => {
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }, []);
    

  return (
    <nav className='sticky-top shadow-sm' ref={node}>
      <div className="navbar justify-content-start py-2 bg-white">
        <ul className="nav py-2">
          <li className="nav-item float-left">
            <Hamburger
              isAuthenticated={isAuthenticated}
              user={user}
              onLogout={onLogout}
              products={products}
            />
            <span
              className="nav-link right-border"
              onClick={(e) => setVisbility(!visibility)}
            >
              Styles
            </span>
            <ul
              className={
                "list-group position-absolute " +
                (visibility ? "d-inline-block" : "d-none")
              }
            >
              {categories.map((category) => (
                <li className="list-group-item" key={category._id}>
                  <Link
                    className="text-dark"
                    to={{
                      pathname: `/category/${category.category_name}`,
                      state: category,
                    }}
                  >
                    {category.category_name
                      .split("-")
                      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(" ")}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark right-border" to={"/about"}>
              About Us
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to={"/customize"}>
              Customize
            </Link>
          </li>
        </ul>
        <a className="navbar-brand text-center position-absolute" href="/">SolBracelets</a>
        <ul className="nav float-right" id="top-menu">
          <li className="nav-item">
            {isAuthenticated ? (
              <UserSublist user={user} onLogout={onLogout}/>
            ) : (
              <Link className="nav-link text-dark" to={"/login"}>
                <i className="fas fa-user"></i>
              </Link>
            )}
          </li>
          <li className="nav-link mx-0">
            <Link to={"/cart"} className="text-dark">
              <i className="fas fa-shopping-cart">
                {products.length > 0 && (
                  <span id="inCart" className="position-absolute">
                    {products.length}
                  </span>
                )}
              </i>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default DefaultNav;
