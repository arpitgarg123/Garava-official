import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function BackButton({
  fallback = "/products ",
  className = "",
}) {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback);
  };

  return (
    <button
      onClick={goBack}
      className={ ` ml-6 cursor-pointer
                  ${className}`}
    >
      <FiArrowLeft size={25} />
    </button>
  );
}
