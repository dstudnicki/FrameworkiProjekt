import { Link } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Nav = styled.nav`
font-size: 18px;
padding: 40px;
`;
const MainNav = styled.ul`
list-style-type: none;
display: flex;
justify-content: space-between;
align-items: center;
padding: 0;
`;

const LeftGroup = styled.ul`
list-style-type: none;
display: flex;
align-items: center;
gap: 2.5rem;
`;

const RightGroup = styled.ul`
list-style-type: none;
display: flex;
align-items: center;
gap: 0.5rem;
`;

const NavLi = styled.li`
text-align: center;
`;

const Button = styled.button`
display: inline-flex;
justify-content: center;
align-items: center;
padding: 0.5rem 1rem;
font-size: medium;
background-color: #1d1c24;
color: #fff;
border: none;
border-radius: 0.375rem;
cursor: pointer;
`;

const ButtonOutline = styled.button`
display: inline-flex;
justify-content: center;
align-items: center;
padding: 0.5rem 1rem;
font-size: medium;
background-color: #ffffff;
border: 1px solid #e1e0e9;
border-radius: 0.375rem;
cursor: pointer;
box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const Navbar = () => {
    const { logout, user, fetchMyProfile } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Function to check authentication status
    const handleAuthentication = () => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); // Set true if token exists, false otherwise
    };

    const handleLogout = () => {
        logout();
        handleAuthentication(); // Check authentication after logout
    };

    // Run on component mount and whenever the token changes
    useEffect(() => {
        // Listen for storage changes (i.e., token being added/removed)
        const onStorageChange = () => handleAuthentication();
        fetchMyProfile(); // Fetch user profile data
        // Check on initial load
        handleAuthentication();

        // Add event listener to handle token change from other tabs
        window.addEventListener("storage", onStorageChange);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener("storage", onStorageChange);
        };
    }, []);

    return (
        <Nav>
            <MainNav>
                <LeftGroup>
                    <NavLi>
                        <Link to="/posts">Posts</Link>
                    </NavLi>
                    <NavLi>
                        <Link to="/photos">Photos</Link>
                    </NavLi>
                    <NavLi>
                        <Link to="/post/add">Add Post</Link>
                    </NavLi>
                    <NavLi>
                        <Link to="/photo/upload">Upload Photo</Link>
                    </NavLi>
                </LeftGroup>
                <RightGroup>
                    {isAuthenticated ? (
                        <>
                            <NavLi>
                                <Link to={user?.username || "#"}>Profile</Link>
                            </NavLi>
                            <NavLi>
                                <Button onClick={handleLogout}>Log out</Button>
                            </NavLi>
                        </>
                    ) : (
                        <>
                            <NavLi>
                                <Link to="/login">
                                    <Button>Login</Button>
                                </Link>
                            </NavLi>
                            <NavLi>
                                <Link to="/register">
                                    <ButtonOutline>Register</ButtonOutline>
                                </Link>
                            </NavLi>
                        </>
                    )}
                </RightGroup>
            </MainNav>
        </Nav>
    );
};

export default Navbar;
