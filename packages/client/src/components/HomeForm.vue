<script setup>
import { ref } from 'vue';
import router from '@/router';
import socket from '@/utils/clientSocket';

const showSignupForm = ref(false);

const toggleForm = () => {
  showSignupForm.value = !showSignupForm.value;
};

const handleSignupSubmit = (e) => {
  e.preventDefault();
  const username = e.target[0].value;
  const password = e.target[1].value;
  fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then((res) => res.json())
    .then(() => {
      alert('You have signed up successfully! Now log in.');
      e.target.reset();
      toggleForm();
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleLoginSubmit = (e) => {
  e.preventDefault();
  const username = e.target[0].value;
  const password = e.target[1].value;
  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }
      // check if there is already a token in the session storage
      if (sessionStorage.getItem('jwt')) {
        socket.connect();
        alert(data.message);
        router.push('/chat');
      } else {
        sessionStorage.setItem('jwt', data.token);
        socket.connect();
        alert(data.message);
        router.push('/chat');
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>

<template>
  <Transition name="flip" mode="out-in">
    <div class="login-box" :key="showSignupForm">
      <form name="home-form" v-if="!showSignupForm" @submit="handleLoginSubmit">
        <legend class="pb-5 text-[var(--myGreenColor)]">LOG IN</legend>
        <div class="user-box">
          <input type="text" required="true" />
          <label>Username</label>
        </div>
        <div class="user-box">
          <input type="password" required="true" />
          <label>Password</label>
        </div>
        <section class="flex flex-col lg:flex-row justify-center">
          <button id="formButtonLogin" type="submit">
            LOGIN
            <span></span>
          </button>
          <button id="formButtonSignup" type="button" @click="toggleForm">
            <div class="flex flex-col">
              <small class="text-[8px] lg:text-[10px]">Aren't you signed up?</small>
              <span>SIGN UP</span>
            </div>
            <span></span>
          </button>
        </section>
      </form>
      <form v-if="showSignupForm" @submit="handleSignupSubmit">
        <legend class="pb-5 text-[var(--myGreenColor)]">SIGN UP</legend>
        <div class="user-box">
          <input type="text" required="true" />
          <label>Username</label>
        </div>
        <div class="user-box">
          <input type="password" required="true" />
          <label>Password</label>
        </div>
        <section class="flex flex-col lg:flex-row justify-center">
          <button id="formButtonLogin" type="submit">
            SIGN UP
            <span></span>
          </button>
          <button id="formButtonSignup" type="button" @click="toggleForm">
            LOGIN
            <span></span>
          </button>
        </section>
      </form>
    </div>
  </Transition>
</template>

<style scoped>
.login-box {
  width: 300px;
  padding: 40px;
  background: #21212187;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  transform-style: preserve-3d;
}
@media (min-width: 1024px) {
  .login-box {
    width: 600px;
  }
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #bdb8b8;
  font-size: 12px;
}

.login-box form #formButtonLogin {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #ffffff;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
}
.login-box form #formButtonSignup {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #ffffff;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
}

.login-box #formButtonLogin:hover {
  background: var(--myGreenColor);
  color: black;
  border-radius: 5px;
  box-shadow:
    0 0 5px var(--myGreenColor),
    0 0 25px var(--myGreenColor),
    0 0 50px var(--myGreenColor),
    0 0 100px var(--myGreenColor);
}
.login-box #formButtonSignup:hover {
  background: var(--myGreenColor);
  color: black;
  border-radius: 5px;
  box-shadow:
    0 0 5px var(--myGreenColor),
    0 0 25px var(--myGreenColor),
    0 0 50px var(--myGreenColor),
    0 0 100px var(--myGreenColor);
}

.login-box #formButtonLogin span {
  position: absolute;
  display: block;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

.login-box #formButtonLogin span:nth-child(1) {
  bottom: 2px;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--myGreenColor));
  animation: btn-anim1 2s linear infinite;
}

.flip-enter-active,
.flip-leave-active {
  transition: transform 0.4s;
  transform-style: preserve-3d;
  backface-visibility: visible;
}
.flip-enter-from,
.flip-leave-to {
  transform: rotateY(90deg);
}
.flip-enter-to,
.flip-leave-from {
  transform: rotateY(0deg);
}
.user-box input {
  caret-color: var(--myGreenColor);
}
</style>
