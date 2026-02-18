import { useNavigate } from "react-router-dom";

import RO from "./assets/RO.jpg";
import DOST from "./assets/logos.png";

import "./App.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // later: validate user/pass
    navigate("/dashboard");
  };

  return (
    <>
      <div
        className="background-wrapper"
        style={{ backgroundImage: `url(${RO})` }}
      >
        <div className="login-container">
          <div>
            <img className="DOSTLOGO" src={DOST} />
          </div>

          <div>
            <span className="dostlog">DOST TARLAC</span>
            <h4>
              <i>Scholars Monitoring System</i>
            </h4>

            <input className="field1" type="text" placeholder="Username" />
            <br />
            <br />

            <input className="field2" type="password" placeholder="Password" />
            <br />
            <br />

            <button className="LOGIN" onClick={handleLogin}>
              <b>LOGIN</b>
            </button>
          </div>

          <h5 className="footer-text">
            <i>Authorized Users Only—PSTO</i>
          </h5>
        </div>
      </div>
    </>
  );
}

export default Login;
