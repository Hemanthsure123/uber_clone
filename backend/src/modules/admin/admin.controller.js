import Driver from "../drivers/driver.model.js";


export const getPendingDrivers = async (req, res) => {
  const drivers = await Driver.find({ status: "PENDING" })
    .populate("userId", "email");

  res.json(drivers);
};

export const approveDriver = async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ error: "Driver not found" });

  driver.status = "VERIFIED";
  await driver.save();

  res.json({ message: "Driver approved" });
};

export const rejectDriver = async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ error: "Driver not found" });

  driver.status = "REJECTED";
  await driver.save();

  res.json({ message: "Driver rejected" });
};
