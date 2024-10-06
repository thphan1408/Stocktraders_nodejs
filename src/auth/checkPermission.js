const { callApi } = require('../utils/apiCaller')

const _GET_STOCKTRADERS_RIGHTS = {
  url: 'https://stocktraders.vn/service/data/getStocktradersRights',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
}

const checkPermission14 = async (user) => {
  const apiConfigs = {
    ..._GET_STOCKTRADERS_RIGHTS,
    body: {
      StocktradersRightsRequest: {
        account: 'StockTraders',
        user: user,
      },
    },
  }

  try {
    const dataFromApi = await callApi(apiConfigs)
    let a = 0
    const userPermission = dataFromApi?.StocktradersRightsReply?.accessRights

    userPermission.forEach((item) => {
      // console.log(`item:: `, item)
      if (item.flag === 1 && item.productId === 14) {
        a = 1
      }
    })

    return a
  } catch (error) {
    console.error('Error in fetching data:', error)
  }
}

const checkPermission15 = async (user) => {
  const apiConfigs = {
    ..._GET_STOCKTRADERS_RIGHTS,
    body: {
      StocktradersRightsRequest: {
        account: 'StockTraders',
        user: user,
      },
    },
  }

  try {
    const dataFromApi = await callApi(apiConfigs)
    let a = 0
    const userPermission = dataFromApi?.StocktradersRightsReply?.accessRights

    userPermission.forEach((item) => {
      // console.log(`item:: `, item)
      if (item.flag === 1 && item.productId === 15) {
        a = 1
      }
    })

    return a
  } catch (error) {
    console.error('Error in fetching data:', error)
  }
}

const checkPermission16 = async (user) => {
  const apiConfigs = {
    ..._GET_STOCKTRADERS_RIGHTS,
    body: {
      StocktradersRightsRequest: {
        account: 'StockTraders',
        user: user,
      },
    },
  }

  try {
    const dataFromApi = await callApi(apiConfigs)
    let a = 0
    const userPermission = dataFromApi?.StocktradersRightsReply?.accessRights

    userPermission.forEach((item) => {
      // console.log(`item:: `, item)
      if (item.flag === 1 && item.productId === 16) {
        a = 1
      }
    })

    return a
  } catch (error) {
    console.error('Error in fetching data:', error)
  }
}

const checkAuthPermission = async (user) => {
  const apiConfigs = {
    ..._GET_STOCKTRADERS_RIGHTS,
    body: {
      StocktradersRightsRequest: {
        account: 'StockTraders',
        user: user,
      },
    },
  }

  try {
    const dataFromApi = await callApi(apiConfigs)

    let a = 0
    const userPermission = dataFromApi?.StocktradersRightsReply?.accessRights

    userPermission.forEach((item) => {
      // console.log(`item:: `, item)
      if (item.flag === 1) {
        a = 1
      }
    })

    return a
  } catch (error) {
    console.error('Error in fetching data:' + error)
  }
}

// Hàm kiểm tra quyền của user
const checkUserPermissions = async (account, user) => {
  // Gọi API hoặc logic kiểm tra quyền dựa trên user và account
  // Trả về danh sách các tín hiệu mà user có quyền truy cập (vd: ['datasell', 'databuy'])
  const permissionsResponse = await callApi({
    url: 'API_TO_CHECK_PERMISSIONS',
    method: 'POST',
    body: {
      account,
      user,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Giả sử API trả về danh sách các quyền
  return permissionsResponse.data.permissions;
};

module.exports = {
  checkUserPermissions,
  checkAuthPermission,
  checkPermission14,
  checkPermission15,
  checkPermission16,
}
