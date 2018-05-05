import Head from "../components/Head";
import "../styles/index.css";

const Layout = (props) => {
    return (
        <div className="app-container container-fluid">
            <div className="row">
                <Head />
                <div className="col col-md-8 offset-md-2">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Layout;