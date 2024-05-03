const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${sessionStorage.getItem('jwt')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          reject(data.error);
        } else {
          resolve(data.user.username);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default getCurrentUser;
