function isValidEmail(email) {
    // Kiểm tra xem email có rỗng không
    if (email.trim() === '') {
        return false; // Trả về false nếu email rỗng
    }
    // Kiểm tra định dạng email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return false; // Trả về false nếu định dạng không hợp lệ
    }
    // Kiểm tra xem có chứa khoảng trắng không
    if (email.indexOf(' ') !== -1) {
        return false; // Trả về false nếu có chứa khoảng trắng
    }
    return true; // Trả về true nếu định dạng và không chứa khoảng trắng
}


// Hàm kiểm tra định dạng password
function isValidPassword(password) {
    if (password.trim() === '') {
        return false;
    }
    if (password.indexOf(' ') !== -1) {
        return false;
    }
    return password.length >= 6;
}

// Hàm kiểm tra định dạng số điện thoại
function isValidPhoneNumber(phoneNumber) {
    // Kiểm tra xem số điện thoại có chứa khoảng trắng không
    if (phoneNumber.indexOf(' ') !== -1) {
        return false; // Trả về false nếu số điện thoại chứa khoảng trắng
    }
    // Kiểm tra xem số điện thoại có rỗng không
    if (phoneNumber.trim() === '') {
        return false; // Trả về false nếu số điện thoại rỗng
    }
    // Kiểm tra định dạng số điện thoại
    return /^\d{10}$/.test(phoneNumber);
}



module.exports = {
    isValidEmail,
    isValidPassword,
    isValidPhoneNumber
};
