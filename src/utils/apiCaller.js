const axios = require('axios')

// Hàm gọi API dùng chung
const callApi = async (
  { url, method = 'GET', body = {}, headers = {} },
  processData,
) => {
  try {
    const response = await axios({
      url,
      method,
      data: body,
      headers,
    })

    const data = response.data

    // Gọi hàm xử lý dữ liệu nếu nó được cung cấp
    if (processData) {
      processData(data)
    }

    console.log('API data fetched successfully')
    return data
  } catch (error) {
    console.error('Error fetching data from API:', error)
    throw error
  }
}

module.exports = { callApi }
