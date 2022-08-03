/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ApiError from '@/utils/ApiError'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import { IS_PRODUCTION, IS_TEST } from '@/config/config'
import logger from '@/config/logger'

export const errorConverter = (err, req, res, next) => {
  let error = err
  if (!(error)) {
    const statusCode =
      error.statusCode || error  ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || httpStatus[statusCode]
    error = new ApiError(statusCode, message, true, err.stack)
  }
  next(error)
}

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err
  if (IS_PRODUCTION && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...(!IS_PRODUCTION && { stack: err.stack }),
  }

  if (!IS_PRODUCTION && !IS_TEST) {
    logger.error(err)
  }

  res.status(statusCode).send(response)
}
