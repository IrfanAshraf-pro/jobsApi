const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json(jobs);
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.find({ createdBy: userId, _id: jobId });
  if(!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }
  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  console.log("DATA ", req.body, req.user);
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: updateData,
  } = req;

  // If no data is sent to update
  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('Please provide at least one field to update');
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndRemove({ createdBy: userId, _id: jobId });
  console.log("JOB DELETE IS ", job)
  if(!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }
  res.status(StatusCodes.OK).send('Job deleted')
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
