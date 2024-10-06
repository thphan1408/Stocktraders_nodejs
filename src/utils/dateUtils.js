// Hàm lấy ngày thứ Sáu gần nhất
const getLastFriday = () => {
    const today = new Date()
    const day = today.getDay()
    const distanceToFriday = (day === 0 ? 2 : day === 6 ? 1 : day - 5)
    today.setDate(today.getDate() - distanceToFriday)
    return today.toISOString().split('T')[0]  // Trả về dạng yyyy-mm-dd
}

module.exports = { getLastFriday }