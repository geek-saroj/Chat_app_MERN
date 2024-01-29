import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha"
import zxcvbn from "zxcvbn";
import "./Signin-up.css";
import { CircularProgress } from "@material-ui/core";

function Signup() {
  const SITE_KEY = "6LdJ91clAAAAAJiUira_g-bve3gFeRNZlqrQA220"
  const [email, setEmail] = useState();
  const [recaptchValue, setRecaptchValue] = useState('')
  const captchaRef = useRef();

  const [password, setPassword] = useState();
  const [passwordScore, setPasswordScore] = useState(0);

  const [username, setUsername] = useState();
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory();

  const API_URL = process.env.REACT_APP_API_URL

  const onChange = value => {
    setRecaptchValue(value)
  }

  const handleForm = async (e) => {
    e.preventDefault();

    // captchaRef.current.reset();



    setIsLoading(true)
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("password", password);
    data.append("recaptchValue", recaptchValue);
    if (photo !== "") {
      data.append("photo", photo);
    }

    try {
      await axios.post(API_URL+"api/auth/signup", data, config);
      history.push("/signin");
    } catch (err) {
      console.log(err);
      setError("Username Already Exist")
    }
    setIsLoading(false)
  }; const calculatePasswordScore = (password) => {
    const score = zxcvbn(password).score;
    setPasswordScore(score);

  
  };

  return (
    <div>
      <div className="signup-container">
        <div className="signup-card">
          <form onSubmit={handleForm}>
            <h2 className="signup-title"> Register </h2>
            <p className="line"></p>
            <div className="error-message"><p>{error}</p></div>
            <div className="signup-fields">
              <label htmlFor="username"> {" "} <b>Username</b></label>
              <input className="signup-textbox" type="text" placeholder="Enter Username" name="username" required onChange={(e) => { setUsername(e.target.value); }} />
              <label htmlFor="email">{" "}<b>Email</b></label>
              <input className="signup-textbox" type="email" placeholder="Enter Email" name="email" required onChange={(e) => { setEmail(e.target.value); }} />
              <label htmlFor="password"> <b>Password</b></label>
              <input className="signup-textbox" type="password" placeholder="Enter Password" minLength="6" name="psw" required onChange={(e) => { setPassword(e.target.value); calculatePasswordScore(e.target.value); }} />

              <div>
                <div className="password-strength-meter">
                  <div
                    className={`password-strength-meter-bar strength-${passwordScore}`}
                  ></div>
                  <div className="password-strength-meter-label text-center">

                    {passwordScore === 0 && "Weak"}

                    {passwordScore === 1 && "Fair"}
                    {passwordScore === 2 && "Good"}
                    {passwordScore === 3 && "Strong"}
                    {passwordScore === 4 && "Very Strong"}

                  </div>
                </div>
              </div>
              <div className="form-group mt-4">
                <ReCAPTCHA
                  sitekey={SITE_KEY}
                  onChange={onChange}
                  ref={captchaRef}

                />

              </div>


              <label><b>Image(You can add Image later)</b></label>
              <input className="file-input" type="file" accept=".png, .jpg, .jpeg, .gif" name="photo" onChange={(e) => { setPhoto(e.target.files[0]); }} />
            </div>
            <button className="signup-button" disabled={isLoading}>{isLoading ? <CircularProgress size="18px" /> : "Sign Up"}</button>
          </form>
          <div className="signup-option">
            <p className="signup-question">
              Have an account? <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>



  );


}


export default Signup;
