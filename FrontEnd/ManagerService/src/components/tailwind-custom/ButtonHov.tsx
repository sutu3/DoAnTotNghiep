import {useNavigate} from "react-router-dom";

const ButtonHov = ({Title = "", classCustom = ""}) => {
    const navigate=useNavigate();
    return (
        <>
            <button onClick={()=>navigate("/")} className={`btn ${classCustom}`}>
        <span className={`relative z-10 font-bold `}>
          { ( Title === "") ? "Shop Now" : Title }
        </span>
            </button>
        </>
    )
}

export default ButtonHov