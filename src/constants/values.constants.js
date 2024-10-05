const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-rtoken-id', // refresh token id
}

const REASON_STATUS_CODE = {
  FORBIDDEN: 'Bad request error',
  CONFLICT: 'Conflict error',
  CREATED: 'Created success',
  OK: 'Success',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Not found',
}


const _API_DATASELL =
{
  url: 'http://roboadvisor.vn/service/data/datasell',
}

const _API_DATA_BUY =
{
  url: 'http://roboadvisor.vn/service/data/databuy',

}

const _API_DATA_HOLD =
{
  url: 'http://roboadvisor.vn/service/data/datahold',
}


module.exports = { STATUS_CODE, HEADER, REASON_STATUS_CODE, _API_DATASELL, _API_DATA_BUY, _API_DATA_HOLD }
