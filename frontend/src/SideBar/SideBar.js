import "./styles.scss";

function SideBar({ selectedClass }) {

    return (
        <div className="sidebar">
            <div className="sidebar__title">"{selectedClass}" Images</div>
            <div className="sidebar__render">
                <div className="sidebar__render__images">
                    <div className="sidebar__render__images__image"></div>
                    <div className="sidebar__render__images__image"></div>
                </div>
                <div className="sidebar__render__sliders">

                </div>
            </div>
            <div className="sidebar__grid">
                {Array.from({ length: 40 }).map((_, index) => (
                    <div key={index} className="sidebar__grid__image"></div>
                ))}
            </div>
        </div>
    );
}

export default SideBar;