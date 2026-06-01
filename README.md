# Soccer Rental API

## Cài đặt

1. Clone dự án về:

    ```bash
    git clone https://github.com/nh11huy/soccer-rental-management-api.git
    cd soccer-rental-api
    ```
2. Checkout qua nhánh dev:

    ```bash
    git checkout dev
    ```

3. Tạo file `.env` từ file mẫu:

    ```bash
    cp .env.example .env
    ```

4. Mở file `.env` và cấu hình các thông tin cơ sở dữ liệu:

    - `DB_HOST`: Địa chỉ của máy chủ MySQL (mặc định là `localhost`).
    - `DB_PORT`: Cổng MySQL (mặc định là `3306`).
    - `DB_USERNAME`: Tên người dùng MySQL (bạn có thể thay đổi tùy thuộc vào cấu hình MySQL của mình).
    - `DB_PASSWORD`: Mật khẩu người dùng MySQL (bạn có thể thay đổi tùy thuộc vào cấu hình MySQL của mình).
    - `DB_DATABASE`: Tên cơ sở dữ liệu bạn muốn sử dụng.
    - `PORT`: Cổng mà ứng dụng của bạn sẽ lắng nghe. Mặc định là 5000, nhưng bạn có thể thay đổi cổng này nếu nó bị trùng với ứng dụng khác đang chạy trên máy tính của bạn.
    - `JWT_SECRET`: Khóa bí mật JWT được sử dụng để mã hóa và xác thực các token JWT trong ứng dụng của bạn. Bạn nên tạo một chuỗi ngẫu nhiên dài và phức tạp để đảm bảo tính bảo mật cho hệ thống.

5. Cài đặt các gói phụ thuộc:

    ```bash
    npm install
    ```

6. Chạy các migration để tạo bảng trong cơ sở dữ liệu:

    ```bash
    npm run typeorm:run-migrations
    ```

7. Chạy ở chế độ development (hot-reload):

    ```bash
    npm run dev
    ```

8. Hoặc build và chạy ở chế độ production:

    ```bash
    npm run build
    npm start
    ```

## Các môi trường hỗ trợ

- **.env**: File chứa cấu hình môi trường cho dự án (không được push lên GitHub).
- **.env.example**: File mẫu cấu hình môi trường để người dùng biết cách cấu hình `.env`.
