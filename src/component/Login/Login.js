import React, { useState } from 'react';

import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { initializeLoginFramework, handleGoogleSignIn, handleSignOut, handleFbLogin, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';


function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  initializeLoginFramework();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/"}};



  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res => {
        setUser(res);
      setLoggedInUser(res);
      history.replace(from);
      })
    }

    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        setUser(res);
      setLoggedInUser(res);
      history.replace(from);
      })
    }
    e.preventDefault();
  }

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      setUser(res);
      setLoggedInUser(res);
      history.replace(from);
    })
  }

  const signOut = () => {
    handleSignOut()
    .then(res => {
      setUser(res);
      setLoggedInUser(res);
    })
  }

  const fbLogin = () => {
    handleFbLogin()
    .then(res => {
      setUser(res);
      setLoggedInUser(res);
      history.replace(from);
    })
  }
  const handleBlur = (e) => {
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length >= 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }


  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn
        ?<button onClick={signOut}>Sign out</button>
        :<button onClick={googleSignIn}>Sign in with Google</button>
      }
      <br/>
      <button onClick={fbLogin}>Sign in with Facebook</button>
      {
        user.isSignedIn && <div>
          <h2>Welcome, {user.name}</h2>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1> Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
        { newUser && <input type="text" name="name" id="" placeholder="Your Name" onBlur={handleBlur}/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Enter your email" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required/>
        <br/>
        <input type="submit" value={newUser ? "Sign up" : "Sign in"}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      { user.success && <p style={{color: 'green'}}>User {newUser ?'Created' : 'Logged In'} Succesfully</p>}


    </div>
  );
}

export default Login;
