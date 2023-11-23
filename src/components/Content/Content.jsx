import "./Content.css";
import ContentTop from "../ContentTop/ContentTop";
import ContentMain from "../ContentMain/ContentMain";

const Content = () => {
  return (
    <div className="main-content">
      <ContentTop />
      <ContentMain />
    </div>
  );
};

export default Content;
