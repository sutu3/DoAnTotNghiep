import { useNavigate } from "react-router-dom";

const ButtonHov = ({ Title = "", classCustom = "" }) => {
  const navigate = useNavigate();

  return (
    <>
      <button className={`btn ${classCustom}`} onClick={() => navigate("/")}>
        <span className={`relative z-10 font-bold `}>
          {Title === "" ? "Shop Now" : Title}
        </span>
      </button>
    </>
  );
};

export default ButtonHov;
