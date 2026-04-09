import Mainbanner from "./MainBanner";
import Section01 from "./Section01";
import Section02 from "./Section02";
import "./css/style.css";

const Main = () => {
    return(
        <div id="Main">
            <Mainbanner />
            <Section01 />
            <Section02 />
        </div>
    )
}

export default Main;