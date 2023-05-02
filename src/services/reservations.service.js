const httpStatus = require('http-status');
const { Reservation } = require('../models');
const ApiError = require('../utils/ApiError');

const createReservation = async (reservationBody) => {
  return Reservation.create(reservationBody);
};

const queryReservation = async (filter, options) => {
  const reservations = await Reservation.paginate(filter, options);
  return reservations;
};
const getReservationById = async (id) => {
  return Reservation.findById(id);
};
const updateReservationById = async (reservationId, updateBody) => {
  const reservation = await getReservationById(reservationId);
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }
  Object.assign(reservation, updateBody);
  await reservation.save();
  return reservation;
};
const deleteReservation = async (reservationId) => {
  const reservation = await getReservationById(reservationId);
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }
  await reservation.remove();
  return reservation;
};

module.exports = {
  createReservation,
  queryReservation,
  getReservationById,
  updateReservationById,
  deleteReservation,
};
