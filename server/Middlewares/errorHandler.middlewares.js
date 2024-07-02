const handleErrors = (err, req, res, next) => {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  };
  
  export default handleErrors;
  