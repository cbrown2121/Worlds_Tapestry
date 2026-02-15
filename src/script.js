useEffect(() => {
  fetch("http://localhost:5000/forums")
    .then(res => res.json())
    .then(data => setForums(data));
}, []);