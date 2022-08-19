const handle = (req, res) => {
  console.log(req);
  // console.log(req.locals.title);
  res.send("This is handle");
};

module.exports = handle;
