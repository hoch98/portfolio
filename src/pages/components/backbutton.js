import { useNavigate } from "react-router-dom"
import { useTransform, useTime } from "framer-motion";

export default function BackButton({ style, children }) {

  const navigate = useNavigate();

  return (
    <div className="backbutton" style={{zIndex: 99, ...style}} onClick={()=> {
      navigate("/")
    }}>
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 5 8 12 15 19"></polyline>
      </svg>
    </div>
  )
}