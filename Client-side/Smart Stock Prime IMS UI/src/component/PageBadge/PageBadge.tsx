import './PageBadgeCSS.css';
interface prop {
    title: string;
}
const PageBadge = (props:prop) => {

    return (
        <div className="main">
            <h3 className="head">
                {props.title}
            </h3>
        </div>
    );
}
export default PageBadge;