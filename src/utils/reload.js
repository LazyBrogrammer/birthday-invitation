import {useNavigate} from "react-router-dom";

export const reload = () => {
    const navigate = useNavigate();
    window.location.reload();
    navigate('/')
}