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
function isValidImages(images) {
    // Kiểm tra xem images có là một mảng không
    if (!Array.isArray(images)) {
        return false;
    }
    
    // Kiểm tra mỗi phần tử trong mảng images
    for (let imageUrl of images) {
        // Kiểm tra xem imageUrl có rỗng không
        if (typeof imageUrl !== 'string' || imageUrl.trim() === '') {
            return false;
        }
        
        // Kiểm tra định dạng của imageUrl, ví dụ: có phải là URL hợp lệ không
        // Bạn có thể sử dụng các phương pháp khác như kiểm tra đuôi file hoặc phần mở rộng của URL để đảm bảo hình ảnh hợp lệ.
        // Ví dụ:
        // if (!isValidImageUrl(imageUrl)) {
        //     return false;
        // }
    }

    return true;
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


//tạo function để add product giá cả phải là số dương
module.exports = {
    isValidEmail,
    isValidPassword,
    isValidPhoneNumber,
    isValidImages
};
