package src/SignInScreen.jsx
import React from 'react';

function SignInScreen() {
  const handleSignIn = () => {
    console.log('Sign in with Google clicked');
  };
  return (
    <section className="sign-in-screen">
      <h2>Sign In</h2>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </section>
  );
}

export default SignInScreen;