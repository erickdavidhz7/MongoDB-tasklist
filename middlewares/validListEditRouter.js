module.exports = function validListEditRouter(req, res, next) {
  const body = req.body;
  const requiredKeysPOST = ["id", "name", "description", "status"];
  const requiredKeysPUT = ["name", "description", "status"];

  if (req.method === "POST") {
    const checkAllKeysPOST = requiredKeysPOST.every(key =>
      body.hasOwnProperty(key)
    );
    if (Object.keys(body).length === 0) {
      return res.status(400).send({ error: "Body is empty" });
    } else if (!checkAllKeysPOST) {
      return res
        .status(400)
        .send({ error: "Object must have all the required properties" });
    } else {
      next();
    }
  } else if (req.method === "PUT") {
    const id = req.params.id;
    const checkAllKeysPUT = requiredKeysPUT.every(key =>
      body.hasOwnProperty(key)
    );
    if (Object.keys(body).length === 0) {
      return res.status(400).send({ error: "Body is empty" });
    } else if (!checkAllKeysPUT) {
      return res
        .status(400)
        .send({ error: "Object must have all the required properties" });
    } else if (!parseInt(id)) {
      return res.status(400).send({ error: "Invalid ID" });
    } else {
      return next();
    }
  } else if (req.method === "DELETE") {
    const id = req.params.id;
    if (!parseInt(id)) {
      return res.status(400).send({ error: "Invalid ID" });
    } else {
      next();
    }
  } else {
    next();
  }
};
